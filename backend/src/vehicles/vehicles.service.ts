import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Office } from '../offices/entities/office.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

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

  findAll() {
    return this.vehiclesRepository.find();
  }

  async findOne(id: string) {
    const vehicle = await this.vehiclesRepository.findOne({ where: { id } });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return vehicle;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    const vehicle = await this.findOne(id);
    Object.assign(vehicle, updateVehicleDto);
    return this.vehiclesRepository.save(vehicle);
  }

  async remove(id: string) {
    const vehicle = await this.findOne(id);
    return this.vehiclesRepository.remove(vehicle);
  }
} 