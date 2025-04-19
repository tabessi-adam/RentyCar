import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../core/models/client.model';
import { ViewClientComponent } from '../view-client/view-client.component';
import { EditClientComponent } from '../edit-client/edit-client.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss']
})
export class ClientsListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'phoneNumber', 'role', 'createdAt', 'actions'];
  clients: Client[] = [];
  isLoading = true;

  constructor(
    private clientService: ClientService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.snackBar.open('Error loading clients', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onView(client: Client): void {
    this.dialog.open(ViewClientComponent, {
      width: '500px',
      data: { client }
    });
  }

  onEdit(client: Client): void {
    const dialogRef = this.dialog.open(EditClientComponent, {
      width: '500px',
      data: { client }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClients();
        this.snackBar.open('Client updated successfully', 'Close', { duration: 3000 });
      }
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}
