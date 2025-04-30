import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CalendarComponent } from '../calendar/calendar.component';
import { Vehicle } from '../../../../core/models/vehicle.model';
import { ReservationService } from '../../../../core/services/reservation.service';

interface DateRange {
  start: Date;
  end: Date;
}

interface ApiDateRange {
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-reserve',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    CalendarComponent
  ],
  templateUrl: './reserve.component.html',
  styleUrl: './reserve.component.scss'
})
export class ReserveComponent implements OnInit {
  @Input() vehicle!: Vehicle;
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  rentedDates: DateRange[] = [];

  constructor(private reservationService: ReservationService) {
    console.log('ReserveComponent - Constructor called with vehicle:', this.vehicle);
  }

  ngOnInit() {
    console.log('ReserveComponent - ngOnInit called with vehicle:', this.vehicle);
    if (!this.vehicle) {
      console.error('ReserveComponent - No vehicle provided!');
      return;
    }
    this.loadVehicleAvailability();
  }

  loadVehicleAvailability() {
    console.log('ReserveComponent - Loading availability for vehicle:', this.vehicle.id);
    this.reservationService.getVehicleAvailability(this.vehicle.id).subscribe({
      next: (dates: ApiDateRange[]) => {
        console.log('ReserveComponent - Raw dates received:', JSON.stringify(dates, null, 2));
        this.rentedDates = dates.map(date => {
          const start = new Date(date.startDate);
          const end = new Date(date.endDate);
          console.log('ReserveComponent - Converting date range:', {
            original: JSON.stringify(date, null, 2),
            converted: {
              start: start.toISOString(),
              end: end.toISOString()
            }
          });
          return { start, end };
        });
        console.log('ReserveComponent - Final rentedDates array:', JSON.stringify(this.rentedDates.map(d => ({
          start: d.start.toISOString(),
          end: d.end.toISOString()
        })), null, 2));
      },
      error: (error) => {
        console.error('ReserveComponent - Error loading vehicle availability:', error);
      }
    });
  }

  onDateRangeChange(event: { start: Date | null, end: Date | null }) {
    console.log('ReserveComponent - Date range changed:', event);
    this.selectedStartDate = event.start;
    this.selectedEndDate = event.end;
  }

  calculateTotalPrice(): number {
    if (!this.selectedStartDate || !this.selectedEndDate) return 0;
    
    const days = Math.ceil(
      (this.selectedEndDate.getTime() - this.selectedStartDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return days * this.vehicle.pricePerDay;
  }

  reserveVehicle() {
    console.log('ReserveComponent - Reserving vehicle...', {
      vehicleId: this.vehicle.id,
      startDate: this.selectedStartDate,
      endDate: this.selectedEndDate,
      totalPrice: this.calculateTotalPrice(),
      rentedDates: this.rentedDates
    });
  }
}
