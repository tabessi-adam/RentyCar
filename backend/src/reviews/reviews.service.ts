import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReservationsService } from '../reservations/reservations.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    private reservationsService: ReservationsService,
  ) {}

  async create(createReviewDto: CreateReviewDto, clientId: string) {
    // Check if the client has rented this vehicle
    const hasRented = await this.reservationsService.hasClientRentedVehicle(clientId, createReviewDto.vehicleId);
    if (!hasRented) {
      throw new BadRequestException('You can only review vehicles you have rented');
    }

    // Check if client has already reviewed this vehicle
    const existingReview = await this.reviewsRepository.findOne({
      where: {
        clientId,
        vehicleId: createReviewDto.vehicleId,
      },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this vehicle');
    }

    const review = this.reviewsRepository.create({
      ...createReviewDto,
      clientId,
    });

    return this.reviewsRepository.save(review);
  }

  async findAll(filters?: { vehicleId?: string | string[]; clientId?: string }) {
    const queryBuilder = this.reviewsRepository.createQueryBuilder('review')
      .leftJoinAndSelect('review.client', 'client')
      .leftJoinAndSelect('review.vehicle', 'vehicle')
      .select([
        'review.id',
        'review.rating',
        'review.comment',
        'review.createdAt',
        'review.updatedAt',
        'client.id',
        'client.name',
        'client.email',
        'client.profilePictureUrl',
        'vehicle.id',
        'vehicle.brand',
        'vehicle.model',
        'vehicle.year',
        'vehicle.color'
      ])
      .orderBy('review.createdAt', 'DESC');

    if (filters) {
      if (filters.vehicleId) {
        if (Array.isArray(filters.vehicleId)) {
          queryBuilder.andWhere('review.vehicleId IN (:...vehicleIds)', { vehicleIds: filters.vehicleId });
        } else {
          queryBuilder.andWhere('review.vehicleId = :vehicleId', { vehicleId: filters.vehicleId });
        }
      }
      if (filters.clientId) {
        queryBuilder.andWhere('review.clientId = :clientId', { clientId: filters.clientId });
      }
    }

    try {
      return await queryBuilder.getMany();
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  async findOne(id: string) {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: ['client', 'vehicle'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, clientId: string) {
    const review = await this.findOne(id);

    if (review.clientId !== clientId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    // Update the review
    Object.assign(review, updateReviewDto);
    return this.reviewsRepository.save(review);
  }

  async remove(id: string, clientId?: string) {
    const review = await this.findOne(id);

    // If clientId is provided, check if the review belongs to the client
    if (clientId && review.clientId !== clientId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.reviewsRepository.remove(review);
    return { message: 'Review deleted successfully' };
  }
} 