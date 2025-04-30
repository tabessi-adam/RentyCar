import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleImage } from './entities/vehicle-image.entity';
import { Office } from '../offices/entities/office.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleFiltersDto } from './dto/vehicle-filters.dto';
import { VehicleStatus } from './entities/vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
    @InjectRepository(VehicleImage)
    private vehicleImagesRepository: Repository<VehicleImage>,
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
    console.log('VehiclesService - Finding all vehicles with filters:', filters);
    const queryBuilder = this.vehiclesRepository.createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.reservations', 'reservation')
      .leftJoinAndSelect('vehicle.images', 'image');

    if (filters) {
      // Search across multiple fields if search query is provided
      if (filters.search) {
        console.log('VehiclesService - Applying search filter:', filters.search);
        const searchQuery = `%${filters.search.toLowerCase()}%`;
        console.log('VehiclesService - Search query (lowercase):', searchQuery);
        
        queryBuilder.andWhere(
          '(LOWER(vehicle.brand) LIKE :search OR ' +
          'LOWER(vehicle.model) LIKE :search OR ' +
          'LOWER(vehicle.color) LIKE :search OR ' +
          'CONCAT(vehicle.year) LIKE :search)',
          { search: searchQuery }
        );
        
        console.log('VehiclesService - Search SQL condition added');
      }

      if (filters.status) {
        queryBuilder.andWhere('vehicle.status = :status', { status: filters.status });
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

    console.log('VehiclesService - Generated SQL query:', queryBuilder.getSql());
    console.log('VehiclesService - Query parameters:', queryBuilder.getParameters());
    
    const vehicles = await queryBuilder.getMany();
    console.log('VehiclesService - Found vehicles:', vehicles.length);
    
    // Add currentStatus to each vehicle
    const vehiclesWithStatus = vehicles.map(vehicle => ({
      ...vehicle,
      currentStatus: vehicle.currentStatus
    }));
    console.log('VehiclesService - Vehicles with status:', vehiclesWithStatus.length);
    return vehiclesWithStatus;
  }

  async findOne(id: string) {
    const vehicle = await this.vehiclesRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.reservations', 'reservation')
      .leftJoinAndSelect('vehicle.images', 'image')
      .where('vehicle.id = :id', { id })
      .getOne();

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
      color: updateVehicleDto.color,
      kilometersDriven: updateVehicleDto.kilometersDriven,
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
    
    // Check if vehicle is currently rented
    if (vehicle.currentStatus === VehicleStatus.RENTED) {
      throw new BadRequestException('Cannot delete a vehicle that is currently rented');
    }

    return this.vehiclesRepository.remove(vehicle);
  }

  async addImage(vehicleId: string, imageData: { url: string; publicId: string }) {
    const vehicle = await this.findOne(vehicleId);
    const image = this.vehicleImagesRepository.create({
      ...imageData,
      vehicleId: vehicle.id
    });
    return this.vehicleImagesRepository.save(image);
  }

  async removeImage(imageId: string) {
    const image = await this.vehicleImagesRepository.findOne({ where: { id: imageId } });
    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }
    return this.vehicleImagesRepository.remove(image);
  }

  async findImage(id: string): Promise<VehicleImage> {
    return this.vehicleImagesRepository.findOne({ where: { id } });
  }

  async deleteImage(id: string): Promise<void> {
    await this.vehicleImagesRepository.delete(id);
  }
} 