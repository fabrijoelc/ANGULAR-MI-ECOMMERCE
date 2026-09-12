import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito-service';
import { UsuarioService } from '../../services/usuario-service';
import { NotificacionService } from '../../services/notificacion-service';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.html',
})
export class Checkout {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  carritoService = inject(CarritoService);
  usuarioService = inject(UsuarioService);
  notificacionService = inject(NotificacionService);

  procesando = false;

  checkoutForm = this.fb.nonNullable.group({
    nombreCompleto: ['', [Validators.required, Validators.minLength(5)]],
    direccion: ['', [Validators.required, Validators.minLength(8)]],
    ciudad: ['Lima', Validators.required],
    numeroTarjeta: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
    cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
  });

  // Getters para no repetir checkoutForm.get(...) en toda la plantilla.
  get nombreCompleto() {
    return this.checkoutForm.get('nombreCompleto');
  }

  get direccion() {
    return this.checkoutForm.get('direccion');
  }

  get ciudad() {
    return this.checkoutForm.get('ciudad');
  }

  get numeroTarjeta() {
    return this.checkoutForm.get('numeroTarjeta');
  }

  get cvv() {
    return this.checkoutForm.get('cvv');
  }

  confirmarPedido() {
    if (this.checkoutForm.invalid) {
      // Marca todos los campos para que se vean los errores de una vez.
      this.checkoutForm.markAllAsTouched();
      this.notificacionService.show('Revisa los datos del formulario', 'error');
      return;
    }

    if (this.carritoService.elementos().length === 0) {
      this.notificacionService.show('Tu carrito esta vacio', 'error');
      return;
    }

    this.procesando = true;

    this.notificacionService.show('Pedido confirmado, gracias por tu compra', 'exito');
    this.carritoService.vaciar();
    this.checkoutForm.reset({ ciudad: 'Lima' });
    this.procesando = false;

    this.router.navigate(['/']);
  }

  volverAlCarrito() {
    this.router.navigate(['/carrito']);
  }
}
