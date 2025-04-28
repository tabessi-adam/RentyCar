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
  profilePictureUrl?: string;
  profilePicturePublicId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;
  private tokenRefreshTimeout: any;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    if (this.isBrowser) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          this.currentUserSubject.next(user);
          this.scheduleTokenRefresh(user.accessToken);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('currentUser');
        }
      }
    }
  }

  private scheduleTokenRefresh(token: string) {
    if (this.tokenRefreshTimeout) {
      clearTimeout(this.tokenRefreshTimeout);
    }

    // Decode the token to get expiration time
    const tokenData = this.decodeToken(token);
    if (!tokenData || !tokenData.exp) return;

    // Calculate time until expiration (minus 5 minutes to refresh early)
    const expiresIn = (tokenData.exp * 1000) - Date.now() - (5 * 60 * 1000);
    
    if (expiresIn > 0) {
      this.tokenRefreshTimeout = setTimeout(() => {
        this.refreshToken();
      }, expiresIn);
    }
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  refreshToken() {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser?.accessToken) return;

    this.http.post(`${this.apiUrl}/refresh`, { token: currentUser.accessToken })
      .pipe(
        tap((response: any) => {
          if (response && response.access_token) {
            const user = {
              ...currentUser,
              accessToken: response.access_token
            };
            if (this.isBrowser) {
              localStorage.setItem('currentUser', JSON.stringify(user));
            }
            this.currentUserSubject.next(user);
            this.scheduleTokenRefresh(response.access_token);
          }
        }),
        catchError(error => {
          console.error('Error refreshing token:', error);
          this.logout();
          return throwError(() => error);
        })
      )
      .subscribe();
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
    if (this.tokenRefreshTimeout) {
      clearTimeout(this.tokenRefreshTimeout);
    }
    this.currentUserSubject.next(null);
  }

  updateCurrentUser(user: User): void {
    if (this.isBrowser) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
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