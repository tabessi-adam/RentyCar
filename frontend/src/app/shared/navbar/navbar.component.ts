import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service'; // Use the new AuthService path
import { CommonModule } from '@angular/common';
import { Role } from '../../core/models/role.enum'; // Use the new Role enum
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
  userName: string = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    private clientService: ClientService
  ) {}

  ngOnInit() {
    // Subscribe to user name changes
    this.clientService.userName$.subscribe(name => {
      this.userName = name;
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
    this.router.navigate(['/']);
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
    const user = this.authService.getCurrentUser();
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
}