import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Office } from '../../../core/models/office.model';
import { OfficeService } from '../../../core/services/office.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-office',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './delete-office.component.html',
  styleUrl: './delete-office.component.scss'
})
export class DeleteOfficeComponent {
  constructor(
    private officeService: OfficeService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DeleteOfficeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { office: Office }
  ) {}

  onDelete(): void {
    this.officeService.deleteOffice(this.data.office.id).subscribe({
      next: () => {
        this.snackBar.open('Office deleted successfully', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error deleting office:', error);
        this.snackBar.open('Error deleting office', 'Close', { duration: 3000 });
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
