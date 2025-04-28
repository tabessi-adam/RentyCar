import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  images?: { url: string }[];
  currentStatus?: string;
}

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vehicle-card.component.html',
  styleUrl: './vehicle-card.component.scss'
})
export class VehicleCardComponent {
  @Input() vehicle!: Vehicle;

  getStatusClass(): string {
    if (!this.vehicle.currentStatus) return 'status-unknown';
    return `status-${this.vehicle.currentStatus.toLowerCase()}`;
  }
}
