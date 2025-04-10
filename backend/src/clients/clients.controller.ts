import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.clientsService.findAll();
  }

  @Get('profile')
  @Roles(Role.CLIENT)
  async getOwnProfile(@Request() req) {
    return this.clientsService.findOne(req.user.id);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.CLIENT)
  async update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto, @Request() req) {
    // Allow admins to update any client profile
    if (req.user.role === Role.ADMIN) {
      return this.clientsService.update(id, updateClientDto);
    }
    
    // Clients can only update their own profile
    if (req.user.id !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }

  @Delete('profile/delete')
  @Roles(Role.CLIENT)
  async deleteOwnProfile(@Request() req) {
    return this.clientsService.remove(req.user.id);
  }
} 