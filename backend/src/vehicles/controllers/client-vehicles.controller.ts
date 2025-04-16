import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { VehiclesService } from '../vehicles.service';
import { VehicleFiltersDto } from '../dto/vehicle-filters.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/enums/role.enum';

@Controller('client/vehicles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.CLIENT)
export class ClientVehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  findAll(@Query() filters: VehicleFiltersDto) {
    return this.vehiclesService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }
} 