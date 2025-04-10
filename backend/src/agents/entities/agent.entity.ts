import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from '../../auth/enums/role.enum';
import { Office } from '../../offices/entities/office.entity';

@Entity('agents')
export class Agent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.AGENT
  })
  role: Role;

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