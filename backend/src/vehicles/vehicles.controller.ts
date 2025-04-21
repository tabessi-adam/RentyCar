import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createVehicleDto: CreateVehicleDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    if (file) {
      const result = await this.cloudinaryService.uploadImage(file);
      createVehicleDto.imageUrl = result.secure_url;
      createVehicleDto.imagePublicId = result.public_id;
    }
    return this.vehiclesService.create(createVehicleDto);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    const vehicle = await this.vehiclesService.findOne(id);
    
    if (file) {
      // Delete old image if exists
      if (vehicle.imagePublicId) {
        await this.cloudinaryService.deleteImage(vehicle.imagePublicId);
      }
      
      // Upload new image
      const result = await this.cloudinaryService.uploadImage(file);
      updateVehicleDto.imageUrl = result.secure_url;
      updateVehicleDto.imagePublicId = result.public_id;
    }
    
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const vehicle = await this.vehiclesService.findOne(id);
    
    // Delete image from Cloudinary if exists
    if (vehicle.imagePublicId) {
      await this.cloudinaryService.deleteImage(vehicle.imagePublicId);
    }
    
    return this.vehiclesService.remove(id);
  }

  // ... rest of your existing endpoints ...
} 