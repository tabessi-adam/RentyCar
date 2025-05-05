import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientService, ClientProfile } from '../../../core/services/client.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProfilePictureComponent } from '../profile-picture-component/profile-picture.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
  imports: [FormsModule, CommonModule, ProfilePictureComponent, TranslateModule]
})
export class EditProfileComponent implements OnInit {
  profile: ClientProfile | null = null;
  editingField: string | null = null;
  tempValue: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isLoading = true;
  error: string | null = null;

  constructor(
    private clientService: ClientService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    this.error = null;
    this.clientService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isLoading = false;
        this.clientService.updateUserName(profile.name);
      },
      error: (err) => {
        this.error = 'Failed to load profile. Please try again later.';
        this.isLoading = false;
        console.error('Error loading profile:', err);
      }
    });
  }

  startEditing(field: string) {
    if (!this.profile) return;
    this.editingField = field;
    this.tempValue = '';
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  saveField(field: string) {
    if (!this.profile || this.editingField !== field) return;

    const updateData = {
      id: this.profile.id,
      [field]: this.tempValue
    };

    this.isLoading = true;
    this.error = null;

    this.clientService.updateProfile(updateData).subscribe({
      next: (updatedProfile) => {
        this.profile = updatedProfile;
        this.editingField = null;
        this.isLoading = false;
        
        if (field === 'name') {
          this.clientService.updateUserName(this.tempValue);
        }
      },
      error: (err) => {
        this.error = 'Failed to update profile. Please try again later.';
        this.isLoading = false;
        console.error('Error updating profile:', err);
      }
    });
  }

  updatePassword() {
    if (!this.profile) return;

    // Validate inputs
    if (!this.oldPassword) {
      this.error = 'Please enter your current password';
      return;
    }

    if (!this.newPassword) {
      this.error = 'Please enter a new password';
      return;
    }

    if (this.newPassword.length < 6) {
      this.error = 'New password must be at least 6 characters long';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'New passwords do not match';
      return;
    }

    const updateData = {
      id: this.profile.id,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    };

    this.isLoading = true;
    this.error = null;

    this.clientService.updatePassword(updateData).subscribe({
      next: () => {
        this.editingField = null;
        this.isLoading = false;
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        // Show success message
        this.error = 'Password updated successfully!';
      },
      error: (err) => {
        this.error = 'Failed to update password. Please check your current password and try again.';
        this.isLoading = false;
        console.error('Error updating password:', err);
      }
    });
  }

  cancelEditing() {
    this.editingField = null;
    this.tempValue = '';
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
} 