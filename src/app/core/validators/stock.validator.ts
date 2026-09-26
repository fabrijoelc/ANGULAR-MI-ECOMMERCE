import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, debounceTime, first, map, switchMap, catchError } from 'rxjs';
import { ProductoService } from '../../services/producto-service';
import { CarritoService } from '../../services/carrito-service';

// Pregunta al servidor si todavia alcanza el stock de cada jersey del carrito.
// El debounce evita disparar una peticion por cada tecla del formulario.
export function stockDisponibleValidator(
  productoService: ProductoService,
  carritoService: CarritoService,
): AsyncValidatorFn {
  return (_control: AbstractControl): Observable<ValidationErrors | null> => {
    const items = carritoService.items();

    if (items.length === 0) {
      return of(null);
    }

    return of(items).pipe(
      debounceTime(500),
      switchMap((lista) => productoService.verificarStock(lista.map((item) => item.id))),
      map((stockPorId) => {
        const sinStock = items.filter((item) => item.cantidad > (stockPorId[item.id] ?? 0));

        if (sinStock.length === 0) {
          return null;
        }

        return { stockInsuficiente: sinStock.map((item) => item.nombre).join(', ') };
      }),
      catchError(() => of(null)),
      first(),
    );
  };
}
