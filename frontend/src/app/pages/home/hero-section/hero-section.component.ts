import { Component, OnInit } from '@angular/core';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, FontAwesomeModule]
})
export class HeroSectionComponent implements OnInit {
  faCheckCircle = faCheckCircle;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  onBookNowClick(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/collection']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
