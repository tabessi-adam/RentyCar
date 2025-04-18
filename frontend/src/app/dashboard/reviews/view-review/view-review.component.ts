import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Review } from '../../../core/models/review.model';

@Component({
  selector: 'app-view-review',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './view-review.component.html',
  styleUrl: './view-review.component.scss'
})
export class ViewReviewComponent {
  review: Review;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { review: Review },
    public dialogRef: MatDialogRef<ViewReviewComponent>
  ) {
    this.review = data.review;
  }

  getStars(): { type: "full" | "half" | "empty" }[] {
    const stars: { type: "full" | "half" | "empty" }[] = [];
    const rating = this.review.rating;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push({ type: "full" });
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push({ type: "half" });
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push({ type: "empty" });
    }

    return stars;
  }
}
