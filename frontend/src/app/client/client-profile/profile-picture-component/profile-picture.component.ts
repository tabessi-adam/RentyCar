import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../core/services/client.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class ProfilePictureComponent implements AfterViewInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('previewImage') previewImage!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;

  profilePictureUrl: string | undefined;
  isUploadingPicture = false;
  error: string | null = null;

  // Image editor properties
  showImageEditor = false;
  selectedFile: File | null = null;
  scale = 1;
  minScale = 1;
  maxScale = 3; // Increased for more zoom flexibility
  rotation = 0; // Support for image rotation
  position = { x: 0, y: 0 };
  isDragging = false;
  dragStart = { x: 0, y: 0 };
  imageDimensions = { width: 0, height: 0 };
  canvasDimensions = { width: 400, height: 400 }; // Higher resolution for crisp output
  aspectRatio = 1;

  constructor(
    private clientService: ClientService,
    private authService: AuthService
  ) {
    // Initialize with current user's profile picture
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      this.profilePictureUrl = currentUser.profilePictureUrl;
    }
  }

  ngAfterViewInit() {
    this.updatePreview(); // Ensure initial render if applicable
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
              height: img.naturalHeight || img.height,
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
    this.minScale = Math.max(scaleX, scaleY, 1); // Ensure image fills canvas
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
      y: Math.max(-maxY, Math.min(maxY, this.position.y)),
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
      y: mouseY - this.position.y,
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
      y: Math.max(-maxY, Math.min(maxY, newY)),
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
    this.error = null;

    // Convert canvas to blob with compression
    this.canvas.nativeElement.toBlob(
      (blob: Blob) => {
        const file = new File([blob], this.selectedFile!.name, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });

        this.clientService.uploadProfilePicture(file).subscribe({
          next: (response) => {
            this.profilePictureUrl = response.profilePictureUrl;

            // Update the auth service's current user
            const currentUser = this.authService.currentUser;
            if (currentUser) {
              currentUser.profilePictureUrl = response.profilePictureUrl;
              this.authService.updateCurrentUser(currentUser);
            }

            this.isUploadingPicture = false;
            this.showImageEditor = false;
            this.selectedFile = null;
            if (this.fileInput) {
              this.fileInput.nativeElement.value = '';
            }
          },
          error: (err) => {
            this.error = 'Failed to upload profile picture. Please try again.';
            this.isUploadingPicture = false;
            console.error('Error uploading profile picture:', err);
          },
        });
      },
      'image/jpeg',
      0.8 // Compress to 80% quality for smaller file size
    );
  }

  deleteProfilePicture() {
    this.isUploadingPicture = true;
    this.error = null;

    this.clientService.deleteProfilePicture().subscribe({
      next: () => {
        this.profilePictureUrl = undefined;

        // Update the auth service's current user
        const currentUser = this.authService.currentUser;
        if (currentUser) {
          currentUser.profilePictureUrl = undefined;
          this.authService.updateCurrentUser(currentUser);
        }

        this.isUploadingPicture = false;
      },
      error: (err) => {
        this.error = 'Failed to delete profile picture. Please try again.';
        this.isUploadingPicture = false;
        console.error('Error deleting profile picture:', err);
      },
    });
  }
}