import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-paginacion',
  imports: [],
  templateUrl: './paginacion.html',
})
export class Paginacion {
  pagina = input.required<number>();
  totalPaginas = input.required<number>();

  cambioPagina = output<number>();

  listaPaginas = computed(() => {
    return Array.from({ length: this.totalPaginas() }, (_, i) => i + 1);
  });

  anterior() {
    this.cambioPagina.emit(Math.max(1, this.pagina() - 1));
  }

  siguiente() {
    this.cambioPagina.emit(Math.min(this.totalPaginas(), this.pagina() + 1));
  }

  irA(numero: number) {
    this.cambioPagina.emit(numero);
  }
}
