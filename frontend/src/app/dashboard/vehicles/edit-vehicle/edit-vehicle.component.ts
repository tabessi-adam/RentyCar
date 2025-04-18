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
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle, VehicleStatus, FuelType, Transmission } from '../../../core/models/vehicle.model';
import { OfficeService } from '../../../core/services/office.service';
import { Office } from '../../../core/models/office.model';

@Component({
  selector: 'app-edit-vehicle',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './edit-vehicle.component.html',
  styleUrl: './edit-vehicle.component.scss'
})
export class EditVehicleComponent {
  @Output() vehicleUpdated = new EventEmitter<Vehicle>();
  
  vehicle: Vehicle;
  offices: Office[] = [];
  isLoading = false;
  currentYear = new Date().getFullYear();
  
  readonly statusOptions = Object.values(VehicleStatus);
  readonly fuelTypeOptions = Object.values(FuelType);
  readonly transmissionOptions = Object.values(Transmission);

  constructor(
    private vehicleService: VehicleService,
    private officeService: OfficeService,
    public dialogRef: MatDialogRef<EditVehicleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vehicle: Vehicle }
  ) {
    this.vehicle = { ...data.vehicle };
    this.loadOffices();
  }

  loadOffices() {
    this.officeService.getAllOffices().subscribe(offices => {
      this.offices = offices;
    });
  }

  onSubmit() {
    this.isLoading = true;
    this.vehicleService.updateVehicle(this.vehicle.id, this.vehicle).subscribe({
      next: (updatedVehicle) => {
        this.vehicleUpdated.emit(updatedVehicle);
        this.dialogRef.close();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating vehicle:', error);
        this.isLoading = false;
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
