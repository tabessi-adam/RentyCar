import { IsDate, IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @IsUUID()
  @IsNotEmpty()
  vehicleId: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  totalDays: number;
} 