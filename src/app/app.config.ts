import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEsPE from '@angular/common/locales/es-PE';

import { routes } from './app.routes';
import { apiKeyInterceptor } from './core/interceptors/api-key-interceptor';

registerLocaleData(localeEsPE, 'es-PE');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    // withComponentInputBinding hace que el :id de la ruta llegue solo al input del componente.
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([apiKeyInterceptor])),
    { provide: LOCALE_ID, useValue: 'es-PE' },
  ],
};
