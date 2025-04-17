import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-office',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './add-office.component.html',
  styleUrl: './add-office.component.scss'
})
export class AddOfficeComponent {
  @Output() officeAdded = new EventEmitter<any>();
  isOpen = false;
  officeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.officeForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9-]+$')]]
    });
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.officeForm.reset();
  }

  onSubmit(): void {
    if (this.officeForm.valid) {
      this.officeAdded.emit(this.officeForm.value);
      this.close();
    }
  }
}
