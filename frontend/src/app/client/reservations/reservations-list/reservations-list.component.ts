import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../../core/services/reservation.service';
import { Reservation } from '../../../core/models/reservation.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { DatePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes, faCalendarAlt, faClock, faMoneyBillWave, faCalendarDay } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-reservations-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, DatePipe, FontAwesomeModule],
  templateUrl: './reservations-list.component.html',
  styleUrl: './reservations-list.component.scss'
})
export class ReservationsListComponent implements OnInit {
  reservations: Reservation[] = [];
  displayedColumns: string[] = ['vehicle', 'startDate', 'endDate', 'totalDays', 'totalPrice', 'status', 'actions'];

  // Font Awesome icons
  faTimes = faTimes;
  faCalendarAlt = faCalendarAlt;
  faClock = faClock;
  faMoneyBillWave = faMoneyBillWave;
  faCalendarDay = faCalendarDay;

  constructor(private reservationService: ReservationService) {}

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.reservationService.getMyReservations().subscribe({
      next: (reservations) => {
        this.reservations = reservations;
      },
      error: (error) => {
        console.error('Error loading reservations:', error);
      }
    });
  }

  cancelReservation(id: string) {
    this.reservationService.deleteReservation(id).subscribe({
      next: () => {
        this.loadReservations(); // Reload the list after cancellation
      },
      error: (error) => {
        console.error('Error cancelling reservation:', error);
      }
    });
  }
}
