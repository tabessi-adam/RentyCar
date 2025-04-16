import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { faCar, faHome, faUsers, faUserTie, faCarSide, faCalendarAlt, faStar, faUser, faSignOutAlt, faChevronLeft, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../core/models/role.enum';

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
export class SidebarComponent implements OnInit {
  @Input() isExpanded = true;
  @Output() expandedChange = new EventEmitter<boolean>();
  navItems: NavItem[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const userRole = this.authService.userRole();
    this.setNavItems(userRole);
  }

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

  setNavItems(role: Role | undefined) {
    if (role === Role.ADMIN) {
      this.navItems = [
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
    } else if (role === Role.AGENT) {
      this.navItems = [
        { path: '/agent/dashboard', icon: 'home', label: 'Dashboard' },
        { path: '/agent/clients', icon: 'users', label: 'Clients' },
        { path: '/agent/vehicles', icon: 'vehicles', label: 'Vehicles' },
        { path: '/agent/reservations', icon: 'reservations', label: 'Reservations' },
        { path: '/agent/reviews', icon: 'reviews', label: 'Reviews' },
        { path: '/agent/profile', icon: 'profile', label: 'Profile' },
        { 
          path: '#', 
          icon: 'logout', 
          label: 'Logout',
          action: () => this.handleLogout()
        }
      ];
    }
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    this.expandedChange.emit(this.isExpanded);
  }

  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
