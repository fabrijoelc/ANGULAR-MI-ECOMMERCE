import { Component, computed, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [RouterLink],
  templateUrl: './registro.html',
})
export class Registro {
  nombre = signal('');
  correo = signal('');
  clave = signal('');
  repetirClave = signal('');

  // Recien muestro los errores cuando el usuario intenta enviar el formulario.
  intentoEnviar = signal(false);
  cuentaCreada = signal(false);

  errores = computed(() => {
    return {
      nombre: this.nombre().trim().length < 3 ? 'Escribe tu nombre y apellido.' : '',
      correo: !this.correo().includes('@') ? 'El correo debe tener un @.' : '',
      clave: this.clave().length < 6 ? 'La contraseña necesita 6 caracteres como mínimo.' : '',
      repetirClave: this.repetirClave() !== this.clave() ? 'Las contraseñas no coinciden.' : '',
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

  crearCuenta() {
    this.intentoEnviar.set(true);

    if (!this.formularioValido()) {
      return;
    }

    this.cuentaCreada.set(true);
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
