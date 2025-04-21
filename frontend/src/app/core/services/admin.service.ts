import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/auth.model'; // Re-use User model for Admin data
import { CreateAdminPayload, UpdateAdminPayload } from '../models/admin.model';
import { AuthService } from './auth.service';
import { Role } from '../models/role.enum';
import { environment } from '../../../environments/environment';

const API_URL = `${environment.apiUrl}/admins`;

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // Helper to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.currentToken();
    if (!token) {
      console.error('Auth token is missing for AdminService request');
      return new HttpHeaders();
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // POST /admins (Admin only)
  createAdmin(payload: CreateAdminPayload): Observable<User> {
    this.checkAdminRole();
    return this.http.post<User>(API_URL, payload, { headers: this.getAuthHeaders() })
      .pipe(
        map(response => this.formatUserResponse(response)),
        catchError(this.handleError)
      );
  }

  // GET /admins (Admin only)
  getAllAdmins(): Observable<User[]> {
    this.checkAdminRole();
    return this.http.get<User[]>(API_URL, { headers: this.getAuthHeaders() })
      .pipe(
        map(admins => admins.map(admin => this.formatUserResponse(admin))),
        catchError(this.handleError)
      );
  }

  // GET /admins/:id (Admin or own profile)
  getAdminById(id: string): Observable<User> {
    const currentUser = this.authService.currentUser;
    if (currentUser?.role !== Role.ADMIN && currentUser?.id !== id) {
      throw new Error('Operation requires Admin role or own profile access');
    }
    return this.http.get<User>(`${API_URL}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        map(response => this.formatUserResponse(response)),
        catchError(this.handleError)
      );
  }

  // PATCH /admins/:id (Admin only)
  updateAdmin(id: string, payload: UpdateAdminPayload): Observable<User> {
    this.checkAdminRole();
    return this.http.patch<User>(`${API_URL}/${id}`, payload, { headers: this.getAuthHeaders() })
      .pipe(
        map(response => this.formatUserResponse(response)),
        catchError(this.handleError)
      );
  }

  // DELETE /admins/:id (Admin only)
  deleteAdmin(id: string): Observable<any> {
    this.checkAdminRole();
    return this.http.delete<any>(`${API_URL}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // DELETE /admins/profile/delete (Admin only - deleting own profile)
  deleteOwnAdminProfile(): Observable<any> {
    return this.http.delete<any>(`${API_URL}/profile/delete`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Helper for formatting user responses to match frontend User model structure
  private formatUserResponse(adminData: any): User {
    return {
      id: adminData.id,
      email: adminData.email,
      name: adminData.name,
      role: Role.ADMIN,
      phoneNumber: adminData.phoneNumber || undefined
    };
  }

  // Helper to check for admin role before proceeding
  private checkAdminRole(): void {
    if (this.authService.userRole() !== Role.ADMIN) {
      throw new Error('Operation requires Admin role');
    }
  }

  private handleError(error: any): Observable<never> {
    console.error('AdminService Error:', error);
    
    // Add specific error handling 
    if (error.status === 401) {
      console.warn('Unauthorized access attempt to admin resources');
    } else if (error.status === 403) {
      console.warn('Forbidden: User does not have admin privileges');
    }
    
    return throwError(() => error);
  }
} 