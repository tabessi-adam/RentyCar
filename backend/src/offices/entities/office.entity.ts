import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Agent } from '../../agents/entities/agent.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

@Entity('offices')
export class Office {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @OneToMany(() => Agent, agent => agent.office)
  agents: Agent[];

  @OneToMany(() => Vehicle, vehicle => vehicle.office)
  vehicles: Vehicle[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 