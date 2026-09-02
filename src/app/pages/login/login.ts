import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario-service';
import { NotificacionService } from '../../services/notificacion-service';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private router = inject(Router);
  usuarioService = inject(UsuarioService);
  notificacionService = inject(NotificacionService);

  correo = signal('');
  clave = signal('');
  verClave = signal(false);

  intentoEnviar = signal(false);
  sesionIniciada = signal(false);
  verificando = signal(false);

  errores = computed(() => {
    return {
      correo: !this.correo().includes('@') ? 'Ingresa un correo válido.' : '',
      clave: this.clave().length === 0 ? 'Escribe tu contrasena.' : '',
    };
  });

  formularioValido = computed(() => {
    const errores = this.errores();
    return errores.correo === '' && errores.clave === '';
  });

  escribir(campo: WritableSignal<string>, evento: Event) {
    const input = evento.target as HTMLInputElement;
    campo.set(input.value);
  }

  cambiarVisibilidadClave() {
    this.verClave.update((valorActual) => !valorActual);
  }

  async iniciarSesion() {
    this.intentoEnviar.set(true);

    if (!this.formularioValido()) {
      return;
    }

    this.verificando.set(true);

    try {
      // El servicio busca el correo en Supabase y compara la contrasena cifrada.
      const correcto = await this.usuarioService.loguear(this.correo(), this.clave());

      if (correcto) {
        this.sesionIniciada.set(true);
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
    this.correo.set('');
    this.clave.set('');
    this.intentoEnviar.set(false);
    this.sesionIniciada.set(false);
  }
}
