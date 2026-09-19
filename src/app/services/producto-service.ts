import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IProductoTienda } from '../interfaces/producto.interface';
import { IBusquedaRespuesta } from '../interfaces/busqueda.interface';

const PRODUCTOS_URL = `${environment.supabaseUrl}/producto`;

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

    this.http.get<IProductoTienda[]>(PRODUCTOS_URL).subscribe({
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

  // Busqueda paginada en el servidor: filtra por texto y equipo, y trae
  // solo la pagina pedida. El total real viene en la cabecera Content-Range.
  buscar(texto: string, equipo: string, pagina: number, tamanoPagina = 6): Observable<IBusquedaRespuesta> {
    const desde = (pagina - 1) * tamanoPagina;
    const hasta = desde + tamanoPagina - 1;

    const params: Record<string, string> = { order: 'nombre.asc' };

    if (texto) {
      params['nombre'] = `ilike.*${texto}*`;
    }

    if (equipo) {
      params['equipo'] = `eq.${equipo}`;
    }

    return this.http
      .get<IProductoTienda[]>(PRODUCTOS_URL, {
        params,
        headers: {
          Range: `${desde}-${hasta}`,
          Prefer: 'count=exact',
        },
        observe: 'response',
      })
      .pipe(
        map((respuesta) => {
          // Content-Range llega como "0-5/20": lo que va despues de la barra es el total.
          const total = Number(respuesta.headers.get('content-range')?.split('/')[1] ?? 0);

          return {
            data: respuesta.body ?? [],
            total,
          };
        }),
      );
  }


  crearProducto(producto: Omit<IProductoTienda, 'id'>) {
    return this.http.post<IProductoTienda>(PRODUCTOS_URL, producto);
  }

  // En Supabase el registro se elige con un filtro: ?id=eq.<valor>
  actualizarProducto(id: string, producto: Partial<Omit<IProductoTienda, 'id'>>) {
    return this.http.patch<IProductoTienda>(`${PRODUCTOS_URL}?id=eq.${id}`, producto);
  }

  eliminarProducto(id: string) {
    return this.http.delete<IProductoTienda>(`${PRODUCTOS_URL}?id=eq.${id}`);
  }
}
