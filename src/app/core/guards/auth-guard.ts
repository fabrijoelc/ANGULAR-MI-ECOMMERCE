import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario-service';

// Si no hay sesion iniciada, el router manda al login en vez de dejar pasar.
export const authGuard: CanActivateFn = () => {
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);

  if (usuarioService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
