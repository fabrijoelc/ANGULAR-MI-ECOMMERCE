import { Component } from '@angular/core';
import { ListaProductos } from './components/lista-productos/lista-productos';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [ListaProductos, Footer],
  templateUrl: './app.html',
})
export class App {}
