import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { VehiclesListComponent } from './vehicles-list/vehicles-list.component';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { Vehicle } from '../../core/models/vehicle.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VehiclesFilterComponent } from './vehicles-filter/vehicles-filter.component';
import { VehicleFilters } from './vehicles-filter/vehicles-filter.component';
import { EditVehicleComponent } from './edit-vehicle/edit-vehicle.component';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [
    SidebarComponent, 
    VehiclesListComponent, 
    MatDialogModule,
    VehiclesFilterComponent
  ],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss'
})
export class VehiclesComponent implements AfterViewInit {
  @ViewChild(VehiclesListComponent) vehiclesList!: VehiclesListComponent;
  isSidebarExpanded = true;

  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    // Ensure the vehicles list is loaded initially
    if (this.vehiclesList) {
      this.vehiclesList.loadVehicles();
    }
    this.cdr.detectChanges();
  }

  onSidebarExpandedChange(expanded: boolean) {
    this.isSidebarExpanded = expanded;
    this.cdr.detectChanges();
  }

  openAddVehicleModal() {
    const dialogRef = this.dialog.open(AddVehicleComponent, {
      width: '100%',
      maxWidth: '500px',
      height: '100%',
      maxHeight: '100vh',
      panelClass: 'responsive-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onVehicleAdded(result);
      }
    });
  }

  onVehicleAdded(vehicle: Vehicle) {
    // Ensure we refresh the list after adding a vehicle
    setTimeout(() => {
      if (this.vehiclesList) {
        this.vehiclesList.loadVehicles();
      }
    });
  }

  onFiltersChanged(filters: VehicleFilters) {
    if (this.vehiclesList) {
      this.vehiclesList.loadVehicles(filters);
    }
  }

  openEditVehicleModal(vehicle: Vehicle) {
    const dialogRef = this.dialog.open(EditVehicleComponent, {
      width: '100%',
      maxWidth: '500px',
      height: '100%',
      maxHeight: '100vh',
      panelClass: 'responsive-dialog',
      data: { vehicle }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onVehicleUpdated(result);
      }
    });
  }

  onVehicleUpdated(vehicle: Vehicle) {
    // Ensure we refresh the list after updating a vehicle
    setTimeout(() => {
      if (this.vehiclesList) {
        this.vehiclesList.loadVehicles();
      }
    });
  }
}
