import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Office } from './entities/office.entity';
import { CreateOfficeDto } from './dto/create-office.dto';

@Injectable()
export class OfficesService {
  constructor(
    @InjectRepository(Office)
    private officesRepository: Repository<Office>,
  ) {}

  async create(createOfficeDto: CreateOfficeDto): Promise<Office> {
    const office = this.officesRepository.create(createOfficeDto);
    return await this.officesRepository.save(office);
  }

  async findAll(): Promise<Office[]> {
    return this.officesRepository.find();
  }

  async findOne(id: string): Promise<Office> {
    const office = await this.officesRepository.findOne({ where: { id } });
    if (!office) {
      throw new NotFoundException(`Office with ID ${id} not found`);
    }
    return office;
  }

  async update(id: string, updateOfficeDto: Partial<CreateOfficeDto>): Promise<Office> {
    const office = await this.findOne(id);
    Object.assign(office, updateOfficeDto);
    return await this.officesRepository.save(office);
  }

  async remove(id: string): Promise<void> {
    const result = await this.officesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Office with ID ${id} not found`);
    }
  }
} 