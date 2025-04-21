import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFiles, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { VehiclesService } from '../vehicles.service';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { VehicleFiltersDto } from '../dto/vehicle-filters.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/enums/role.enum';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

@Controller('admin/vehicles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminVehiclesController {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
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
  findAll(@Query() filters: VehicleFiltersDto) {
    return this.vehiclesService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Patch(':id')
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
  async remove(@Param('id') id: string) {
    const vehicle = await this.vehiclesService.findOne(id);
    
    // Delete images from Cloudinary
    for (const image of vehicle.images) {
      await this.cloudinaryService.deleteImage(image.publicId);
    }
    
    return this.vehiclesService.remove(id);
  }

  @Delete('images/:id')
  async deleteImage(@Param('id') id: string) {
    const image = await this.vehiclesService.findImage(id);
    if (image) {
      // Delete from Cloudinary first
      await this.cloudinaryService.deleteImage(image.publicId);
      // Then delete from database
      await this.vehiclesService.deleteImage(id);
    }
    return { message: 'Image deleted successfully' };
  }
} 