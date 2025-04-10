import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

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
  private userNameSubject = new BehaviorSubject<string>('');
  userName$ = this.userNameSubject.asObservable();
  private apiUrl = `${environment.apiUrl}/clients`;
  private authService = inject(AuthService);

  constructor(private http: HttpClient) {
    // Initialize with the name from localStorage if available
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      this.userNameSubject.next(storedName);
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
          this.authService.logout(); // Log out the user after account deletion
        })
      );
  }

  // User name methods
  updateUserName(name: string) {
    this.userNameSubject.next(name);
    localStorage.setItem('userName', name);
  }

  getUserName(): string {
    return this.userNameSubject.value;
  }

  clearUserName() {
    this.userNameSubject.next('');
    localStorage.removeItem('userName');
  }
} 