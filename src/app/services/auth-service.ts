import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { IRespuestaAuth, ISesionUsuario } from '../interfaces/sesion.interface';

const AUTH_URL = environment.supabaseAuthUrl;
const CLAVE_SESION = 'nba-sesion';

interface ISesionGuardada {
  accessToken: string;
  usuario: ISesionUsuario;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  // La sesion arranca desde LocalStorage, asi al recargar sigues dentro.
  private accessToken = signal<string | null>(this.leerSesionGuardada()?.accessToken ?? null);
  private usuarioActual = signal<ISesionUsuario | null>(this.leerSesionGuardada()?.usuario ?? null);

  isLoggedIn = computed(() => this.accessToken() !== null);
  usuario = this.usuarioActual.asReadonly();

  // Ya no hay usuario inventado: esto pega de verdad al auth de Supabase.
  login(email: string, password: string): Observable<IRespuestaAuth> {
    return this.http
      .post<IRespuestaAuth>(`${AUTH_URL}/token?grant_type=password`, { email, password })
      .pipe(tap((respuesta) => this.guardarSesion(respuesta)));
  }

  registrarse(email: string, password: string, nombre: string): Observable<IRespuestaAuth> {
    return this.http
      .post<IRespuestaAuth>(`${AUTH_URL}/signup`, {
        email,
        password,
        data: { nombre },
      })
      .pipe(
        tap((respuesta) => {
          // Si el proyecto tiene la confirmacion por correo desactivada,
          // el signup ya devuelve sesion y entras directo.
          if (respuesta?.access_token) {
            this.guardarSesion(respuesta);
          }
        }),
      );
  }

  logout(): Observable<void> {
    const habiaSesion = this.accessToken() !== null;
    this.limpiarSesion();

    if (!habiaSesion) {
      return of(void 0);
    }

    // Si el servidor rechaza el logout igual ya limpiamos la sesion local.
    return this.http.post<void>(`${AUTH_URL}/logout`, {}).pipe(catchError(() => of(void 0)));
  }

  // Lo usa el interceptor para firmar cada peticion.
  getAccessToken(): string | null {
    return this.accessToken();
  }

  private guardarSesion(respuesta: IRespuestaAuth) {
    if (!respuesta?.access_token) {
      return;
    }

    const payload = this.decodificarPayload(respuesta.access_token);
    const metadata = (payload?.['user_metadata'] ??
      respuesta.user?.user_metadata ??
      {}) as Record<string, unknown>;

    const usuario: ISesionUsuario = {
      email: (payload?.['email'] as string) ?? respuesta.user?.email ?? '',
      nombre: (metadata['nombre'] as string) ?? '',
    };

    this.accessToken.set(respuesta.access_token);
    this.usuarioActual.set(usuario);

    const guardar: ISesionGuardada = { accessToken: respuesta.access_token, usuario };
    localStorage.setItem(CLAVE_SESION, JSON.stringify(guardar));
  }

  private limpiarSesion() {
    this.accessToken.set(null);
    this.usuarioActual.set(null);
    localStorage.removeItem(CLAVE_SESION);
  }

  private leerSesionGuardada(): ISesionGuardada | null {
    const guardado = localStorage.getItem(CLAVE_SESION);

    if (!guardado) {
      return null;
    }

    try {
      return JSON.parse(guardado) as ISesionGuardada;
    } catch {
      return null;
    }
  }

  // El JWT son tres partes separadas por punto. La del medio es un JSON
  // en base64 con los datos del usuario: eso es lo que mostramos.
  private decodificarPayload(jwt: string): Record<string, unknown> | null {
    try {
      const partes = jwt.split('.');
      return JSON.parse(atob(partes[1]));
    } catch {
      return null;
    }
  }
}
