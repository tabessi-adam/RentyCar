import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';   
import { LocationsComponent } from './pages/locations/locations.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { clientGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { UserRole } from './core/services/auth.service';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'locations', component: LocationsComponent },
  { path: 'about', component: AboutUsComponent },
  { 
    path: 'login', 
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) 
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [clientGuard]
  },
  { 
    path: 'register', 
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent) 
  },
  { 
    path: 'admin',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./dashboard/users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'vehicles',
        loadComponent: () => import('./dashboard/vehicles/vehicles.component').then(m => m.VehiclesComponent)
      },
      {
        path: 'reservations',
        loadComponent: () => import('./dashboard/reservations/reservations.component').then(m => m.ReservationsComponent)
      },
      {
        path: 'reviews',
        loadComponent: () => import('./dashboard/reviews/reviews.component').then(m => m.ReviewsComponent)
      },
    
      {
        path: 'offices',
        loadComponent: () => import('./dashboard/offices/offices.component').then(m => m.OfficesComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./dashboard/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },
  {
    path: 'agent',
    canActivate: [RoleGuard],
    data: { roles: ['agent'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./dashboard/users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'vehicles',
        loadComponent: () => import('./dashboard/vehicles/vehicles.component').then(m => m.VehiclesComponent)
      },
      {
        path: 'reservations',
        loadComponent: () => import('./dashboard/reservations/reservations.component').then(m => m.ReservationsComponent)
      },
      {
        path: 'reviews',
        loadComponent: () => import('./dashboard/reviews/reviews.component').then(m => m.ReviewsComponent)
      },
   
      {
        path: 'profile',
        loadComponent: () => import('./dashboard/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },
  {
    path: 'client',
    canActivate: [RoleGuard],
    data: { roles: ['client'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'vehicles',
        loadComponent: () => import('./dashboard/vehicles/vehicles.component').then(m => m.VehiclesComponent)
      },
      {
        path: 'reservations',
        loadComponent: () => import('./dashboard/reservations/reservations.component').then(m => m.ReservationsComponent)
      },
      {
        path: 'reviews',
        loadComponent: () => import('./dashboard/reviews/reviews.component').then(m => m.ReviewsComponent)
      },
      {
        path: 'client-profile',
        loadComponent: () => import('./client/client-profile/client-profile.component').then(m => m.ClientProfileComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./dashboard/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
