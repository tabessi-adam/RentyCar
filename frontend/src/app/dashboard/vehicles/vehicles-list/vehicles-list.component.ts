import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle, VehicleStatus, FuelType, Transmission } from '../../../core/models/vehicle.model';
import { EditVehicleComponent } from '../edit-vehicle/edit-vehicle.component';
import { DeleteVehicleComponent } from '../delete-vehicle/delete-vehicle.component';
import { ViewVehicleComponent } from '../view-vehicle/view-vehicle.component';
import { VehicleFiltersComponent } from '../vehicle-filters/vehicle-filters.component';

@Component({
  selector: 'app-vehicles-list',
  standalone: true,
  imports: [
    CommonModule, 
    EditVehicleComponent, 
    DeleteVehicleComponent, 
    ViewVehicleComponent,
    VehicleFiltersComponent
  ],
  templateUrl: './vehicles-list.component.html',
  styleUrl: './vehicles-list.component.scss'
})
export class VehiclesListComponent implements OnInit {
  @ViewChild(EditVehicleComponent) editVehicleComponent!: EditVehicleComponent;
  @ViewChild(DeleteVehicleComponent) deleteVehicleComponent!: DeleteVehicleComponent;
  @ViewChild(ViewVehicleComponent) viewVehicleComponent!: ViewVehicleComponent;
  vehicles: Vehicle[] = [];
  loading = true;
  error: string | null = null;
  vehicleToDelete: Vehicle | null = null;
  currentFilters: any = {};

  constructor(private vehicleService: VehicleService) {}

  ngOnInit() {
    this.loadVehicles();
  }

  loadVehicles() {
    console.log('Loading vehicles with filters:', this.currentFilters);
    this.loading = true;
    this.error = null;
    
    this.vehicleService.getAllVehicles(this.currentFilters).subscribe({
      next: (vehicles) => {
        console.log('Vehicles loaded:', vehicles);
        this.vehicles = vehicles;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
        this.error = 'Failed to load vehicles. Please try again later.';
        this.loading = false;
      }
    });
  }

  onFiltersChanged(filters: any) {
    console.log('Filters received in VehiclesList:', filters);
    this.currentFilters = filters;
    console.log('Current filters set to:', this.currentFilters);
    this.loadVehicles();
  }

  // Helper methods for displaying enum values nicely
  getStatusClass(status: VehicleStatus): string {
    switch (status) {
      case VehicleStatus.AVAILABLE:
        return 'status-available';
      case VehicleStatus.RENTED:
        return 'status-rented';
      case VehicleStatus.MAINTENANCE:
        return 'status-maintenance';
      default:
        return '';
    }
  }

  onView(vehicle: Vehicle): void {
    this.viewVehicleComponent.open(vehicle);
  }

  onEdit(vehicle: Vehicle): void {
    this.editVehicleComponent.open(vehicle);
  }

  onDelete(vehicle: Vehicle): void {
    this.vehicleToDelete = vehicle;
    this.deleteVehicleComponent.open(`${vehicle.brand} ${vehicle.model} (${vehicle.year})`);
  }

  onDeleteConfirmed(): void {
    if (this.vehicleToDelete) {
      this.vehicleService.deleteVehicle(this.vehicleToDelete.id).subscribe({
        next: () => {
          this.loadVehicles(); // Reload the list after deletion
        },
        error: (error) => {
          console.error('Error deleting vehicle:', error);
          this.error = 'Failed to delete vehicle. Please try again later.';
        }
      });
    }
  }

  onVehicleUpdated(updatedVehicle: Vehicle) {
    this.vehicleService.updateVehicle(updatedVehicle.id, {
      brand: updatedVehicle.brand,
      model: updatedVehicle.model,
      year: updatedVehicle.year,
      fuelType: updatedVehicle.fuelType,
      transmission: updatedVehicle.transmission,
      pricePerDay: updatedVehicle.pricePerDay,
      hasGPS: updatedVehicle.hasGPS,
      hasBluetooth: updatedVehicle.hasBluetooth,
      hasAirConditioning: updatedVehicle.hasAirConditioning,
      hasUSBCable: updatedVehicle.hasUSBCable,
      officeId: updatedVehicle.officeId,
      status: updatedVehicle.status
    }).subscribe({
      next: () => {
        this.loadVehicles(); // Reload the list after update
      },
      error: (error) => {
        console.error('Error updating vehicle:', error);
        // Handle error (show message to user)
      }
    });
  }
}
