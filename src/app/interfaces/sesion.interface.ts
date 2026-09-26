// Datos del usuario ya sacados del JWT, listos para mostrar en el header.
export interface ISesionUsuario {
  email: string;
  nombre: string;
}

// Forma de la respuesta de /auth/v1/token y /auth/v1/signup.
export interface IRespuestaAuth {
  access_token?: string;
  refresh_token?: string;
  user?: {
    email?: string;
    user_metadata?: Record<string, unknown>;
  };
}
