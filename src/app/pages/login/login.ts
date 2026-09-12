import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario-service';
import { NotificacionService } from '../../services/notificacion-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  usuarioService = inject(UsuarioService);
  notificacionService = inject(NotificacionService);

  verClave = signal(false);
  verificando = signal(false);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    clave: ['', [Validators.required, Validators.minLength(6)]],
    recordarme: [false],
  });

  get email() {
    return this.loginForm.get('email');
  }

  get clave() {
    return this.loginForm.get('clave');
  }

  cambiarVisibilidadClave() {
    this.verClave.update((valorActual) => !valorActual);
  }

  async iniciarSesion() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.verificando.set(true);

    try {
      const correcto = await this.usuarioService.loguear(
        this.loginForm.controls.email.value,
        this.loginForm.controls.clave.value,
      );

      if (correcto) {
        this.notificacionService.show('Bienvenido de vuelta', 'exito');
        this.router.navigate(['/catalogo']);
      } else {
        this.notificacionService.show('Correo o contrasena incorrectos', 'error');
      }
    } catch {
      this.notificacionService.show('No se pudo conectar con el servidor', 'error');
    }

    this.verificando.set(false);
  }

  cerrarSesion() {
    this.usuarioService.cerrarSesion();
    this.loginForm.reset();
  }
}
