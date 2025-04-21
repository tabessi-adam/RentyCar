import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-delete-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delete-profile.component.html',
  styleUrls: ['./delete-profile.component.scss']
})
export class DeleteProfileComponent {
  isConfirmed = false;
  isDeleting = false;
  message = '';
  isError = false;

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  onDelete() {
    if (!this.isConfirmed) return;

    this.isDeleting = true;
    this.message = '';

    this.adminService.deleteOwnAdminProfile().subscribe({
      next: () => {
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error deleting profile:', error);
        this.showMessage('Error deleting profile', true);
        this.isDeleting = false;
      }
    });
  }

  private showMessage(text: string, isError = false) {
    this.message = text;
    this.isError = isError;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}
