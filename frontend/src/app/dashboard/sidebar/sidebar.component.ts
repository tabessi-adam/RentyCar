import { Component, Input, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { faCar, faHome, faUsers, faUserTie, faCarSide, faCalendarAlt, faStar, faUser, faSignOutAlt, faChevronLeft, faBuilding, faBars, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../core/models/role.enum';

type IconKey = 'car' | 'home' | 'users' | 'agents' | 'vehicles' | 'reservations' | 'reviews' | 'profile' | 'logout' | 'chevronLeft' | 'offices' | 'menu';

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
  userRole: Role | undefined;
  isMobile = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.userRole = this.authService.userRole();
    this.isMobile = window.innerWidth < 768;
  }

  ngOnInit() {
    // Always hide sidebar on mobile
    if (this.isMobile) {
      this.isExpanded = false;
    } else {
      const savedState = localStorage.getItem('sidebarExpanded');
      if (savedState !== null) {
        this.isExpanded = savedState === 'true';
      }
    }
    this.expandedChange.emit(this.isExpanded);
    this.setNavItems(this.userRole);
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
    chevronLeft: faChevronLeft,
    offices: faBuilding,
    menu: faBars
  };

  setNavItems(role: Role | undefined) {
    if (role === Role.ADMIN) {
      this.navItems = [
        { path: '/admin/dashboard', icon: 'home', label: 'Dashboard' },
        { path: '/admin/users', icon: 'users', label: 'User Management' },
        { path: '/admin/vehicles', icon: 'vehicles', label: 'Vehicles' },
        { path: '/admin/offices', icon: 'offices', label: 'Offices' },
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
        { path: '/agent/users', icon: 'users', label: 'User Management' },
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
    if (!this.isMobile) {
      this.isExpanded = !this.isExpanded;
      // Save the state to localStorage only for desktop
      localStorage.setItem('sidebarExpanded', this.isExpanded.toString());
      this.expandedChange.emit(this.isExpanded);
    }
  }

  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const newIsMobile = window.innerWidth < 768;
    if (newIsMobile !== this.isMobile) {
      this.isMobile = newIsMobile;
      if (this.isMobile) {
        this.isExpanded = false;
        this.expandedChange.emit(this.isExpanded);
      }
    }
  }
}
