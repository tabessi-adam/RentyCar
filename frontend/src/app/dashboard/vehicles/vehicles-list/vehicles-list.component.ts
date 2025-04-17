import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle, VehicleStatus } from '../../../core/models/vehicle.model';
import { EditVehicleComponent } from '../edit-vehicle/edit-vehicle.component';
import { DeleteVehicleComponent } from '../delete-vehicle/delete-vehicle.component';
import { ViewVehicleComponent } from '../view-vehicle/view-vehicle.component';
import { VehicleFiltersComponent } from '../vehicle-filters/vehicle-filters.component';

interface SortConfig {
  key: keyof Vehicle;
  direction: 'asc' | 'desc' | null;
}

// Define the VehicleFilter interface (same as in VehicleFiltersComponent)
interface VehicleFilter extends Partial<Vehicle> {
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
}

@Component({
  selector: 'app-vehicles-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EditVehicleComponent,
    DeleteVehicleComponent,
    ViewVehicleComponent,
    VehicleFiltersComponent
  ],
  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.scss']
})
export class VehiclesListComponent implements OnInit {
  @ViewChild(EditVehicleComponent) editVehicleComponent!: EditVehicleComponent;
  @ViewChild(DeleteVehicleComponent) deleteVehicleComponent!: DeleteVehicleComponent;
  @ViewChild(ViewVehicleComponent) viewVehicleComponent!: ViewVehicleComponent;

  vehicles: Vehicle[] = [];
  paginatedVehicles: Vehicle[] = [];
  loading = false;
  error: string | null = null;
  vehicleToDelete: Vehicle | null = null;
  currentFilters: VehicleFilter = {};
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  
  // Sorting
  sortConfig: SortConfig = { key: 'brand', direction: null };

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.loading = true;
    this.error = null;

    this.vehicleService.getAllVehicles(this.currentFilters).subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        this.sortVehicles();
        this.updatePagination();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
        this.error = 'Failed to load vehicles. Please try again.';
        this.loading = false;
      }
    });
  }

  onFiltersChanged(filters: VehicleFilter): void {
    this.currentFilters = filters;
    this.currentPage = 1;
    this.loadVehicles();
  }

  // Sorting
  sortBy(key: keyof Vehicle): void {
    if (this.sortConfig.key === key) {
      this.sortConfig.direction = 
        this.sortConfig.direction === 'asc' ? 'desc' : 
        this.sortConfig.direction === 'desc' ? null : 'asc';
    } else {
      this.sortConfig = { key, direction: 'asc' };
    }
    this.sortVehicles();
    this.updatePagination();
  }

  sortVehicles(): void {
    if (!this.sortConfig.direction) {
      this.vehicles = [...this.vehicles];
      return;
    }

    this.vehicles.sort((a, b) => {
      const valueA = a[this.sortConfig.key];
      const valueB = b[this.sortConfig.key];
      
      if (valueA === null || valueB === null) {
        return 0;
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortConfig.direction === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return this.sortConfig.direction === 'asc'
        ? (valueA < valueB ? -1 : 1)
        : (valueA > valueB ? -1 : 1);
    });
  }

  getSortIcon(key: keyof Vehicle): string {
    if (this.sortConfig.key !== key || !this.sortConfig.direction) {
      return 'fa-sort';
    }
    return this.sortConfig.direction === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  // Pagination
  updatePagination(): void {
    this.totalPages = Math.ceil(this.vehicles.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedVehicles = this.vehicles.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  // Status handling
  getStatusClass(status: VehicleStatus): string {
    return `status-${status.toLowerCase()}`;
  }

  // Action handlers
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
    if (!this.vehicleToDelete) return;

    this.loading = true;
    this.vehicleService.deleteVehicle(this.vehicleToDelete.id).subscribe({
      next: () => {
        this.vehicleToDelete = null;
        this.loadVehicles();
      },
      error: (error) => {
        console.error('Error deleting vehicle:', error);
        this.error = 'Failed to delete vehicle. Please try again.';
        this.loading = false;
      }
    });
  }

  onVehicleUpdated(updatedVehicle: Vehicle): void {
    this.loading = true;
    this.vehicleService.updateVehicle(updatedVehicle.id, updatedVehicle).subscribe({
      next: () => {
        this.loadVehicles();
      },
      error: (error) => {
        console.error('Error updating vehicle:', error);
        this.error = 'Failed to update vehicle. Please try again.';
        this.loading = false;
      }
    });
  }
}