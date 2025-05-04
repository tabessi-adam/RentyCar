import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, NavbarComponent, FooterComponent],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent {
  teamMembers = [
    {
      name: 'Adam Tabessi',
      roleKey: 'aboutUs.team.members.ceo.role'
    },
    {
      name: 'Harvey Specter',
      roleKey: 'aboutUs.team.members.operations.role'
    },
    {
      name: 'Mike Ross',
      roleKey: 'aboutUs.team.members.customerService.role'
    }
  ];

  constructor() {}
}
