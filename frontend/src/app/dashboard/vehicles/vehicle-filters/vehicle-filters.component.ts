import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicleStatus, FuelType, Transmission, Vehicle } from '../../../core/models/vehicle.model';

// Define a specific interface for filters
interface VehicleFilter extends Partial<Vehicle> {
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
}

@Component({
  selector: 'app-vehicle-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TitleCasePipe
  ],
  templateUrl: './vehicle-filters.component.html',
  styleUrls: ['./vehicle-filters.component.scss']
})
export class VehicleFiltersComponent implements OnInit, OnDestroy {
  @Output() filtersChanged = new EventEmitter<VehicleFilter>();

  filterForm: FormGroup;
  vehicleStatus = Object.values(VehicleStatus);
  fuelTypes = Object.values(FuelType);
  transmissions = Object.values(Transmission);
  currentYear = new Date().getFullYear();
  minYear = 1900;
  isCollapsed = window.innerWidth <= 480;
  isMobile = window.innerWidth <= 480;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      status: [''],
      brand: ['', [Validators.pattern(/^[a-zA-Z\s]*$/)]],
      model: ['', [Validators.pattern(/^[a-zA-Z0-9\s]*$/)]],
      minYear: ['', [Validators.min(this.minYear), Validators.max(this.currentYear)]],
      maxYear: ['', [Validators.min(this.minYear), Validators.max(this.currentYear)]],
      fuelType: [''],
      transmission: [''],
      minPrice: ['', [Validators.min(0)]],
      maxPrice: ['', [Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.checkMobileView();
    window.addEventListener('resize', this.checkMobileView.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.checkMobileView.bind(this));
  }

  private checkMobileView(): void {
    const isMobile = window.innerWidth <= 480;
    this.isMobile = isMobile;
    this.isCollapsed = isMobile;
  }

  get yearRangeInvalid(): boolean {
    const minYear = this.filterForm.get('minYear')?.value;
    const maxYear = this.filterForm.get('maxYear')?.value;
    return minYear && maxYear && minYear > maxYear;
  }

  get priceRangeInvalid(): boolean {
    const minPrice = this.filterForm.get('minPrice')?.value;
    const maxPrice = this.filterForm.get('maxPrice')?.value;
    return minPrice && maxPrice && minPrice > maxPrice;
  }

  applyFilters(): void {
    if (this.filterForm.invalid) return;

    const formValue = this.filterForm.value;
    const filters: VehicleFilter = {};

    // Handle numeric values
    if (formValue.minYear) filters.minYear = Number(formValue.minYear);
    if (formValue.maxYear) filters.maxYear = Number(formValue.maxYear);
    if (formValue.minPrice) filters.minPrice = Number(formValue.minPrice);
    if (formValue.maxPrice) filters.maxPrice = Number(formValue.maxPrice);

    // Handle string values
    if (formValue.status) filters.status = formValue.status as VehicleStatus;
    if (formValue.brand) filters.brand = formValue.brand;
    if (formValue.model) filters.model = formValue.model;
    if (formValue.fuelType) filters.fuelType = formValue.fuelType as FuelType;
    if (formValue.transmission) filters.transmission = formValue.transmission as Transmission;

    this.filtersChanged.emit(filters);
  }

  resetFilters(): void {
    this.filterForm.reset({
      status: '',
      brand: '',
      model: '',
      minYear: '',
      maxYear: '',
      fuelType: '',
      transmission: '',
      minPrice: '',
      maxPrice: ''
    });
    this.filtersChanged.emit({});
  }

  toggleCollapse(): void {
    if (window.innerWidth <= 480) {
      return;
    }
    this.isCollapsed = !this.isCollapsed;
  }
}