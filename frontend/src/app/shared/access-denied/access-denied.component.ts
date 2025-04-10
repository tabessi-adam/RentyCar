import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="access-denied">
      <div class="container">
        <h1>Access Denied</h1>
        <p>Sorry, you don't have permission to access this page.</p>
        <div class="actions">
          <a routerLink="/" class="btn-home">Go Home</a>
          <a routerLink="/login" class="btn-login">Login</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .access-denied {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      text-align: center;
    }
    .container {
      max-width: 500px;
      padding: 2rem;
      background-color: #f8f9fa;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    h1 {
      color: #dc3545;
      margin-bottom: 1rem;
    }
    p {
      margin-bottom: 2rem;
      font-size: 1.1rem;
      color: #6c757d;
    }
    .actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }
    .btn-home, .btn-login {
      display: inline-block;
      padding: 0.5rem 1.5rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s;
    }
    .btn-home {
      background-color: #6c757d;
      color: white;
    }
    .btn-login {
      background-color: #007bff;
      color: white;
    }
    .btn-home:hover, .btn-login:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }
  `]
})
export class AccessDeniedComponent {} 