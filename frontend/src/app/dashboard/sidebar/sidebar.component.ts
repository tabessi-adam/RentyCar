import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { faCar, faHome, faUsers, faUserTie, faCarSide, faCalendarAlt, faStar, faUser, faSignOutAlt, faChevronLeft, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../core/services/auth.service';

type IconKey = 'car' | 'home' | 'users' | 'agents' | 'vehicles' | 'reservations' | 'reviews' | 'profile' | 'logout' | 'chevronLeft';

interface NavItem {
  path: string;
  icon: IconKey;
  label: string;
  action?: () => void;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() isExpanded = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Icons
  icons: Record<IconKey, IconDefinition> = {
    car: faCar,
    home: faHome,
    users: faUsers,
    agents: faUserTie,
    vehicles: faCarSide,
    reservations: faCalendarAlt,
    reviews: faStar,
    profile: faUser,
    logout: faSignOutAlt,
    chevronLeft: faChevronLeft
  };

  // Navigation items
  navItems: NavItem[] = [
    { path: '/admin/dashboard', icon: 'home', label: 'Dashboard' },
    { path: '/admin/agents', icon: 'agents', label: 'Agents' },
    { path: '/admin/clients', icon: 'users', label: 'Clients' },
    { path: '/admin/vehicles', icon: 'vehicles', label: 'Vehicles' },
    { path: '/admin/reservations', icon: 'reservations', label: 'Reservations' },
    { path: '/admin/reviews', icon: 'reviews', label: 'Reviews' },
    { path: '/admin/profile', icon: 'profile', label: 'Profile' },
    { 
      path: '#', 
      icon: 'logout', 
      label: 'Logout',
      action: () => this.handleLogout()
    }
  ];

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
