import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../../../app/core/services/vehicle.service';
import { Vehicle } from '../../../../app/core/models/vehicle.model';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card.component';
import { Observable } from 'rxjs';
import { tap, catchError, of } from 'rxjs';
import { NavbarComponent } from '../../../../app/shared/navbar/navbar.component';
import { FooterComponent } from '../../../../app/shared/footer/footer.component';

@Component({
  selector: 'app-vehicles-list',
  standalone: true,
  imports: [CommonModule, VehicleCardComponent, NavbarComponent, FooterComponent],
  templateUrl: './vehicles-list.component.html',
  styleUrl: './vehicles-list.component.scss'
})
export class VehiclesListComponent implements OnInit {
  vehicles$!: Observable<Vehicle[]>;
  isLoading = true;
  error: string | null = null;

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.isLoading = true;
    this.error = null;
    
    this.vehicles$ = this.vehicleService.getPublicVehicles().pipe(
      tap(vehicles => {
        this.isLoading = false;
      }),
      catchError(error => {
        this.isLoading = false;
        this.error = 'Failed to load vehicles. Please try again later.';
        return of([]);
      })
    );

    // Subscribe to the observable to ensure it's activated
    this.vehicles$.subscribe();
  }
}
