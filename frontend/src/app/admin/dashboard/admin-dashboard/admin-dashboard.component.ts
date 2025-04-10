import { Component } from '@angular/core';
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
}
