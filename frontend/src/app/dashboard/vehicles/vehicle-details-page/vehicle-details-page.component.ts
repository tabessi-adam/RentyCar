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
import { AuthService } from '../../../core/services/auth.service';
import { Vehicle, VehicleStatus, VehicleImage } from '../../../core/models/vehicle.model';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { EditVehicleComponent } from '../edit-vehicle/edit-vehicle.component';
import { UploadImagesComponent } from '../upload-images/upload-images.component';
import { DeleteVehicleComponent } from '../delete-vehicle/delete-vehicle.component';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private location: Location,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
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
        width: '100%',
        maxWidth: '500px',
        height: '100%',
        maxHeight: '100vh',
        panelClass: 'responsive-dialog',
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
    if (this.vehicle) {
      const dialogRef = this.dialog.open(DeleteVehicleComponent, {
        width: '500px',
        maxWidth: '90vw',
        panelClass: 'delete-dialog-container',
        data: { vehicle: this.vehicle }
      });

      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          const role = this.authService.userRole();
          this.router.navigate([`/${role}/vehicles`]);
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
    this.cdr.detectChanges();
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
      width: '700px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      autoFocus: false,
      panelClass: ['upload-dialog-container'],
      data: { 
        vehicle: this.vehicle,
        onImageDeleted: () => this.refreshVehicleData()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.vehicle = result;
        const imagesLength = this.vehicle?.images?.length || 0;
        if (this.currentImageIndex >= imagesLength) {
          this.currentImageIndex = 0;
        }
        this.cdr.detectChanges();
      }
    });
  }

  refreshVehicleData(): void {
    if (this.vehicle?.id) {
      this.loadVehicle(this.vehicle.id);
    }
  }
}
