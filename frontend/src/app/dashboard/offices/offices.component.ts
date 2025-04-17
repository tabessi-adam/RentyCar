import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-offices',
  imports: [CommonModule,SidebarComponent],
  templateUrl: './offices.component.html',
  styleUrl: './offices.component.scss'
})
export class OfficesComponent {
  isSidebarExpanded = true;

  onSidebarExpandedChange(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }
}
