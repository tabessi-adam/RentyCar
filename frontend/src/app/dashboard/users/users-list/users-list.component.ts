import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../core/services/client.service';
import { AgentService } from '../../../core/services/agent.service';
import { Client } from '../../../core/models/client.model';
import { Agent } from '../../../core/models/agent.model';
import { Role } from '../../../core/models/role.enum';
import { ViewUserComponent } from '../view-user/view-user.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { AuthService } from '../../../core/services/auth.service';

type User = Client | Agent;

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    FormsModule
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnInit {
  clients: Client[] = [];
  agents: Agent[] = [];
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedRole: Role | '' = '';
  isLoading = true;
  Role = Role; // Make Role enum available in template
  isAdmin = false;
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'role',
    'phoneNumber',
    'actions'
  ];

  constructor(
    private clientService: ClientService,
    private agentService: AgentService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.hasRole(Role.ADMIN);
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    if (this.isAdmin) {
      // Admin can see both clients and agents
      Promise.all([
        this.loadClients(),
        this.loadAgents()
      ]).finally(() => {
        this.isLoading = false;
        this.filterUsers();
      });
    } else {
      // Agent can only see clients
      this.loadClients().add(() => {
        this.isLoading = false;
        this.filterUsers();
      });
    }
  }

  loadClients() {
    return this.clientService.getAllClients().subscribe({
      next: (clients: Client[]) => {
        this.clients = clients;
        this.updateUsers();
      },
      error: (error: any) => {
        console.error('Error loading clients:', error);
        this.snackBar.open('Error loading clients', 'Close', { duration: 3000 });
      }
    });
  }

  loadAgents() {
    return this.agentService.getAllAgents().subscribe({
      next: (agents: Agent[]) => {
        this.agents = agents;
        this.updateUsers();
      },
      error: (error: any) => {
        console.error('Error loading agents:', error);
        this.snackBar.open('Error loading agents', 'Close', { duration: 3000 });
      }
    });
  }

  private updateUsers() {
    if (this.isAdmin) {
      this.users = [...this.clients, ...this.agents];
    } else {
      this.users = [...this.clients];
    }
    this.filterUsers();
  }

  filterUsers() {
    if (!this.selectedRole) {
      this.filteredUsers = [...this.users];
    } else {
      this.filteredUsers = this.users.filter(user => user.role === this.selectedRole);
    }
  }

  getRoleClass(role: string): string {
    return role.toLowerCase();
  }

  onView(user: User) {
    this.dialog.open(ViewUserComponent, {
      width: '500px',
      data: { user }
    });
  }

  onEdit(user: User) {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '600px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  onDelete(user: User) {
    const dialogRef = this.dialog.open(DeleteUserComponent, {
      width: '500px',
      data: { user },
      panelClass: 'delete-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
