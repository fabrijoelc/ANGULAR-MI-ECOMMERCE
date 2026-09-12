import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CarritoService } from '../../services/carrito-service';
import { NotificacionService } from '../../services/notificacion-service';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.html',
})
export class Cart {
  private router = inject(Router);

  carritoService = inject(CarritoService);
  notificacionService = inject(NotificacionService);

  quitar(id: string, nombre: string) {
    this.carritoService.quitar(id);
    this.notificacionService.show('Quitaste ' + nombre + ' del carrito', 'info');
  }

  vaciar() {
    this.carritoService.vaciar();
    this.notificacionService.show('Vaciaste el carrito', 'info');
  }

  // El checkout esta protegido: si no hay sesion, el guard redirige al login.
  irAlCheckout() {
    this.router.navigate(['/checkout']);
  }
}
