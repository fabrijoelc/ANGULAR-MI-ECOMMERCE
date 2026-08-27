import { computed, effect, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private idsSignal = signal<string[]>([]);
  ids = this.idsSignal.asReadonly();

  cantidad = computed(() => this.idsSignal().length);

  constructor() {
    const guardados = localStorage.getItem('nba-favoritos');
    if (guardados) {
      this.idsSignal.set(JSON.parse(guardados));
    }

    effect(() => {
      localStorage.setItem('nba-favoritos', JSON.stringify(this.idsSignal()));
    });
  }

  esFavorito(id: string) {
    return this.idsSignal().includes(id);
  }

  toggle(id: string) {
    this.idsSignal.update((listaActual) => {
      if (listaActual.includes(id)) {
        return listaActual.filter((idGuardado) => idGuardado !== id);
      }

      return [...listaActual, id];
    });
  }
}
