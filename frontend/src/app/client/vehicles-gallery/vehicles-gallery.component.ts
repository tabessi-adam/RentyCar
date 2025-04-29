import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../core/services/vehicle.service';
import { Vehicle } from '../../core/models/vehicle.model';
import { CommonModule } from '@angular/common';
import { VehicleCardComponent } from './vehicle-card/vehicle-card.component';
import { VehiclesFilterComponent } from './vehicles-filter/vehicles-filter.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component'; 

@Component({
  selector: 'app-vehicles-gallery',
  standalone: true,
  imports: [CommonModule, VehicleCardComponent, VehiclesFilterComponent,NavbarComponent,FooterComponent],
  templateUrl: './vehicles-gallery.component.html',
  styleUrl: './vehicles-gallery.component.scss'
})
export class VehiclesGalleryComponent implements OnInit {
  vehicles: Vehicle[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  private loadVehicles(filters?: any): void {
    this.isLoading = true;
    this.error = null;

    this.vehicleService.getPublicVehicles(filters).subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load vehicles. Please try again later.';
        this.isLoading = false;
        console.error('Error loading vehicles:', err);
      }
    });
  }

  onFiltersChanged(filters: any): void {
    this.loadVehicles(filters);
  }
}
