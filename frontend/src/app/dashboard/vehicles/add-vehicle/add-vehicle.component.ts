import { Component, EventEmitter, Output, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle, VehicleStatus, FuelType, Transmission } from '../../../core/models/vehicle.model';
import { OfficeService } from '../../../core/services/office.service';
import { Office } from '../../../core/models/office.model';

@Component({
  selector: 'app-add-vehicle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './add-vehicle.component.html',
  styleUrl: './add-vehicle.component.scss'
})
export class AddVehicleComponent {
  @Output() vehicleAdded = new EventEmitter<Vehicle>();
  
  vehicle: Partial<Vehicle> = {
    status: VehicleStatus.AVAILABLE,
    hasGPS: false,
    hasBluetooth: false,
    hasAirConditioning: false,
    hasUSBCable: false
  };
  
  offices: Office[] = [];
  isLoading = false;
  currentYear = new Date().getFullYear();
  
  readonly statusOptions = Object.values(VehicleStatus);
  readonly fuelTypeOptions = Object.values(FuelType);
  readonly transmissionOptions = Object.values(Transmission);

  constructor(
    private vehicleService: VehicleService,
    private officeService: OfficeService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddVehicleComponent>
  ) {
    this.loadOffices();
  }

  loadOffices() {
    this.officeService.getAllOffices().subscribe(offices => {
      this.offices = offices;
    });
  }

  onSubmit() {
    this.isLoading = true;
    this.vehicleService.createVehicle(this.vehicle as Vehicle).subscribe({
      next: (newVehicle) => {
        this.snackBar.open('Vehicle created successfully', 'Close', { duration: 3000 });
        this.dialogRef.close(newVehicle);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creating vehicle:', error);
        this.snackBar.open('Error creating vehicle', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
