import { Component, Input } from '@angular/core';
import { Vehicle } from '../../../core/models/vehicle.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle-card.component.html',
  styleUrl: './vehicle-card.component.scss'
})
export class VehicleCardComponent {
  @Input() vehicle!: Vehicle;

  constructor(private router: Router) {}

  navigateToDetails(): void {
    this.router.navigate(['/collection/vehicle-details', this.vehicle.id]);
  }
}
