import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { WhyChooseUsComponent } from './why-choose-us/why-choose-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, FooterComponent, HeroSectionComponent, HowItWorksComponent, WhyChooseUsComponent, ContactUsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
