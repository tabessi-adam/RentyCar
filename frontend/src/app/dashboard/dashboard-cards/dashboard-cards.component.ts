import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faCar, 
  faCalendarAlt, 
  faUsers, 
  faBuilding, 
  faCheckCircle, 
  faClock, 
  faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import { ReservationService } from '../../core/services/reservation.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { OfficeService } from '../../core/services/office.service';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../core/models/role.enum';
import { Reservation, ReservationStatus } from '../../core/models/reservation.model';
import { Vehicle, VehicleStatus } from '../../core/models/vehicle.model';
import { Office } from '../../core/models/office.model';

interface DashboardCard {
  title: string;
  value: number | string;
  icon: any;
  color: string;
  link?: string;
}

@Component({
  selector: 'app-dashboard-cards',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './dashboard-cards.component.html',
  styleUrls: ['./dashboard-cards.component.scss']
})
export class DashboardCardsComponent implements OnInit {
  cards: DashboardCard[] = [];
  userRole: Role | undefined;

  // Icons
  icons = {
    car: faCar,
    calendar: faCalendarAlt,
    users: faUsers,
    building: faBuilding,
    check: faCheckCircle,
    clock: faClock,
    warning: faExclamationTriangle
  };

  constructor(
    private reservationService: ReservationService,
    private vehicleService: VehicleService,
    private officeService: OfficeService,
    private authService: AuthService
  ) {
    this.userRole = this.authService.userRole();
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  async loadDashboardData() {
    try {
      const [reservations, vehicles, offices] = await Promise.all([
        this.reservationService.getMyReservations().toPromise(),
        this.vehicleService.getAllVehicles().toPromise(),
        this.officeService.getAllOffices().toPromise()
      ]);

      this.cards = [
        {
          title: 'Active Reservations',
          value: reservations?.filter((r: Reservation) => r.status === ReservationStatus.ACCEPTED).length || 0,
          icon: this.icons.calendar,
          color: 'primary',
          link: this.userRole === Role.ADMIN ? '/admin/reservations' : 
                this.userRole === Role.AGENT ? '/agent/reservations' : 
                '/client/reservations'
        },
        {
          title: 'Available Vehicles',
          value: vehicles?.filter((v: Vehicle) => v.status === VehicleStatus.AVAILABLE).length || 0,
          icon: this.icons.car,
          color: 'success',
          link: this.userRole === Role.ADMIN ? '/admin/vehicles' : 
                this.userRole === Role.AGENT ? '/agent/vehicles' : 
                '/client/vehicles'
        },
        {
          title: 'Total Vehicles',
          value: vehicles?.length || 0,
          icon: this.icons.car,
          color: 'info',
          link: this.userRole === Role.ADMIN ? '/admin/vehicles' : 
                this.userRole === Role.AGENT ? '/agent/vehicles' : 
                '/client/vehicles'
        }
      ];

      if (this.userRole === Role.ADMIN) {
        this.cards.push({
          title: 'Total Offices',
          value: offices?.length || 0,
          icon: this.icons.building,
          color: 'warning',
          link: '/admin/offices'
        });
      }

      // Add today's reservations card
      const today = new Date().toISOString().split('T')[0];
      const todayReservations = reservations?.filter((r: Reservation) => 
        r.startDate.split('T')[0] === today
      ).length || 0;

      this.cards.push({
        title: "Today's Reservations",
        value: todayReservations,
        icon: this.icons.clock,
        color: 'secondary',
        link: this.userRole === Role.ADMIN ? '/admin/reservations' : 
              this.userRole === Role.AGENT ? '/agent/reservations' : 
              '/client/reservations'
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }
} 