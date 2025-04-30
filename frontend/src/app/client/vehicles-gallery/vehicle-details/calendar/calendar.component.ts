import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';

interface DateRange {
  start: Date;
  end: Date;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatCalendar
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  @Input() selectedStartDate: Date | null = null;
  @Input() selectedEndDate: Date | null = null;
  @Input() rentedDates: DateRange[] = [];
  @Output() dateRangeChange = new EventEmitter<{ start: Date | null, end: Date | null }>();

  selectedMonth: Date = new Date();
  minDate: Date = new Date();

  constructor() {
    console.log('CalendarComponent - Constructor called');
  }

  ngOnChanges() {
    console.log('CalendarComponent - Inputs changed:', {
      selectedStartDate: this.selectedStartDate?.toISOString(),
      selectedEndDate: this.selectedEndDate?.toISOString(),
      rentedDates: this.rentedDates.map(d => ({
        start: d.start.toISOString(),
        end: d.end.toISOString()
      }))
    });
  }

  isDateRented(date: Date): boolean {
    const isRented = this.rentedDates.some(range => {
      const start = new Date(range.start);
      const end = new Date(range.end);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      const result = checkDate >= start && checkDate <= end;
      if (result) {
        console.log('CalendarComponent - Date is rented:', {
          date: checkDate.toISOString(),
          range: {
            start: start.toISOString(),
            end: end.toISOString()
          }
        });
      }
      return result;
    });
    return isRented;
  }

  onDateChange(date: Date | null) {
    if (!date) return;

    // Don't allow selection of rented dates
    if (this.isDateRented(date)) {
      return;
    }

    if (!this.selectedStartDate || (this.selectedStartDate && this.selectedEndDate)) {
      // Start new selection
      this.selectedStartDate = new Date(date);
      this.selectedEndDate = null;
    } else {
      // Complete the selection
      if (date < this.selectedStartDate) {
        this.selectedEndDate = new Date(this.selectedStartDate);
        this.selectedStartDate = new Date(date);
      } else {
        this.selectedEndDate = new Date(date);
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

  isInRange(date: Date): boolean {
    if (!this.selectedStartDate || !this.selectedEndDate) return false;
    return date >= this.selectedStartDate && date <= this.selectedEndDate;
  }

  isStartDate(date: Date): boolean {
    if (!this.selectedStartDate) return false;
    return date.getTime() === this.selectedStartDate.getTime();
  }

  isEndDate(date: Date): boolean {
    if (!this.selectedEndDate) return false;
    return date.getTime() === this.selectedEndDate.getTime();
  }

  dateClass = (date: Date): string => {
    const isRented = this.isDateRented(date);
    const isStart = this.isStartDate(date);
    const isEnd = this.isEndDate(date);
    const isInRange = this.isInRange(date);
    
    console.log('CalendarComponent - Date class calculation:', {
      date: date.toISOString(),
      isRented,
      isStart,
      isEnd,
      isInRange
    });

    if (isRented) {
      return 'rented-date';
    }
    if (isStart || isEnd) {
      return 'selected-date';
    }
    if (isInRange) {
      return 'in-range';
    }
    return '';
  };
}
