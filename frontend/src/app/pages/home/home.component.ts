import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeroSectionComponent } from './hero-section/hero-section.component';
@Component({
  selector: 'app-home',
  imports: [NavbarComponent,FooterComponent,HeroSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
