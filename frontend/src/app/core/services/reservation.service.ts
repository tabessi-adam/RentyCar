import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Reservation, CreateReservationPayload, UpdateReservationPayload, UpdateReservationStatusPayload, ReservationStatus } from '../models/reservation.model';
import { AuthService } from './auth.service';
import { Role } from '../models/role.enum';
import { environment } from '../../../environments/environment';

const API_URL = `${environment.apiUrl}/reservations`;

interface DateRange {
  startDate: string;
  endDate: string;
}

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
    console.log('Creating reservation with payload:', payload);
    return this.http.post<Reservation>(API_URL, payload, { headers: this.getAuthHeaders() })
      .pipe(
        tap(response => console.log('Reservation created successfully:', response)),
        catchError(error => {
          console.error('Error creating reservation:', {
            status: error.status,
            message: error.message,
            error: error.error,
            payload: payload
          });
          return this.handleError(error);
        })
      );
  }

  // GET / (Admin and Agent only, with filters)
  getAllReservations(filters?: { vehicleId?: string; clientId?: string }): Observable<Reservation[]> {
    // Client-side check for admin or agent role before making the call
    const userRole = this.authService.userRole();
    if (userRole !== Role.ADMIN && userRole !== Role.AGENT) {
      console.error('Attempted to call getAllReservations without proper role.');
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

  // GET /vehicle/:id/availability
  getVehicleAvailability(vehicleId: string): Observable<DateRange[]> {
    return this.http.get<DateRange[]>(`${API_URL}/vehicle/${vehicleId}/availability`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(error => {
          console.error('ReservationService - Error fetching availability:', error);
          return throwError(() => error);
        })
      );
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

  // PATCH /:id/status (Admin and Agent only)
  updateReservationStatus(id: string, status: ReservationStatus): Observable<Reservation> {
    // Client-side check for admin or agent role
    const userRole = this.authService.userRole();
    if (userRole !== Role.ADMIN && userRole !== Role.AGENT) {
      console.error('Attempted to call updateReservationStatus without proper role.');
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
    console.error('ReservationService Error:', {
      status: error.status,
      message: error.message,
      error: error.error,
      url: error.url,
      payload: error.payload
    });
    return throwError(() => error);
  }
}
