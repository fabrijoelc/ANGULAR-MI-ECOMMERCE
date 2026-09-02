import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto-service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
})
export class Home {
  productoService = inject(ProductoService);

  // Los 4 primeros jerseys con stock, para la vitrina del inicio.
  destacados = computed(() => {
    return this.productoService
      .productos()
      .filter((producto) => producto.stock > 0)
      .slice(0, 4);
  });

  // Lista de equipos sin repetir, sacada de los propios productos.
  equipos = computed(() => {
    const vistos: string[] = [];

    for (const producto of this.productoService.productos()) {
      if (!vistos.includes(producto.equipo)) {
        vistos.push(producto.equipo);
      }
    }

    return vistos;
  });

  constructor() {
    if (this.productoService.productos().length === 0) {
      this.productoService.listarProductos();
    }
  }
}
