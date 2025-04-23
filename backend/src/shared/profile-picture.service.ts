import { Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../clients/entities/client.entity';
import { Agent } from '../agents/entities/agent.entity';
import { Admin } from '../admins/entities/admin.entity';

@Injectable()
export class ProfilePictureService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async uploadProfilePicture(
    userId: string,
    role: 'client' | 'agent' | 'admin',
    file: Express.Multer.File,
  ) {
    let user: Client | Agent | Admin;
    let repository: Repository<Client | Agent | Admin>;

    switch (role) {
      case 'client':
        repository = this.clientRepository;
        user = await this.clientRepository.findOne({ where: { id: userId } });
        break;
      case 'agent':
        repository = this.agentRepository;
        user = await this.agentRepository.findOne({ where: { id: userId } });
        break;
      case 'admin':
        repository = this.adminRepository;
        user = await this.adminRepository.findOne({ where: { id: userId } });
        break;
      default:
        throw new NotFoundException('Invalid user role');
    }

    if (!user) {
      throw new NotFoundException(`${role} not found`);
    }

    // Delete existing profile picture if any
    if (user.profilePicturePublicId) {
      await this.cloudinaryService.deleteImage(user.profilePicturePublicId);
    }

    // Upload new profile picture
    const result = await this.cloudinaryService.uploadImage(file, 'profile-pictures');

    // Update user with new profile picture
    user.profilePictureUrl = result.secure_url;
    user.profilePicturePublicId = result.public_id;

    return repository.save(user);
  }

  async deleteProfilePicture(userId: string, role: 'client' | 'agent' | 'admin') {
    let user: Client | Agent | Admin;
    let repository: Repository<Client | Agent | Admin>;

    switch (role) {
      case 'client':
        repository = this.clientRepository;
        user = await this.clientRepository.findOne({ where: { id: userId } });
        break;
      case 'agent':
        repository = this.agentRepository;
        user = await this.agentRepository.findOne({ where: { id: userId } });
        break;
      case 'admin':
        repository = this.adminRepository;
        user = await this.adminRepository.findOne({ where: { id: userId } });
        break;
      default:
        throw new NotFoundException('Invalid user role');
    }

    if (!user) {
      throw new NotFoundException(`${role} not found`);
    }

    if (user.profilePicturePublicId) {
      await this.cloudinaryService.deleteImage(user.profilePicturePublicId);
      user.profilePictureUrl = null;
      user.profilePicturePublicId = null;
      return repository.save(user);
    }

    return user;
  }
} 