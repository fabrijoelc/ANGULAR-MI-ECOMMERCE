import { computed, effect, Injectable, signal } from '@angular/core';
import { IProductoCarrito } from '../interfaces/producto.interface';

const CLAVE_CARRITO = 'nba-carrito';

// Estado de interfaz, separado de los datos del carrito.
interface IEstadoUI {
  cargando: boolean;
  error: string | null;
  ultimoAgregado: string;
}

@Injectable({ providedIn: 'root' })
export class CarritoService {
  // Los datos van por un lado...
  private itemsSignal = signal<IProductoCarrito[]>([]);
  items = this.itemsSignal.asReadonly();

  // ...y el estado de la interfaz por otro, sin mezclarlos en un objeto.
  estadoUI = signal<IEstadoUI>({
    cargando: false,
    error: null,
    ultimoAgregado: '',
  });

  // Se mantiene el nombre viejo para no romper el resto de la app.
  elementos = this.itemsSignal.asReadonly();

  // --- Cadena de computed: cada uno depende del anterior ---
  subtotal = computed(() =>
    this.itemsSignal().reduce((acc, item) => acc + item.precio * item.cantidad, 0),
  );

  // Mas de S/ 200 de compra: 10% de descuento.
  descuento = computed(() => {
    const base = this.subtotal();
    return base > 200 ? base * 0.1 : 0;
  });

  total = computed(() => this.subtotal() - this.descuento());

  cantidadDeItems = computed(() =>
    this.itemsSignal().reduce((acc, item) => acc + item.cantidad, 0),
  );

  // Alias del total, que es lo que ya usaban el carrito y el header.
  precioTotal = this.total;

  constructor() {
    // El signal se llena leyendo LocalStorage antes que nada.
    const guardado = localStorage.getItem(CLAVE_CARRITO);

    if (guardado) {
      try {
        this.itemsSignal.set(JSON.parse(guardado));
      } catch {
        localStorage.removeItem(CLAVE_CARRITO);
      }
    }

    // Un solo effect() guarda en cada cambio: ningun metodo del CRUD
    // tiene que acordarse de llamar setItem().
    effect(() => {
      localStorage.setItem(CLAVE_CARRITO, JSON.stringify(this.itemsSignal()));
    });

    effect(() => {
      const items = this.cantidadDeItems();
      document.title = items === 0 ? 'Tienda de Jerseys NBA' : '(' + items + ') Tienda de Jerseys NBA';
    });
  }

  // --- CRUD inmutable: siempre se reemplaza el arreglo, nunca se muta ---

  agregarAlCarrito(data: IProductoCarrito) {
    this.itemsSignal.update((lista) => {
      const existente = lista.find((item) => item.id === data.id);

      if (existente) {
        return lista.map((item) =>
          item.id === data.id ? { ...item, cantidad: item.cantidad + data.cantidad } : item,
        );
      }

      return [...lista, { ...data }];
    });

    this.estadoUI.update((estado) => ({ ...estado, ultimoAgregado: data.nombre, error: null }));
  }

  actualizarCantidad(id: string, cantidad: number) {
    if (cantidad < 1) {
      this.eliminarDelCarrito(id);
      return;
    }

    this.itemsSignal.update((lista) =>
      lista.map((item) => (item.id === id ? { ...item, cantidad } : item)),
    );
  }

  eliminarDelCarrito(id: string) {
    this.itemsSignal.update((lista) => lista.filter((item) => item.id !== id));
  }

  vaciar() {
    this.itemsSignal.set([]);
    this.estadoUI.update((estado) => ({ ...estado, ultimoAgregado: '', error: null }));
  }

  // Nombres viejos, para no tocar los componentes que ya funcionaban.
  agregar(data: IProductoCarrito) {
    this.agregarAlCarrito(data);
  }

  quitar(id: string) {
    this.eliminarDelCarrito(id);
  }
}
