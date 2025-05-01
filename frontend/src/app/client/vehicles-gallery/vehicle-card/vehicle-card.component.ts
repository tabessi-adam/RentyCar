import { Component, Input } from '@angular/core';
import { Vehicle } from '../../../core/models/vehicle.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vehicle-card.component.html',
  styleUrl: './vehicle-card.component.scss'
})
export class VehicleCardComponent {
  @Input() vehicle!: Vehicle;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  navigateToDetails(): void {
    this.router.navigate(['/collection/vehicle-details', this.vehicle.id]);
  }

  handleBookNow(event: Event): void {
    event.stopPropagation();
    if (this.authService.isAuthenticated()) {
      this.navigateToDetails();
    } else {
      this.router.navigate(['/auth/login'], { 
        queryParams: { returnUrl: `/collection/vehicle-details/${this.vehicle.id}` }
      });
    }
  }
}
