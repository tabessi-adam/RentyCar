import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VehicleService } from '../../../core/services/vehicle.service';
import { OfficeService } from '../../../core/services/office.service';
import { Vehicle } from '../../../core/models/vehicle.model';
import { Office } from '../../../core/models/office.model';
import { ViewVehicleComponent } from '../view-vehicle/view-vehicle.component';
import { DeleteVehicleComponent } from '../delete-vehicle/delete-vehicle.component';
import { EditVehicleComponent } from '../edit-vehicle/edit-vehicle.component';

@Component({
  selector: 'app-vehicles-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './vehicles-list.component.html',
  styleUrl: './vehicles-list.component.scss'
})
export class VehiclesListComponent implements OnInit {
  vehicles: Vehicle[] = [];
  offices: Office[] = [];
  isLoading = true;
  displayedColumns: string[] = [
    'id',
    'status',
    'brand',
    'model',
    'year',
    'pricePerDay',
    'office',
    'actions'
  ];

  constructor(
    private vehicleService: VehicleService,
    private officeService: OfficeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadVehicles();
    this.loadOffices();
  }

  private loadOffices() {
    this.officeService.getAllOffices().subscribe({
      next: (offices) => {
        this.offices = offices;
      },
      error: (error) => {
        console.error('Error loading offices:', error);
        this.snackBar.open('Error loading offices', 'Close', { duration: 3000 });
      }
    });
  }

  getOfficeName(officeId: string): string {
    const office = this.offices.find(o => o.id === officeId);
    return office ? office.name : 'Unknown Office';
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  onView(vehicle: Vehicle) {
    this.dialog.open(ViewVehicleComponent, {
      width: '500px',
      data: { vehicle }
    });
  }

  onEdit(vehicle: Vehicle) {
    const dialogRef = this.dialog.open(EditVehicleComponent, {
      width: '500px',
      data: { vehicle }
    });

    dialogRef.afterClosed().subscribe((result: Vehicle) => {
      if (result) {
        this.loadVehicles();
      }
    });
  }

  onDelete(vehicle: Vehicle) {
    const dialogRef = this.dialog.open(DeleteVehicleComponent, {
      width: '500px',
      maxWidth: '90vw',
      panelClass: 'delete-dialog-container',
      data: { vehicle }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadVehicles();
      }
    });
  }

  loadVehicles() {
    this.isLoading = true;
    this.vehicleService.getAllVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
        this.snackBar.open('Error loading vehicles', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
}
