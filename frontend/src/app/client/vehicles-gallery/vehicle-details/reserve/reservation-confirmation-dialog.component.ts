import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-reservation-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule
  ],
  templateUrl: './reservation-confirmation-dialog.component.html',
  styleUrls: ['./reservation-confirmation-dialog.component.scss']
})
export class ReservationConfirmationDialogComponent {
  acceptedTerms = false;

  constructor(
    public dialogRef: MatDialogRef<ReservationConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }
} 