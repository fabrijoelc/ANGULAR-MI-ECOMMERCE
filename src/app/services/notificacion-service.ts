import { Injectable, signal } from '@angular/core';
import { INotificacion, TipoNotificacion } from '../interfaces/notificacion.interface';

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private notificacionesSignal = signal<INotificacion[]>([]);
  notificaciones = this.notificacionesSignal.asReadonly();

  show(mensaje: string, tipo: TipoNotificacion) {
    const id = Date.now();

    this.notificacionesSignal.update((listaActual) => {
      return [...listaActual, { id, mensaje, tipo }];
    });

    setTimeout(() => {
      this.eliminar(id);
    }, 3000);
  }

  eliminar(id: number) {
    this.notificacionesSignal.update((listaActual) => {
      return listaActual.filter((notificacion) => notificacion.id !== id);
    });
  }
}
