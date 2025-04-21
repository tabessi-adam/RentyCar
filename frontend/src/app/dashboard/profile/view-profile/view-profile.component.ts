import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { AgentService } from '../../../core/services/agent.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/auth.model';
import { Agent } from '../../../core/models/agent.model';
import { Role } from '../../../core/models/role.enum';

type Profile = {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: Role;
  officeId?: string;
  agentId?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {
  profile: Profile | null = null;
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
          next: (profile: User) => {
            this.profile = {
              id: profile.id,
              name: profile.name || '',
              email: profile.email,
              phoneNumber: profile.phoneNumber,
              role: Role.ADMIN
            };
          },
          error: (error) => {
            console.error('Error loading admin profile:', error);
          }
        });
      } else {
        this.agentService.getAgentById(currentUser.id).subscribe({
          next: (profile: Agent) => {
            this.profile = {
              id: profile.id,
              name: profile.name,
              email: profile.email,
              phoneNumber: profile.phoneNumber,
              role: Role.AGENT,
              officeId: profile.officeId,
              agentId: profile.id,
              isActive: true,
              createdAt: profile.createdAt,
              updatedAt: profile.updatedAt
            };
          },
          error: (error) => {
            console.error('Error loading agent profile:', error);
          }
        });
      }
    }
  }
}
