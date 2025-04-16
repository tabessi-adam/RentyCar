import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent {
  isSidebarExpanded = true;

  onSidebarExpandedChange(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }
}
