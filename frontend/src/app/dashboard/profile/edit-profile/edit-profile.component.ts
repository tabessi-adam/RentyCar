import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { AgentService } from '../../../core/services/agent.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/auth.model';
import { Agent } from '../../../core/models/agent.model';
import { Role } from '../../../core/models/role.enum';

type Profile = User | Agent;

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('previewImage') previewImage!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;

  profile: Profile | null = null;
  isSubmitting = false;
  message = '';
  isError = false;
  isAdmin: boolean = false;
  isUploadingPicture = false;
  
  // Image scaling properties
  showImageEditor = false;
  selectedFile: File | null = null;
  scale = 1;
  position = { x: 0, y: 0 };
  isDragging = false;
  dragStart = { x: 0, y: 0 };

  constructor(
    private adminService: AdminService,
    private agentService: AgentService,
    private authService: AuthService
  ) {
    this.isAdmin = this.authService.currentUser?.role === Role.ADMIN;
  }

  ngOnInit() {
    const currentUser = this.authService.currentUser;
    if (currentUser?.id) {
      if (this.isAdmin) {
        this.adminService.getAdminById(currentUser.id).subscribe({
          next: (profile) => {
            this.profile = profile;
          },
          error: (error) => {
            console.error('Error loading admin profile:', error);
            this.showMessage('Error loading profile information', true);
          }
        });
      } else {
        this.agentService.getAgentById(currentUser.id).subscribe({
          next: (profile) => {
            this.profile = profile;
          },
          error: (error) => {
            console.error('Error loading agent profile:', error);
            this.showMessage('Error loading profile information', true);
          }
        });
      }
    }
  }

  onSubmit() {
    if (!this.profile) return;

    this.isSubmitting = true;
    this.message = '';

    const updateData = {
      name: this.profile.name,
      email: this.profile.email,
      phoneNumber: this.profile.phoneNumber
    };

    if (this.isAdmin) {
      this.adminService.updateAdmin(this.profile.id, updateData).subscribe({
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
    } else {
      this.agentService.updateAgent(this.profile.id, updateData).subscribe({
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
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        this.showMessage('Please select a valid image file (JPEG, PNG, or WebP)', true);
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        this.showMessage('File size must be less than 5MB', true);
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
    this.message = '';

    // Convert canvas to blob
    this.canvas.nativeElement.toBlob((blob: Blob) => {
      const file = new File([blob], this.selectedFile!.name, { type: this.selectedFile!.type });

      if (this.isAdmin) {
        this.adminService.uploadProfilePicture(file).subscribe({
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
            this.showMessage('Profile picture updated successfully');
          },
          error: (error) => {
            this.showMessage('Failed to upload profile picture. Please try again.', true);
            this.isUploadingPicture = false;
            console.error('Error uploading profile picture:', error);
          }
        });
      } else {
        this.agentService.uploadProfilePicture(file).subscribe({
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
            this.showMessage('Profile picture updated successfully');
          },
          error: (error) => {
            this.showMessage('Failed to upload profile picture. Please try again.', true);
            this.isUploadingPicture = false;
            console.error('Error uploading profile picture:', error);
          }
        });
      }
    }, this.selectedFile.type);
  }

  deleteProfilePicture() {
    if (!this.profile?.profilePicturePublicId) return;

    this.isUploadingPicture = true;
    this.message = '';

    if (this.isAdmin) {
      this.adminService.deleteProfilePicture().subscribe({
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
          this.showMessage('Profile picture deleted successfully');
        },
        error: (error) => {
          this.showMessage('Failed to delete profile picture. Please try again.', true);
          this.isUploadingPicture = false;
          console.error('Error deleting profile picture:', error);
        }
      });
    } else {
      this.agentService.deleteProfilePicture().subscribe({
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
          this.showMessage('Profile picture deleted successfully');
        },
        error: (error) => {
          this.showMessage('Failed to delete profile picture. Please try again.', true);
          this.isUploadingPicture = false;
          console.error('Error deleting profile picture:', error);
        }
      });
    }
  }

  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.dragStart = {
      x: event.clientX - this.position.x,
      y: event.clientY - this.position.y
    };
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    
    this.position = {
      x: event.clientX - this.dragStart.x,
      y: event.clientY - this.dragStart.y
    };
    this.updatePreview();
  }

  onMouseUp() {
    this.isDragging = false;
  }

  private showMessage(text: string, isError = false) {
    this.message = text;
    this.isError = isError;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}
