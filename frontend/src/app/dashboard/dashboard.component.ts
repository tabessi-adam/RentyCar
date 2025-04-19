import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  isSidebarExpanded = true;

  constructor(private cdr: ChangeDetectorRef) {}

  onSidebarExpandedChange(expanded: boolean) {
    this.isSidebarExpanded = expanded;
    this.cdr.detectChanges();
  }
}
