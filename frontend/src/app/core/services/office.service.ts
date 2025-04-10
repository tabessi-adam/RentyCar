import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Office, CreateOfficePayload, UpdateOfficePayload } from '../models/office.model';
import { AuthService } from './auth.service';
import { Role } from '../models/role.enum';
import { environment } from '../../../environments/environment';

const API_URL = `${environment.apiUrl}/offices`;

@Injectable({
  providedIn: 'root'
})
export class OfficeService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // Helper to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.currentToken();
    if (!token) {
      console.error('Auth token is missing for OfficeService request');
      return new HttpHeaders();
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // POST / (Admin only)
  createOffice(payload: CreateOfficePayload): Observable<Office> {
    this.checkAdminRole();
    return this.http.post<Office>(API_URL, payload, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // GET / (Admin or Agent)
  getAllOffices(): Observable<Office[]> {
    this.checkAdminOrAgentRole();
    return this.http.get<Office[]>(API_URL, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // GET /:id (Admin or Agent)
  getOfficeById(id: string): Observable<Office> {
    this.checkAdminOrAgentRole();
    return this.http.get<Office>(`${API_URL}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // PATCH /:id (Admin only)
  updateOffice(id: string, payload: UpdateOfficePayload): Observable<Office> {
    this.checkAdminRole();
    return this.http.patch<Office>(`${API_URL}/${id}`, payload, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // DELETE /:id (Admin only)
  deleteOffice(id: string): Observable<any> {
    this.checkAdminRole();
    return this.http.delete<any>(`${API_URL}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // --- Role Check Helpers ---
  private checkAdminRole(): void {
    if (this.authService.userRole() !== Role.ADMIN) {
      // Or return throwError(() => new Error(...))
      throw new Error('Operation requires Admin role');
    }
  }

  private checkAdminOrAgentRole(): void {
    const role = this.authService.userRole();
    if (role !== Role.ADMIN && role !== Role.AGENT) {
      throw new Error('Operation requires Admin or Agent role');
    }
  }
  // --- End Role Check Helpers ---

  private handleError(error: any): Observable<never> {
    console.error('OfficeService Error:', error);
    return throwError(() => error);
  }
} 