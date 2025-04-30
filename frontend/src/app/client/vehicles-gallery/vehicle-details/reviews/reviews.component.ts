import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from '../../../../core/services/review.service';
import { Review, CreateReviewPayload } from '../../../../core/models/review.model';
import { AuthService } from '../../../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit, OnDestroy {
  @Input() vehicleId!: string;
  reviews: Review[] = [];
  reviewForm: FormGroup;
  editForm: FormGroup;
  isSubmitting = false;
  isEditing = false;
  errorMessage: string | null = null;
  hasUserReviewed = false;
  userReview: Review | null = null;
  showAlreadyReviewedMessage = false;
  showNotRentedMessage = false;
  currentUserName: string | null = null;
  currentUserId: string | null = null;
  private authSubscription: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private authService: AuthService
  ) {
    this.reviewForm = this.fb.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.editForm = this.fb.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    // Initialize with current user state
    const currentUser = this.authService.currentUser;
    this.currentUserName = currentUser?.name || null;
    this.currentUserId = currentUser?.id || null;

    // Subscribe to auth state changes
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUserName = user?.name || null;
      this.currentUserId = user?.id || null;
      this.checkUserReview();
    });

    this.loadReviews();
    this.checkRentalStatus();
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  loadReviews() {
    this.reviewService.getAllReviews({ vehicleId: this.vehicleId }).subscribe({
      next: (reviews: Review[]) => {
        this.reviews = reviews;
        this.errorMessage = null;
        this.checkUserReview();
      },
      error: (error: any) => {
        console.error('Error loading reviews:', error);
        this.errorMessage = error.message || 'Failed to load reviews';
      }
    });
  }

  checkUserReview() {
    if (this.currentUserId) {
      this.userReview = this.reviews.find(review => review.client?.id === this.currentUserId) || null;
      this.hasUserReviewed = !!this.userReview;
      if (this.hasUserReviewed) {
        this.reviewForm.disable();
        this.editForm.patchValue({
          rating: this.userReview?.rating,
          comment: this.userReview?.comment
        });
      } else {
        this.reviewForm.enable();
      }
    }
  }

  checkRentalStatus() {
    // TODO: Implement rental status check
    // For now, we'll assume the user has rented the vehicle
    this.showNotRentedMessage = false;
  }

  onSubmit() {
    if (this.reviewForm.valid && !this.isSubmitting && !this.hasUserReviewed) {
      if (this.showNotRentedMessage) {
        this.errorMessage = 'You can only review vehicles you have rented.';
        return;
      }

      this.isSubmitting = true;
      this.errorMessage = null;
      this.showAlreadyReviewedMessage = false;

      const reviewData: CreateReviewPayload = {
        ...this.reviewForm.value,
        vehicleId: this.vehicleId
      };

      this.reviewService.createReview(reviewData).subscribe({
        next: (response: Review) => {
          // Add client information to the review
          const reviewWithClient = {
            ...response,
            client: {
              id: this.currentUserId!,
              name: this.currentUserName || 'Anonymous'
            }
          };
          
          this.reviews.unshift(reviewWithClient);
          this.reviewForm.reset({ rating: 5 });
          this.isSubmitting = false;
          this.userReview = reviewWithClient;
          this.hasUserReviewed = true;
          this.reviewForm.disable();
          this.editForm.patchValue({
            rating: response.rating,
            comment: response.comment
          });
        },
        error: (error: any) => {
          console.error('Error submitting review:', error);
          if (error.message === 'You have already reviewed this vehicle') {
            this.showAlreadyReviewedMessage = true;
            this.errorMessage = null;
          } else if (error.message === 'You can only review vehicles you have rented') {
            this.showNotRentedMessage = true;
            this.errorMessage = null;
          } else {
            this.errorMessage = error.message || 'Failed to submit review';
          }
          this.isSubmitting = false;
        }
      });
    }
  }

  onEditSubmit() {
    if (this.editForm.valid && !this.isSubmitting && this.userReview) {
      this.isSubmitting = true;
      this.errorMessage = null;

      const reviewData = {
        ...this.editForm.value,
        vehicleId: this.vehicleId
      };

      this.reviewService.updateReview(this.userReview.id, reviewData).subscribe({
        next: (response: Review) => {
          const index = this.reviews.findIndex(r => r.id === response.id);
          if (index !== -1) {
            this.reviews[index] = response;
          }
          this.userReview = response;
          this.isSubmitting = false;
          this.isEditing = false;
        },
        error: (error: any) => {
          console.error('Error updating review:', error);
          this.errorMessage = error.message || 'Failed to update review';
          this.isSubmitting = false;
        }
      });
    }
  }

  deleteReview() {
    if (this.userReview && confirm('Are you sure you want to delete your review?')) {
      this.reviewService.deleteReview(this.userReview.id).subscribe({
        next: () => {
          this.reviews = this.reviews.filter(r => r.id !== this.userReview?.id);
          this.userReview = null;
          this.hasUserReviewed = false;
          this.reviewForm.enable();
          this.reviewForm.reset({ rating: 5 });
        },
        error: (error: any) => {
          console.error('Error deleting review:', error);
          this.errorMessage = error.message || 'Failed to delete review';
        }
      });
    }
  }

  startEditing() {
    this.isEditing = true;
    this.editForm.patchValue({
      rating: this.userReview?.rating,
      comment: this.userReview?.comment
    });
  }

  cancelEditing() {
    this.isEditing = false;
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }

  setRating(rating: number, form: FormGroup) {
    form.patchValue({ rating });
  }

  getStarClass(index: number, rating: number): string {
    return index < rating ? 'fas fa-star' : 'far fa-star';
  }
}
