import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth-service';

const SUPABASE_ORIGIN = new URL(environment.supabaseUrl).origin;

// Toda peticion a Supabase sale firmada: siempre la apikey del proyecto y,
// si hay sesion iniciada, el JWT del usuario en vez de la llave anonima.
export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  let origen: string;

  try {
    origen = new URL(req.url).origin;
  } catch {
    return next(req);
  }

  if (origen !== SUPABASE_ORIGIN) {
    return next(req);
  }

  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  const cabeceras: Record<string, string> = {
    apikey: environment.supabaseKey,
    Authorization: `Bearer ${token ?? environment.supabaseKey}`,
    'Content-Type': 'application/json',
  };

  // Si la peticion trae su propio Prefer (count=exact al paginar) no lo pisamos.
  if (!req.headers.has('Prefer')) {
    cabeceras['Prefer'] = 'return=representation';
  }

  return next(req.clone({ setHeaders: cabeceras }));
};
