import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Example method to fetch data
  getData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/data`); // Replace with your actual endpoint
  }

  // Add other methods for POST, PUT, DELETE etc. as needed
  // e.g., postData(data: any): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/api/items`, data);
  // }
} 