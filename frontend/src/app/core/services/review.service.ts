import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Review, CreateReviewPayload, UpdateReviewPayload } from '../models/review.model';
import { AuthService } from './auth.service';
import { Role } from '../models/role.enum';
import { environment } from '../../../environments/environment';

const API_URL = `${environment.apiUrl}/reviews`;

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // Helper to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.currentToken();
    if (!token) {
      console.error('Auth token is missing for ReviewService request');
      return new HttpHeaders();
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // POST /
  createReview(payload: CreateReviewPayload): Observable<Review> {
    return this.http.post<Review>(API_URL, payload, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // GET / (Admin and Agent only, with filters)
  getAllReviews(filters?: { vehicleId?: string; clientId?: string }): Observable<Review[]> {
    const userRole = this.authService.userRole();
    if (userRole !== Role.ADMIN && userRole !== Role.AGENT) {
      return throwError(() => new Error('Operation not permitted for this role'));
    }
    let params = new HttpParams();
    if (filters?.vehicleId) {
      params = params.set('vehicleId', filters.vehicleId);
    }
    if (filters?.clientId) {
      params = params.set('clientId', filters.clientId);
    }
    return this.http.get<Review[]>(API_URL, { headers: this.getAuthHeaders(), params })
      .pipe(catchError(this.handleError));
  }

  // GET /:id (Admin and Agent only)
  getReviewById(id: string): Observable<Review> {
    const userRole = this.authService.userRole();
    if (userRole !== Role.ADMIN && userRole !== Role.AGENT) {
      return throwError(() => new Error('Operation not permitted for this role'));
    }
    return this.http.get<Review>(`${API_URL}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // PATCH /:id
  updateReview(id: string, payload: UpdateReviewPayload): Observable<Review> {
    // Backend service handles ownership check
    return this.http.patch<Review>(`${API_URL}/${id}`, payload, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // DELETE /:id
  deleteReview(id: string): Observable<any> {
    // Backend controller/service handles ownership/admin check
    return this.http.delete<any>(`${API_URL}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('ReviewService Error:', error);
    let errorMessage = 'An unknown error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 403) {
      errorMessage = 'You do not have permission to perform this action';
    } else if (error.status === 404) {
      errorMessage = 'The review could not be found';
    }
    
    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      error: error.error
    }));
  }
}
