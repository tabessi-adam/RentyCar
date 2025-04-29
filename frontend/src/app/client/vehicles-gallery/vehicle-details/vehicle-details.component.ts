import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle } from '../../../core/models/vehicle.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle-details.component.html',
  styleUrl: './vehicle-details.component.scss'
})
export class VehicleDetailsComponent implements OnInit {
  vehicle: Vehicle | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    const vehicleId = this.route.snapshot.paramMap.get('id');
    if (vehicleId) {
      this.loadVehicle(vehicleId);
    } else {
      this.error = 'Vehicle ID not provided';
      this.isLoading = false;
    }
  }

  private loadVehicle(id: string): void {
    this.isLoading = true;
    this.error = null;

    this.vehicleService.getVehicleById(id).subscribe({
      next: (vehicle) => {
        this.vehicle = vehicle;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load vehicle details. Please try again later.';
        this.isLoading = false;
        console.error('Error loading vehicle:', err);
      }
    });
  }
}
