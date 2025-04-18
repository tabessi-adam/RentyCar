import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OfficeService } from '../../../core/services/office.service';

@Component({
  selector: 'app-add-office',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './add-office.component.html',
  styleUrl: './add-office.component.scss'
})
export class AddOfficeComponent {
  officeForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private officeService: OfficeService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddOfficeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.officeForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9-]+$')]]
    });
  }

  onSubmit(): void {
    if (this.officeForm.valid) {
      this.isLoading = true;
      this.officeService.createOffice(this.officeForm.value).subscribe({
        next: (newOffice) => {
          this.snackBar.open('Office created successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(newOffice);
        },
        error: (error) => {
          console.error('Error creating office:', error);
          this.snackBar.open('Error creating office', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
