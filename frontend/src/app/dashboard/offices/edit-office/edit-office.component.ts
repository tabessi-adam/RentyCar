import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Office } from '../../../core/models/office.model';
import { OfficeService } from '../../../core/services/office.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-office',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './edit-office.component.html',
  styleUrl: './edit-office.component.scss'
})
export class EditOfficeComponent {
  officeForm: FormGroup;
  office: Office;

  constructor(
    private fb: FormBuilder,
    private officeService: OfficeService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EditOfficeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { office: Office }
  ) {
    this.office = data.office;
    this.officeForm = this.fb.group({
      name: [this.office.name, [Validators.required]],
      address: [this.office.address, [Validators.required]],
      phoneNumber: [this.office.phoneNumber, [Validators.required, Validators.pattern('^[0-9-]+$')]]
    });
  }

  onSubmit(): void {
    if (this.officeForm.valid) {
      this.officeService.updateOffice(this.office.id, this.officeForm.value).subscribe({
        next: (updatedOffice) => {
          this.snackBar.open('Office updated successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(updatedOffice);
        },
        error: (error) => {
          console.error('Error updating office:', error);
          this.snackBar.open('Error updating office', 'Close', { duration: 3000 });
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
