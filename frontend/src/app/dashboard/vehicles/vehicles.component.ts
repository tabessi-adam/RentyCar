import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { VehiclesListComponent } from './vehicles-list/vehicles-list.component';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, SidebarComponent, VehiclesListComponent],
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent {
  isSidebarExpanded = true;

  onSidebarExpandedChange(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }
}
