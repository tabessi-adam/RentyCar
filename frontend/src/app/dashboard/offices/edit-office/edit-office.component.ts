import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Office } from '../../../core/models/office.model';
import { OfficeService } from '../../../core/services/office.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-office',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './edit-office.component.html',
  styleUrl: './edit-office.component.scss'
})
export class EditOfficeComponent {
  office: Office;
  isLoading = false;

  constructor(
    private officeService: OfficeService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EditOfficeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { office: Office }
  ) {
    this.office = { ...data.office };
  }

  onSubmit(): void {
    this.isLoading = true;
    this.officeService.updateOffice(this.office.id, this.office).subscribe({
      next: (updatedOffice) => {
        this.snackBar.open('Office updated successfully', 'Close', { duration: 3000 });
        this.dialogRef.close(updatedOffice);
      },
      error: (error) => {
        console.error('Error updating office:', error);
        this.snackBar.open('Error updating office', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
