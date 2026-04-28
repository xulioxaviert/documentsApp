import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { API_BASE_URL } from './core/tokens/api-base-url.token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    {
      provide: API_BASE_URL,
      useValue: environment.apiUrl
    },
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
