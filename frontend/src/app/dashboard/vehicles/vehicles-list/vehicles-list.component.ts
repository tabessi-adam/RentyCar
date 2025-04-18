import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { VehicleService } from '../../../core/services/vehicle.service';
import { OfficeService } from '../../../core/services/office.service';
import { Vehicle } from '../../../core/models/vehicle.model';
import { Office } from '../../../core/models/office.model';
import { ViewVehicleComponent } from '../view-vehicle/view-vehicle.component';
import { DeleteVehicleComponent } from '../delete-vehicle/delete-vehicle.component';
import { interval, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-vehicles-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './vehicles-list.component.html',
  styleUrl: './vehicles-list.component.scss'
})
export class VehiclesListComponent implements OnInit, OnDestroy {
  vehicles: Vehicle[] = [];
  offices: Office[] = [];
  isLoading = true;
  displayedColumns: string[] = [
    'id',
    'brand',
    'model',
    'year',
    'status',
    'pricePerDay',
    'office',
    'actions'
  ];

  private updateSubscription?: Subscription;
  private readonly REFRESH_INTERVAL = 30000; // 30 seconds

  constructor(
    private vehicleService: VehicleService,
    private officeService: OfficeService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadOffices();
    this.setupAutoRefresh();
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  private setupAutoRefresh() {
    this.updateSubscription = interval(this.REFRESH_INTERVAL)
      .pipe(
        startWith(0), // Start immediately
        switchMap(() => this.vehicleService.getAllVehicles())
      )
      .subscribe({
        next: (vehicles) => {
          this.vehicles = vehicles;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading vehicles:', error);
          this.isLoading = false;
        }
      });
  }

  loadOffices() {
    this.officeService.getAllOffices().subscribe({
      next: (offices) => {
        this.offices = offices;
      },
      error: (error) => {
        console.error('Error loading offices:', error);
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
    // Implement edit logic
  }

  onDelete(vehicle: Vehicle) {
    const dialogRef = this.dialog.open(DeleteVehicleComponent, {
      width: '500px',
      maxWidth: '90vw',
      panelClass: 'delete-dialog-container',
      data: { vehicle }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadVehicles();
      }
    });
  }

  private loadVehicles() {
    this.isLoading = true;
    this.vehicleService.getAllVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
        this.isLoading = false;
      }
    });
  }
}
