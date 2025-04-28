import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { VehicleService } from '../../../../app/core/services/vehicle.service';
import { NavbarComponent } from '../../../../app/shared/navbar/navbar.component';
import { FooterComponent } from '../../../../app/shared/footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatCardModule } from '@angular/material/card';

interface Vehicle {
  id: string;
  officeId: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  kilometersDriven: number;
  fuelType: string;
  transmission: string;
  pricePerDay: number;
  hasGPS: boolean;
  hasBluetooth: boolean;
  hasAirConditioning: boolean;
  hasUSBCable: boolean;
  images: { url: string }[];
}

@Component({
  selector: 'app-vehicle-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    FooterComponent,
    FontAwesomeModule,
    MatCardModule
  ],
  templateUrl: './vehicle-details.component.html',
  styleUrl: './vehicle-details.component.scss'
})
export class VehicleDetailsComponent implements OnInit {
  vehicle: Vehicle | null = null;
  isLoading = true;
  error: string | null = null;
  currentSlideIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadVehicleDetails(id);
    } else {
      this.error = 'Vehicle ID not provided';
      this.isLoading = false;
      this.router.navigate(['/collection']);
    }
  }

  loadVehicleDetails(id: string): void {
    this.isLoading = true;
    this.error = null;
    
    this.vehicleService.getVehicleById(id).subscribe({
      next: (vehicle) => {
        this.vehicle = {
          ...vehicle,
          images: vehicle.images || []
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading vehicle details:', error);
        this.error = 'Failed to load vehicle details. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  nextSlide(): void {
    if (this.vehicle?.images) {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.vehicle.images.length;
    }
  }

  prevSlide(): void {
    if (this.vehicle?.images) {
      this.currentSlideIndex = (this.currentSlideIndex - 1 + this.vehicle.images.length) % this.vehicle.images.length;
    }
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
  }
}
