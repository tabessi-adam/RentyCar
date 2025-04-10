import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientProfileService {
  private apiUrl = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<ClientProfile> {
    return this.http.get<ClientProfile>(`${this.apiUrl}/profile`);
  }

  updateProfile(profile: Partial<ClientProfile>): Observable<ClientProfile> {
    return this.http.patch<ClientProfile>(`${this.apiUrl}/${profile.id}`, profile);
  }

  deleteProfile(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/profile/delete`);
  }
} 