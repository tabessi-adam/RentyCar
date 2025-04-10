import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClientProfileService } from '../../../services/client-profile.service';

@Component({
  selector: 'app-delete-profile',
  templateUrl: './delete-profile.component.html',
  styleUrl: './delete-profile.component.scss'
})
export class DeleteProfileComponent {
  showConfirmation = false;
  isDeleting = false;
  error: string | null = null;

  constructor(
    private clientProfileService: ClientProfileService,
    private router: Router
  ) {}

  openConfirmation() {
    this.showConfirmation = true;
  }

  closeConfirmation() {
    this.showConfirmation = false;
    this.error = null;
  }

  confirmDelete() {
    this.isDeleting = true;
    this.error = null;

    this.clientProfileService.deleteProfile().subscribe({
      next: () => {
        // Redirect to login or home page after successful deletion
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.error = 'Failed to delete profile. Please try again later.';
        this.isDeleting = false;
      }
    });
  }
} 