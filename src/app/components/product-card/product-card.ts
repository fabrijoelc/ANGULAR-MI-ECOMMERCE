import { Component, input, model, output } from '@angular/core';
import { IProductoCarrito } from '../../product.interface';
import { EstadoStockPipe } from '../../pipes/estado-stock-pipe';

@Component({
  selector: 'app-product-card',
  imports: [EstadoStockPipe],
  templateUrl: './product-card.html',
})
export class ProductCard {
  id = input.required<number>();
  nombre = input.required<string>();
  equipo = input.required<string>();
  abrev = input.required<string>();
  precio = input.required<number>();
  imagen = input.required<string>();
  stock = input.required<number>();
  esFavorito = input<boolean>(false);

  cantidad = model<number>(1);

  addToCart = output<IProductoCarrito>();
  toggleFavorito = output<number>();

  incrementar() {
    this.cantidad.update((valorActual) => {
      return valorActual + 1;
    });
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
    this.addToCart.emit({
      id: this.id(),
      nombre: this.nombre(),
      equipo: this.equipo(),
      abrev: this.abrev(),
      precio: this.precio(),
      cantidad: this.cantidad(),
      imagen: this.imagen(),
    });
  }

  marcarFavorito() {
    this.toggleFavorito.emit(this.id());
  }
}
