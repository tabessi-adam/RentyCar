import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { OfficeService } from '../../../core/services/office.service';
import { Office } from '../../../core/models/office.model';

export interface VehicleFilters {
  status?: string;
  brand?: string;
  model?: string;
  minYear?: number;
  maxYear?: number;
  fuelType?: string;
  transmission?: string;
  minPrice?: number;
  maxPrice?: number;
  officeId?: string;
}

@Component({
  selector: 'app-vehicles-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  templateUrl: './vehicles-filter.component.html',
  styleUrl: './vehicles-filter.component.scss'
})
export class VehiclesFilterComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<VehicleFilters>();

  filterForm: FormGroup;
  currentYear = new Date().getFullYear();
  years = Array.from({ length: 50 }, (_, i) => this.currentYear - i);
  faFilter = faFilter;
  offices: Office[] = [];

  constructor(
    private fb: FormBuilder,
    private officeService: OfficeService
  ) {
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
      officeId: ['']
    });

    this.filterForm.valueChanges.subscribe(value => {
      // Only emit filters that have values
      const filters: Partial<VehicleFilters> = {};
      
      // Handle string and number values
      Object.entries(value).forEach(([key, val]) => {
        if (typeof val === 'string' && val !== '') {
          (filters as any)[key] = val;
        } else if (typeof val === 'number' && val !== null) {
          (filters as any)[key] = val;
        }
      });

      this.filtersChanged.emit(filters);
    });
  }

  ngOnInit() {
    this.loadOffices();
  }

  loadOffices() {
    this.officeService.getAllOffices().subscribe(offices => {
      this.offices = offices;
    });
  }

  clearFilters() {
    this.filterForm.reset();
  }
}
