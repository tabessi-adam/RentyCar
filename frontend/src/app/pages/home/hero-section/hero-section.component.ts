import { Component, OnInit } from '@angular/core';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss'],
  standalone: true,
  imports: [FontAwesomeModule, RouterLink]
})
export class HeroSectionComponent implements OnInit {
  faCheckCircle = faCheckCircle;

  constructor() {}

  ngOnInit(): void {}
}
