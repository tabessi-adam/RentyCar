import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleStatus, FuelType, Transmission } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-vehicles-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicles-filter.component.html',
  styleUrl: './vehicles-filter.component.scss'
})
export class VehiclesFilterComponent {
  @Output() filtersChanged = new EventEmitter<any>();

  // Filter options
  statusOptions = Object.values(VehicleStatus);
  fuelTypeOptions = Object.values(FuelType);
  transmissionOptions = Object.values(Transmission);
  
  // Filter values
  filters = {
    // Basic filters
    brand: '',
    model: '',
    status: '',
    fuelType: '',
    transmission: '',
    
    // Price and year range
    minPrice: null as number | null,
    maxPrice: null as number | null,
    minYear: null as number | null,
    maxYear: null as number | null,
    
    // Features
    hasGPS: false,
    hasBluetooth: false,
    hasAirConditioning: false,
    hasUSBCable: false
  };

  // UI state
  currentYear = new Date().getFullYear();
  yearOptions = Array.from({length: 30}, (_, i) => this.currentYear - i);

  onFilterChange(): void {
    this.filtersChanged.emit(this.filters);
  }

  clearFilters(): void {
    this.filters = {
      brand: '',
      model: '',
      status: '',
      fuelType: '',
      transmission: '',
      minPrice: null,
      maxPrice: null,
      minYear: null,
      maxYear: null,
      hasGPS: false,
      hasBluetooth: false,
      hasAirConditioning: false,
      hasUSBCable: false
    };
    this.onFilterChange();
  }
}
