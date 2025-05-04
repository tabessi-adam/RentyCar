import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCar, faMoneyBillWave, faHeadset, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-why-choose-us',
  standalone: true,
  imports: [CommonModule, TranslateModule, FontAwesomeModule],
  templateUrl: './why-choose-us.component.html',
  styleUrls: ['./why-choose-us.component.scss']
})
export class WhyChooseUsComponent {
  faCar = faCar;
  faHeadset = faHeadset;
  faCalendarCheck = faCalendarCheck;

  features = [
    {
      icon: faCar,
      key: 'vehicles'
    },
    {
      icon: faMoneyBillWave,
      key: 'prices'
    },
    {
      icon: faHeadset,
      key: 'support'
    },
    {
      icon: faCalendarCheck,
      key: 'booking'
    }
  ];
}
