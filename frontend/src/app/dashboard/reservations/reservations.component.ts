import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ReservationsListComponent } from './reservations-list/reservations-list.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faChevronDown, 
  faUsers, 
  faBuilding, 
  faCarSide,
  faCalendarCheck,
  faStar,
  faUser,
  faPlus,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    ReservationsListComponent,
    RouterModule,
    FontAwesomeModule
  ],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements AfterViewInit {
  @ViewChild(ReservationsListComponent) reservationsList!: ReservationsListComponent;
  isSidebarExpanded = true;
  isDropdownOpen = false;

  icons = {
    chevronDown: faChevronDown,
    dashboard: faChartLine,
    users: faUsers,
    offices: faBuilding,
    vehicles: faCarSide,
    reservations: faCalendarCheck,
    reviews: faStar,
    profile: faUser,
    plus: faPlus
  };

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    // Ensure the reservations list is loaded initially
    if (this.reservationsList) {
      this.reservationsList.loadReservations();
    }
    this.cdr.detectChanges();
  }

  onSidebarExpandedChange(expanded: boolean) {
    this.isSidebarExpanded = expanded;
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

  openAddReservationModal(): void {
    // TODO: Implement modal opening logic
    console.log('Opening add reservation modal');
  }
}
