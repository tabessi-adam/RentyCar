import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
// Font Awesome imports
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCarSide, faCalendar, faClipboardCheck, faBell } from '@fortawesome/free-solid-svg-icons';

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
  faCarSide = faCarSide;
  faCalendar = faCalendar;
  faClipboardCheck = faClipboardCheck;
  faBell = faBell;
  
  // Features array
  features = [
    {
      icon: this.faCarSide,
      title: 'Browse Vehicles',
      description: 'Browse our wide selection of vehicles and select the perfect one for your needs'
    },
    {
      icon: this.faCalendar,
      title: 'Select Dates',
      description: 'Pick your rental start date and specify the number of days you need the vehicle'
    },
    {
      icon: this.faClipboardCheck,
      title: 'Review & Submit',
      description: 'Review your selection and submit your reservation request. Our system will calculate the total price'
    },
    {
      icon: this.faBell,
      title: 'Wait for Confirmation',
      description: 'Wait for our team to review and confirm your reservation. You\'ll receive a notification once approved'
    }
  ];
}
