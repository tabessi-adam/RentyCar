import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Office } from '../../offices/entities/office.entity';

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  RENTED = 'RENTED',
  MAINTENANCE = 'MAINTENANCE',
}

export enum FuelType {
  PETROL = 'PETROL',
  DIESEL = 'DIESEL',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID',
}

export enum Transmission {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC',
}

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: VehicleStatus,
    default: VehicleStatus.AVAILABLE,
  })
  status: VehicleStatus;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column({
    type: 'enum',
    enum: FuelType,
  })
  fuelType: FuelType;

  @Column({
    type: 'enum',
    enum: Transmission,
  })
  transmission: Transmission;

  @Column('decimal', { precision: 10, scale: 2 })
  pricePerDay: number;

  @Column({ default: false })
  hasGPS: boolean;

  @Column({ default: false })
  hasBluetooth: boolean;

  @Column({ default: false })
  hasAirConditioning: boolean;

  @Column({ default: false })
  hasUSBCable: boolean;

  @Column()
  officeId: string;

  @ManyToOne(() => Office, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'officeId' })
  office: Office;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 