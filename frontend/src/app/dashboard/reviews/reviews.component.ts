import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ReviewsListComponent } from './reviews-list/reviews-list.component';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [
    CommonModule, 
    SidebarComponent,
    ReviewsListComponent
  ],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements AfterViewInit {
  @ViewChild(ReviewsListComponent) reviewsList!: ReviewsListComponent;
  isSidebarExpanded = true;

  constructor(private cdr: ChangeDetectorRef) {}

  onSidebarExpandedChange(expanded: boolean) {
    this.isSidebarExpanded = expanded;
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    // Ensure the reviews list is loaded initially
    if (this.reviewsList) {
      this.reviewsList.loadReviews();
    }
    this.cdr.detectChanges();
  }
}
