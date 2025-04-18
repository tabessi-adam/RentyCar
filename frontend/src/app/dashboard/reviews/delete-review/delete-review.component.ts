import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReviewService } from '../../../core/services/review.service';
import { Review } from '../../../core/models/review.model';

@Component({
  selector: 'app-delete-review',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './delete-review.component.html',
  styleUrl: './delete-review.component.scss'
})
export class DeleteReviewComponent {
  constructor(
    private reviewService: ReviewService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DeleteReviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { review: Review }
  ) {}

  onDelete() {
    this.reviewService.deleteReview(this.data.review.id).subscribe({
      next: () => {
        this.snackBar.open('Review deleted successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error deleting review:', error);
        this.snackBar.open('Error deleting review', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}
