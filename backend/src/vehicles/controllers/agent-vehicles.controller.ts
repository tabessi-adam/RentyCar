import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { VehiclesService } from '../vehicles.service';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/enums/role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from '../../agents/entities/agent.entity';
import { Vehicle, VehicleStatus } from '../entities/vehicle.entity';

@Controller('agent/vehicles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.AGENT)
export class AgentVehiclesController {
  constructor(
    private readonly vehiclesService: VehiclesService,
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
  ) {}

  @Post()
  async create(@Body() createVehicleDto: CreateVehicleDto, @Request() req) {
    const agent = await this.agentRepository.findOne({ where: { id: req.user.id } });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    
    // Use the VehiclesService to create the vehicle with the agent's officeId
    return this.vehiclesService.create({
      ...createVehicleDto,
      officeId: agent.officeId,
      status: VehicleStatus.AVAILABLE // Set default status if not provided
    });
  }

  @Get()
  async findAll(@Request() req) {
    const agent = await this.agentRepository.findOne({ where: { id: req.user.id } });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    
    // Return only vehicles from the agent's office
    return this.vehicleRepository.find({ where: { officeId: agent.officeId } });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const agent = await this.agentRepository.findOne({ where: { id: req.user.id } });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    
    const vehicle = await this.vehicleRepository.findOne({ 
      where: { id, officeId: agent.officeId } 
    });
    
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found in your office');
    }
    
    return vehicle;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateVehicleDto: UpdateVehicleDto,
    @Request() req
  ) {
    const agent = await this.agentRepository.findOne({ where: { id: req.user.id } });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    
    const vehicle = await this.vehicleRepository.findOne({ 
      where: { id, officeId: agent.officeId } 
    });
    
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found in your office');
    }
    
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const agent = await this.agentRepository.findOne({ where: { id: req.user.id } });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    
    const vehicle = await this.vehicleRepository.findOne({ 
      where: { id, officeId: agent.officeId } 
    });
    
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found in your office');
    }
    
    return this.vehiclesService.remove(id);
  }
} 