import { Component } from '@angular/core';
import { ReservationsListComponent } from './reservations-list/reservations-list.component';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, ReservationsListComponent, NavbarComponent, FooterComponent],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss'
})
export class ReservationsComponent {

}
