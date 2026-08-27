import { computed, effect, Injectable, signal } from '@angular/core';
import { IProductoCarrito } from '../interfaces/producto.interface';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private elementosSignal = signal<IProductoCarrito[]>([]);
  elementos = this.elementosSignal.asReadonly();

  cantidadDeItems = computed(() => {
    let cantidadTotal = 0;
    for (let index = 0; index < this.elementosSignal().length; index++) {
      cantidadTotal += this.elementosSignal()[index].cantidad;
    }
    return cantidadTotal;
  });

  precioTotal = computed(() => {
    let precioTotal = 0;
    for (let index = 0; index < this.elementosSignal().length; index++) {
      precioTotal += this.elementosSignal()[index].cantidad * this.elementosSignal()[index].precio;
    }
    return precioTotal;
  });

  constructor() {
    const guardado = localStorage.getItem('nba-carrito');
    if (guardado) {
      this.elementosSignal.set(JSON.parse(guardado));
    }

    effect(() => {
      localStorage.setItem('nba-carrito', JSON.stringify(this.elementosSignal()));
    });

    effect(() => {
      const items = this.cantidadDeItems();

      if (items === 0) {
        document.title = 'Tienda de Jerseys NBA';
      } else {
        document.title = '(' + items + ') Tienda de Jerseys NBA';
      }
    });
  }

  agregar(data: IProductoCarrito) {
    this.elementosSignal.update((listaActual) => {
      const existente = listaActual.find((item) => item.id === data.id);

      if (existente) {
        return listaActual.map((item) => {
          if (item.id === data.id) {
            return { ...item, cantidad: item.cantidad + data.cantidad };
          }
          return item;
        });
      }

      return [...listaActual, data];
    });
  }

  quitar(id: string) {
    this.elementosSignal.update((listaActual) => {
      return listaActual.filter((item) => item.id !== id);
    });
  }

  vaciar() {
    this.elementosSignal.set([]);
  }
}
