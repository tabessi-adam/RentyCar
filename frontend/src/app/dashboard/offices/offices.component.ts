import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { OfficesListComponent } from './offices-list/offices-list.component';
import { AddOfficeComponent } from './add-office/add-office.component';
import { OfficeService } from '../../core/services/office.service';
import { CreateOfficePayload } from '../../core/models/office.model';

@Component({
  selector: 'app-offices',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    OfficesListComponent,
    AddOfficeComponent
  ],
  templateUrl: './offices.component.html',
  styleUrl: './offices.component.scss'
})
export class OfficesComponent {
  @ViewChild(AddOfficeComponent) addOfficeComponent!: AddOfficeComponent;
  @ViewChild(OfficesListComponent) officesListComponent!: OfficesListComponent;
  isSidebarExpanded = true;

  constructor(private officeService: OfficeService) {}

  onSidebarExpandedChange(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  openAddOfficeModal() {
    this.addOfficeComponent.open();
  }

  onOfficeAdded(officeData: CreateOfficePayload) {
    this.officeService.createOffice(officeData).subscribe({
      next: (createdOffice) => {
        console.log('Office created successfully:', createdOffice);
        // Refresh the offices list
        this.officesListComponent.loadOffices();
      },
      error: (error) => {
        console.error('Error creating office:', error);
        // Handle error appropriately (show error message to user)
      }
    });
  }
}
