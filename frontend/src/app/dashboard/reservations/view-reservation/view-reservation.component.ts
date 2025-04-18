import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Reservation } from '../../../core/models/reservation.model';

@Component({
  selector: 'app-view-reservation',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './view-reservation.component.html',
  styleUrl: './view-reservation.component.scss'
})
export class ViewReservationComponent {
  constructor(
    public dialogRef: MatDialogRef<ViewReservationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { reservation: Reservation }
  ) {}

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }
} 