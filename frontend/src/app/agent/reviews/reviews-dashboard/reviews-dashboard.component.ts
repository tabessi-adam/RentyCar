import { Component } from '@angular/core';
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-reviews-dashboard',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './reviews-dashboard.component.html',
  styleUrls: ['./reviews-dashboard.component.scss']
})
export class ReviewsDashboardComponent {
}
