import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OfficeService } from '../../../core/services/office.service';
import { Office } from '../../../core/models/office.model';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ViewOfficesComponent } from '../view-offices/view-offices.component';
import { EditOfficeComponent } from '../edit-office/edit-office.component';
import { DeleteOfficeComponent } from '../delete-office/delete-office.component';

@Component({
  selector: 'app-offices-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RouterModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    ViewOfficesComponent,
    EditOfficeComponent,
    DeleteOfficeComponent
  ],
  templateUrl: './offices-list.component.html',
  styleUrl: './offices-list.component.scss'
})
export class OfficesListComponent implements OnInit {
  @ViewChild(ViewOfficesComponent) viewOfficeComponent!: ViewOfficesComponent;
  displayedColumns: string[] = ['id', 'name', 'address', 'phoneNumber', 'createdAt', 'actions'];
  offices: Office[] = [];
  isLoading = true;
  selectedOffice: Office | null = null;

  constructor(
    private officeService: OfficeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadOffices();
  }

  loadOffices(): void {
    this.isLoading = true;
    this.officeService.getAllOffices().subscribe({
      next: (offices) => {
        this.offices = offices;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading offices:', error);
        this.snackBar.open('Error loading offices', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onView(office: Office): void {
    this.viewOfficeComponent.open(office);
  }

  onEdit(office: Office): void {
    const dialogRef = this.dialog.open(EditOfficeComponent, {
      width: '500px',
      data: { office }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadOffices();
      }
    });
  }

  onDelete(office: Office): void {
    const dialogRef = this.dialog.open(DeleteOfficeComponent, {
      width: '500px',
      maxWidth: '90vw',
      panelClass: 'delete-dialog-container',
      data: { office }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadOffices();
      }
    });
  }
}
