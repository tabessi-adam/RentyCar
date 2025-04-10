import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser && currentUser.accessToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.accessToken}`
        }
      });
    }

    return next.handle(request);
  }
}

// Factory function for the HTTP interceptor
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const currentUser = authService.getCurrentUser();
  
  if (currentUser && currentUser.accessToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${currentUser.accessToken}`
      }
    });
  }
  
  return next(req);
};