import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Office } from '../offices/entities/office.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleFiltersDto } from './dto/vehicle-filters.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
    @InjectRepository(Office)
    private officeRepository: Repository<Office>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto) {
    // Check if office exists
    const office = await this.officeRepository.findOne({
      where: { id: createVehicleDto.officeId },
    });

    if (!office) {
      throw new NotFoundException(`Office with ID ${createVehicleDto.officeId} not found`);
    }

    const vehicle = this.vehiclesRepository.create(createVehicleDto);
    return this.vehiclesRepository.save(vehicle);
  }

  async findAll(filters?: VehicleFiltersDto) {
    const queryBuilder = this.vehiclesRepository.createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.reservations', 'reservation');

    if (filters) {
      if (filters.status) {
        // For status filter, we need to check both status and current reservations
        if (filters.status === 'AVAILABLE') {
          queryBuilder.andWhere('vehicle.status = :status', { status: filters.status })
            .andWhere('(reservation.id IS NULL OR NOT (reservation.status = :accepted AND :today BETWEEN reservation.startDate AND reservation.endDate))', 
              { accepted: 'ACCEPTED', today: new Date() });
        } else if (filters.status === 'RENTED') {
          queryBuilder.andWhere('reservation.status = :accepted AND :today BETWEEN reservation.startDate AND reservation.endDate',
            { accepted: 'ACCEPTED', today: new Date() });
        } else {
          queryBuilder.andWhere('vehicle.status = :status', { status: filters.status });
        }
      }

      if (filters.brand) {
        queryBuilder.andWhere('vehicle.brand LIKE :brand', { brand: `%${filters.brand}%` });
      }

      if (filters.model) {
        queryBuilder.andWhere('vehicle.model LIKE :model', { model: `%${filters.model}%` });
      }

      if (filters.minYear || filters.maxYear) {
        if (filters.minYear && filters.maxYear) {
          queryBuilder.andWhere('vehicle.year BETWEEN :minYear AND :maxYear', {
            minYear: filters.minYear,
            maxYear: filters.maxYear,
          });
        } else if (filters.minYear) {
          queryBuilder.andWhere('vehicle.year >= :minYear', { minYear: filters.minYear });
        } else if (filters.maxYear) {
          queryBuilder.andWhere('vehicle.year <= :maxYear', { maxYear: filters.maxYear });
        }
      }

      if (filters.fuelType) {
        queryBuilder.andWhere('vehicle.fuelType = :fuelType', { fuelType: filters.fuelType });
      }

      if (filters.transmission) {
        queryBuilder.andWhere('vehicle.transmission = :transmission', { transmission: filters.transmission });
      }

      if (filters.minPrice || filters.maxPrice) {
        if (filters.minPrice && filters.maxPrice) {
          queryBuilder.andWhere('vehicle.pricePerDay BETWEEN :minPrice AND :maxPrice', {
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
          });
        } else if (filters.minPrice) {
          queryBuilder.andWhere('vehicle.pricePerDay >= :minPrice', { minPrice: filters.minPrice });
        } else if (filters.maxPrice) {
          queryBuilder.andWhere('vehicle.pricePerDay <= :maxPrice', { maxPrice: filters.maxPrice });
        }
      }

      if (filters.officeId) {
        queryBuilder.andWhere('vehicle.officeId = :officeId', { officeId: filters.officeId });
      }

      if (filters.hasGPS !== undefined) {
        queryBuilder.andWhere('vehicle.hasGPS = :hasGPS', { hasGPS: filters.hasGPS });
      }

      if (filters.hasBluetooth !== undefined) {
        queryBuilder.andWhere('vehicle.hasBluetooth = :hasBluetooth', { hasBluetooth: filters.hasBluetooth });
      }

      if (filters.hasAirConditioning !== undefined) {
        queryBuilder.andWhere('vehicle.hasAirConditioning = :hasAirConditioning', { hasAirConditioning: filters.hasAirConditioning });
      }

      if (filters.hasUSBCable !== undefined) {
        queryBuilder.andWhere('vehicle.hasUSBCable = :hasUSBCable', { hasUSBCable: filters.hasUSBCable });
      }
    }

    const vehicles = await queryBuilder.getMany();
    
    // Add currentStatus to each vehicle
    return vehicles.map(vehicle => ({
      ...vehicle,
      currentStatus: vehicle.currentStatus
    }));
  }

  async findOne(id: string) {
    const vehicle = await this.vehiclesRepository.findOne({ 
      where: { id },
      relations: ['reservations']
    });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return vehicle;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    const vehicle = await this.findOne(id);
    // Create a new object with only the properties that can be updated
    const updateData = {
      status: updateVehicleDto.status,
      brand: updateVehicleDto.brand,
      model: updateVehicleDto.model,
      year: updateVehicleDto.year,
      fuelType: updateVehicleDto.fuelType,
      transmission: updateVehicleDto.transmission,
      pricePerDay: updateVehicleDto.pricePerDay,
      hasGPS: updateVehicleDto.hasGPS,
      hasBluetooth: updateVehicleDto.hasBluetooth,
      hasAirConditioning: updateVehicleDto.hasAirConditioning,
      hasUSBCable: updateVehicleDto.hasUSBCable,
      officeId: updateVehicleDto.officeId
    };
    
    // Remove undefined values
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
    
    Object.assign(vehicle, updateData);
    return this.vehiclesRepository.save(vehicle);
  }

  async remove(id: string) {
    const vehicle = await this.findOne(id);
    return this.vehiclesRepository.remove(vehicle);
  }
} 