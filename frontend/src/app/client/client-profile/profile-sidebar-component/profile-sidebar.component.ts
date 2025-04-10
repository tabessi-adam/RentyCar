import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-profile-sidebar',
  templateUrl: './profile-sidebar.component.html',
  styleUrl: './profile-sidebar.component.scss'
})
export class ProfileSidebarComponent {
  @Input() activePage: 'edit' | 'delete' = 'edit';
  @Output() pageChange = new EventEmitter<'edit' | 'delete'>();

  onPageSelect(page: 'edit' | 'delete') {
    this.pageChange.emit(page);
  }
} 