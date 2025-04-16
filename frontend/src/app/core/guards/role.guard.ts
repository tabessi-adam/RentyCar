import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/role.enum';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: any) {
    const requiredRoles = route.data['roles'] as Role[];
    const currentUser = this.authService.currentUser;

    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    if (!requiredRoles || requiredRoles.includes(currentUser.role)) {
      return true;
    }

    // Redirect to appropriate dashboard based on role
    switch (currentUser.role) {
      case Role.ADMIN:
        this.router.navigate(['/admin/dashboard']);
        break;
      case Role.AGENT:
        this.router.navigate(['/agent/dashboard']);
        break;
      case Role.CLIENT:
        this.router.navigate(['/client/dashboard']);
        break;
      default:
        this.router.navigate(['/login']);
    }
    return false;
  }
}
