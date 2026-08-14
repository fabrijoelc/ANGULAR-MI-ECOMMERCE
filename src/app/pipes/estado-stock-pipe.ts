import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stockAString',
})
export class EstadoStockPipe implements PipeTransform {
  transform(stock: number): string {
    if (stock > 10) {
      return 'Disponible';
    } else if (stock > 0) {
      return 'Últimas unidades';
    } else {
      return 'Agotado';
    }
  }
}
