import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not, LessThan } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto, ReservationStatus } from './dto/update-reservation.dto';
import { Vehicle, VehicleStatus } from '../vehicles/entities/vehicle.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
  ) {}

  async create(createReservationDto: CreateReservationDto, clientId: string) {
    const vehicle = await this.vehiclesRepository.findOne({
      where: { id: createReservationDto.vehicleId }
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (vehicle.status !== 'AVAILABLE') {
      throw new BadRequestException('Vehicle is not available for reservation');
    }

    const startDate = new Date(createReservationDto.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + createReservationDto.totalDays);

    // Check for any overlapping reservations (including pending ones)
    const overlappingReservation = await this.reservationsRepository.findOne({
      where: [
        {
          vehicleId: createReservationDto.vehicleId,
          status: ReservationStatus.ACCEPTED,
          startDate: Between(startDate, endDate),
        },
        {
          vehicleId: createReservationDto.vehicleId,
          status: ReservationStatus.PENDING,
          startDate: Between(startDate, endDate),
        },
        {
          vehicleId: createReservationDto.vehicleId,
          status: ReservationStatus.ACCEPTED,
          endDate: Between(startDate, endDate),
        },
        {
          vehicleId: createReservationDto.vehicleId,
          status: ReservationStatus.PENDING,
          endDate: Between(startDate, endDate),
        }
      ],
    });

    if (overlappingReservation) {
      throw new BadRequestException('Vehicle is already reserved for this period');
    }

    // Check for client's own overlapping reservations
    const clientOverlappingReservation = await this.reservationsRepository.findOne({
      where: [
        {
          clientId,
          vehicleId: createReservationDto.vehicleId,
          status: ReservationStatus.PENDING,
          startDate: Between(startDate, endDate),
        },
        {
          clientId,
          vehicleId: createReservationDto.vehicleId,
          status: ReservationStatus.PENDING,
          endDate: Between(startDate, endDate),
        }
      ],
    });

    if (clientOverlappingReservation) {
      throw new BadRequestException('You already have a pending reservation for this vehicle during this period');
    }

    // Calculate total price
    const totalPrice = Number(vehicle.pricePerDay) * createReservationDto.totalDays;

    const reservation = this.reservationsRepository.create({
      ...createReservationDto,
      clientId,
      endDate,
      totalPrice,
    });

    return this.reservationsRepository.save(reservation);
  }

  async findAll(filters?: { vehicleId?: string; clientId?: string }) {
    return this.reservationsRepository.find({
      where: filters,
      relations: ['client', 'vehicle'],
    });
  }

  async findByClientId(clientId: string) {
    return this.reservationsRepository.find({
      where: { clientId },
      relations: ['vehicle'],
    });
  }

  async findOne(id: string) {
    const reservation = await this.reservationsRepository.findOne({
      where: { id },
      relations: ['client', 'vehicle'],
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return reservation;
  }

  async update(id: string, updateReservationDto: UpdateReservationDto, clientId: string) {
    const reservation = await this.findOne(id);

    if (reservation.clientId !== clientId) {
      throw new BadRequestException('You can only update your own reservations');
    }

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException('Only pending reservations can be updated');
    }

    if (updateReservationDto.startDate || updateReservationDto.totalDays) {
      const startDate = updateReservationDto.startDate || reservation.startDate;
      const totalDays = updateReservationDto.totalDays || reservation.totalDays;
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + totalDays);

      // Check for overlapping reservations
      const overlappingReservation = await this.reservationsRepository.findOne({
        where: {
          vehicleId: reservation.vehicleId,
          status: ReservationStatus.ACCEPTED,
          startDate: Between(startDate, endDate),
          id: Not(id),
        },
      });

      if (overlappingReservation) {
        throw new BadRequestException('Vehicle is already reserved for this period');
      }

      // Get vehicle to recalculate total price
      const vehicle = await this.vehiclesRepository.findOne({
        where: { id: reservation.vehicleId }
      });

      if (!vehicle) {
        throw new NotFoundException('Vehicle not found');
      }

      // Calculate new total price
      const totalPrice = Number(vehicle.pricePerDay) * totalDays;

      updateReservationDto['endDate'] = endDate;
      updateReservationDto['totalPrice'] = totalPrice;
    }

    await this.reservationsRepository.update(id, updateReservationDto);
    return this.findOne(id);
  }

  async updateStatus(id: string, status: ReservationStatus) {
    const reservation = await this.findOne(id);

    if (status === ReservationStatus.ACCEPTED) {
      const vehicle = await this.vehiclesRepository.findOne({
        where: { id: reservation.vehicleId }
      });

      if (vehicle.status !== 'AVAILABLE') {
        throw new BadRequestException('Vehicle is not available');
      }

      // Check for overlapping reservations
      const overlappingReservation = await this.reservationsRepository.findOne({
        where: {
          vehicleId: reservation.vehicleId,
          status: ReservationStatus.ACCEPTED,
          startDate: Between(reservation.startDate, reservation.endDate),
          id: Not(id),
        },
      });

      if (overlappingReservation) {
        throw new BadRequestException('Vehicle is already reserved for this period');
      }

      await this.vehiclesRepository.update(reservation.vehicleId, { status: VehicleStatus.RENTED });
    }

    await this.reservationsRepository.update(id, { status });
    return this.findOne(id);
  }

  async remove(id: string, clientId: string) {
    const reservation = await this.findOne(id);

    if (reservation.clientId !== clientId) {
      throw new BadRequestException('You can only cancel your own reservations');
    }

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException('Only pending reservations can be cancelled');
    }

    await this.reservationsRepository.update(id, { status: ReservationStatus.CANCELLED });
    return this.findOne(id);
  }

  async hasClientRentedVehicle(clientId: string, vehicleId: string): Promise<boolean> {
    const reservation = await this.reservationsRepository.findOne({
      where: {
        clientId,
        vehicleId,
        status: ReservationStatus.ACCEPTED,
        endDate: LessThan(new Date()),
      },
    });

    return !!reservation;
  }
} 