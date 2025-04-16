import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { VehicleStatus, FuelType, Transmission } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-vehicle-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehicle-filters.component.html',
  styleUrls: ['./vehicle-filters.component.scss']
})
export class VehicleFiltersComponent {
  @Output() filtersChanged = new EventEmitter<any>();
  
  filterForm: FormGroup;
  vehicleStatus = Object.values(VehicleStatus);
  fuelTypes = Object.values(FuelType);
  transmissions = Object.values(Transmission);
  currentYear = new Date().getFullYear();

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      status: [''],
      brand: [''],
      model: [''],
      minYear: [''],
      maxYear: [''],
      fuelType: [''],
      transmission: [''],
      minPrice: [''],
      maxPrice: [''],
      hasGPS: [false],
      hasBluetooth: [false],
      hasAirConditioning: [false],
      hasUSBCable: [false]
    });
  }

  applyFilters() {
    console.log('Apply Filters clicked');
    const formValue = this.filterForm.value;
    console.log('Current form values:', formValue);
    
    // Format the filters
    const filters: any = {};
    
    // Handle numeric values
    if (formValue.minYear) filters.minYear = Number(formValue.minYear);
    if (formValue.maxYear) filters.maxYear = Number(formValue.maxYear);
    if (formValue.minPrice) filters.minPrice = Number(formValue.minPrice);
    if (formValue.maxPrice) filters.maxPrice = Number(formValue.maxPrice);
    
    // Handle string values
    if (formValue.status) filters.status = formValue.status;
    if (formValue.brand) filters.brand = formValue.brand;
    if (formValue.model) filters.model = formValue.model;
    if (formValue.fuelType) filters.fuelType = formValue.fuelType;
    if (formValue.transmission) filters.transmission = formValue.transmission;
    
    // Handle boolean values
    if (formValue.hasGPS !== false) filters.hasGPS = formValue.hasGPS;
    if (formValue.hasBluetooth !== false) filters.hasBluetooth = formValue.hasBluetooth;
    if (formValue.hasAirConditioning !== false) filters.hasAirConditioning = formValue.hasAirConditioning;
    if (formValue.hasUSBCable !== false) filters.hasUSBCable = formValue.hasUSBCable;

    console.log('Formatted filters:', filters);
    this.filtersChanged.emit(filters);
  }

  resetFilters() {
    console.log('Reset Filters clicked');
    this.filterForm.reset({
      hasGPS: false,
      hasBluetooth: false,
      hasAirConditioning: false,
      hasUSBCable: false
    });
    this.filtersChanged.emit({});
  }
} 