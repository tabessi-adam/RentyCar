import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../../../../core/services/reservation.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

interface AvailabilityPeriod {
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-availability-calendar',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './availability-calendar.component.html',
  styleUrl: './availability-calendar.component.scss'
})
export class AvailabilityCalendarComponent implements OnInit {
  @Input() vehicleId: string = '';
  availabilityPeriods: AvailabilityPeriod[] = [];
  isLoading = true;
  error: string | null = null;
  currentDate = new Date();
  currentMonth = this.currentDate.getMonth();
  currentYear = this.currentDate.getFullYear();

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    if (this.vehicleId) {
      this.loadAvailability();
    }
  }

  loadAvailability(): void {
    this.isLoading = true;
    this.error = null;

    this.reservationService.getVehicleAvailability(this.vehicleId).subscribe({
      next: (periods) => {
        this.availabilityPeriods = periods;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading availability:', error);
        this.error = 'Failed to load availability data';
        this.isLoading = false;
      }
    });
  }

  isDateReserved(date: Date): boolean {
    return this.availabilityPeriods.some(period => {
      const startDate = new Date(period.startDate);
      const endDate = new Date(period.endDate);
      return date >= startDate && date <= endDate;
    });
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  getDaysInMonth(year: number, month: number): Date[] {
    const days: Date[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Add days from previous month to start from Sunday
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    // Add days from next month to complete the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  }

  getMonthName(month: number): string {
    return new Date(2000, month, 1).toLocaleString('default', { month: 'long' });
  }

  getWeekDays(): string[] {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }

  previousMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
  }
}
