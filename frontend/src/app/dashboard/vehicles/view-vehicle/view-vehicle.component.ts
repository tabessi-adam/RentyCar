import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle, VehicleStatus, FuelType, Transmission } from '../../../core/models/vehicle.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faLocationDot, 
  faSignal, 
  faSnowflake, 
  faPlug,
  faCheck
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-view-vehicle',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './view-vehicle.component.html',
  styleUrls: ['./view-vehicle.component.scss']
})
export class ViewVehicleComponent {
  @Output() closed = new EventEmitter<void>();
  @Input() vehicle: Vehicle | null = null;
  @Input() isOpen = false;
  
  // Font Awesome icons
  faMapMarkerAlt = faLocationDot;
  faBluetooth = faSignal;
  faSnowflake = faSnowflake;
  faPlug = faPlug;
  faCheck = faCheck;

  open(vehicle: Vehicle) {
    this.vehicle = vehicle;
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.vehicle = null;
    this.closed.emit();
  }

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