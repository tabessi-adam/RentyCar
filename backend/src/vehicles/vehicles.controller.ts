import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UseGuards } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('vehicles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VehiclesController {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.AGENT)
  @UseInterceptors(FilesInterceptor('images', 5)) // Allow up to 5 images
  async create(
    @Body() createVehicleDto: CreateVehicleDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB per file
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    files?: Express.Multer.File[],
  ) {
    const vehicle = await this.vehiclesService.create(createVehicleDto);
    
    if (files && files.length > 0) {
      for (const file of files) {
        const result = await this.cloudinaryService.uploadImage(file);
        await this.vehiclesService.addImage(vehicle.id, {
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    }
    
    return this.vehiclesService.findOne(vehicle.id);
  }

  @Get()
  @Roles(Role.ADMIN, Role.AGENT, Role.CLIENT)
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.AGENT, Role.CLIENT)
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.AGENT)
  @UseInterceptors(FilesInterceptor('images', 5))
  async update(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
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
    const vehicle = await this.vehiclesService.findOne(id);
    
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
  @Roles(Role.ADMIN, Role.AGENT)
  async remove(@Param('id') id: string) {
    const vehicle = await this.vehiclesService.findOne(id);
    
    // Delete images from Cloudinary
    for (const image of vehicle.images) {
      await this.cloudinaryService.deleteImage(image.publicId);
    }
    
    return this.vehiclesService.remove(id);
  }
} 