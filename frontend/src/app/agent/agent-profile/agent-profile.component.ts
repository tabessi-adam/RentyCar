import { Component } from '@angular/core';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-agent-profile',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './agent-profile.component.html',
  styleUrls: ['./agent-profile.component.scss']
})
export class AgentProfileComponent {
}
