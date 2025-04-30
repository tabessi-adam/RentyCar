import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight, faCar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-vehicle-carousel',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './vehicle-carousel.component.html',
  styleUrl: './vehicle-carousel.component.scss'
})
export class VehicleCarouselComponent {
  @Input() images: string[] = [];
  currentIndex = 0;

  // Font Awesome icons
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faCar = faCar;

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  previousImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  selectImage(index: number) {
    this.currentIndex = index;
  }
}
