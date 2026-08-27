import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IProductoTienda } from '../interfaces/producto.interface';

const PRODUCTOS_URL = `${environment.supabaseUrl}/producto`;

// Cabeceras que pide Supabase en cada peticion.
const SUPABASE_HEADERS = {
  apikey: environment.supabaseKey,
  Authorization: `Bearer ${environment.supabaseKey}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
};

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private http = inject(HttpClient);

  private productosSignal = signal<IProductoTienda[]>([]);
  productos = this.productosSignal.asReadonly();

  cargando = signal(false);
  error = signal('');

  listarProductos() {
    this.cargando.set(true);
    this.error.set('');

    this.http.get<IProductoTienda[]>(PRODUCTOS_URL, { headers: SUPABASE_HEADERS }).subscribe({
      next: (datos) => {
        this.productosSignal.set(datos);
      },
      error: () => {
        this.error.set('No se pudieron cargar los jerseys');
        this.cargando.set(false);
      },
      complete: () => {
        this.cargando.set(false);
      },
    });
  }

  crearProducto(producto: Omit<IProductoTienda, 'id'>) {
    return this.http.post<IProductoTienda>(PRODUCTOS_URL, producto, {
      headers: SUPABASE_HEADERS,
    });
  }

  // En Supabase el registro se elige con un filtro: ?id=eq.<valor>
  actualizarProducto(id: string, producto: Partial<Omit<IProductoTienda, 'id'>>) {
    return this.http.patch<IProductoTienda>(`${PRODUCTOS_URL}?id=eq.${id}`, producto, {
      headers: SUPABASE_HEADERS,
    });
  }

  eliminarProducto(id: string) {
    return this.http.delete<IProductoTienda>(`${PRODUCTOS_URL}?id=eq.${id}`, {
      headers: SUPABASE_HEADERS,
    });
  }
}
