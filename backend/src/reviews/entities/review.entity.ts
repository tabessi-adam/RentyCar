import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 2, scale: 1 })
  rating: number;

  @Column('text', { nullable: true })
  comment: string;

  @ManyToOne(() => Client, { onDelete: 'CASCADE' })
  client: Client;

  @Column()
  clientId: string;

  @ManyToOne(() => Vehicle, { onDelete: 'CASCADE' })
  vehicle: Vehicle;

  @Column()
  vehicleId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 