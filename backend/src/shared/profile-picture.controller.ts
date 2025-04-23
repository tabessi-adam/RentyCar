import { Controller, Post, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UseGuards, Request, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfilePictureService } from './profile-picture.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('profile-picture')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProfilePictureController {
  constructor(private readonly profilePictureService: ProfilePictureService) {}

  @Post(':role')
  @Roles(Role.ADMIN, Role.AGENT, Role.CLIENT)
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @Request() req,
    @Param('role') role: 'client' | 'agent' | 'admin',
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.profilePictureService.uploadProfilePicture(req.user.id, role, file);
  }

  @Delete(':role')
  @Roles(Role.ADMIN, Role.AGENT, Role.CLIENT)
  async deleteProfilePicture(
    @Request() req,
    @Param('role') role: 'client' | 'agent' | 'admin',
  ) {
    return this.profilePictureService.deleteProfilePicture(req.user.id, role);
  }
} 