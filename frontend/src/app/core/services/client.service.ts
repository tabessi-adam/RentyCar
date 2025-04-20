import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Client } from '../models/client.model';
import { isPlatformBrowser } from '@angular/common';

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
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    // Initialize with the name from localStorage if available
    if (this.isBrowser) {
      const storedName = localStorage.getItem('userName');
      if (storedName) {
        this.userName.set(storedName);
      }
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

  updatePassword(data: { id: string; oldPassword: string; newPassword: string }): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${data.id}/password`, {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword
    });
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
    if (this.isBrowser) {
      localStorage.setItem('userName', name);
    }
  }

  clearUserName() {
    this.userName.set('');
    if (this.isBrowser) {
      localStorage.removeItem('userName');
    }
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