import { Component, computed, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  of,
  retry,
  switchMap,
  tap,
} from 'rxjs';
import { ProductCard } from '../product-card/product-card';
import { SkeletonCard } from '../skeleton-card/skeleton-card';
import { Paginacion } from '../paginacion/paginacion';
import { ProductoFiltro } from '../producto-filtro/producto-filtro';
import { IProductoCarrito } from '../../interfaces/producto.interface';
import { IBusquedaRespuesta } from '../../interfaces/busqueda.interface';
import { ProductoService } from '../../services/producto-service';
import { CarritoService } from '../../services/carrito-service';
import { FavoritosService } from '../../services/favoritos-service';
import { NotificacionService } from '../../services/notificacion-service';

@Component({
  selector: 'app-lista-productos',
  imports: [ProductCard, SkeletonCard, Paginacion, ProductoFiltro],
  templateUrl: './lista-productos.html',
})
export class ListaProductos {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  productoService = inject(ProductoService);
  carritoService = inject(CarritoService);
  favoritosService = inject(FavoritosService);
  notificacionService = inject(NotificacionService);

  readonly TAMANO_PAGINA = 6;

  // Estado de la busqueda: texto, equipo (la "categoria") y pagina.
  textoBusqueda = signal('');
  equipo = signal('');
  paginaActual = signal(1);

  cargando = signal(true);

  // Tantos skeletons como tarjetas entran en una pagina.
  skeletons = Array.from({ length: this.TAMANO_PAGINA }, (_, i) => i + 1);

  // Los operadores de RxJS trabajan con Observables, no con signals:
  // toObservable() es el puente. Tiene que llamarse aqui, en contexto de inyeccion.
  private busqueda$ = combineLatest([
    toObservable(this.textoBusqueda),
    toObservable(this.equipo),
    toObservable(this.paginaActual),
  ]).pipe(
    // Espera a que el usuario deje de escribir 300 ms antes de pedir nada.
    debounceTime(300),

    // Si texto, equipo y pagina son los mismos que la vez anterior, no repite la peticion.
    distinctUntilChanged(
      ([textoA, equipoA, paginaA], [textoB, equipoB, paginaB]) =>
        textoA === textoB && equipoA === equipoB && paginaA === paginaB,
    ),

    // Se activa en cada intento, antes de lanzar la peticion.
    tap(() => this.cargando.set(true)),

    // switchMap cancela la peticion anterior si llega una nueva busqueda,
    // asi nunca se muestra una respuesta vieja que llego tarde.
    switchMap(([texto, equipo, pagina]) =>
      this.productoService.buscar(texto, equipo, pagina, this.TAMANO_PAGINA).pipe(
        retry({ count: 2, delay: 1000 }),
        tap(() => this.cargando.set(false)),
        catchError(() => {
          this.cargando.set(false);
          this.notificacionService.show('No se pudieron cargar los jerseys', 'error');
          return of({ data: [], total: 0 } as IBusquedaRespuesta);
        }),
      ),
    ),
  );

  // De vuelta a signal para usarlo en la plantilla, con valor inicial.
  resultado = toSignal(this.busqueda$, {
    initialValue: { data: [], total: 0 } as IBusquedaRespuesta,
  });

  productos = computed(() => this.resultado().data);
  total = computed(() => this.resultado().total);
  totalPaginas = computed(() => Math.ceil(this.total() / this.TAMANO_PAGINA));

  // Rango que se esta mostrando, ej. "7-12 de 20".
  desde = computed(() => (this.total() === 0 ? 0 : (this.paginaActual() - 1) * this.TAMANO_PAGINA + 1));
  hasta = computed(() => Math.min(this.paginaActual() * this.TAMANO_PAGINA, this.total()));

  constructor() {
    // Al entrar, el estado sale de la URL: asi ?q=bulls&page=2 abre ya filtrado.
    const params = this.route.snapshot.queryParamMap;
    this.textoBusqueda.set(params.get('q') ?? '');
    this.equipo.set(params.get('categoria') ?? '');

    const pagina = Number(params.get('page'));
    this.paginaActual.set(pagina > 0 ? pagina : 1);

    // Y cada cambio se escribe de vuelta en la URL.
    effect(() => {
      this.router.navigate([], {
        queryParams: {
          q: this.textoBusqueda() || null,
          categoria: this.equipo() || null,
          page: this.paginaActual() > 1 ? this.paginaActual() : null,
        },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });
  }

  alBuscar(texto: string) {
    this.textoBusqueda.set(texto);
    // Texto nuevo = volver a la pagina 1: la pagina 3 del filtro viejo
    // probablemente no exista con el nuevo.
    this.paginaActual.set(1);
  }

  limpiarBusqueda() {
    this.textoBusqueda.set('');
    this.paginaActual.set(1);
  }

  alCambiarEquipo(nombre: string) {
    this.equipo.set(nombre);
    this.paginaActual.set(1);
  }

  alCambiarPagina(numero: number) {
    this.paginaActual.set(numero);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  manejarAgregarAlCarrito(data: IProductoCarrito) {
    this.carritoService.agregar(data);
    this.notificacionService.show('Agregaste ' + data.nombre + ' al carrito', 'exito');
  }

  manejarToggleFavorito(id: string) {
    this.favoritosService.toggle(id);
  }
}
