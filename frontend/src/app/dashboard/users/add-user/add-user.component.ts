import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { AgentService } from '../../../core/services/agent.service';
import { OfficeService } from '../../../core/services/office.service';
import { Office } from '../../../core/models/office.model';
import { Role } from '../../../core/models/role.enum';
import { RegisterDto } from '../../../core/models/auth.model';
import { CreateAgentPayload } from '../../../core/models/agent.model';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
  user = {
    name: '',
    email: '',
    phoneNumber: '',
    role: '',
    officeId: '',
    password: ''
  };
  
  offices: Office[] = [];
  roles = [Role.CLIENT, Role.AGENT];
  isLoading = false;
  emailExists = false;
  Role = Role;

  constructor(
    private authService: AuthService,
    private agentService: AgentService,
    private officeService: OfficeService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddUserComponent>
  ) {
    this.loadOffices();
  }

  loadOffices() {
    this.officeService.getAllOffices().subscribe(offices => {
      this.offices = offices;
    });
  }

  checkEmailExists(email: string): void {
    if (!email || !this.isValidEmail(email)) {
      this.emailExists = false;
      return;
    }
    this.isLoading = true;
    this.authService.checkEmailExists(email).subscribe({
      next: (exists) => {
        this.emailExists = exists;
        if (exists) {
          this.snackBar.open('This email is already registered', 'Close', { duration: 3000 });
        }
      },
      error: () => {
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  onSubmit() {
    if (!this.isFormValid()) {
      return;
    }

    if (!this.isValidEmail(this.user.email)) {
      this.snackBar.open('Please enter a valid email address', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    this.authService.checkEmailExists(this.user.email).subscribe({
      next: (exists) => {
        if (exists) {
          this.emailExists = true;
          this.snackBar.open('This email is already registered', 'Close', { duration: 3000 });
          this.isLoading = false;
          return;
        }

        if (this.user.role === Role.CLIENT) {
          const registerDto: RegisterDto = {
            name: this.user.name,
            email: this.user.email,
            password: this.user.password,
            phoneNumber: this.user.phoneNumber || undefined,
            role: Role.CLIENT
          };

          this.authService.register(registerDto).subscribe({
            next: () => {
              this.snackBar.open('Client created successfully', 'Close', { duration: 3000 });
              this.dialogRef.close(true);
            },
            error: (error) => {
              console.error('Error creating client:', error);
              this.snackBar.open('Error creating client', 'Close', { duration: 3000 });
              this.isLoading = false;
            }
          });
        } else if (this.user.role === Role.AGENT) {
          const agentPayload: CreateAgentPayload = {
            name: this.user.name,
            email: this.user.email,
            password: this.user.password,
            phoneNumber: this.user.phoneNumber || undefined,
            officeId: this.user.officeId
          };

          this.agentService.createAgent(agentPayload).subscribe({
            next: () => {
              this.snackBar.open('Agent created successfully', 'Close', { duration: 3000 });
              this.dialogRef.close(true);
            },
            error: (error) => {
              console.error('Error creating agent:', error);
              this.snackBar.open('Error creating agent', 'Close', { duration: 3000 });
              this.isLoading = false;
            }
          });
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  isFormValid(): boolean {
    return !!(
      this.user.name &&
      this.user.email &&
      this.user.role &&
      this.user.password &&
      (this.user.role !== Role.AGENT || this.user.officeId) &&
      !this.emailExists
    );
  }

  onCancel() {
    this.dialogRef.close();
  }
}
