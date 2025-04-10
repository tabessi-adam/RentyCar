import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Reservation, CreateReservationPayload, UpdateReservationPayload, UpdateReservationStatusPayload, ReservationStatus } from '../models/reservation.model';
import { AuthService } from './auth.service';
import { Role } from '../models/role.enum';
import { environment } from '../../../environments/environment';

const API_URL = `${environment.apiUrl}/reservations`;

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // Helper to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.currentToken();
    if (!token) {
      console.error('Auth token is missing for ReservationService request');
      // Consider throwing an error or handling appropriately
      return new HttpHeaders(); 
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // POST /
  createReservation(payload: CreateReservationPayload): Observable<Reservation> {
    return this.http.post<Reservation>(API_URL, payload, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // GET / (Admin only, with filters)
  getAllReservations(filters?: { vehicleId?: string; clientId?: string }): Observable<Reservation[]> {
    // Client-side check for admin role before making the call
    if (this.authService.userRole() !== Role.ADMIN) {
      console.error('Attempted to call admin-only getAllReservations without admin role.');
      return throwError(() => new Error('Operation not permitted for this role'));
    }
    let params = new HttpParams();
    if (filters?.vehicleId) {
      params = params.set('vehicleId', filters.vehicleId);
    }
    if (filters?.clientId) {
      params = params.set('clientId', filters.clientId);
    }
    return this.http.get<Reservation[]>(API_URL, { headers: this.getAuthHeaders(), params })
      .pipe(catchError(this.handleError));
  }

  // GET /my-reservations
  getMyReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${API_URL}/my-reservations`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // GET /:id
  getReservationById(id: string): Observable<Reservation> {
    // Add logic here if access should be further restricted on the client-side
    return this.http.get<Reservation>(`${API_URL}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // PATCH /:id
  updateReservation(id: string, payload: UpdateReservationPayload): Observable<Reservation> {
    // Backend service likely handles ownership/admin check
    return this.http.patch<Reservation>(`${API_URL}/${id}`, payload, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // PATCH /:id/status (Admin only)
  updateReservationStatus(id: string, status: ReservationStatus): Observable<Reservation> {
    // Client-side check for admin role
    if (this.authService.userRole() !== Role.ADMIN) {
      console.error('Attempted to call admin-only updateReservationStatus without admin role.');
      return throwError(() => new Error('Operation not permitted for this role'));
    }
    const payload: UpdateReservationStatusPayload = { status };
    return this.http.patch<Reservation>(`${API_URL}/${id}/status`, payload, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // DELETE /:id
  deleteReservation(id: string): Observable<any> {
    // Backend service likely handles ownership/admin check
    return this.http.delete<any>(`${API_URL}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('ReservationService Error:', error);
    // Add more specific error handling based on status codes if needed
    return throwError(() => error); // Rethrow for component handling
  }
}
