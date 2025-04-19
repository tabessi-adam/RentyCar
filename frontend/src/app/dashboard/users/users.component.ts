import { Component, ViewChild, AfterViewInit, OnInit, AfterContentChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { UsersListComponent } from './users-list/users-list.component';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from './add-user/add-user.component';
import { Client } from '../../core/models/client.model';
import { Agent } from '../../core/models/agent.model';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../core/models/role.enum';

type User = Client | Agent;

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    UsersListComponent,
    RouterModule
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit, AfterContentChecked {
  @ViewChild(UsersListComponent) usersList!: UsersListComponent;
  isSidebarExpanded = true;
  isAdmin = false;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.hasRole(Role.ADMIN);
  }

  ngAfterViewInit() {
    // Ensure the users list is loaded initially
    if (this.usersList) {
      this.usersList.loadUsers();
    }
  }

  ngAfterContentChecked() {
    // This hook is called after every change detection cycle
    // No need to manually trigger change detection
  }

  onSidebarExpandedChange(expanded: boolean) {
    this.isSidebarExpanded = expanded;
  }

  openAddUserModal() {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '600px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onUserAdded(result);
      }
    });
  }

  onUserAdded(user: User) {
    // Ensure we refresh the list after adding a user
    setTimeout(() => {
      if (this.usersList) {
        this.usersList.loadUsers();
      }
    });
  }
}
