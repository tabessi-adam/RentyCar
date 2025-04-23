import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCar, faMoneyBillWave, faHeadset, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-why-choose-us',
  templateUrl: './why-choose-us.component.html',
  styleUrls: ['./why-choose-us.component.scss'],
  standalone: true,
  imports: [FontAwesomeModule, CommonModule]
})
export class WhyChooseUsComponent {
  features = [
    {
      title: 'Wide Range of Vehicles',
      icon: faCar
    },
    {
      title: 'Affordable Prices',
      icon: faMoneyBillWave
    },
    {
      title: '24/7 Customer Support',
      icon: faHeadset
    },
    {
      title: 'Easy Booking Process',
      icon: faCalendarCheck
    }
  ];

  constructor(private library: FaIconLibrary) {
    // Add icons to the library for use throughout the component
    library.addIcons(faCar, faMoneyBillWave, faHeadset, faCalendarCheck);
  }
}
