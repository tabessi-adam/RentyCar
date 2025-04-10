import { Component } from '@angular/core';
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-agents-dashboard',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './agents-dashboard.component.html',
  styleUrls: ['./agents-dashboard.component.scss']
})
export class AgentsDashboardComponent {

}
