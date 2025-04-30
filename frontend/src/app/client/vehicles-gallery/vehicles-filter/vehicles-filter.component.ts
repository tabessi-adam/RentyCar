import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleStatus, FuelType, Transmission } from '../../../core/models/vehicle.model';

interface VehicleFilters {
  basic: {
    brand: string;
    model: string;
  };
  status: {
    status: VehicleStatus | '';
  };
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

  // Filter options
  statusOptions = Object.values(VehicleStatus);
  fuelTypeOptions = Object.values(FuelType);
  transmissionOptions = Object.values(Transmission);
  
  // Filter values organized by sections
  filters: VehicleFilters = {
    basic: {
      brand: '',
      model: ''
    },
    status: {
      status: ''
    },
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

  // UI state
  currentYear = new Date().getFullYear();
  yearOptions = Array.from({length: 30}, (_, i) => this.currentYear - i);

  onFilterChange(): void {
    // Flatten the filters structure to match the API expectations
    const flattenedFilters = {
      brand: this.filters.basic.brand,
      model: this.filters.basic.model,
      status: this.filters.status.status,
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

  clearFilters(): void {
    this.filters = {
      basic: {
        brand: '',
        model: ''
      },
      status: {
        status: ''
      },
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
    this.onFilterChange();
  }
}
