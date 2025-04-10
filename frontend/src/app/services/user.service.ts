import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userNameSubject = new BehaviorSubject<string>('');
  userName$ = this.userNameSubject.asObservable();

  constructor() {
    // Initialize with the name from localStorage if available
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      this.userNameSubject.next(storedName);
    }
  }

  updateUserName(name: string) {
    this.userNameSubject.next(name);
    localStorage.setItem('userName', name);
  }

  getUserName(): string {
    return this.userNameSubject.value;
  }
} 