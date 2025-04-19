import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClientService } from '../../../core/services/client.service';
import { AgentService } from '../../../core/services/agent.service';
import { OfficeService } from '../../../core/services/office.service';
import { AuthService } from '../../../core/services/auth.service';
import { Client } from '../../../core/models/client.model';
import { Agent } from '../../../core/models/agent.model';
import { Office } from '../../../core/models/office.model';
import { Role } from '../../../core/models/role.enum';
import { CreateAgentPayload } from '../../../core/models/agent.model';
import { RegisterDto } from '../../../core/models/auth.model';

type User = Client | Agent;

@Component({
  selector: 'app-edit-user',
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
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {
  user: User;
  isLoading = false;
  roles = [Role.CLIENT, Role.AGENT];
  offices: Office[] = [];
  Role = Role;
  originalRole: Role;

  constructor(
    private clientService: ClientService,
    private agentService: AgentService,
    private officeService: OfficeService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) {
    this.user = { ...data.user };
    this.originalRole = this.user.role as Role;
    this.loadOffices();
  }

  loadOffices() {
    this.officeService.getAllOffices().subscribe({
      next: (offices) => {
        this.offices = offices;
        // If changing to agent and no office selected, select the first office
        if (this.user.role === Role.AGENT && !this.officeId && this.offices.length > 0) {
          this.officeId = this.offices[0].id;
        }
      },
      error: (error) => {
        console.error('Error loading offices:', error);
        this.snackBar.open('Error loading offices', 'Close', { duration: 3000 });
      }
    });
  }

  get officeId(): string {
    return (this.user as Agent).officeId || '';
  }

  set officeId(value: string) {
    if (this.user.role === Role.AGENT) {
      (this.user as Agent).officeId = value;
    }
  }

  onSubmit() {
    if (!this.user.name || !this.user.email) {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
      return;
    }

    if (this.user.role === Role.AGENT && !this.officeId) {
      this.snackBar.open('Office is required for agents', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges(); // Force change detection

    // If role changed from client to agent
    if (this.originalRole === Role.CLIENT && this.user.role === Role.AGENT) {
      const agentData: CreateAgentPayload = {
        name: this.user.name,
        email: this.user.email,
        password: 'defaultPassword123',
        phoneNumber: this.user.phoneNumber || undefined,
        officeId: this.officeId
      };

      // First check if we can create the agent
      this.agentService.createAgent(agentData).subscribe({
        next: (agent) => {
          // If agent creation succeeds, then delete the client
          this.clientService.deleteClient(this.user.id).subscribe({
            next: () => {
              this.isLoading = false;
              this.cdr.detectChanges();
              this.snackBar.open('User converted to agent successfully', 'Close', { duration: 3000 });
              this.dialogRef.close(true);
            },
            error: (error: any) => {
              console.error('Error deleting client:', error);
              this.isLoading = false;
              this.cdr.detectChanges();
              const errorMessage = error.error?.message || 'Error deleting client';
              this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
            }
          });
        },
        error: (error: any) => {
          console.error('Error converting to agent:', error);
          this.isLoading = false;
          this.cdr.detectChanges();
          const errorMessage = error.error?.message || 'Error converting to agent';
          this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
        }
      });
    }
    // If role changed from agent to client
    else if (this.originalRole === Role.AGENT && this.user.role === Role.CLIENT) {
      const clientData: RegisterDto = {
        name: this.user.name,
        email: this.user.email,
        password: 'defaultPassword123', // We'll need to handle password reset
        phoneNumber: this.user.phoneNumber || undefined,
        role: Role.CLIENT
      };

      // First delete the agent
      this.agentService.deleteAgent(this.user.id).subscribe({
        next: () => {
          // Then create the client
          this.authService.register(clientData).subscribe({
            next: () => {
              this.snackBar.open('User converted to client successfully', 'Close', { duration: 3000 });
              this.dialogRef.close(true);
            },
            error: (error: any) => {
              console.error('Error converting to client:', error);
              this.snackBar.open('Error converting to client', 'Close', { duration: 3000 });
              this.isLoading = false;
            }
          });
        },
        error: (error: any) => {
          console.error('Error deleting agent:', error);
          this.snackBar.open('Error converting to client', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
    // If role didn't change
    else if (this.user.role === Role.CLIENT) {
      this.clientService.updateClient(this.user.id, this.user).subscribe({
        next: () => {
          this.snackBar.open('Client updated successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error: any) => {
          console.error('Error updating client:', error);
          this.snackBar.open('Error updating client', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    } else if (this.user.role === Role.AGENT) {
      const agentData = {
        name: this.user.name,
        email: this.user.email,
        phoneNumber: this.user.phoneNumber || undefined,
        officeId: this.officeId
      };
      
      this.agentService.updateAgent(this.user.id, agentData).subscribe({
        next: () => {
          this.snackBar.open('Agent updated successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error: any) => {
          console.error('Error updating agent:', error);
          this.snackBar.open('Error updating agent', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
