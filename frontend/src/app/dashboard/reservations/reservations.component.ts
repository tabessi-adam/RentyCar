import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ReservationsListComponent } from './reservations-list/reservations-list.component';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    ReservationsListComponent
  ],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements AfterViewInit {
  @ViewChild(ReservationsListComponent) reservationsList!: ReservationsListComponent;
  isSidebarExpanded = true;

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
}
