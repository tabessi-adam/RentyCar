import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent {
  reviews = [
    {
      name: 'John Doe',
      rating: 5,
      date: '2024-03-15',
      comment: 'Excellent service! The car was in perfect condition and the staff was very helpful. Would definitely rent again.'
    },
    {
      name: 'Jane Smith',
      rating: 4,
      date: '2024-03-10',
      comment: 'Great experience overall. The car was clean and well-maintained. Only minor issue was the GPS navigation system.'
    },
    {
      name: 'Mike Johnson',
      rating: 5,
      date: '2024-03-05',
      comment: 'Perfect rental experience. The vehicle was exactly as described and the pickup/drop-off process was smooth.'
    }
  ];

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }
}
