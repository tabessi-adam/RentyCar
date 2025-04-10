import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto, ReservationStatus } from './dto/update-reservation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(@Body() createReservationDto: CreateReservationDto, @Request() req) {
    return this.reservationsService.create(createReservationDto, req.user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findAll(@Query('vehicleId') vehicleId?: string, @Query('clientId') clientId?: string) {
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
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
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
  @Roles(Role.ADMIN)
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: ReservationStatus,
  ) {
    return this.reservationsService.updateStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.reservationsService.remove(id, req.user.id);
  }
} 