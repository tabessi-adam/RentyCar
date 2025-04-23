import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../core/models/role.enum';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    SidebarComponent,
    RouterOutlet,
    FontAwesomeModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  isSidebarExpanded = true;
  currentRole: Role | null = null;
  
  // Icons
  icons = {
    user: faUser,
    edit: faEdit,
    trash: faTrash
  };

  constructor(private authService: AuthService) {
    this.currentRole = this.authService.currentUser?.role || null;
  }

  onSidebarExpandedChange(expanded: boolean): void {
    this.isSidebarExpanded = expanded;
  }
}
