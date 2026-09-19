import { Component, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EquipoService } from '../../services/equipo-service';

// Solo muestra el buscador y los equipos. No busca nada por su cuenta:
// avisa al padre con output() y el padre decide.
@Component({
  selector: 'app-producto-filtro',
  imports: [],
  templateUrl: './producto-filtro.html',
})
export class ProductoFiltro {
  private equipoService = inject(EquipoService);

  texto = input('');
  equipo = input('');

  textoCambio = output<string>();
  equipoCambio = output<string>();

  equipos = toSignal(this.equipoService.listarEquipos(), { initialValue: [] as string[] });

  alEscribir(evento: Event) {
    const valor = (evento.target as HTMLInputElement).value;
    this.textoCambio.emit(valor.trim());
  }

  limpiar() {
    this.textoCambio.emit('');
  }

  elegirEquipo(nombre: string) {
    this.equipoCambio.emit(nombre);
  }
}
