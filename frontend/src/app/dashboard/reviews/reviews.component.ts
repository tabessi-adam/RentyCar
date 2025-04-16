import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent {
  isSidebarExpanded = true;

  onSidebarExpandedChange(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }
}
