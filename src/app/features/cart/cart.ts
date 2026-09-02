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

  // Al terminar la compra el Router nos lleva al inicio.
  finalizarCompra() {
    this.notificacionService.show('Compra realizada, gracias por tu pedido', 'exito');
    this.carritoService.vaciar();
    this.router.navigate(['/']);
  }
}
