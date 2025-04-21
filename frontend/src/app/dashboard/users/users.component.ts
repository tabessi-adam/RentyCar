import { Component, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
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
export class UsersComponent implements OnInit, AfterViewInit {
  @ViewChild(UsersListComponent) usersList!: UsersListComponent;
  isSidebarExpanded = true;
  isAdmin = false;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Move isAdmin check to a promise to ensure it runs after initial change detection
    Promise.resolve().then(() => {
      this.isAdmin = this.authService.hasRole(Role.ADMIN);
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit() {
    // Ensure the users list is loaded initially
    Promise.resolve().then(() => {
      if (this.usersList) {
        this.usersList.loadUsers();
        this.cdr.detectChanges();
      }
    });
  }

  onSidebarExpandedChange(expanded: boolean) {
    this.isSidebarExpanded = expanded;
    this.cdr.detectChanges();
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
    Promise.resolve().then(() => {
      if (this.usersList) {
        this.usersList.loadUsers();
        this.cdr.detectChanges();
      }
    });
  }
}
