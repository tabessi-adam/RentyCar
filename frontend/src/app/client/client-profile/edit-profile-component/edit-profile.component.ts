import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientProfileService, ClientProfile } from '../../../services/client-profile.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
  imports: [FormsModule, CommonModule]
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
    private clientProfileService: ClientProfileService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    this.error = null;
    this.clientProfileService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isLoading = false;
        this.userService.updateUserName(profile.name);
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

    this.clientProfileService.updateProfile(updateData).subscribe({
      next: (updatedProfile) => {
        this.profile = updatedProfile;
        this.editingField = null;
        this.isLoading = false;
        
        if (field === 'name') {
          this.userService.updateUserName(this.tempValue);
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

    this.clientProfileService.updateProfile(updateData).subscribe({
      next: (updatedProfile) => {
        this.profile = updatedProfile;
        this.editingField = null;
        this.isLoading = false;
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
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

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
} 