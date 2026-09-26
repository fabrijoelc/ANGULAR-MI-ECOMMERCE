import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { NotificacionService } from '../../services/notificacion-service';

// Validador propio a nivel de grupo: compara los dos campos entre si.
function clavesIguales(): ValidatorFn {
  return (grupo: AbstractControl): ValidationErrors | null => {
    const clave = grupo.get('clave')?.value;
    const repetir = grupo.get('repetirClave')?.value;

    return clave === repetir ? null : { clavesNoCoinciden: true };
  };
}

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
})
export class Registro {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  authService = inject(AuthService);
  notificacionService = inject(NotificacionService);

  guardando = signal(false);

  registroForm = this.fb.nonNullable.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      repetirClave: ['', Validators.required],
    },
    { validators: clavesIguales() },
  );

  get nombre() {
    return this.registroForm.get('nombre');
  }

  get email() {
    return this.registroForm.get('email');
  }

  get clave() {
    return this.registroForm.get('clave');
  }

  get repetirClave() {
    return this.registroForm.get('repetirClave');
  }

  crearCuenta() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.guardando.set(true);

    this.authService
      .registrarse(
        this.registroForm.controls.email.value,
        this.registroForm.controls.clave.value,
        this.registroForm.controls.nombre.value,
      )
      .subscribe({
        next: (respuesta) => {
          if (respuesta?.access_token) {
            // El proyecto no pide confirmar correo: ya quedaste dentro.
            this.notificacionService.show('Cuenta creada, ya iniciaste sesion', 'exito');
            this.router.navigate(['/catalogo']);
          } else {
            this.notificacionService.show('Cuenta creada, revisa tu correo para confirmarla', 'info');
            this.router.navigate(['/login']);
          }
        },
        error: () => {
          this.notificacionService.show('No se pudo crear la cuenta', 'error');
          this.guardando.set(false);
        },
        complete: () => {
          this.guardando.set(false);
        },
      });
  }

  limpiarFormulario() {
    this.registroForm.reset();
  }
}
