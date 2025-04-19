import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, NotFoundException } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto, ReservationStatus } from './dto/update-reservation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from '../agents/entities/agent.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';

@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
  ) {}

  @Post()
  create(@Body() createReservationDto: CreateReservationDto, @Request() req) {
    return this.reservationsService.create(createReservationDto, req.user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  async findAll(@Request() req, @Query('vehicleId') vehicleId?: string, @Query('clientId') clientId?: string) {
    // If user is an agent, filter by their office's vehicles
    if (req.user.role === Role.AGENT) {
      const agent = await this.agentRepository.findOne({ where: { id: req.user.id } });
      if (!agent) {
        throw new NotFoundException('Agent not found');
      }

      // Get all vehicles from the agent's office
      const vehicles = await this.vehicleRepository.find({ 
        where: { officeId: agent.officeId },
        select: ['id']
      });

      // Get all reservations for these vehicles
      const vehicleIds = vehicles.map(vehicle => vehicle.id);
      return this.reservationsService.findAll({ vehicleId: vehicleIds });
    }

    // For admin, use the provided filters
    const filters: { vehicleId?: string; clientId?: string } = {};
    if (vehicleId) filters.vehicleId = vehicleId;
    if (clientId) filters.clientId = clientId;
    return this.reservationsService.findAll(filters);
  }

  @Get('my-reservations')
  findMyReservations(@Request() req) {
    return this.reservationsService.findByClientId(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const reservation = await this.reservationsService.findOne(id);

    // If user is an agent, check if the vehicle belongs to their office
    if (req.user.role === Role.AGENT) {
      const agent = await this.agentRepository.findOne({ where: { id: req.user.id } });
      if (!agent) {
        throw new NotFoundException('Agent not found');
      }

      const vehicle = await this.vehicleRepository.findOne({ 
        where: { id: reservation.vehicleId, officeId: agent.officeId } 
      });
      
      if (!vehicle) {
        throw new NotFoundException('Reservation not found in your office');
      }
    }

    return reservation;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
    @Request() req,
  ) {
    return this.reservationsService.update(id, updateReservationDto, req.user.id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.AGENT)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ReservationStatus,
    @Request() req,
  ) {
    // If user is an agent, check if the vehicle belongs to their office
    if (req.user.role === Role.AGENT) {
      const agent = await this.agentRepository.findOne({ where: { id: req.user.id } });
      if (!agent) {
        throw new NotFoundException('Agent not found');
      }

      const reservation = await this.reservationsService.findOne(id);
      const vehicle = await this.vehicleRepository.findOne({ 
        where: { id: reservation.vehicleId, officeId: agent.officeId } 
      });
      
      if (!vehicle) {
        throw new NotFoundException('Reservation not found in your office');
      }
    }

    return this.reservationsService.updateStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.reservationsService.remove(id, req.user.id);
  }
} 