import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Office } from '../../offices/entities/office.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { VehicleImage } from './vehicle-image.entity';

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

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  imagePublicId: string;

  @Column()
  officeId: string;

  @ManyToOne(() => Office, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'officeId' })
  office: Office;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Reservation, reservation => reservation.vehicle)
  reservations: Reservation[];

  @OneToMany(() => VehicleImage, image => image.vehicle)
  images: VehicleImage[];

  get currentStatus(): VehicleStatus {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight for accurate date comparison

    const activeReservation = this.reservations?.find(reservation => {
      if (reservation.status !== 'ACCEPTED') return false;
      
      const startDate = new Date(reservation.startDate);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(reservation.endDate);
      endDate.setHours(0, 0, 0, 0);
      
      return startDate <= today && endDate >= today;
    });

    return activeReservation ? VehicleStatus.RENTED : this.status;
  }
} 