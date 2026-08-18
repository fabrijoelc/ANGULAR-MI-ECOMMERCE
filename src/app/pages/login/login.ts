import { Component, computed, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
})
export class Login {
  correo = signal('');
  clave = signal('');
  verClave = signal(false);

  intentoEnviar = signal(false);
  sesionIniciada = signal(false);

  errores = computed(() => {
    return {
      correo: !this.correo().includes('@') ? 'Ingresa un correo válido.' : '',
      clave: this.clave().length === 0 ? 'Escribe tu contraseña.' : '',
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

  iniciarSesion() {
    this.intentoEnviar.set(true);

    if (!this.formularioValido()) {
      return;
    }

    this.sesionIniciada.set(true);
  }

  cerrarSesion() {
    this.correo.set('');
    this.clave.set('');
    this.intentoEnviar.set(false);
    this.sesionIniciada.set(false);
  }
}
