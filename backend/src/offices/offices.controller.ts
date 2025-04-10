import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OfficesService } from './offices.service';
import { CreateOfficeDto } from './dto/create-office.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('offices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OfficesController {
  constructor(private readonly officesService: OfficesService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createOfficeDto: CreateOfficeDto) {
    return this.officesService.create(createOfficeDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.AGENT)
  findAll() {
    return this.officesService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.AGENT)
  findOne(@Param('id') id: string) {
    return this.officesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateOfficeDto: Partial<CreateOfficeDto>) {
    return this.officesService.update(id, updateOfficeDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.officesService.remove(id);
  }
} 