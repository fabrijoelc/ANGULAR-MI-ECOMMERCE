import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { NotFound } from './features/not-found/not-found';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  // El home y la 404 quedan eager: son las que se ven de entrada.
  { path: '', component: Home },

  // Estas se descargan recien cuando entras a ellas (lazy loading).
  {
    path: 'catalogo',
    loadComponent: () =>
      import('./components/lista-productos/lista-productos').then((m) => m.ListaProductos),
  },
  {
    path: 'producto/:id',
    loadComponent: () =>
      import('./features/product-detail/product-detail').then((m) => m.ProductDetail),
  },
  {
    path: 'carrito',
    loadComponent: () => import('./features/cart/cart').then((m) => m.Cart),
  },
  // Protegida: si no hay sesion, el guard manda al login.
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () => import('./features/checkout/checkout').then((m) => m.Checkout),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro').then((m) => m.Registro),
  },

  // Ruta comodin: siempre al final del array.
  { path: '**', component: NotFound },
];
