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
  
  // Image editor properties
  showImageEditor = false;
  selectedFile: File | null = null;
  scale = 1;
  minScale = 1;
  maxScale = 3;
  rotation = 0;
  position = { x: 0, y: 0 };
  isDragging = false;
  dragStart = { x: 0, y: 0 };
  imageDimensions = { width: 0, height: 0 };
  canvasDimensions = { width: 400, height: 400 };
  aspectRatio = 1;

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
      this.rotation = 0;
      this.position = { x: 0, y: 0 };

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.previewImage) {
          const img = this.previewImage.nativeElement;
          img.src = e.target.result;
          img.onload = () => {
            // Store original image dimensions
            this.imageDimensions = {
              width: img.naturalWidth || img.width,
              height: img.naturalHeight || img.height
            };
            
            // Calculate aspect ratio
            this.aspectRatio = this.imageDimensions.width / this.imageDimensions.height;
            
            // Calculate initial scale to fit the canvas
            this.calculateInitialScale();
            this.updatePreview();
          };
        }
      };
      reader.readAsDataURL(file);
    }
  }

  calculateInitialScale() {
    const { width: imgWidth, height: imgHeight } = this.imageDimensions;
    const { width: canvasWidth, height: canvasHeight } = this.canvasDimensions;
    
    // Calculate scale to fit the canvas while maintaining aspect ratio
    const scaleX = canvasWidth / imgWidth;
    const scaleY = canvasHeight / imgHeight;
    
    this.minScale = Math.max(scaleX, scaleY, 1);
    this.scale = this.minScale;
    
    // Reset position to center
    this.position = { x: 0, y: 0 };
  }

  onScaleChange() {
    // Ensure scale is within bounds
    this.scale = Math.max(this.minScale, Math.min(this.maxScale, this.scale));
    
    // Recalculate position to maintain centering
    const scaledWidth = this.imageDimensions.width * this.scale;
    const scaledHeight = this.imageDimensions.height * this.scale;
    
    const maxX = (scaledWidth - this.canvasDimensions.width) / 2;
    const maxY = (scaledHeight - this.canvasDimensions.height) / 2;
    
    this.position = {
      x: Math.max(-maxX, Math.min(maxX, this.position.x)),
      y: Math.max(-maxY, Math.min(maxY, this.position.y))
    };
    
    this.updatePreview();
  }

  onRotateChange(degrees: number) {
    this.rotation = (this.rotation + degrees) % 360;
    this.updatePreview();
  }

  onMouseDown(event: MouseEvent) {
    if (!this.canvas) return;
    
    this.isDragging = true;
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    
    // Calculate the mouse position relative to the canvas
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Calculate the drag start position relative to the image position
    this.dragStart = {
      x: mouseX - this.position.x,
      y: mouseY - this.position.y
    };
    
    // Prevent text selection during drag
    event.preventDefault();
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging || !this.canvas) return;
    
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    
    // Calculate the mouse position relative to the canvas
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Calculate new position based on mouse movement
    const newX = mouseX - this.dragStart.x;
    const newY = mouseY - this.dragStart.y;
    
    // Calculate scaled dimensions
    const scaledWidth = this.imageDimensions.width * this.scale;
    const scaledHeight = this.imageDimensions.height * this.scale;
    
    // Calculate maximum allowed position
    const maxX = (scaledWidth - this.canvasDimensions.width) / 2;
    const maxY = (scaledHeight - this.canvasDimensions.height) / 2;
    
    // Constrain position within bounds
    this.position = {
      x: Math.max(-maxX, Math.min(maxX, newX)),
      y: Math.max(-maxY, Math.min(maxY, newY))
    };
    
    this.updatePreview();
  }

  onMouseUp() {
    this.isDragging = false;
  }

  onMouseLeave() {
    this.isDragging = false;
  }

  updatePreview() {
    if (!this.previewImage || !this.canvas) return;

    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    const img = this.previewImage.nativeElement;

    // Set canvas size for high-DPI displays
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = this.canvasDimensions.width * pixelRatio;
    canvas.height = this.canvasDimensions.height * pixelRatio;
    canvas.style.width = `${this.canvasDimensions.width}px`;
    canvas.style.height = `${this.canvasDimensions.height}px`;
    ctx.scale(pixelRatio, pixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width / pixelRatio, canvas.height / pixelRatio);

    // Calculate center points
    const centerX = this.canvasDimensions.width / 2;
    const centerY = this.canvasDimensions.height / 2;
    const radius = Math.min(centerX, centerY);

    // Apply circular clipping
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();

    // Apply transformations (rotation and positioning)
    ctx.translate(centerX, centerY);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    // Calculate scaled dimensions
    const scaledWidth = this.imageDimensions.width * this.scale;
    const scaledHeight = this.imageDimensions.height * this.scale;

    // Draw image centered
    ctx.drawImage(
      img,
      centerX - scaledWidth / 2 + this.position.x,
      centerY - scaledHeight / 2 + this.position.y,
      scaledWidth,
      scaledHeight
    );

    ctx.restore();

    // Add subtle shadow for polished look
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 4;
    ctx.stroke();
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

    // Convert canvas to blob with compression
    this.canvas.nativeElement.toBlob(
      (blob: Blob) => {
        const file = new File([blob], this.selectedFile!.name, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });

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
              if (this.fileInput) {
                this.fileInput.nativeElement.value = '';
              }
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
              if (this.fileInput) {
                this.fileInput.nativeElement.value = '';
              }
              this.showMessage('Profile picture updated successfully');
            },
            error: (error) => {
              this.showMessage('Failed to upload profile picture. Please try again.', true);
              this.isUploadingPicture = false;
              console.error('Error uploading profile picture:', error);
            }
          });
        }
      },
      'image/jpeg',
      0.8 // Compress to 80% quality for smaller file size
    );
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

  private showMessage(text: string, isError = false) {
    this.message = text;
    this.isError = isError;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}
