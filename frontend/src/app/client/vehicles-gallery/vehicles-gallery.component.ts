import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../core/services/vehicle.service';
import { Vehicle } from '../../core/models/vehicle.model';
import { CommonModule } from '@angular/common';
import { VehicleCardComponent } from './vehicle-card/vehicle-card.component';
import { VehiclesFilterComponent } from './vehicles-filter/vehicles-filter.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-vehicles-gallery',
  standalone: true,
  imports: [
    CommonModule, 
    VehicleCardComponent, 
    VehiclesFilterComponent,
    NavbarComponent,
    FooterComponent,
    SearchBarComponent,
    TranslateModule
  ],
  templateUrl: './vehicles-gallery.component.html',
  styleUrl: './vehicles-gallery.component.scss'
})
export class VehiclesGalleryComponent implements OnInit {
  vehicles: Vehicle[] = [];
  isLoading = true;
  error: string | null = null;
  currentFilters: any = {};
  currentPage = 1;
  totalPages = 1;
  totalVehicles = 0;
  itemsPerPage = 10;

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  private loadVehicles(filters?: any): void {
    this.isLoading = true;
    this.error = null;
    this.currentFilters = { ...this.currentFilters, ...filters, page: this.currentPage, limit: this.itemsPerPage };

    this.vehicleService.getPublicVehicles(this.currentFilters).subscribe({
      next: (response) => {
        this.vehicles = response.data;
        this.totalVehicles = response.meta.total;
        this.totalPages = response.meta.totalPages;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load vehicles. Please try again later.';
        this.isLoading = false;
        console.error('Error loading vehicles:', err);
      }
    });
  }

  onFiltersChanged(filters: any): void {
    this.currentPage = 1; // Reset to first page when filters change
    this.loadVehicles(filters);
  }

  onSearch(query: string): void {
    this.currentPage = 1; // Reset to first page when search changes
    this.loadVehicles({ search: query });
  }

  onClearFilters(): void {
    this.currentPage = 1; // Reset to first page when clearing filters
    this.currentFilters = {};
    this.loadVehicles();
  }

  onClearSearch(): void {
    this.currentPage = 1; // Reset to first page when clearing search
    this.currentFilters = { ...this.currentFilters, search: '' };
    this.loadVehicles();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadVehicles();
  }
}
