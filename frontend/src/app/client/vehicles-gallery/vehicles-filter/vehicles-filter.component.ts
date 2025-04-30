import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FuelType, Transmission } from '../../../core/models/vehicle.model';

interface VehicleFilters {
  specifications: {
    fuelType: FuelType | '';
    transmission: Transmission | '';
  };
  price: {
    minPrice: number | null;
    maxPrice: number | null;
  };
  year: {
    minYear: number | null;
    maxYear: number | null;
  };
  features: {
    hasGPS: boolean;
    hasBluetooth: boolean;
    hasAirConditioning: boolean;
    hasUSBCable: boolean;
  };
}

@Component({
  selector: 'app-vehicles-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicles-filter.component.html',
  styleUrl: './vehicles-filter.component.scss'
})
export class VehiclesFilterComponent {
  @Output() filtersChanged = new EventEmitter<any>();
  @Output() clearFilters = new EventEmitter<void>();

  isMobileFiltersOpen = false;
  filters: VehicleFilters = {
    specifications: {
      fuelType: '',
      transmission: ''
    },
    price: {
      minPrice: null,
      maxPrice: null
    },
    year: {
      minYear: null,
      maxYear: null
    },
    features: {
      hasGPS: false,
      hasBluetooth: false,
      hasAirConditioning: false,
      hasUSBCable: false
    }
  };

  fuelTypeOptions = Object.values(FuelType);
  transmissionOptions = Object.values(Transmission);
  yearOptions: number[] = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  toggleMobileFilters(): void {
    this.isMobileFiltersOpen = !this.isMobileFiltersOpen;
  }

  onFilterChange(): void {
    const flattenedFilters = {
      fuelType: this.filters.specifications.fuelType,
      transmission: this.filters.specifications.transmission,
      minPrice: this.filters.price.minPrice,
      maxPrice: this.filters.price.maxPrice,
      minYear: this.filters.year.minYear,
      maxYear: this.filters.year.maxYear,
      hasGPS: this.filters.features.hasGPS,
      hasBluetooth: this.filters.features.hasBluetooth,
      hasAirConditioning: this.filters.features.hasAirConditioning,
      hasUSBCable: this.filters.features.hasUSBCable
    };
    this.filtersChanged.emit(flattenedFilters);
  }

  handleClearFilters(): void {
    this.filters = {
      specifications: {
        fuelType: '',
        transmission: ''
      },
      price: {
        minPrice: null,
        maxPrice: null
      },
      year: {
        minYear: null,
        maxYear: null
      },
      features: {
        hasGPS: false,
        hasBluetooth: false,
        hasAirConditioning: false,
        hasUSBCable: false
      }
    };
    this.clearFilters.emit();
    this.filtersChanged.emit({
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
    });
  }
}
