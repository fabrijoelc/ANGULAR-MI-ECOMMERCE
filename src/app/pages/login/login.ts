import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { NotificacionService } from '../../services/notificacion-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  authService = inject(AuthService);
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

  iniciarSesion() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.verificando.set(true);

    this.authService
      .login(this.loginForm.controls.email.value, this.loginForm.controls.clave.value)
      .subscribe({
        next: () => {
          this.notificacionService.show('Bienvenido de vuelta', 'exito');
          this.router.navigate(['/catalogo']);
        },
        error: (fallo: HttpErrorResponse) => {
          const codigo = fallo.error?.error_code ?? '';

          if (codigo === 'email_not_confirmed') {
            this.notificacionService.show('Tienes que confirmar tu correo primero', 'error');
          } else {
            this.notificacionService.show('Correo o contrasena incorrectos', 'error');
          }

          this.verificando.set(false);
        },
        complete: () => {
          this.verificando.set(false);
        },
      });
  }

  cerrarSesion() {
    this.authService.logout().subscribe();
    this.loginForm.reset();
  }
}
