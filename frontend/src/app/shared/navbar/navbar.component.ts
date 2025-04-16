import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Role } from '../../core/models/role.enum';
import { ClientService } from '../../core/services/client.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class NavbarComponent implements OnInit {
  isMobileMenuOpen = false;
  isProfileDropdownOpen = false;
  isAuthenticated = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    public clientService: ClientService
  ) {}

  ngOnInit() {
    // Subscribe to auth state changes
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      if (user?.name) {
        this.clientService.updateUserName(user.name);
      } else {
        this.clientService.clearUserName();
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.navbar__profile') && !target.closest('.navbar__hamburger')) {
      this.closeMenus();
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 768 && this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) this.isProfileDropdownOpen = false;
  }

  toggleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
    if (this.isProfileDropdownOpen) this.isMobileMenuOpen = false;
  }

  navigateToHome() {
    this.router.navigate(['/']);
    this.closeMenus();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.closeMenus();
  }

  handleKeydown(event: KeyboardEvent, path: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.navigateToHome();
    }
  }

  handleProfileKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleProfileDropdown();
    }
  }

  // Get dashboard route based on user role
  getDashboardRoute(): string {
    const user = this.authService.currentUser;
    const role = user?.role;
    switch (role) {
      case Role.ADMIN:
        return '/admin/dashboard';
      case Role.AGENT:
        return '/agent/dashboard';
      case Role.CLIENT:
        return '/client/dashboard';
      default:
        return '/';
    }
  }

  private closeMenus() {
    this.isMobileMenuOpen = false;
    this.isProfileDropdownOpen = false;
  }

  get currentUser() {
    return this.authService.currentUser;
  }
}