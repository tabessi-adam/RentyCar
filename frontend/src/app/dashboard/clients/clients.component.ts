import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent {
  isSidebarExpanded = true;

  onSidebarExpandedChange(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }
} 