import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
// Font Awesome imports
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTruck, faCar, faCheckCircle, faRoute } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.scss'],
  standalone: true,
  imports: [FontAwesomeModule, CommonModule]
})
export class HowItWorksComponent {
  primaryColor = '#36c63c';
  
  // Font Awesome icons
  faTruck = faTruck;
  faCar = faCar;
  faCheckCircle = faCheckCircle;
  faRoute = faRoute;
  
  // Features array
  features = [
    {
      icon: this.faTruck,
      title: 'Choose a Location',
      description: 'Select the ideal destination to begin your journey with.'
    },
    {
      icon: this.faCar,
      title: 'Choose Your Vehicle',
      description: 'Browse our fleet and find the perfect car for your needs.'
    },
    {
      icon: this.faCheckCircle,
      title: 'Verification',
      description: 'Review your information and confirm your booking.'
    },
    {
      icon: this.faRoute,
      title: 'Begin Your Journey',
      description: 'Start your adventure with confidence.'
    }
  ];
}
