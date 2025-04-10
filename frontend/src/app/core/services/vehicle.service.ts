import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Vehicle, CreateVehiclePayload, UpdateVehiclePayload } from '../models/vehicle.model';
import { AuthService } from './auth.service';
import { Role } from '../models/role.enum';
import { environment } from '../../../environments/environment';

// Use environment variable instead of hardcoded URL
const BASE_API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // Helper to get the correct API path based on role
  private getApiPath(): string | null {
    const role = this.authService.userRole(); // Get role from signal
    switch (role) {
      case Role.ADMIN: return `${BASE_API_URL}/admin/vehicles`;
      case Role.AGENT: return `${BASE_API_URL}/agent/vehicles`;
      case Role.CLIENT: return `${BASE_API_URL}/client/vehicles`;
      default: return null; // Or throw error if role is unexpected/null
    }
  }

  // Helper to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.currentToken();
    if (!token) {
      console.error('Auth token is missing for VehicleService request');
      return new HttpHeaders();
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // --- Combined CRUD Methods --- 
  // These methods use the role to determine the correct endpoint

  // POST /<role>/vehicles
  createVehicle(payload: CreateVehiclePayload): Observable<Vehicle> {
    const apiUrl = this.getApiPath();
    if (!apiUrl || this.authService.userRole() === Role.CLIENT) {
      return throwError(() => new Error('Operation not permitted for this role or role unknown'));
    }
    // Note: Backend agent controller injects officeId automatically
    return this.http.post<Vehicle>(apiUrl, payload, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // GET /<role>/vehicles
  getAllVehicles(): Observable<Vehicle[]> {
    const apiUrl = this.getApiPath();
    if (!apiUrl) {
      return throwError(() => new Error('User role unknown'));
    }
    return this.http.get<Vehicle[]>(apiUrl, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // GET /<role>/vehicles/:id
  getVehicleById(id: string): Observable<Vehicle> {
    const apiUrl = this.getApiPath();
    if (!apiUrl) {
      return throwError(() => new Error('User role unknown'));
    }
    return this.http.get<Vehicle>(`${apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // PATCH /<role>/vehicles/:id
  updateVehicle(id: string, payload: UpdateVehiclePayload): Observable<Vehicle> {
    const apiUrl = this.getApiPath();
    if (!apiUrl || this.authService.userRole() === Role.CLIENT) {
        return throwError(() => new Error('Operation not permitted for this role or role unknown'));
    }
    return this.http.patch<Vehicle>(`${apiUrl}/${id}`, payload, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // DELETE /<role>/vehicles/:id
  deleteVehicle(id: string): Observable<any> {
    const apiUrl = this.getApiPath();
    if (!apiUrl || this.authService.userRole() === Role.CLIENT) {
        return throwError(() => new Error('Operation not permitted for this role or role unknown'));
    }
    return this.http.delete<any>(`${apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('VehicleService Error:', error);
    return throwError(() => error);
  }
}
