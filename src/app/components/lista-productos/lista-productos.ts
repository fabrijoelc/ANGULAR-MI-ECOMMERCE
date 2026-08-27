import { Component, computed, inject, signal } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { IProductoCarrito } from '../../interfaces/producto.interface';
import { ProductoService } from '../../services/producto-service';
import { CarritoService } from '../../services/carrito-service';
import { FavoritosService } from '../../services/favoritos-service';
import { NotificacionService } from '../../services/notificacion-service';

@Component({
  selector: 'app-lista-productos',
  imports: [ProductCard],
  templateUrl: './lista-productos.html',
})
export class ListaProductos {
  productoService = inject(ProductoService);
  carritoService = inject(CarritoService);
  favoritosService = inject(FavoritosService);
  notificacionService = inject(NotificacionService);

  textoBuscado = signal('');
  soloFavoritos = signal(false);

  productosFavoritos = computed(() => {
    return this.productoService.productos().filter((producto) => {
      return this.favoritosService.ids().includes(producto.id);
    });
  });

  productosFiltrados = computed(() => {
    const busqueda = this.textoBuscado().toLowerCase();
    const base = this.soloFavoritos() ? this.productosFavoritos() : this.productoService.productos();

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

  constructor() {
    // Los jerseys ya no estan escritos aqui: los trae el servicio desde Supabase.
    this.productoService.listarProductos();
  }

  alBuscar(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.textoBuscado.set(input.value);
  }

  limpiarBusqueda() {
    this.textoBuscado.set('');
  }

  cambiarSoloFavoritos() {
    this.soloFavoritos.update((valorActual) => !valorActual);
  }

  manejarAgregarAlCarrito(data: IProductoCarrito) {
    this.carritoService.agregar(data);
    this.notificacionService.show('Agregaste ' + data.nombre + ' al carrito', 'exito');
  }

  manejarToggleFavorito(id: string) {
    this.favoritosService.toggle(id);
  }
}
