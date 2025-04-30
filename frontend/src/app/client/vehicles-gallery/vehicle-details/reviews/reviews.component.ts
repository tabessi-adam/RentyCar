import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from '../../../../core/services/review.service';
import { Review, CreateReviewPayload } from '../../../../core/models/review.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
  @Input() vehicleId!: string;
  reviews: Review[] = [];
  reviewForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  hasUserReviewed = false;
  userReview: Review | null = null;
  showAlreadyReviewedMessage = false;
  currentUserName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private authService: AuthService
  ) {
    this.reviewForm = this.fb.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    this.currentUserName = this.authService.currentUser?.name || null;
    this.loadReviews();
  }

  loadReviews() {
    this.reviewService.getAllReviews({ vehicleId: this.vehicleId }).subscribe({
      next: (reviews: Review[]) => {
        this.reviews = reviews;
        this.errorMessage = null;
        // Check if the current user has already reviewed this vehicle
        this.checkUserReview();
      },
      error: (error: any) => {
        console.error('Error loading reviews:', error);
        this.errorMessage = error.message || 'Failed to load reviews';
      }
    });
  }

  checkUserReview() {
    const currentUserId = this.authService.currentUser?.id;
    if (currentUserId) {
      this.userReview = this.reviews.find(review => review.client?.id === currentUserId) || null;
      this.hasUserReviewed = !!this.userReview;
      if (this.hasUserReviewed) {
        this.reviewForm.disable();
      }
    }
  }

  onSubmit() {
    if (this.reviewForm.valid && !this.isSubmitting && !this.hasUserReviewed) {
      this.isSubmitting = true;
      this.errorMessage = null;
      this.showAlreadyReviewedMessage = false;

      const reviewData: CreateReviewPayload = {
        ...this.reviewForm.value,
        vehicleId: this.vehicleId
      };

      this.reviewService.createReview(reviewData).subscribe({
        next: (response: Review) => {
          this.reviews.unshift(response);
          this.reviewForm.reset({ rating: 5 });
          this.isSubmitting = false;
          this.hasUserReviewed = true;
          this.userReview = response;
          this.reviewForm.disable();
        },
        error: (error: any) => {
          console.error('Error submitting review:', error);
          if (error.message === 'You have already reviewed this vehicle') {
            this.showAlreadyReviewedMessage = true;
            this.errorMessage = null;
          } else {
            this.errorMessage = error.message || 'Failed to submit review';
          }
          this.isSubmitting = false;
        }
      });
    }
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }

  setRating(rating: number) {
    this.reviewForm.patchValue({ rating });
  }

  getRatingStars(): number[] {
    const rating = this.reviewForm.get('rating')?.value || 0;
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }

  getStarClass(index: number): string {
    const rating = this.reviewForm.get('rating')?.value || 0;
    return index < rating ? 'fas fa-star' : 'far fa-star';
  }
}
