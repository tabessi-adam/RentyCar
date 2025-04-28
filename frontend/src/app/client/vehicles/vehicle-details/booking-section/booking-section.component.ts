import { Component, Input } from '@angular/core';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { AvailabilityCalendarComponent } from './availability-calendar/availability-calendar.component';

@Component({
  selector: 'app-booking-section',
  standalone: true,
  imports: [BookingFormComponent, AvailabilityCalendarComponent],
  templateUrl: './booking-section.component.html',
  styleUrl: './booking-section.component.scss'
})
export class BookingSectionComponent {
  @Input() vehicleId: string = '';
}
