import { Component, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EstadoStockPipe } from '../../pipes/estado-stock-pipe';
import { ProductoService } from '../../services/producto-service';
import { CarritoService } from '../../services/carrito-service';
import { FavoritosService } from '../../services/favoritos-service';
import { NotificacionService } from '../../services/notificacion-service';

@Component({
  selector: 'app-product-detail',
  imports: [EstadoStockPipe, RouterLink],
  templateUrl: './product-detail.html',
})
export class ProductDetail {
  private router = inject(Router);

  productoService = inject(ProductoService);
  carritoService = inject(CarritoService);
  favoritosService = inject(FavoritosService);
  notificacionService = inject(NotificacionService);

  // El id llega solo desde la ruta gracias a withComponentInputBinding().
  id = input.required<string>();

  cantidad = signal(1);

  producto = computed(() => {
    return this.productoService.productos().find((item) => item.id === this.id());
  });

  constructor() {
    if (this.productoService.productos().length === 0) {
      this.productoService.listarProductos();
    }
  }

  incrementar() {
    this.cantidad.update((valorActual) => valorActual + 1);
  }

  reducir() {
    this.cantidad.update((valorActual) => {
      if (valorActual === 1) {
        return 1;
      }
      return valorActual - 1;
    });
  }

  agregarAlCarrito() {
    const item = this.producto();

    if (!item) {
      return;
    }

    this.carritoService.agregar({
      id: item.id,
      nombre: item.nombre,
      equipo: item.equipo,
      abrev: item.abrev,
      precio: item.precio,
      cantidad: this.cantidad(),
      imagen: item.imagen,
    });

    this.notificacionService.show('Agregaste ' + item.nombre + ' al carrito', 'exito');
  }

  volverAlCatalogo() {
    this.router.navigate(['/catalogo']);
  }
}
