import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CalendarComponent } from '../calendar/calendar.component';
import { Vehicle } from '../../../../core/models/vehicle.model';

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
export class ReserveComponent {
  @Input() vehicle!: Vehicle;
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;

  onDateRangeChange(event: { start: Date | null, end: Date | null }) {
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
    // TODO: Implement reservation logic
    console.log('Reserving vehicle...', {
      vehicleId: this.vehicle.id,
      startDate: this.selectedStartDate,
      endDate: this.selectedEndDate,
      totalPrice: this.calculateTotalPrice()
    });
  }
}
