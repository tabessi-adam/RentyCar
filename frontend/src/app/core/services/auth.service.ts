import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginDto, RegisterDto, User as AuthUser } from '../models/auth.model';
import { Role } from '../models/role.enum';
import { isPlatformBrowser } from '@angular/common';

export type UserRole = Role;

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  accessToken?: string;
}

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
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          this.currentUserSubject.next(JSON.parse(savedUser));
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('currentUser');
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
          const user: User = {
            id: response.id,
            email: loginDto.email,
            role: Role.ADMIN,
            name: response.name || loginDto.email.split('@')[0],
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
          const user: User = {
            id: response.id,
            email: loginDto.email,
            role: Role.AGENT,
            name: response.name || loginDto.email.split('@')[0],
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

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser?.accessToken;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  userRole(): Role | undefined {
    return this.currentUser?.role;
  }

  currentToken(): string | undefined {
    return this.currentUser?.accessToken;
  }

  hasRole(role: Role): boolean {
    const user = this.currentUser;
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

  get isAdmin(): boolean {
    return this.currentUser?.role === Role.ADMIN;
  }

  get isAgent(): boolean {
    return this.currentUser?.role === Role.AGENT;
  }

  get isClient(): boolean {
    return this.currentUser?.role === Role.CLIENT;
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-email?email=${encodeURIComponent(email)}`).pipe(
      catchError(() => of(false))
    );
  }
}