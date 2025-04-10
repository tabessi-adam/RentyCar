import { Component } from '@angular/core';
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-reservations-dashboard',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './reservations-dashboard.component.html',
  styleUrls: ['./reservations-dashboard.component.scss']
})
export class ReservationsDashboardComponent {
}
