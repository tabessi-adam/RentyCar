import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Vehicle, CreateVehiclePayload, UpdateVehiclePayload, VehicleStatus, getVehicleCurrentStatus } from '../models/vehicle.model';
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
  getAllVehicles(filters?: any): Observable<Vehicle[]> {
    console.log('VehicleService - Getting vehicles with filters:', filters);
    const apiUrl = this.getApiPath();
    if (!apiUrl) {
      console.error('VehicleService - No API URL found');
      return throwError(() => new Error('User role unknown'));
    }

    // Format query parameters
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params = params.append(key, value.toString());
        }
      });
    }

    // For agents, we don't need to add officeId filter as the backend already handles it
    // The backend will automatically filter vehicles based on the agent's office

    console.log('VehicleService - Sending request to:', apiUrl);
    console.log('VehicleService - With headers:', this.getAuthHeaders());
    return this.http.get<Vehicle[]>(apiUrl, { 
      headers: this.getAuthHeaders(),
      params
    }).pipe(
      tap(response => {
        console.log('VehicleService - Raw response:', response);
        console.log('VehicleService - Response type:', typeof response);
        console.log('VehicleService - Response length:', Array.isArray(response) ? response.length : 'Not an array');
      }),
      map(response => {
        if (!Array.isArray(response)) {
          console.error('VehicleService - Response is not an array:', response);
          return [];
        }
        return response.map(vehicle => ({
          ...vehicle,
          baseStatus: vehicle.baseStatus || VehicleStatus.AVAILABLE,
          currentStatus: vehicle.currentStatus || VehicleStatus.AVAILABLE
        }));
      }),
      tap(mappedResponse => {
        console.log('VehicleService - Mapped response:', mappedResponse);
      }),
      catchError(error => {
        console.error('VehicleService - Error:', error);
        return this.handleError(error);
      })
    );
  }

  // GET /<role>/vehicles/:id
  getVehicleById(id: string): Observable<Vehicle> {
    const apiUrl = this.getApiPath();
    if (!apiUrl) {
      return throwError(() => new Error('User role unknown'));
    }
    console.log('Fetching vehicle with ID:', id);
    console.log('API URL:', `${apiUrl}/${id}`);
    return this.http.get<Vehicle>(`${apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(response => {
          console.log('Vehicle response:', response);
          console.log('Vehicle images:', response.images);
          if (response.images) {
            console.log('Image URLs:', response.images.map(img => img.url));
          }
        }),
        map(response => {
          // If we have a single image but no images array, convert it to the new format
          if (response.imageUrl && (!response.images || response.images.length === 0)) {
            response.images = [{
              id: 'legacy',
              url: response.imageUrl,
              publicId: response.imagePublicId || '', // Provide empty string as fallback
              vehicleId: response.id,
              createdAt: response.createdAt
            }];
          }
          return response;
        }),
        catchError(this.handleError)
      );
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

  mapVehicle(vehicle: any): Vehicle {
    const mappedVehicle = {
      ...vehicle,
      baseStatus: vehicle.status || VehicleStatus.AVAILABLE,
      currentStatus: getVehicleCurrentStatus(vehicle)
    };
    return mappedVehicle;
  }

  private handleError(error: any): Observable<never> {
    console.error('VehicleService Error:', error);
    return throwError(() => error);
  }
}
