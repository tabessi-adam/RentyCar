import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { Role } from '../auth/enums/role.enum';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const hashedPassword = await bcrypt.hash(createClientDto.password, 10);
    const client = this.clientRepository.create({
      name: createClientDto.name,
      email: createClientDto.email,
      password: hashedPassword,
      phoneNumber: createClientDto.phoneNumber,
      role: createClientDto.role || Role.CLIENT
    });
    return this.clientRepository.save(client);
  }

  async findAll(): Promise<Client[]> {
    return this.clientRepository.find();
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);
    if (updateClientDto.password) {
      updateClientDto.password = await bcrypt.hash(updateClientDto.password, 10);
    }
    Object.assign(client, updateClientDto);
    return this.clientRepository.save(client);
  }

  async updatePassword(id: string, updatePasswordDto: { oldPassword: string; newPassword: string }): Promise<void> {
    const client = await this.findOne(id);
    
    // Verify old password
    const isPasswordValid = await bcrypt.compare(updatePasswordDto.oldPassword, client.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    
    // Hash and update new password
    const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);
    client.password = hashedPassword;
    await this.clientRepository.save(client);
  }

  async remove(id: string): Promise<void> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['reviews', 'reservations']
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    // Delete the client and all related entities will be deleted due to cascade
    await this.clientRepository.remove(client);
  }
} 