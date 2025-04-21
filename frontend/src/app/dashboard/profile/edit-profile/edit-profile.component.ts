import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/auth.model';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  profile: User | null = null;
  isSubmitting = false;
  message = '';
  isError = false;

  constructor(
    private adminService: AdminService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.currentUser;
    if (currentUser?.id) {
      this.adminService.getAdminById(currentUser.id).subscribe({
        next: (profile) => {
          this.profile = profile;
        },
        error: (error) => {
          console.error('Error loading profile:', error);
          this.showMessage('Error loading profile information', true);
        }
      });
    }
  }

  onSubmit() {
    if (!this.profile) return;

    this.isSubmitting = true;
    this.message = '';

    this.adminService.updateAdmin(this.profile.id, {
      name: this.profile.name,
      email: this.profile.email,
      phoneNumber: this.profile.phoneNumber
    }).subscribe({
      next: () => {
        this.showMessage('Profile updated successfully');
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.showMessage('Error updating profile', true);
        this.isSubmitting = false;
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
