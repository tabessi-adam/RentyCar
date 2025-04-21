import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, NotFoundException, Query, UseInterceptors, UploadedFiles, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { VehiclesService } from '../vehicles.service';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { VehicleFiltersDto } from '../dto/vehicle-filters.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/enums/role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from '../../agents/entities/agent.entity';
import { Vehicle, VehicleStatus } from '../entities/vehicle.entity';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

@Controller('agent/vehicles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.AGENT)
export class AgentVehiclesController {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly cloudinaryService: CloudinaryService,
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
  async findAll(@Request() req, @Query() filters: VehicleFiltersDto) {
    const agent = await this.agentRepository.findOne({ where: { id: req.user.id } });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    
    // Always filter by the agent's office
    const filtersWithOffice = {
      ...filters,
      officeId: agent.officeId
    };
    
    return this.vehiclesService.findAll(filtersWithOffice);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const agent = await this.agentRepository.findOne({ where: { id: req.user.id } });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    
    const vehicle = await this.vehiclesService.findOne(id);
    
    // Check if the vehicle belongs to the agent's office
    if (vehicle.officeId !== agent.officeId) {
      throw new NotFoundException('Vehicle not found in your office');
    }
    
    return vehicle;
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 5))
  async update(
    @Param('id') id: string, 
    @Body() updateVehicleDto: UpdateVehicleDto,
    @Request() req,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    files?: Express.Multer.File[],
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
    
    if (files && files.length > 0) {
      // Upload new images without deleting existing ones
      for (const file of files) {
        const result = await this.cloudinaryService.uploadImage(file);
        await this.vehiclesService.addImage(vehicle.id, {
          url: result.secure_url,
          publicId: result.public_id
        });
      }
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

  @Delete('images/:id')
  async deleteImage(@Param('id') id: string, @Request() req) {
    const agent = await this.agentRepository.findOne({ where: { id: req.user.id } });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    const image = await this.vehiclesService.findImage(id);
    if (!image) {
      throw new NotFoundException('Image not found');
    }

    // Verify the image belongs to a vehicle in the agent's office
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: image.vehicleId, officeId: agent.officeId }
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found in your office');
    }

    // Delete from Cloudinary first
    await this.cloudinaryService.deleteImage(image.publicId);
    // Then delete from database
    await this.vehiclesService.deleteImage(id);
    
    return { message: 'Image deleted successfully' };
  }
} 