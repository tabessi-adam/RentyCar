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
      console.log('Loading dashboard data...');
      console.log('User role:', this.userRole);

      const [reservations, vehicles, offices] = await Promise.all([
        this.userRole === Role.ADMIN || this.userRole === Role.AGENT 
          ? this.reservationService.getAllReservations().toPromise()
          : this.reservationService.getMyReservations().toPromise(),
        this.vehicleService.getAllVehicles().toPromise(),
        this.officeService.getAllOffices().toPromise()
      ]);

      console.log('API Responses:', {
        reservations,
        vehicles,
        offices
      });

      // Debug reservation data
      if (reservations) {
        console.log('All reservations:', reservations);
        console.log('Pending reservations:', reservations.filter((r: Reservation) => r.status === ReservationStatus.PENDING));
        console.log('Reservation statuses:', reservations.map((r: Reservation) => r.status));
      }

      if (!reservations || !vehicles || !offices) {
        console.error('Failed to load dashboard data - one or more services returned null');
        return;
      }

      // Debug vehicle data
      console.log('Vehicles data:', vehicles);
      console.log('Available vehicles:', vehicles.filter((v: Vehicle) => v.status === VehicleStatus.AVAILABLE));

      this.cards = [
        {
          title: 'Active Reservations',
          value: reservations.filter((r: Reservation) => r.status === ReservationStatus.ACCEPTED).length,
          icon: this.icons.calendar,
          color: 'primary',
          link: this.userRole === Role.ADMIN ? '/admin/reservations' : 
                this.userRole === Role.AGENT ? '/agent/reservations' : 
                '/client/reservations'
        },
        {
          title: 'Pending Reservations',
          value: reservations.filter((r: Reservation) => r.status === ReservationStatus.PENDING).length,
          icon: this.icons.clock,
          color: 'warning',
          link: this.userRole === Role.ADMIN ? '/admin/reservations' : 
                this.userRole === Role.AGENT ? '/agent/reservations' : 
                '/client/reservations'
        },
        {
          title: 'Available Vehicles',
          value: vehicles.filter((v: Vehicle) => v.status === VehicleStatus.AVAILABLE).length,
          icon: this.icons.car,
          color: 'success',
          link: this.userRole === Role.ADMIN ? '/admin/vehicles' : 
                this.userRole === Role.AGENT ? '/agent/vehicles' : 
                '/client/vehicles'
        },
        {
          title: 'Total Vehicles',
          value: vehicles.length,
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
          value: offices.length,
          icon: this.icons.building,
          color: 'secondary',
          link: '/admin/offices'
        });
      }

      console.log('Final cards data:', this.cards);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set default values when there's an error
      this.cards = [
        {
          title: 'Active Reservations',
          value: 0,
          icon: this.icons.calendar,
          color: 'primary',
          link: this.userRole === Role.ADMIN ? '/admin/reservations' : 
                this.userRole === Role.AGENT ? '/agent/reservations' : 
                '/client/reservations'
        },
        {
          title: 'Pending Reservations',
          value: 0,
          icon: this.icons.clock,
          color: 'warning',
          link: this.userRole === Role.ADMIN ? '/admin/reservations' : 
                this.userRole === Role.AGENT ? '/agent/reservations' : 
                '/client/reservations'
        },
        {
          title: 'Available Vehicles',
          value: 0,
          icon: this.icons.car,
          color: 'success',
          link: this.userRole === Role.ADMIN ? '/admin/vehicles' : 
                this.userRole === Role.AGENT ? '/agent/vehicles' : 
                '/client/vehicles'
        },
        {
          title: 'Total Vehicles',
          value: 0,
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
          value: 0,
          icon: this.icons.building,
          color: 'secondary',
          link: '/admin/offices'
        });
      }
    }
  }
} 