import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CarritoService } from '../../services/carrito-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
})
export class Header {
  private router = inject(Router);

  // El header no es padre del catalogo, pero ve el mismo carrito
  // porque los dos inyectan el mismo servicio.
  carritoService = inject(CarritoService);
  authService = inject(AuthService);

  cerrarSesion() {
    this.authService.logout().subscribe();
    this.router.navigate(['/catalogo']);
  }
}
