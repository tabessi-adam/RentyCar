import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginDto, RegisterDto, User } from '../models/auth.model';
import { Role } from '../models/role.enum';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    if (this.isBrowser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          this.currentUserSubject.next(user);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('currentUser'); // Remove invalid data
        }
      }
    }
  }

  register(registerDto: RegisterDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, registerDto).pipe(
      catchError(this.handleError)
    );
  }

  login(loginDto: LoginDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, loginDto).pipe(
      tap((response: any) => {
        if (response && response.access_token) {
          const user = {
            ...response.user,
            accessToken: response.access_token
          };
          if (this.isBrowser) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          this.currentUserSubject.next(user);
        }
      }),
      catchError(this.handleError)
    );
  }

  adminLogin(loginDto: LoginDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/login`, loginDto).pipe(
      tap((response: any) => {
        if (response && response.access_token) {
          const user = {
            id: response.id,
            email: loginDto.email,
            role: Role.ADMIN,
            accessToken: response.access_token
          };
          if (this.isBrowser) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          this.currentUserSubject.next(user);
        }
      }),
      catchError(this.handleError)
    );
  }

  agentLogin(loginDto: LoginDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/agent/login`, loginDto).pipe(
      tap((response: any) => {
        if (response && response.access_token) {
          const user = {
            ...response,
            accessToken: response.access_token
          };
          if (this.isBrowser) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          this.currentUserSubject.next(user);
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser()?.accessToken;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  userRole(): Role | undefined {
    return this.getCurrentUser()?.role;
  }

  currentUser(): User | null {
    return this.getCurrentUser();
  }

  currentToken(): string | undefined {
    return this.getCurrentUser()?.accessToken;
  }

  hasRole(role: Role): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  private handleError(error: any): Observable<never> {
    console.error('Auth Service Error:', error);
    
    let errorMessage = 'An unknown error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status === 409) {
      errorMessage = 'This email address is already registered. Please use a different email or try logging in.';
    } else if (error.status === 400) {
      errorMessage = 'Invalid request. Please check your input and try again.';
    } else if (error.status === 401) {
      errorMessage = 'Invalid credentials. Please check your email and password.';
    } else if (error.status === 500) {
      errorMessage = 'Server error. Please try again later.';
    }
    
    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      error: error.error
    }));
  }
}