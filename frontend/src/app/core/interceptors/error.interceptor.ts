import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpInterceptorFn } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        if (err.status === 401) {
          // Auto logout if 401 Unauthorized response returned from api
          this.authService.logout();
          this.router.navigate(['/login']);
        }

        const error = err.error?.message || err.statusText;
        return throwError(() => new Error(error));
      })
    );
  }
}

// Factory function for the HTTP interceptor
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return next(req).pipe(
    catchError(err => {
      let errorMessage = 'An unknown error occurred';
      
      if (err.status === 401) {
        if (err.error?.message === 'No account found with this email') {
          errorMessage = 'No account found with this email address';
        } else if (err.error?.message === 'Incorrect password') {
          errorMessage = 'Incorrect password. Please try again.';
        } else {
          // Auto logout if 401 Unauthorized response returned from api
          authService.logout();
          router.navigate(['/login']);
          errorMessage = 'Your session has expired. Please log in again.';
        }
      } else if (err.status === 400) {
        errorMessage = err.error?.message || 'Invalid request. Please check your input.';
      } else if (err.status === 404) {
        errorMessage = err.error?.message || 'Resource not found.';
      } else if (err.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      return throwError(() => ({
        message: errorMessage,
        status: err.status,
        error: err.error
      }));
    })
  );
};