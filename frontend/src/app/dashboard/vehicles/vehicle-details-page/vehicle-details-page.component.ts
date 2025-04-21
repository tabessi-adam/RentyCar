import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle, VehicleStatus, VehicleImage } from '../../../core/models/vehicle.model';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { EditVehicleComponent } from '../edit-vehicle/edit-vehicle.component';
import { UploadImagesComponent } from '../upload-images/upload-images.component';

@Component({
  selector: 'app-vehicle-details-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    SidebarComponent
  ],
  templateUrl: './vehicle-details-page.component.html',
  styleUrls: ['./vehicle-details-page.component.scss']
})
export class VehicleDetailsPageComponent implements OnInit, OnDestroy {
  vehicle: Vehicle | null = null;
  isSidebarExpanded = true;
  currentImageIndex = 0;
  isLoading = true;
  VehicleStatus = VehicleStatus;
  private autoRotateInterval: any;
  private readonly ROTATE_INTERVAL = 5000; // 5 seconds

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private location: Location,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadVehicle(id);
    } else {
      this.snackBar.open('Vehicle ID not found', 'Close', { duration: 3000 });
      this.router.navigate(['/dashboard/vehicles']);
    }
  }

  ngOnDestroy(): void {
    this.stopAutoRotate();
  }

  startAutoRotate(): void {
    if (this.hasMultipleImages) {
      this.stopAutoRotate();
      this.autoRotateInterval = setInterval(() => {
        this.nextImage();
      }, this.ROTATE_INTERVAL);
    }
  }

  stopAutoRotate(): void {
    if (this.autoRotateInterval) {
      clearInterval(this.autoRotateInterval);
      this.autoRotateInterval = null;
    }
  }

  loadVehicle(id: string): void {
    this.isLoading = true;
    this.vehicleService.getVehicleById(id).subscribe({
      next: (vehicle: Vehicle) => {
        console.log('Vehicle loaded:', vehicle);
        console.log('Vehicle images:', vehicle.images);
        this.vehicle = vehicle;
        this.isLoading = false;
        this.cdr.detectChanges();
        this.startAutoRotate();
      },
      error: (error: any) => {
        console.error('Error loading vehicle:', error);
        this.snackBar.open('Error loading vehicle details', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  editVehicle(): void {
    if (this.vehicle) {
      const dialogRef = this.dialog.open(EditVehicleComponent, {
        width: '600px',
        data: { vehicle: this.vehicle }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.vehicle = result;
          this.snackBar.open('Vehicle updated successfully', 'Close', { duration: 3000 });
        }
      });
    }
  }

  deleteVehicle(): void {
    if (this.vehicle && confirm('Are you sure you want to delete this vehicle?')) {
      this.vehicleService.deleteVehicle(this.vehicle.id).subscribe({
        next: () => {
          this.snackBar.open('Vehicle deleted successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard/vehicles']);
        },
        error: (error: any) => {
          console.error('Error deleting vehicle:', error);
          this.snackBar.open('Error deleting vehicle', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onSidebarExpandedChange(expanded: boolean): void {
    this.isSidebarExpanded = expanded;
    this.cdr.detectChanges();
  }

  nextImage(): void {
    if (this.vehicle?.images) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.vehicle.images.length;
      this.cdr.detectChanges();
    }
  }

  previousImage(): void {
    if (this.vehicle?.images) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.vehicle.images.length) % this.vehicle.images.length;
      this.cdr.detectChanges();
    }
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
    this.stopAutoRotate();
    this.startAutoRotate();
  }

  getStatusClass(status: VehicleStatus): string {
    switch (status) {
      case VehicleStatus.AVAILABLE:
        return 'available';
      case VehicleStatus.RENTED:
        return 'rented';
      case VehicleStatus.MAINTENANCE:
        return 'maintenance';
      default:
        return '';
    }
  }

  get currentImage(): VehicleImage | null {
    return this.vehicle?.images?.[this.currentImageIndex] || null;
  }

  get hasMultipleImages(): boolean {
    return (this.vehicle?.images?.length || 0) > 1;
  }

  get images(): VehicleImage[] {
    return this.vehicle?.images || [];
  }

  uploadImages(): void {
    if (!this.vehicle) return;

    const dialogRef = this.dialog.open(UploadImagesComponent, {
      width: '600px',
      data: { vehicle: this.vehicle }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.vehicle = result;
        this.cdr.detectChanges();
        this.startAutoRotate();
      }
    });
  }
}
