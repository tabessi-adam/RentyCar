import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientService, ClientProfile } from '../../../core/services/client.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
  imports: [FormsModule, CommonModule]
})
export class EditProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('previewImage') previewImage!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;
  
  profile: ClientProfile | null = null;
  editingField: string | null = null;
  tempValue: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isLoading = true;
  error: string | null = null;
  isUploadingPicture = false;
  
  // Image scaling properties
  showImageEditor = false;
  selectedFile: File | null = null;
  scale = 1;
  position = { x: 0, y: 0 };
  isDragging = false;
  dragStart = { x: 0, y: 0 };

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

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        this.error = 'Please select a valid image file (JPEG, PNG, or WebP)';
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        this.error = 'File size must be less than 5MB';
        return;
      }

      this.selectedFile = file;
      this.showImageEditor = true;
      this.scale = 1;
      this.position = { x: 0, y: 0 };

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.previewImage) {
          const img = this.previewImage.nativeElement;
          img.src = e.target.result;
          img.onload = () => {
            // Update preview immediately after image loads
            this.updatePreview();
          };
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onScaleChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.scale = parseFloat(input.value);
    this.updatePreview();
  }

  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.dragStart = {
      x: event.clientX - this.position.x,
      y: event.clientY - this.position.y
    };
  }

  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      this.position = {
        x: event.clientX - this.dragStart.x,
        y: event.clientY - this.dragStart.y
      };
      this.updatePreview();
    }
  }

  onMouseUp() {
    this.isDragging = false;
  }

  updatePreview() {
    if (!this.previewImage || !this.canvas) return;

    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    const img = this.previewImage.nativeElement;

    // Set canvas size to match the preview container
    canvas.width = 300;
    canvas.height = 300;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate scaled dimensions
    const scaledWidth = img.width * this.scale;
    const scaledHeight = img.height * this.scale;

    // Draw image centered
    ctx.drawImage(
      img,
      (canvas.width - scaledWidth) / 2 + this.position.x,
      (canvas.height - scaledHeight) / 2 + this.position.y,
      scaledWidth,
      scaledHeight
    );
  }

  cancelEdit() {
    this.showImageEditor = false;
    this.selectedFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  uploadProfilePicture() {
    if (!this.selectedFile || !this.canvas) return;

    this.isUploadingPicture = true;
    this.error = null;

    // Convert canvas to blob
    this.canvas.nativeElement.toBlob((blob: Blob) => {
      const file = new File([blob], this.selectedFile!.name, { type: this.selectedFile!.type });

      this.clientService.uploadProfilePicture(file).subscribe({
        next: (response) => {
          if (this.profile) {
            this.profile.profilePictureUrl = response.profilePictureUrl;
            this.profile.profilePicturePublicId = response.profilePicturePublicId;
            
            // Update the auth service's current user
            const currentUser = this.authService.currentUser;
            if (currentUser) {
              currentUser.profilePictureUrl = response.profilePictureUrl;
              this.authService.updateCurrentUser(currentUser);
            }
          }
          this.isUploadingPicture = false;
          this.showImageEditor = false;
          this.selectedFile = null;
        },
        error: (err) => {
          this.error = 'Failed to upload profile picture. Please try again.';
          this.isUploadingPicture = false;
          console.error('Error uploading profile picture:', err);
        }
      });
    }, this.selectedFile.type);
  }

  deleteProfilePicture() {
    if (!this.profile?.profilePicturePublicId) return;

    this.isUploadingPicture = true;
    this.error = null;

    this.clientService.deleteProfilePicture().subscribe({
      next: () => {
        if (this.profile) {
          this.profile.profilePictureUrl = undefined;
          this.profile.profilePicturePublicId = undefined;
          
          // Update the auth service's current user
          const currentUser = this.authService.currentUser;
          if (currentUser) {
            currentUser.profilePictureUrl = undefined;
            this.authService.updateCurrentUser(currentUser);
          }
        }
        this.isUploadingPicture = false;
      },
      error: (err) => {
        this.error = 'Failed to delete profile picture. Please try again.';
        this.isUploadingPicture = false;
        console.error('Error deleting profile picture:', err);
      }
    });
  }
} 