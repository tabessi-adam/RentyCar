import { Component, HostListener, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Role } from '../../core/models/role.enum';
import { ClientService } from '../../core/services/client.service';
import { Subscription } from 'rxjs';
import { signal } from '@angular/core';
import { User } from '../../core/models/auth.model';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../core/services/translation.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule]
})
export class NavbarComponent implements OnInit, OnDestroy {
  private translationService = inject(TranslationService);
  private translate = inject(TranslateService);
  public clientService = inject(ClientService);
  private authService = inject(AuthService);

  isMobileMenuOpen = false;
  isProfileDropdownOpen = false;
  isLanguageDropdownOpen = false;
  isAuthenticated = false;
  private authSubscription?: Subscription;
  profilePictureUrl = signal<string | undefined>(undefined);

  constructor(
    private router: Router
  ) {
    this.currentLanguage();
  }

  ngOnInit() {
    // Subscribe to auth state changes
    this.authSubscription = this.authService.currentUser$.subscribe((user: User | null) => {
      this.isAuthenticated = !!user;
      if (user) {
        this.clientService.updateUserName(user.name || '');
        // Fetch profile data to get the profile picture
        this.clientService.getProfile().subscribe({
          next: (profile) => {
            this.profilePictureUrl.set(profile.profilePictureUrl);
          },
          error: (error) => {
            console.error('Error fetching profile:', error);
          }
        });
      } else {
        this.clientService.clearUserName();
        this.profilePictureUrl.set(undefined);
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.navbar__profile') && 
        !target.closest('.navbar__hamburger') && 
        !target.closest('.navbar__language')) {
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

  toggleLanguageDropdown() {
    this.isLanguageDropdownOpen = !this.isLanguageDropdownOpen;
    if (this.isLanguageDropdownOpen) {
      this.isProfileDropdownOpen = false;
      this.isMobileMenuOpen = false;
    }
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

  handleLanguageKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleLanguageDropdown();
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
    this.isLanguageDropdownOpen = false;
  }

  get currentUser() {
    return this.authService.currentUser;
  }

  currentLanguage(): string {
    return this.translate.currentLang;
  }

  switchLanguage(lang: string): void {
    this.translationService.switchLanguage(lang);
    this.isLanguageDropdownOpen = false;
  }
}