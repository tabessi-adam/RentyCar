import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReviewService } from '../../../core/services/review.service';
import { Review } from '../../../core/models/review.model';
import { ViewReviewComponent } from '../view-review/view-review.component';
import { DeleteReviewComponent } from '../delete-review/delete-review.component';

@Component({
  selector: 'app-reviews-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './reviews-list.component.html',
  styleUrl: './reviews-list.component.scss'
})
export class ReviewsListComponent implements OnInit {
  reviews: Review[] = [];
  isLoading = true;
  displayedColumns: string[] = [
    'id',
    'rating',
    'comment',
    'vehicleId',
    'clientId',
    'createdAt',
    'actions'
  ];

  constructor(
    private reviewService: ReviewService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    this.isLoading = true;
    this.reviewService.getAllReviews().subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.snackBar.open('Error loading reviews', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  getStars(rating: number): { type: "full" | "half" | "empty" }[] {
    const stars: { type: "full" | "half" | "empty" }[] = [];
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

  onView(review: Review) {
    this.dialog.open(ViewReviewComponent, {
      width: '500px',
      data: { review }
    });
  }

  onDelete(review: Review) {
    const dialogRef = this.dialog.open(DeleteReviewComponent, {
      width: '500px',
      maxWidth: '90vw',
      panelClass: 'delete-dialog-container',
      data: { review }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadReviews();
      }
    });
  }
}
