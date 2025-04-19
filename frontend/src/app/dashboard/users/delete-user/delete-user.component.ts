import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../../core/models/client.model';
import { Agent } from '../../../core/models/agent.model';
import { ClientService } from '../../../core/services/client.service';
import { AgentService } from '../../../core/services/agent.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Role } from '../../../core/models/role.enum';

type User = Client | Agent;

@Component({
  selector: 'app-delete-user',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './delete-user.component.html',
  styleUrl: './delete-user.component.scss'
})
export class DeleteUserComponent {
  constructor(
    private clientService: ClientService,
    private agentService: AgentService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DeleteUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) {}

  onDelete(): void {
    if (this.data.user.role === Role.CLIENT) {
      this.clientService.deleteClient(this.data.user.id).subscribe({
        next: () => {
          this.snackBar.open('Client deleted successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error deleting client:', error);
          this.snackBar.open('Error deleting client', 'Close', { duration: 3000 });
        }
      });
    } else if (this.data.user.role === Role.AGENT) {
      this.agentService.deleteAgent(this.data.user.id).subscribe({
        next: () => {
          this.snackBar.open('Agent deleted successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error deleting agent:', error);
          this.snackBar.open('Error deleting agent', 'Close', { duration: 3000 });
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
