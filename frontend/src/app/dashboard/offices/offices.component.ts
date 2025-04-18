import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { OfficesListComponent } from './offices-list/offices-list.component';
import { AddOfficeComponent } from './add-office/add-office.component';
import { Office } from '../../core/models/office.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-offices',
  standalone: true,
  imports: [
    SidebarComponent, 
    OfficesListComponent, 
    AddOfficeComponent,
    MatDialogModule
  ],
  providers: [provideAnimations()],
  templateUrl: './offices.component.html',
  styleUrl: './offices.component.scss'
})
export class OfficesComponent {
  isSidebarExpanded = true;

  constructor(private dialog: MatDialog) {}

  onSidebarExpandedChange(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  openAddOfficeModal() {
    const dialogRef = this.dialog.open(AddOfficeComponent, {
      width: '100%',
      maxWidth: '600px',
      height: 'auto',
      maxHeight: '100vh',
      disableClose: false,
      autoFocus: false,
      panelClass: 'responsive-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onOfficeAdded(result);
      }
    });
  }

  onOfficeAdded(office: Office) {
    // Refresh the offices list when a new office is added
    const officesList = document.querySelector('app-offices-list');
    if (officesList) {
      (officesList as any).loadOffices();
    }
  }
}
