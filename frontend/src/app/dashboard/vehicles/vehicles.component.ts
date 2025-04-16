import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { VehiclesListComponent } from './vehicles-list/vehicles-list.component';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { VehicleService } from '../../core/services/vehicle.service';
import { CreateVehiclePayload, Vehicle } from '../../core/models/vehicle.model';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [
    CommonModule, 
    SidebarComponent, 
    VehiclesListComponent,
    AddVehicleComponent
  ],
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent {
  @ViewChild(AddVehicleComponent) addVehicleComponent!: AddVehicleComponent;
  @ViewChild(VehiclesListComponent) vehiclesListComponent!: VehiclesListComponent;
  isSidebarExpanded = true;

  constructor(private vehicleService: VehicleService) {}

  onSidebarExpandedChange(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  openAddVehicleModal() {
    this.addVehicleComponent.open();
  }

  onVehicleAdded(vehicleData: CreateVehiclePayload) {
    this.vehicleService.createVehicle(vehicleData).subscribe({
      next: (createdVehicle) => {
        console.log('Vehicle created successfully:', createdVehicle);
        // Refresh the vehicles list
        this.vehiclesListComponent.loadVehicles();
      },
      error: (error) => {
        console.error('Error creating vehicle:', error);
        // Handle error appropriately (show error message to user)
      }
    });
  }
}
