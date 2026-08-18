import { Component, computed, effect, signal } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { IProductoCarrito, IProductoTienda } from '../../product.interface';

@Component({
  selector: 'app-lista-productos',
  imports: [ProductCard],
  templateUrl: './lista-productos.html',
})
export class ListaProductos {
  textoBuscado = signal('');

  elementosCarrito = signal<IProductoCarrito[]>([]);

  // Guardo solo los ids de los favoritos, asi no duplico la informacion del producto.
  idsFavoritos = signal<number[]>([]);

  soloFavoritos = signal(false);

  productos = signal<IProductoTienda[]>([
    { id: 1, nombre: 'Camiseta Miami Heat', equipo: 'Miami Heat', abrev: 'MIA', precio: 249, stock: 7, imagen: 'images/productos/153393579.jpg' },
    { id: 2, nombre: 'Camiseta Lakers Negro', equipo: 'Los Angeles Lakers', abrev: 'LAL', precio: 269, stock: 12, imagen: 'images/productos/153393600.jpg' },
    { id: 3, nombre: 'Camiseta Chicago Bulls Negra', equipo: 'Chicago Bulls', abrev: 'CHI', precio: 259, stock: 5, imagen: 'images/productos/153393569.jpg' },
    { id: 4, nombre: 'Camiseta Chicago Bulls Blanca', equipo: 'Chicago Bulls', abrev: 'CHI', precio: 259, stock: 15, imagen: 'images/productos/153393587.jpg' },
    { id: 5, nombre: 'Camiseta Chicago Bulls Classic', equipo: 'Chicago Bulls', abrev: 'CHI', precio: 239, stock: 0, imagen: 'images/productos/153394666.jpg' },
    { id: 6, nombre: 'Camiseta NBA Chicago Bulls', equipo: 'Chicago Bulls', abrev: 'CHI', precio: 219, stock: 9, imagen: 'images/productos/155204065.jpg' },
    { id: 7, nombre: 'Chompa Lakers', equipo: 'Los Angeles Lakers', abrev: 'LAL', precio: 349, stock: 3, imagen: 'images/productos/153393566.jpg' },
    { id: 8, nombre: 'Camiseta Lakers NBA', equipo: 'Los Angeles Lakers', abrev: 'LAL', precio: 199, stock: 18, imagen: 'images/productos/128454883.jpg' },
    { id: 9, nombre: 'Chompa Miami Heat', equipo: 'Miami Heat', abrev: 'MIA', precio: 339, stock: 4, imagen: 'images/productos/153393562.jpg' },
    { id: 10, nombre: 'Camiseta NBA Chicago Bulls Retro', equipo: 'Chicago Bulls', abrev: 'CHI', precio: 209, stock: 11, imagen: 'images/productos/128457302.jpg' },
    { id: 11, nombre: 'Camiseta Milwaukee Bucks Blanca', equipo: 'Milwaukee Bucks', abrev: 'MIL', precio: 229, stock: 2, imagen: 'images/productos/117698653.jpg' },
    { id: 12, nombre: 'Camisilla Chicago Bulls Roja', equipo: 'Chicago Bulls', abrev: 'CHI', precio: 179, stock: 14, imagen: 'images/productos/153393585.jpg' },
    { id: 13, nombre: 'Camisilla Chicago Bulls Negra', equipo: 'Chicago Bulls', abrev: 'CHI', precio: 179, stock: 0, imagen: 'images/productos/153394670.jpg' },
    { id: 14, nombre: 'Jersey Los Angeles Lakers Negro', equipo: 'Los Angeles Lakers', abrev: 'LAL', precio: 289, stock: 6, imagen: 'images/productos/153394691.jpg' },
    { id: 15, nombre: 'Jersey Chicago Bulls Negro', equipo: 'Chicago Bulls', abrev: 'CHI', precio: 289, stock: 13, imagen: 'images/productos/153394683.jpg' },
    { id: 16, nombre: 'Camisilla Miami Heat Jaquez Jr.', equipo: 'Miami Heat', abrev: 'MIA', precio: 199, stock: 1, imagen: 'images/productos/153394679.jpg' },
    { id: 17, nombre: 'Camiseta Boston Celtics Essential', equipo: 'Boston Celtics', abrev: 'BOS', precio: 239, stock: 16, imagen: 'images/productos/132918675.jpg' },
    { id: 18, nombre: 'Camiseta Bulls Cuello Contrastado', equipo: 'Chicago Bulls', abrev: 'CHI', precio: 249, stock: 8, imagen: 'images/productos/155804395.jpg' },
    { id: 19, nombre: 'Camiseta Chicago Bulls City Edition', equipo: 'Chicago Bulls', abrev: 'CHI', precio: 279, stock: 0, imagen: 'images/productos/150975206.jpg' },
    { id: 20, nombre: 'Camiseta Miami Heat Butler', equipo: 'Miami Heat', abrev: 'MIA', precio: 269, stock: 10, imagen: 'images/productos/155804029.jpg' },
  ]);

