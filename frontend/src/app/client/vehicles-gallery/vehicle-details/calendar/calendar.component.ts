import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';

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
  @Output() dateRangeChange = new EventEmitter<{ start: Date | null, end: Date | null }>();

  selectedMonth: Date = new Date();
  minDate: Date = new Date();

  onDateChange(date: Date | null) {
    if (!date) return;

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
    if (this.isStartDate(date) || this.isEndDate(date)) {
      return 'selected-date';
    }
    if (this.isInRange(date)) {
      return 'in-range';
    }
    return '';
  };
}
