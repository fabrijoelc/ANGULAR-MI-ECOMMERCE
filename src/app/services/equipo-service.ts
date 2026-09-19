import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const PRODUCTOS_URL = `${environment.supabaseUrl}/producto`;

// Los equipos hacen de "categoria" del catalogo. Se sacan de los propios
// productos, asi un equipo nuevo aparece solo en el filtro.
@Injectable({ providedIn: 'root' })
export class EquipoService {
  private http = inject(HttpClient);

  listarEquipos(): Observable<string[]> {
    return this.http
      .get<{ equipo: string }[]>(PRODUCTOS_URL, { params: { select: 'equipo' } })
      .pipe(
        map((filas) => {
          const equipos: string[] = [];

          for (const fila of filas) {
            if (!equipos.includes(fila.equipo)) {
              equipos.push(fila.equipo);
            }
          }

          return equipos.sort();
        }),
      );
  }
}
