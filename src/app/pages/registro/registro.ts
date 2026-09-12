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
import { UsuarioService } from '../../services/usuario-service';
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

  usuarioService = inject(UsuarioService);
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

  async crearCuenta() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.guardando.set(true);

    try {
      const creada = await this.usuarioService.registrar(
        this.registroForm.controls.nombre.value,
        this.registroForm.controls.email.value,
        this.registroForm.controls.clave.value,
      );

      if (creada) {
        this.notificacionService.show('Cuenta creada, ya puedes iniciar sesion', 'exito');
        this.router.navigate(['/login']);
      } else {
        this.notificacionService.show('Ese correo ya esta registrado', 'error');
      }
    } catch {
      this.notificacionService.show('No se pudo conectar con el servidor', 'error');
    }

    this.guardando.set(false);
  }

  limpiarFormulario() {
    this.registroForm.reset();
  }
}
