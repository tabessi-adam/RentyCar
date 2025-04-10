import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('agents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createAgentDto: CreateAgentDto) {
    return this.agentsService.create(createAgentDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.agentsService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.agentsService.findOne(id);
  }

  @Get('office/:officeId')
  @Roles(Role.ADMIN)
  findByOffice(@Param('officeId') officeId: string) {
    return this.agentsService.findByOffice(officeId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateAgentDto: Partial<CreateAgentDto>) {
    return this.agentsService.update(id, updateAgentDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.agentsService.remove(id);
  }

  @Delete('profile/delete')
  @UseGuards(JwtAuthGuard)
  async deleteOwnProfile(@Request() req) {
    return this.agentsService.remove(req.user.id);
  }
} 