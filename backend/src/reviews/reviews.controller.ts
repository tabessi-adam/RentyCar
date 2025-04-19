import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from '../agents/entities/agent.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    return this.reviewsService.create(createReviewDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.AGENT)
  async findAll(@Request() req: any, @Query('vehicleId') vehicleId?: string, @Query('clientId') clientId?: string) {
    const filters: { vehicleId?: string | string[]; clientId?: string } = {};
    
    // If user is an agent, get their office's vehicles
    if (req.user.role === Role.AGENT) {
      const agent = await this.agentRepository.findOne({
        where: { id: req.user.id },
        relations: ['office']
      });
      
      if (!agent || !agent.office) {
        throw new Error('Agent or office not found');
      }

      const officeVehicles = await this.vehicleRepository.find({
        where: { officeId: agent.office.id },
        select: ['id']
      });

      filters.vehicleId = officeVehicles.map(v => v.id);
    } else if (vehicleId) {
      filters.vehicleId = vehicleId;
    }

    if (clientId) {
      filters.clientId = clientId;
    }

    return this.reviewsService.findAll(filters);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.AGENT)
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto, @Request() req) {
    return this.reviewsService.update(id, updateReviewDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Request() req) {
    // If user is admin, don't pass clientId to allow deletion of any review
    // If user is client, pass clientId to restrict deletion to their own reviews
    // If user is agent, check if the review belongs to a vehicle in their office
    if (req.user.role === Role.ADMIN) {
      return this.reviewsService.remove(id);
    } else if (req.user.role === Role.AGENT) {
      const review = await this.reviewsService.findOne(id);
      const agent = await this.agentRepository.findOne({
        where: { id: req.user.id },
        relations: ['office']
      });
      
      if (!agent || !agent.office) {
        throw new Error('Agent or office not found');
      }

      const vehicle = await this.vehicleRepository.findOne({
        where: { id: review.vehicleId }
      });

      if (!vehicle || vehicle.officeId !== agent.office.id) {
        throw new ForbiddenException('You can only delete reviews for vehicles in your office');
      }

      return this.reviewsService.remove(id);
    } else {
      // For clients, they can only delete their own reviews
      return this.reviewsService.remove(id, req.user.id);
    }
  }
} 