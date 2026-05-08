import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const toast = inject(ToastService);
  const token = typeof window !== 'undefined' ? localStorage.getItem('bg_token') : null;

  let cloned = req;
  if (token && !req.headers.has('Authorization')) {
    cloned = req.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
  }

  return next(cloned).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        localStorage.removeItem('bg_token');
        auth.logout();
        toast.show('Session expired. Please sign in again.');
        auth.openAuth(false);
      }
      return throwError(() => err);
    })
  );
};
