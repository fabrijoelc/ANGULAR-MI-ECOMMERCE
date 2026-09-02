import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto-service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
})
export class Home {
  productoService = inject(ProductoService);

  constructor() {
    if (this.productoService.productos().length === 0) {
      this.productoService.listarProductos();
    }
  }
}
