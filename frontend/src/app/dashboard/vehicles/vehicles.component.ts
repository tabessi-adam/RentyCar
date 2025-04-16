import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { VehiclesListComponent } from './vehicles-list/vehicles-list.component';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';

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
  isSidebarExpanded = true;

  onSidebarExpandedChange(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  openAddVehicleModal() {
    this.addVehicleComponent.open();
  }

  onVehicleAdded(vehicle: any) {
    // Here you can handle the newly added vehicle
    // For example, refresh the vehicles list or add the vehicle to the list
    console.log('New vehicle added:', vehicle);
  }
}
