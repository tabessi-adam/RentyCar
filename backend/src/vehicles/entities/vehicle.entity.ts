import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Office } from '../../offices/entities/office.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';

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

  @OneToMany(() => Reservation, reservation => reservation.vehicle)
  reservations: Reservation[];

  get currentStatus(): VehicleStatus {
    const today = new Date();
    const activeReservation = this.reservations?.find(reservation => 
      reservation.status === 'ACCEPTED' &&
      new Date(reservation.startDate) <= today &&
      new Date(reservation.endDate) >= today
    );

    return activeReservation ? VehicleStatus.RENTED : this.status;
  }
} 