import { Component, ViewChild } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { VehiclesListComponent } from './vehicles-list/vehicles-list.component';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { Vehicle } from '../../core/models/vehicle.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [
    SidebarComponent, 
    VehiclesListComponent, 
    AddVehicleComponent,
    MatDialogModule
  ],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss'
})
export class VehiclesComponent {
  @ViewChild(VehiclesListComponent) vehiclesList!: VehiclesListComponent;
  isSidebarExpanded = true;

  constructor(private dialog: MatDialog) {}

  onSidebarExpandedChange(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  openAddVehicleModal() {
    const dialogRef = this.dialog.open(AddVehicleComponent, {
      width: '100%',
      maxWidth: '600px',
      height: 'auto',
      maxHeight: '100vh',
      disableClose: false,
      autoFocus: false,
      panelClass: 'responsive-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onVehicleAdded(result);
      }
    });
  }

  onVehicleAdded(vehicle: Vehicle) {
    if (this.vehiclesList) {
      this.vehiclesList.loadVehicles();
    }
  }
}
