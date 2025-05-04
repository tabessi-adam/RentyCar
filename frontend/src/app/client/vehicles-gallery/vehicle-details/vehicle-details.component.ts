import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { VehicleCarouselComponent } from './vehicle-carousel/vehicle-carousel.component';
import { ReserveComponent } from './reserve/reserve.component';
import { ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle } from '../../../core/models/vehicle.model';
import { CommonModule } from '@angular/common';
import { ReviewsComponent } from './reviews/reviews.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-vehicle-details',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent,
    VehicleCarouselComponent,
    ReserveComponent,
    ReviewsComponent,
    TranslateModule
  ],
  templateUrl: './vehicle-details.component.html',
  styleUrl: './vehicle-details.component.scss'
})
export class VehicleDetailsComponent implements OnInit {
  vehicle: Vehicle | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private vehicleService: VehicleService
  ) {}

  ngOnInit() {
    const vehicleId = this.route.snapshot.paramMap.get('id');
    if (vehicleId) {
      this.vehicleService.getVehicleById(vehicleId).subscribe({
        next: (vehicle) => {
          this.vehicle = vehicle;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading vehicle:', error);
          this.isLoading = false;
        }
      });
    }
  }

  get vehicleImages(): string[] {
    if (!this.vehicle) return [];
    
    // If we have images array, use those URLs
    if (this.vehicle.images && this.vehicle.images.length > 0) {
      return this.vehicle.images.map(img => img.url);
    }
    
    // Fallback to legacy imageUrl if available
    if (this.vehicle.imageUrl) {
      return [this.vehicle.imageUrl];
    }
    
    return [];
  }
}
