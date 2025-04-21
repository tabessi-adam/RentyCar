import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle, VehicleImage } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-upload-images',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  templateUrl: './upload-images.component.html',
  styleUrls: ['./upload-images.component.scss']
})
export class UploadImagesComponent {
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  isDragOver = false;
  isUploading = false;
  uploadProgress = 0;
  existingImages: VehicleImage[] = [];

  constructor(
    private dialogRef: MatDialogRef<UploadImagesComponent>,
    private vehicleService: VehicleService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { 
      vehicle: Vehicle,
      onImageDeleted?: () => void 
    }
  ) {
    if (data.vehicle.images) {
      this.existingImages = [...data.vehicle.images];
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = Array.from(event.dataTransfer?.files || [])
      .filter(file => file.type.startsWith('image/'));
    this.addFiles(files);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.addFiles(Array.from(input.files));
    }
  }

  addFiles(files: File[]): void {
    // Calculate remaining slots considering both existing and selected images
    const totalImages = this.existingImages.length + this.selectedFiles.length;
    const remainingSlots = 5 - totalImages;
    const filesToAdd = files.slice(0, remainingSlots);

    filesToAdd.forEach(file => {
      if (file.size <= 5 * 1024 * 1024) { // 5MB limit
        this.selectedFiles.push(file);
        this.createPreview(file);
      } else {
        this.snackBar.open(`File ${file.name} exceeds 5MB limit`, 'Close', { duration: 3000 });
      }
    });

    if (files.length > remainingSlots) {
      this.snackBar.open('Maximum 5 images allowed', 'Close', { duration: 3000 });
    }
  }

  createPreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.previewUrls.push(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  deleteExistingImage(image: VehicleImage): void {
    if (confirm('Are you sure you want to delete this image?')) {
      if (image.id === 'legacy') {
        // For legacy images, update the vehicle to remove the image
        this.vehicleService.updateVehicle(this.data.vehicle.id, {
          imageUrl: null,
          imagePublicId: null
        }).subscribe({
          next: (updatedVehicle) => {
            this.existingImages = this.existingImages.filter(img => img.id !== image.id);
            this.snackBar.open('Image deleted successfully', 'Close', { duration: 3000 });
            this.data.onImageDeleted?.();
          },
          error: (error) => {
            console.error('Error deleting legacy image:', error);
            this.snackBar.open('Error deleting image', 'Close', { duration: 3000 });
          }
        });
      } else {
        // For regular images, use the delete endpoint
        this.vehicleService.deleteImage(image.id, this.data.vehicle.id).subscribe({
          next: () => {
            this.existingImages = this.existingImages.filter(img => img.id !== image.id);
            this.snackBar.open('Image deleted successfully', 'Close', { duration: 3000 });
            this.data.onImageDeleted?.();
          },
          error: (error) => {
            console.error('Error deleting image:', error);
            this.snackBar.open('Error deleting image', 'Close', { duration: 3000 });
          }
        });
      }
    }
  }

  async onUpload(): Promise<void> {
    if (!this.selectedFiles.length) return;

    this.isUploading = true;
    const formData = new FormData();
    this.selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
      const updatedVehicle = await this.vehicleService.uploadImages(this.data.vehicle.id, formData).toPromise();
      this.snackBar.open('Images uploaded successfully', 'Close', { duration: 3000 });
      this.dialogRef.close(updatedVehicle);
    } catch (error) {
      console.error('Error uploading images:', error);
      this.snackBar.open('Error uploading images', 'Close', { duration: 3000 });
    } finally {
      this.isUploading = false;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  get totalImagesCount(): number {
    return this.existingImages.length + this.selectedFiles.length;
  }

  get canAddMoreImages(): boolean {
    return this.totalImagesCount < 5;
  }
} 