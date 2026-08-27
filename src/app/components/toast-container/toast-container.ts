import { Component, inject } from '@angular/core';
import { NotificacionService } from '../../services/notificacion-service';

@Component({
  selector: 'app-toast-container',
  imports: [],
  templateUrl: './toast-container.html',
})
export class ToastContainer {
  notificacionService = inject(NotificacionService);
}
