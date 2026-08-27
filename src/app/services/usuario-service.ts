import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import bcrypt from 'bcryptjs';
import { environment } from '../../environments/environment';
import { IUsuario } from '../interfaces/usuario.interface';

const USUARIOS_URL = `${environment.supabaseUrl}/usuario`;

const SUPABASE_HEADERS = {
  apikey: environment.supabaseKey,
  Authorization: `Bearer ${environment.supabaseKey}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
};

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);

  private usuarioActivoSignal = signal<IUsuario | null>(null);
  usuarioActivo = this.usuarioActivoSignal.asReadonly();

  constructor() {
    const guardado = localStorage.getItem('nba-usuario');
    if (guardado) {
      this.usuarioActivoSignal.set(JSON.parse(guardado));
    }
  }

  async loguear(email: string, contrasena: string): Promise<boolean> {
    const usuarios = await firstValueFrom(
      this.http.get<IUsuario[]>(`${USUARIOS_URL}?email=eq.${email}`, {
        headers: SUPABASE_HEADERS,
      }),
    );

    if (!usuarios || usuarios.length === 0) {
      return false;
    }

    const usuario = usuarios[0];

    // La contrasena guardada esta cifrada, por eso comparamos con bcrypt.
    const coincide = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!coincide) {
      return false;
    }

    this.usuarioActivoSignal.set(usuario);
    localStorage.setItem('nba-usuario', JSON.stringify(usuario));
    return true;
  }

  async registrar(nombres: string, email: string, contrasena: string): Promise<boolean> {
    const existentes = await firstValueFrom(
      this.http.get<IUsuario[]>(`${USUARIOS_URL}?email=eq.${email}`, {
        headers: SUPABASE_HEADERS,
      }),
    );

    if (existentes && existentes.length > 0) {
      return false;
    }

    // Nunca guardamos la contrasena tal cual, la ciframos antes de enviarla.
    const contrasenaCifrada = bcrypt.hashSync(contrasena, 10);

    await firstValueFrom(
      this.http.post<IUsuario>(
        USUARIOS_URL,
        { nombres, email, contrasena: contrasenaCifrada },
        { headers: SUPABASE_HEADERS },
      ),
    );

    return true;
  }

  cerrarSesion() {
    this.usuarioActivoSignal.set(null);
    localStorage.removeItem('nba-usuario');
  }
}
