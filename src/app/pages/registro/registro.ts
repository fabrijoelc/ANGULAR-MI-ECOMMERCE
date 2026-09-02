import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario-service';
import { NotificacionService } from '../../services/notificacion-service';

@Component({
  selector: 'app-registro',
  imports: [RouterLink],
  templateUrl: './registro.html',
})
export class Registro {
  private router = inject(Router);
  usuarioService = inject(UsuarioService);
  notificacionService = inject(NotificacionService);

  nombre = signal('');
  correo = signal('');
  clave = signal('');
  repetirClave = signal('');

  // Recien muestro los errores cuando el usuario intenta enviar el formulario.
  intentoEnviar = signal(false);
  cuentaCreada = signal(false);
  guardando = signal(false);

  errores = computed(() => {
    return {
      nombre: this.nombre().trim().length < 3 ? 'Escribe tu nombre y apellido.' : '',
      correo: !this.correo().includes('@') ? 'El correo debe tener un @.' : '',
      clave: this.clave().length < 6 ? 'La contrasena necesita 6 caracteres como mínimo.' : '',
      repetirClave: this.repetirClave() !== this.clave() ? 'Las contrasenas no coinciden.' : '',
    };
  });

  formularioValido = computed(() => {
    const errores = this.errores();
    return (
      errores.nombre === '' &&
      errores.correo === '' &&
      errores.clave === '' &&
      errores.repetirClave === ''
    );
  });

  escribir(campo: WritableSignal<string>, evento: Event) {
    const input = evento.target as HTMLInputElement;
    campo.set(input.value);
  }

  async crearCuenta() {
    this.intentoEnviar.set(true);

    if (!this.formularioValido()) {
      return;
    }

    this.guardando.set(true);

    try {
      // El servicio cifra la contrasena antes de guardarla en Supabase.
      const creada = await this.usuarioService.registrar(
        this.nombre(),
        this.correo(),
        this.clave(),
      );

      if (creada) {
        this.cuentaCreada.set(true);
        this.notificacionService.show('Cuenta creada, ya puedes iniciar sesión', 'exito');
        this.router.navigate(['/login']);
      } else {
        this.notificacionService.show('Ese correo ya está registrado', 'error');
      }
    } catch {
      this.notificacionService.show('No se pudo conectar con el servidor', 'error');
    }

    this.guardando.set(false);
  }

  limpiarFormulario() {
    this.nombre.set('');
    this.correo.set('');
    this.clave.set('');
    this.repetirClave.set('');
    this.intentoEnviar.set(false);
    this.cuentaCreada.set(false);
  }
}
