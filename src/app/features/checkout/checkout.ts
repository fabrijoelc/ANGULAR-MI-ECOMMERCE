import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito-service';
import { AuthService } from '../../services/auth-service';
import { ProductoService } from '../../services/producto-service';
import { NotificacionService } from '../../services/notificacion-service';
import { stockDisponibleValidator } from '../../core/validators/stock.validator';

// Validador de grupo sobre "pago": el monto tecleado tiene que coincidir
// con el total real del carrito.
function montoCoincideConTotal(totalEsperado: () => number): ValidatorFn {
  return (grupo: AbstractControl): ValidationErrors | null => {
    const monto = Number(grupo.get('montoIngresado')?.value);
    const total = Number(totalEsperado().toFixed(2));

    if (!monto) {
      return null;
    }

    return Math.abs(monto - total) < 0.01 ? null : { montoNoCoincide: true };
  };
}

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.html',
})
export class Checkout {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  carritoService = inject(CarritoService);
  authService = inject(AuthService);
  productoService = inject(ProductoService);
  notificacionService = inject(NotificacionService);

  procesando = signal(false);

  // Formulario con sub-grupos: envio y pago.
  checkoutForm = this.fb.group(
    {
      envio: this.fb.group({
        nombreCompleto: ['', [Validators.required, Validators.minLength(5)]],
        direccion: ['', [Validators.required, Validators.minLength(8)]],
        ciudad: ['Lima', Validators.required],
        usarOtraDireccion: [false],
        direccionAlternativa: [{ value: '', disabled: true }, Validators.required],
      }),
      pago: this.fb.group(
        {
          numeroTarjeta: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
          cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
          montoIngresado: ['', Validators.required],
        },
        { validators: montoCoincideConTotal(() => this.carritoService.total()) },
      ),
    },
    {
      // Antes de dejar confirmar, el servidor dice si aun hay stock.
      asyncValidators: [stockDisponibleValidator(this.productoService, this.carritoService)],
    },
  );

  get envio() {
    return this.checkoutForm.get('envio');
  }

  get pago() {
    return this.checkoutForm.get('pago');
  }

  get nombreCompleto() {
    return this.checkoutForm.get('envio.nombreCompleto');
  }

  get direccion() {
    return this.checkoutForm.get('envio.direccion');
  }

  get direccionAlternativa() {
    return this.checkoutForm.get('envio.direccionAlternativa');
  }

  get numeroTarjeta() {
    return this.checkoutForm.get('pago.numeroTarjeta');
  }

  get cvv() {
    return this.checkoutForm.get('pago.cvv');
  }

  get montoIngresado() {
    return this.checkoutForm.get('pago.montoIngresado');
  }

  constructor() {
    // El campo de la otra direccion solo se habilita si marcan la casilla.
    this.checkoutForm.get('envio.usarOtraDireccion')?.valueChanges.subscribe((usar) => {
      const campo = this.direccionAlternativa;

      if (usar) {
        campo?.enable();
      } else {
        campo?.reset('');
        campo?.disable();
      }
    });
  }

  confirmarPedido() {
    if (this.checkoutForm.pending) {
      this.notificacionService.show('Espera, estamos verificando el stock', 'info');
      return;
    }

    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();

      if (this.checkoutForm.hasError('stockInsuficiente')) {
        this.notificacionService.show(
          'Ya no hay stock de: ' + this.checkoutForm.getError('stockInsuficiente'),
          'error',
        );
      } else {
        this.notificacionService.show('Revisa los datos del formulario', 'error');
      }

      return;
    }

    if (this.carritoService.items().length === 0) {
      this.notificacionService.show('Tu carrito esta vacio', 'error');
      return;
    }

    this.procesando.set(true);

    this.notificacionService.show('Pedido confirmado, gracias por tu compra', 'exito');
    this.carritoService.vaciar();
    this.checkoutForm.reset({ envio: { ciudad: 'Lima', usarOtraDireccion: false } });
    this.direccionAlternativa?.disable();
    this.procesando.set(false);

    this.router.navigate(['/']);
  }

  volverAlCarrito() {
    this.router.navigate(['/carrito']);
  }
}
