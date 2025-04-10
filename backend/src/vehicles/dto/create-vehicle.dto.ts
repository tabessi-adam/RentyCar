import { IsEnum, IsString, IsNumber, IsBoolean, IsOptional, Min, Max, IsUUID, IsNotEmpty } from 'class-validator';
import { VehicleStatus, FuelType, Transmission } from '../entities/vehicle.entity';

export class CreateVehicleDto {
  @IsEnum(VehicleStatus)
  @IsOptional()
  status?: VehicleStatus;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsEnum(FuelType)
  fuelType: FuelType;

  @IsEnum(Transmission)
  transmission: Transmission;

  @IsNumber()
  @Min(0)
  pricePerDay: number;

  @IsOptional()
  @IsBoolean()
  hasGPS?: boolean;

  @IsOptional()
  @IsBoolean()
  hasBluetooth?: boolean;

  @IsOptional()
  @IsBoolean()
  hasAirConditioning?: boolean;

  @IsOptional()
  @IsBoolean()
  hasUSBCable?: boolean;

  @IsUUID()
  @IsNotEmpty()
  officeId: string;
} 