import { IsEnum, IsOptional, IsNumber, IsString, Min, Max } from 'class-validator';
import { VehicleStatus, FuelType, Transmission } from '../entities/vehicle.entity';

export class VehicleFiltersDto {
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  @Min(1900)
  minYear?: number;

  @IsOptional()
  @IsNumber()
  @Max(new Date().getFullYear() + 1)
  maxYear?: number;

  @IsOptional()
  @IsEnum(FuelType)
  fuelType?: FuelType;

  @IsOptional()
  @IsEnum(Transmission)
  transmission?: Transmission;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsString()
  officeId?: string;

  @IsOptional()
  hasGPS?: boolean;

  @IsOptional()
  hasBluetooth?: boolean;

  @IsOptional()
  hasAirConditioning?: boolean;

  @IsOptional()
  hasUSBCable?: boolean;
} 