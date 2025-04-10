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
      // Application should ideally prevent reaching here if not logged in as admin
      return new HttpHeaders(); // Or throw an error
    }
    
    // Ensure the user is actually an admin before proceeding (client-side check)
    if (this.authService.userRole() !== Role.ADMIN) {
      console.warn('Non-admin user attempting to use AdminService');
    }
    
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // POST /admins (Admin only)
  createAdmin(payload: CreateAdminPayload): Observable<User> {
    return this.http.post<User>(API_URL, payload, { headers: this.getAuthHeaders() })
      .pipe(
        map(response => this.formatUserResponse(response)),
        catchError(this.handleError)
      );
  }

  // GET /admins (Admin only)
  getAllAdmins(): Observable<User[]> {
    return this.http.get<User[]>(API_URL, { headers: this.getAuthHeaders() })
      .pipe(
        map(admins => admins.map(admin => this.formatUserResponse(admin))),
        catchError(this.handleError)
      );
  }

  // GET /admins/:id (Admin only)
  getAdminById(id: string): Observable<User> {
    return this.http.get<User>(`${API_URL}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        map(response => this.formatUserResponse(response)),
        catchError(this.handleError)
      );
  }

  // PATCH /admins/:id (Admin only)
  updateAdmin(id: string, payload: UpdateAdminPayload): Observable<User> {
    return this.http.patch<User>(`${API_URL}/${id}`, payload, { headers: this.getAuthHeaders() })
      .pipe(
        map(response => this.formatUserResponse(response)),
        catchError(this.handleError)
      );
  }

  // DELETE /admins/:id (Admin only)
  deleteAdmin(id: string): Observable<any> {
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

  private handleError(error: any): Observable<never> {
    console.error('AdminService Error:', error);
    
    // Add specific error handling 
    if (error.status === 401) {
      console.warn('Unauthorized access attempt to admin resources');
      // Optional: Redirect to login or display message
    } else if (error.status === 403) {
      console.warn('Forbidden: User does not have admin privileges');
      // Optional: Redirect to appropriate page
    }
    
    return throwError(() => error); // Rethrow for component handling
  }
} 