import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Agent, CreateAgentPayload, UpdateAgentPayload } from '../models/agent.model';
import { AuthService } from './auth.service';
import { Role } from '../models/role.enum';
import { environment } from '../../../environments/environment';

const API_URL = `${environment.apiUrl}/agents`;

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // Helper to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.currentToken();
    if (!token) {
      console.error('Auth token is missing for AgentService request');
      return new HttpHeaders();
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // POST / (Admin only)
  createAgent(payload: CreateAgentPayload): Observable<Agent> {
    this.checkAdminRole(); // Throw error if not admin
    return this.http.post<Agent>(API_URL, payload, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // GET / (Admin only)
  getAllAgents(): Observable<Agent[]> {
    this.checkAdminRole();
    return this.http.get<Agent[]>(API_URL, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // GET /:id (Admin or own profile)
  getAgentById(id: string): Observable<Agent> {
    return this.http.get<Agent>(`${API_URL}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // GET /office/:officeId (Admin only)
  getAgentsByOffice(officeId: string): Observable<Agent[]> {
    this.checkAdminRole();
    return this.http.get<Agent[]>(`${API_URL}/office/${officeId}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // PATCH /:id (Admin only)
  updateAgent(id: string, payload: UpdateAgentPayload): Observable<Agent> {
    this.checkAdminRole();
    return this.http.patch<Agent>(`${API_URL}/${id}`, payload, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // DELETE /:id (Admin only)
  deleteAgent(id: string): Observable<any> {
    this.checkAdminRole();
    return this.http.delete<any>(`${API_URL}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // DELETE /profile/delete (Agent only - deleting own profile)
  deleteOwnAgentProfile(): Observable<any> {
    // No role check needed here, backend verifies token owner
    return this.http.delete<any>(`${API_URL}/profile/delete`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Helper to check for admin role before proceeding
  private checkAdminRole(): void {
    if (this.authService.userRole() !== Role.ADMIN) {
      throw new Error('Operation requires Admin role');
    }
  }

  private handleError(error: any): Observable<never> {
    console.error('AgentService Error:', error);
    return throwError(() => error);
  }
} 