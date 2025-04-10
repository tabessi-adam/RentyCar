import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service'; // Use the new AuthService path
import { Role } from '../../core/models/role.enum'; // Use the new Role enum

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [CommonModule, RouterLink],
  standalone: true
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  mainMenuItems: any[] = [];
  
  bottomMenuItems = [
    { icon: 'fa-cog', label: 'Settings', route: '' },
    { icon: 'fa-sign-out-alt', label: 'Logout', route: null, action: () => this.logout() }
  ];

  constructor(
    public router: Router,
    public authService: AuthService
  ) {}

  ngOnInit() {
    // Subscribe to currentUser changes to update menu dynamically
    this.authService.currentUser$.subscribe(user => {
      this.updateMenuItems(user?.role);
    });
  }

  updateMenuItems(role?: Role) {
    switch (role) {
      case Role.ADMIN:
        this.mainMenuItems = [
          { icon: 'fa-tachometer-alt', label: 'Dashboard', route: '/admin/dashboard' },
          { icon: 'fa-car', label: 'Vehicles', route: '/admin/vehicles/vehicles-dashboard' },
          { icon: 'fa-calendar-alt', label: 'Reservations', route: '/admin/reservations/reservations-dashboard' },
          { icon: 'fa-building', label: 'Agencies', route: '/admin/agencies' },
          { icon: 'fa-user-tie', label: 'Agents', route: '/admin/agents' },
          { icon: 'fa-users', label: 'Clients', route: '/admin/clients' },
          { icon: 'fa-star', label: 'Reviews', route: '/admin/reviews' }
        ];
        this.bottomMenuItems[0].route = '/admin/settings';
        break;
      
      case Role.AGENT:
        this.mainMenuItems = [
          { icon: 'fa-tachometer-alt', label: 'Dashboard', route: '/agent/dashboard' },
          { icon: 'fa-car', label: 'Vehicles', route: '/agent/vehicles/vehicles-dashboard' },
          { icon: 'fa-calendar-alt', label: 'Reservations', route: '/agent/reservations/reservations-dashboard' },
          { icon: 'fa-star', label: 'Reviews', route: '/agent/reviews' }
        ];
        this.bottomMenuItems[0].route = '/agent/settings';
        break;
      
      case Role.CLIENT:
        this.mainMenuItems = [
          { icon: 'fa-tachometer-alt', label: 'Dashboard', route: '/client/dashboard' },
          { icon: 'fa-calendar-alt', label: 'My Reservations', route: '/client/reservations' },
          { icon: 'fa-star', label: 'My Reviews', route: '/client/reviews' }
        ];
        this.bottomMenuItems[0].route = '/client/settings';
        break;
      
      default:
        this.mainMenuItems = [];
        this.bottomMenuItems[0].route = '/settings';
        break;
    }
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  handleMenuClick(item: any): void {
    if (item.action) {
      item.action();
    } else if (item.route) {
      this.router.navigate([item.route]);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}