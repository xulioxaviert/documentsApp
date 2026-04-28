import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Simulamos la obtención del token desde el local storage o un servicio de autenticación
  const token = localStorage.getItem('auth_token');

  // Si hay token, clonamos la petición para añadir el header de Authorization
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  // Si no hay token, dejamos pasar la petición tal cual
  return next(req);
};
