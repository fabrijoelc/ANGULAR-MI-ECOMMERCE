import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
})
export class Header {
  buscar = output<string>();

  termino = signal('');

  alEscribir(evento: Event) {
    const valor = (evento.target as HTMLInputElement).value;
    this.termino.set(valor);
    this.buscar.emit(valor);
  }

  limpiar() {
    this.termino.set('');
    this.buscar.emit('');
  }
}
