import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { OfficesListComponent } from './offices-list/offices-list.component';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddOfficeComponent } from './add-office/add-office.component';
import { Office } from '../../core/models/office.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faChevronDown, 
  faPlus, 
  faUsers, 
  faBuilding, 
  faCarSide,
  faCalendarCheck,
  faStar,
  faUser,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-offices',
  standalone: true,
  imports: [
    CommonModule, 
    SidebarComponent, 
    OfficesListComponent, 
    RouterModule,
    FontAwesomeModule,
    MatDialogModule
  ],
  templateUrl: './offices.component.html',
  styleUrls: ['./offices.component.scss']
})
export class OfficesComponent implements AfterViewInit {
  @ViewChild(OfficesListComponent) officesList!: OfficesListComponent;
  isSidebarExpanded = true;
  isDropdownOpen = false;

  icons = {
    chevronDown: faChevronDown,
    plus: faPlus,
    dashboard: faChartLine,
    users: faUsers,
    offices: faBuilding,
    vehicles: faCarSide,
    reservations: faCalendarCheck,
    reviews: faStar,
    profile: faUser
  };

  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    // Ensure the offices list is loaded initially
    Promise.resolve().then(() => {
      if (this.officesList) {
        this.officesList.loadOffices();
        this.cdr.detectChanges();
      }
    });
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

  openAddOfficeModal() {
    const dialogRef = this.dialog.open(AddOfficeComponent, {
      width: '500px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'responsive-dialog'
    });

    dialogRef.afterClosed().subscribe((result: Office) => {
      if (result) {
        this.onOfficeAdded(result);
      }
    });
  }

  onOfficeAdded(office: Office): void {
    // Ensure we refresh the list after adding an office
    Promise.resolve().then(() => {
      if (this.officesList) {
        this.officesList.loadOffices();
        this.cdr.detectChanges();
      }
    });
  }
}