  productosFavoritos = computed(() => {
    return this.productos().filter((producto) => {
      return this.idsFavoritos().includes(producto.id);
    });
  });

  cantidadDeFavoritos = computed(() => {
    return this.idsFavoritos().length;
  });

  productosFiltrados = computed(() => {
    const busqueda = this.textoBuscado().toLowerCase();
    const base = this.soloFavoritos() ? this.productosFavoritos() : this.productos();

    if (busqueda === '') {
      return base;
    }

    return base.filter((producto) => {
      return (
        producto.nombre.toLowerCase().includes(busqueda) ||
        producto.equipo.toLowerCase().includes(busqueda)
      );
    });
  });

  cantidadDeItems = computed(() => {
    let cantidadTotal = 0;
    for (let index = 0; index < this.elementosCarrito().length; index++) {
      cantidadTotal += this.elementosCarrito()[index].cantidad;
    }
    return cantidadTotal;
  });

  precioTotal = computed(() => {
    let precioTotal = 0;
    for (let index = 0; index < this.elementosCarrito().length; index++) {
      precioTotal += this.elementosCarrito()[index].cantidad * this.elementosCarrito()[index].precio;
    }
    return precioTotal;
  });

  constructor() {
    // Al entrar recupero lo que el usuario dejo guardado la ultima vez.
    const carritoGuardado = localStorage.getItem('nba-carrito');
    if (carritoGuardado) {
      this.elementosCarrito.set(JSON.parse(carritoGuardado));
    }

    const favoritosGuardados = localStorage.getItem('nba-favoritos');
    if (favoritosGuardados) {
      this.idsFavoritos.set(JSON.parse(favoritosGuardados));
    }

    // Cada vez que cambia el carrito o los favoritos vuelvo a guardarlos.
    effect(() => {
      localStorage.setItem('nba-carrito', JSON.stringify(this.elementosCarrito()));
      localStorage.setItem('nba-favoritos', JSON.stringify(this.idsFavoritos()));
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

  alBuscar(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.textoBuscado.set(input.value);
  }

  limpiarBusqueda() {
    this.textoBuscado.set('');
  }

  esFavorito(id: number) {
    return this.idsFavoritos().includes(id);
  }

  manejarToggleFavorito(id: number) {
    this.idsFavoritos.update((listaActual) => {
      if (listaActual.includes(id)) {
        return listaActual.filter((idGuardado) => idGuardado !== id);
      }

      return [...listaActual, id];
    });
  }

  cambiarSoloFavoritos() {
    this.soloFavoritos.update((valorActual) => !valorActual);
  }

  manejarAgregarAlCarrito(data: IProductoCarrito) {
    this.elementosCarrito.update((listaActual) => {
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

  quitarDelCarrito(id: number) {
    this.elementosCarrito.update((listaActual) => {
      return listaActual.filter((item) => item.id !== id);
    });
  }

  vaciarCarrito() {
    this.elementosCarrito.set([]);
  }
}
