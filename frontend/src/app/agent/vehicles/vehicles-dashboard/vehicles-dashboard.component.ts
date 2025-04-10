import { Component } from '@angular/core';
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-vehicles-dashboard',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './vehicles-dashboard.component.html',
  styleUrls: ['./vehicles-dashboard.component.scss']
})
export class VehiclesDashboardComponent {
}
