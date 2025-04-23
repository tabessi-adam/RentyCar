import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { ReservationService } from '../../../core/services/reservation.service';
import { Reservation, ReservationStatus } from '../../../core/models/reservation.model';
import { ViewReservationComponent } from '../view-reservation/view-reservation.component';
import { UpdateReservationStatusComponent } from '../update-reservation-status/update-reservation-status.component';

@Component({
  selector: 'app-reservations-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RouterModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './reservations-list.component.html',
  styleUrl: './reservations-list.component.scss'
})
export class ReservationsListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'client',
    'vehicle',
    'startDate',
    'endDate',
    'totalDays',
    'totalPrice',
    'damageDeposit',
    'status',
    'actions'
  ];
  reservations: Reservation[] = [];
  isLoading = true;

  constructor(
    private reservationService: ReservationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  onView(reservation: Reservation): void {
    this.dialog.open(ViewReservationComponent, {
      width: '500px',
      data: { reservation }
    });
  }

  onUpdateStatus(reservation: Reservation): void {
    const dialogRef = this.dialog.open(UpdateReservationStatusComponent, {
      width: '500px',
      data: { reservation }
    });

    dialogRef.afterClosed().subscribe((result: Reservation) => {
      if (result) {
        this.loadReservations();
      }
    });
  }

  loadReservations(): void {
    this.isLoading = true;
    this.reservationService.getAllReservations().subscribe({
      next: (reservations) => {
        this.reservations = reservations.filter(reservation => 
          reservation.status !== 'CANCELLED'
        );
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading reservations:', error);
        this.snackBar.open('Error loading reservations', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: ReservationStatus): string {
    return status.toLowerCase();
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}
