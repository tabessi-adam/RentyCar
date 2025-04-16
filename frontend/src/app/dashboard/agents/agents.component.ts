import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent {
  isSidebarExpanded = true;

  onSidebarExpandedChange(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }
}
