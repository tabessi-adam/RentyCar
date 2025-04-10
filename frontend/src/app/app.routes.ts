import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';   
import { AdminDashboardComponent } from './admin/dashboard/admin-dashboard/admin-dashboard.component';
import { AgentDashboardComponent } from './agent/dashboard/agent-dashboard/agent-dashboard.component';
import { LocationsComponent } from './pages/locations/locations.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { adminGuard, agentGuard, clientGuard } from './core/guards/auth.guard';

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
    path: 'register', 
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent) 
  },
  { 
    path: 'client',
    canActivate: [clientGuard],
    children: [
      { path: 'profile', loadComponent: () => 
        import('./client/client-profile/client-profile.component').then(m => m.ClientProfileComponent) 
      },
      { path: 'reservations', loadComponent: () => 
        import('./client/reservations/reservation-list/reservation-list.component').then(m => m.ReservationListComponent) 
      }
    ]
  },
  { 
    path: 'admin', 
    canActivate: [adminGuard],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'vehicles/vehicles-dashboard', loadComponent: () => 
        import('./admin/vehicles/vehicles-dashboard/vehicles-dashboard.component').then(m => m.VehiclesDashboardComponent) 
      },
      { path: 'reservations/reservations-dashboard', loadComponent: () => 
        import('./admin/reservations/reservations-dashboard/reservations-dashboard.component').then(m => m.ReservationsDashboardComponent) 
      },
      { path: 'agencies', loadComponent: () => 
        import('./admin/agencies/agencies-dashboard/agencies-dashboard.component').then(m => m.AgenciesDashboardComponent) 
      },
      { path: 'agents', loadComponent: () => 
        import('./admin/agents/agents-dashboard/agents-dashboard.component').then(m => m.AgentsDashboardComponent) 
      },
      { path: 'settings', loadComponent: () => 
        import('./admin/admin-profile/admin-profile.component').then(m => m.AdminProfileComponent) 
      },
      { path: 'clients', loadComponent: () => 
        import('./admin/clients/clients-dashboard/clients-dashboard.component').then(m => m.ClientsDashboardComponent)       },
      { path: 'reviews', loadComponent: () => 
        import('./admin/reviews/reviews-dashboard/reviews-dashboard.component').then(m => m.ReviewsDashboardComponent) 
      }
    ]
  },
  { 
    path: 'agent', 
    canActivate: [agentGuard],
    children: [
      { path: 'dashboard', component: AgentDashboardComponent },
      { path: 'vehicles/vehicles-dashboard', loadComponent: () => 
        import('./agent/vehicles/vehicles-dashboard/vehicles-dashboard.component').then(m => m.VehiclesDashboardComponent) 
      },
      { path: 'reservations/reservations-dashboard', loadComponent: () => 
        import('./agent/reservations/reservations-dashboard/reservations-dashboard.component').then(m => m.ReservationsDashboardComponent) 
      },
      { path: 'settings', loadComponent: () => 
        import('./agent/agent-profile/agent-profile.component').then(m => m.AgentProfileComponent) 
      },
      { path: 'reviews', loadComponent: () => 
        import('./agent/reviews/reviews-dashboard/reviews-dashboard.component').then(m => m.ReviewsDashboardComponent) 
      }
    ]
  },
  { 
    path: 'access-denied', 
    loadComponent: () => import('./shared/access-denied/access-denied.component').then(m => m.AccessDeniedComponent) 
  },
  { path: '**', redirectTo: '' }
];
