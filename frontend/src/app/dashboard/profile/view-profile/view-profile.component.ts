import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/auth.model';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {
  profile: User | null = null;

  constructor(
    private adminService: AdminService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.currentUser;
    if (currentUser?.id) {
      this.adminService.getAdminById(currentUser.id).subscribe({
        next: (profile) => {
          this.profile = profile;
        },
        error: (error) => {
          console.error('Error loading profile:', error);
        }
      });
    }
  }
}
