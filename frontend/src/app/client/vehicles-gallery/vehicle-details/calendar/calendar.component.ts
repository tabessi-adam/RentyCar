import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DateRange {
  start: Date;
  end: Date;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  @Input() selectedStartDate: Date | null = null;
  @Input() selectedEndDate: Date | null = null;
  @Input() rentedDates: DateRange[] = [];
  @Output() dateRangeChange = new EventEmitter<{ start: Date | null, end: Date | null }>();

  currentMonth: Date = new Date();
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: (Date | null)[] = [];

  constructor() {
    this.generateCalendarDays();
  }

  ngOnChanges() {
    this.generateCalendarDays();
  }

  generateCalendarDays() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    // Get first day of the month
    const firstDay = new Date(year, month, 1);
    // Get last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of week of the first day (0-6)
    const firstDayOfWeek = firstDay.getDay();
    
    // Calculate total days in the month
    const totalDays = lastDay.getDate();
    
    // Create array for calendar days
    this.calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      this.calendarDays.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= totalDays; i++) {
      this.calendarDays.push(new Date(year, month, i));
    }
  }

  previousMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    );
    this.generateCalendarDays();
  }

  nextMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1
    );
    this.generateCalendarDays();
  }

  isDateRented(date: Date): boolean {
    return this.rentedDates.some(range => {
      const start = new Date(range.start);
      const end = new Date(range.end);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      return checkDate >= start && checkDate <= end;
    });
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  isInRange(date: Date): boolean {
    if (!this.selectedStartDate || !this.selectedEndDate) return false;
    return date >= this.selectedStartDate && date <= this.selectedEndDate;
  }

  isSelected(date: Date): boolean {
    if (!this.selectedStartDate && !this.selectedEndDate) return false;
    
    const isStartDate = this.selectedStartDate ? date.getTime() === this.selectedStartDate.getTime() : false;
    const isEndDate = this.selectedEndDate ? date.getTime() === this.selectedEndDate.getTime() : false;
    
    return isStartDate || isEndDate;
  }

  isPast(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  getDayClass(day: Date | null): string {
    if (!day) return 'empty';
    
    const classes = [];
    if (this.isPast(day)) {
      classes.push('past');
      return classes.join(' '); // Return early for past dates
    }
    if (this.isToday(day)) classes.push('today');
    if (this.isDateRented(day)) classes.push('rented');
    if (this.isSelected(day)) classes.push('selected');
    if (this.isInRange(day)) classes.push('in-range');
    
    return classes.join(' ');
  }

  onDayClick(day: Date | null) {
    if (!day) return;

    // Don't allow selection of past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (day < today) return;

    if (!this.selectedStartDate || (this.selectedStartDate && this.selectedEndDate)) {
      // Start new selection
      if (this.isDateRented(day)) return; // Don't allow starting on a rented date
      this.selectedStartDate = new Date(day);
      this.selectedEndDate = null;
    } else {
      // Complete the selection
      if (day < this.selectedStartDate) {
        this.selectedEndDate = new Date(this.selectedStartDate);
        this.selectedStartDate = new Date(day);
      } else {
        this.selectedEndDate = new Date(day);
      }

      // Check if any dates in the range are rented
      const start = new Date(this.selectedStartDate);
      const end = new Date(this.selectedEndDate);
      let current = new Date(start);
      
      while (current <= end) {
        if (this.isDateRented(current)) {
          // If any date in the range is rented, reset the selection
          this.selectedStartDate = null;
          this.selectedEndDate = null;
          this.dateRangeChange.emit({ start: null, end: null });
          return;
        }
        current.setDate(current.getDate() + 1);
      }
    }
    this.dateRangeChange.emit({
      start: this.selectedStartDate,
      end: this.selectedEndDate
    });
  }
}
