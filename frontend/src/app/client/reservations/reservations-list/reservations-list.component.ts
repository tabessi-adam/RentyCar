import { Component, OnInit, Inject } from '@angular/core';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reservations-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    DatePipe,
    FontAwesomeModule,
    MatTooltipModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './reservations-list.component.html',
  styleUrl: './reservations-list.component.scss'
})
export class ReservationsListComponent implements OnInit {
  reservations: Reservation[] = [];
  displayedColumns: string[] = ['vehicle', 'startDate', 'endDate', 'totalDays', 'totalPrice', 'damageDeposit', 'status', 'actions'];

  // Font Awesome icons
  faTimes = faTimes;
  faCalendarAlt = faCalendarAlt;
  faClock = faClock;
  faMoneyBillWave = faMoneyBillWave;
  faCalendarDay = faCalendarDay;

  constructor(
    private reservationService: ReservationService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadReservations();
  }

  getStatusTranslation(status: string): string {
    const statusKey = `RESERVATIONS_LIST.STATUS.${status}`;
    const translation = this.translate.instant(statusKey);
    return translation === statusKey ? status : translation;
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

  confirmCancel(reservationId: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Cancel Reservation',
        message: 'Are you sure you want to cancel this reservation? This action cannot be undone.',
        confirmText: 'Yes, Cancel',
        cancelText: 'No, Keep It'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cancelReservation(reservationId);
      }
    });
  }

  cancelReservation(reservationId: string) {
    this.reservationService.deleteReservation(reservationId).subscribe({
      next: () => {
        this.loadReservations(); // Reload the list after cancellation
      },
      error: (error) => {
        console.error('Error cancelling reservation:', error);
      }
    });
  }
}

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">{{ data.cancelText }}</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">{{ data.confirmText }}</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule]
})
export class ConfirmationDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}
}
