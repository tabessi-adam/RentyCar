import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle, VehicleStatus, FuelType, Transmission } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-vehicles-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicles-list.component.html',
  styleUrl: './vehicles-list.component.scss'
})
export class VehiclesListComponent implements OnInit {
  vehicles: Vehicle[] = [];
  loading = true;
  error: string | null = null;

  constructor(private vehicleService: VehicleService) {}

  ngOnInit() {
    this.loadVehicles();
  }

  private loadVehicles() {
    this.loading = true;
    this.error = null;
    
    this.vehicleService.getAllVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load vehicles. Please try again later.';
        this.loading = false;
        console.error('Error loading vehicles:', error);
      }
    });
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
}
