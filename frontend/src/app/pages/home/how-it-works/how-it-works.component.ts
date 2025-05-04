import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
// Font Awesome imports
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCarSide, faCalendar, faClipboardCheck, faBell } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.scss'],
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, TranslateModule]
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
      key: 'browse'
    },
    {
      icon: this.faCalendar,
      key: 'select'
    },
    {
      icon: this.faClipboardCheck,
      key: 'review'
    },
    {
      icon: this.faBell,
      key: 'wait'
    }
  ];

  getStepKey(index: number): string {
    return this.features[index].key;
  }
}
