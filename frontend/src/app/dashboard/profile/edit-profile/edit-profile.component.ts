import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { AgentService } from '../../../core/services/agent.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/auth.model';
import { Agent } from '../../../core/models/agent.model';
import { Role } from '../../../core/models/role.enum';

type Profile = User | Agent;

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  profile: Profile | null = null;
  isSubmitting = false;
  message = '';
  isError = false;
  isAdmin: boolean = false;

  constructor(
    private adminService: AdminService,
    private agentService: AgentService,
    private authService: AuthService
  ) {
    this.isAdmin = this.authService.currentUser?.role === Role.ADMIN;
  }

  ngOnInit() {
    const currentUser = this.authService.currentUser;
    if (currentUser?.id) {
      if (this.isAdmin) {
        this.adminService.getAdminById(currentUser.id).subscribe({
          next: (profile) => {
            this.profile = profile;
          },
          error: (error) => {
            console.error('Error loading admin profile:', error);
            this.showMessage('Error loading profile information', true);
          }
        });
      } else {
        this.agentService.getAgentById(currentUser.id).subscribe({
          next: (profile) => {
            this.profile = profile;
          },
          error: (error) => {
            console.error('Error loading agent profile:', error);
            this.showMessage('Error loading profile information', true);
          }
        });
      }
    }
  }

  onSubmit() {
    if (!this.profile) return;

    this.isSubmitting = true;
    this.message = '';

    const updateData = {
      name: this.profile.name,
      email: this.profile.email,
      phoneNumber: this.profile.phoneNumber
    };

    if (this.isAdmin) {
      this.adminService.updateAdmin(this.profile.id, updateData).subscribe({
        next: () => {
          this.showMessage('Profile updated successfully');
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.showMessage('Error updating profile', true);
          this.isSubmitting = false;
        }
      });
    } else {
      this.agentService.updateAgent(this.profile.id, updateData).subscribe({
        next: () => {
          this.showMessage('Profile updated successfully');
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.showMessage('Error updating profile', true);
          this.isSubmitting = false;
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
