import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const SUPABASE_ORIGIN = new URL(environment.supabaseUrl).origin;

// Le pega la apikey a toda peticion que vaya a Supabase, asi los servicios
// ya no tienen que repetir las cabeceras en cada metodo.
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

  const peticionConApiKey = req.clone({
    setHeaders: {
      apikey: environment.supabaseKey,
      Authorization: `Bearer ${environment.supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
  });

  return next(peticionConApiKey);
};
