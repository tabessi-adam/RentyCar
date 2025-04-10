import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum ReservationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  CANCELLED = 'CANCELLED',
}

export class UpdateReservationDto {
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @IsNumber()
  @Min(1)
  @IsOptional()
  totalDays?: number;

  @IsEnum(ReservationStatus)
  @IsOptional()
  status?: ReservationStatus;
} 