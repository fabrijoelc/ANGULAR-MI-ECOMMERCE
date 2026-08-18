import { Routes } from '@angular/router';
import { ListaProductos } from './components/lista-productos/lista-productos';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';

export const routes: Routes = [
  { path: '', redirectTo: 'catalogo', pathMatch: 'full' },
  { path: 'catalogo', component: ListaProductos },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: '**', redirectTo: 'catalogo' },
];
