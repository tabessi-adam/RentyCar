import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const currentUser = authService.currentUser;
  const token = currentUser?.accessToken;

  // Skip auth header for login/register endpoints
  if (!req.url.includes('/auth/')) {
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === HttpStatusCode.Unauthorized) {
        // Prevent multiple logout attempts
        if (!isRefreshing) {
          isRefreshing = true;
          console.log('Session expired, logging out...');
          authService.logout();
          router.navigate(['/auth/login'], { 
            queryParams: { 
              returnUrl: router.url,
              reason: 'session_expired' 
            }
          });
        }
      }
      return throwError(() => ({
        message: error.error?.message || 'Your session has expired. Please log in again.',
        status: error.status,
        error: error.error
      }));
    })
  );
};