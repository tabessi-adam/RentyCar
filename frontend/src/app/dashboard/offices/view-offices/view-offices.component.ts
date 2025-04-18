import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Office } from '../../../core/models/office.model';

@Component({
  selector: 'app-view-offices',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './view-offices.component.html',
  styleUrls: ['./view-offices.component.scss']
})
export class ViewOfficesComponent {
  office: Office;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { office: Office }) {
    this.office = data.office;
  }
}
