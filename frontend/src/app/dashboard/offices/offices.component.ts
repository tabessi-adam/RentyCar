import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { OfficesListComponent } from './offices-list/offices-list.component';
import { MatDialog } from '@angular/material/dialog';
import { AddOfficeComponent } from './add-office/add-office.component';
import { Office } from '../../core/models/office.model';
import { provideAnimations } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-offices',
  standalone: true,
  imports: [CommonModule, SidebarComponent, OfficesListComponent],
  providers: [provideAnimations()],
  templateUrl: './offices.component.html',
  styleUrls: ['./offices.component.scss']
})
export class OfficesComponent {
  @ViewChild(OfficesListComponent) officesList!: OfficesListComponent;
  isSidebarExpanded = true;

  constructor(private dialog: MatDialog) {}

  onSidebarExpandedChange(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  openAddOfficeModal() {
    const dialogRef = this.dialog.open(AddOfficeComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onOfficeAdded(result);
      }
    });
  }

  onOfficeAdded(office: Office): void {
    if (this.officesList) {
      this.officesList.loadOffices();
    }
  }
}
