import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { AgentService } from '../../../core/services/agent.service';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/models/role.enum';

@Component({
  selector: 'app-delete-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delete-profile.component.html',
  styleUrls: ['./delete-profile.component.scss']
})
export class DeleteProfileComponent {
  isConfirmed = false;
  isDeleting = false;
  message = '';
  isError = false;
  isAdmin: boolean = false;

  constructor(
    private adminService: AdminService,
    private agentService: AgentService,
    private authService: AuthService,
    private router: Router
  ) {
    this.isAdmin = this.authService.currentUser?.role === Role.ADMIN;
  }

  onDelete() {
    if (!this.isConfirmed) return;

    this.isDeleting = true;
    this.message = '';

    if (this.isAdmin) {
      this.adminService.deleteOwnAdminProfile().subscribe({
        next: () => {
          this.authService.logout();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error deleting admin profile:', error);
          this.showMessage('Error deleting profile', true);
          this.isDeleting = false;
        }
      });
    } else {
      this.agentService.deleteOwnAgentProfile().subscribe({
        next: () => {
          this.authService.logout();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error deleting agent profile:', error);
          this.showMessage('Error deleting profile', true);
          this.isDeleting = false;
        }
      });
    }
  }

  private showMessage(text: string, isError = false) {
    this.message = text;
    this.isError = isError;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}
