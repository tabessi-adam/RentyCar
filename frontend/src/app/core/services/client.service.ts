import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Client } from '../models/client.model';

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
export class ClientService {
  userName = signal<string>('');
  private apiUrl = `${environment.apiUrl}/clients`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    // Initialize with the name from localStorage if available
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      this.userName.set(storedName);
    }
  }

  // Profile data methods
  getProfile(): Observable<ClientProfile> {
    return this.http.get<ClientProfile>(`${this.apiUrl}/profile`);
  }

  updateProfile(profile: Partial<ClientProfile>): Observable<ClientProfile> {
    return this.http.patch<ClientProfile>(`${this.apiUrl}/${profile.id}`, profile)
      .pipe(
        tap(updatedProfile => {
          if (updatedProfile.name) {
            this.updateUserName(updatedProfile.name);
          }
        })
      );
  }

  deleteProfile(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/profile/delete`)
      .pipe(
        tap(() => {
          this.clearUserName();
          this.authService.logout();
          this.router.navigate(['/']);
        })
      );
  }

  // User name methods
  updateUserName(name: string) {
    this.userName.set(name);
    localStorage.setItem('userName', name);
  }

  clearUserName() {
    this.userName.set('');
    localStorage.removeItem('userName');
  }

  // Client management methods
  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}`);
  }

  updateClient(clientId: string, clientData: Partial<Client>): Observable<Client> {
    return this.http.patch<Client>(`${this.apiUrl}/${clientId}`, clientData);
  }

  deleteClient(clientId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${clientId}`);
  }
} 