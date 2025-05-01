import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CalendarComponent } from '../calendar/calendar.component';
import { Vehicle } from '../../../../core/models/vehicle.model';
import { ReservationService } from '../../../../core/services/reservation.service';
import { CreateReservationPayload } from '../../../../core/models/reservation.model';
import { take, filter } from 'rxjs/operators';
import { ReservationConfirmationDialogComponent } from './reservation-confirmation-dialog.component';
import { AuthService } from '../../../../core/services/auth.service';

interface DateRange {
  start: Date;
  end: Date;
}

interface ApiDateRange {
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-reserve',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    CalendarComponent
  ],
  templateUrl: './reserve.component.html',
  styleUrl: './reserve.component.scss'
})
export class ReserveComponent implements OnInit {
  @Input() vehicle!: Vehicle;
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  rentedDates: DateRange[] = [];
  isReserving = false;

  constructor(
    private reservationService: ReservationService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (!this.vehicle) {
      console.error('ReserveComponent - No vehicle provided!');
      return;
    }
    // Wait for authentication before loading vehicle availability
    this.reservationService['authService'].currentUser$
      .pipe(
        filter(user => !!user && !!user.accessToken),
        take(1)
      )
      .subscribe(() => {
        this.loadVehicleAvailability();
      });
  }

  loadVehicleAvailability() {
    this.reservationService.getVehicleAvailability(this.vehicle.id).subscribe({
      next: (dates: ApiDateRange[]) => {
        this.rentedDates = dates.map(date => ({
          start: new Date(date.startDate),
          end: new Date(date.endDate)
        }));
      },
      error: (error) => {
        console.error('Error loading vehicle availability:', error);
      }
    });
  }

  onDateRangeChange(event: { start: Date | null, end: Date | null }) {
    this.selectedStartDate = event.start;
    this.selectedEndDate = event.end;
  }

  calculateTotalPrice(): number {
    if (!this.selectedStartDate || !this.selectedEndDate) return 0;
    
    const days = Math.ceil(
      (this.selectedEndDate.getTime() - this.selectedStartDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return days * this.vehicle.pricePerDay;
  }

  calculateTotalDays(): number {
    if (!this.selectedStartDate || !this.selectedEndDate) return 0;
    return Math.ceil(
      (this.selectedEndDate.getTime() - this.selectedStartDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  reserveVehicle() {
    if (!this.selectedStartDate || !this.selectedEndDate) {
      this.snackBar.open('Please select both start and end dates', 'Close', {
        duration: 3000
      });
      return;
    }

    if (!this.authService.isAuthenticated()) {
      this.snackBar.open('Please log in to make a reservation', 'Login', {
        duration: 5000
      }).onAction().subscribe(() => {
        this.router.navigate(['/auth/login'], {
          queryParams: { returnUrl: this.router.url }
        });
      });
      return;
    }

    const dialogRef = this.dialog.open(ReservationConfirmationDialogComponent, {
      width: '500px',
      data: {
        vehicle: this.vehicle,
        startDate: this.selectedStartDate,
        endDate: this.selectedEndDate,
        totalPrice: this.calculateTotalPrice()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.processReservation();
      }
    });
  }

  private processReservation() {
    this.isReserving = true;

    const payload: CreateReservationPayload = {
      vehicleId: this.vehicle.id,
      startDate: this.selectedStartDate!.toISOString().split('T')[0],
      totalDays: this.calculateTotalDays()
    };

    this.reservationService.createReservation(payload).subscribe({
      next: (reservation) => {
        this.snackBar.open('Reservation created successfully!', 'View Reservations', {
          duration: 5000
        }).onAction().subscribe(() => {
          this.router.navigate(['/my-reservations']);
        });
      },
      error: (error) => {
        console.error('Error creating reservation:', error);
        this.snackBar.open('Error creating reservation. Please try again.', 'Close', {
          duration: 5000
        });
      },
      complete: () => {
        this.isReserving = false;
      }
    });
  }
}
