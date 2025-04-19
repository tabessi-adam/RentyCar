import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Client } from '../../../core/models/client.model';

@Component({
  selector: 'app-view-client',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './view-client.component.html',
  styleUrl: './view-client.component.scss'
})
export class ViewClientComponent {
  client: Client;

  constructor(
    public dialogRef: MatDialogRef<ViewClientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { client: Client }
  ) {
    this.client = data.client;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}
