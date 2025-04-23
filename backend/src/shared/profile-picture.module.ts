import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilePictureService } from './profile-picture.service';
import { ProfilePictureController } from './profile-picture.controller';
import { Client } from '../clients/entities/client.entity';
import { Agent } from '../agents/entities/agent.entity';
import { Admin } from '../admins/entities/admin.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, Agent, Admin]),
    CloudinaryModule,
  ],
  controllers: [ProfilePictureController],
  providers: [ProfilePictureService],
  exports: [ProfilePictureService],
})
export class ProfilePictureModule {} 