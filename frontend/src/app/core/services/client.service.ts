import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/auth.model'; // Re-use User model for Client data
import { CreateClientPayload, UpdateClientPayload } from '../models/client.model';
import { AuthService } from './auth.service';
import { Role } from '../models/role.enum';
import { environment } from '../../../environments/environment';

const API_URL = `${environment.apiUrl}/clients`;

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // Helper to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.currentToken(); // Get token from signal
    if (!token) {
      // Handle case where token is missing - maybe throw error or redirect
      console.error('Auth token is missing for ClientService request');
      return new HttpHeaders(); // Or throw an error
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // POST /clients (Admin only)
  createClient(payload: CreateClientPayload): Observable<User> {
    return this.http.post<User>(API_URL, payload, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // GET /clients (Admin only)
  getAllClients(): Observable<User[]> {
    return this.http.get<User[]>(API_URL, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // GET /clients/profile (Client only)
  getOwnProfile(): Observable<User> {
    return this.http.get<User>(`${API_URL}/profile`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // GET /clients/:id (Admin only)
  getClientById(id: string): Observable<User> {
    return this.http.get<User>(`${API_URL}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // PATCH /clients/:id (Admin or own Client)
  updateClient(id: string, payload: UpdateClientPayload): Observable<User> {
    return this.http.patch<User>(`${API_URL}/${id}`, payload, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // DELETE /clients/:id (Admin only)
  deleteClient(id: string): Observable<any> { // Response might be empty or just status
    return this.http.delete<any>(`${API_URL}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // DELETE /clients/profile/delete (Client only)
  deleteOwnProfile(): Observable<any> { // Response might be empty or just status
    return this.http.delete<any>(`${API_URL}/profile/delete`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('ClientService Error:', error);
    // Add specific error handling if needed
    return throwError(() => error); // Rethrow for component handling
  }
} 