import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';   
import { LocationsComponent } from './pages/locations/locations.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { clientGuard } from './core/guards/auth.guard';

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
 
  { path: '**', redirectTo: '' }
];
