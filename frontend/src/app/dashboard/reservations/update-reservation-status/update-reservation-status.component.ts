import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReservationService } from '../../../core/services/reservation.service';
import { Reservation, ReservationStatus } from '../../../core/models/reservation.model';

@Component({
  selector: 'app-update-reservation-status',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './update-reservation-status.component.html',
  styleUrl: './update-reservation-status.component.scss'
})
export class UpdateReservationStatusComponent {
  reservation: Reservation;
  newStatus: ReservationStatus;
  isLoading = false;
  readonly statusOptions = Object.values(ReservationStatus);

  constructor(
    private reservationService: ReservationService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UpdateReservationStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { reservation: Reservation }
  ) {
    this.reservation = { ...data.reservation };
    this.newStatus = this.reservation.status;
  }

  onSubmit() {
    this.isLoading = true;
    this.reservationService.updateReservationStatus(this.reservation.id, this.newStatus).subscribe({
      next: (updatedReservation) => {
        this.snackBar.open('Reservation status updated successfully', 'Close', { duration: 3000 });
        this.dialogRef.close(updatedReservation);
      },
      error: (error) => {
        console.error('Error updating reservation status:', error);
        this.snackBar.open('Error updating reservation status', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
} 