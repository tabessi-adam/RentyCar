import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Vehicle } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-view-vehicle',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './view-vehicle.component.html',
  styleUrls: ['./view-vehicle.component.scss']
})
export class ViewVehicleComponent {
  vehicle: Vehicle;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { vehicle: Vehicle }) {
    this.vehicle = data.vehicle;
  }
}
