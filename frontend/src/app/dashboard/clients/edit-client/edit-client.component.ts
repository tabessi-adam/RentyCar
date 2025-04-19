import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../core/models/client.model';
import { Role } from '../../../core/models/role.enum';

@Component({
  selector: 'app-edit-client',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.scss']
})
export class EditClientComponent implements OnInit {
  editForm: FormGroup;
  isLoading = false;
  readonly roleOptions = Object.values(Role);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditClientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { client: Client },
    private clientService: ClientService
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      role: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.editForm.patchValue({
      name: this.data.client.name,
      email: this.data.client.email,
      phoneNumber: this.data.client.phoneNumber,
      role: this.data.client.role
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      this.isLoading = true;
      this.clientService.updateClient(this.data.client.id, this.editForm.value).subscribe({
        next: (updatedClient) => {
          this.isLoading = false;
          this.dialogRef.close(updatedClient);
        },
        error: (error) => {
          console.error('Error updating client:', error);
          this.isLoading = false;
        }
      });
    }
  }
} 