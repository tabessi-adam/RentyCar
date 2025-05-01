import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ReviewsListComponent } from './reviews-list/reviews-list.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faChevronDown, 
  faUsers, 
  faBuilding, 
  faCarSide,
  faCalendarCheck,
  faUser,
  faStar,
  faPlus,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [
    CommonModule, 
    SidebarComponent,
    ReviewsListComponent,
    RouterModule,
    FontAwesomeModule
  ],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements AfterViewInit {
  @ViewChild(ReviewsListComponent) reviewsList!: ReviewsListComponent;
  isSidebarExpanded = true;
  isDropdownOpen = false;

  icons = {
    chevronDown: faChevronDown,
    users: faUsers,
    offices: faBuilding,
    vehicles: faCarSide,
    reservations: faCalendarCheck,
    reviews: faStar,
    profile: faUser,
    plus: faPlus,
    dashboard: faChartLine
  };

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

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.cdr.detectChanges();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.management-dropdown')) {
      this.isDropdownOpen = false;
      this.cdr.detectChanges();
    }
  }

  openAddReviewModal(): void {
    // TODO: Implement modal opening logic
    console.log('Opening add review modal');
  }
}
