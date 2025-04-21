import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { DeleteProfileComponent } from './delete-profile/delete-profile.component';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    SidebarComponent,
    ViewProfileComponent,
    EditProfileComponent,
    DeleteProfileComponent,
    RouterOutlet,
    FontAwesomeModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  isSidebarExpanded = true;
  
  // Icons
  icons = {
    user: faUser,
    edit: faEdit,
    trash: faTrash
  };

  onSidebarExpandedChange(expanded: boolean): void {
    this.isSidebarExpanded = expanded;
  }
}
