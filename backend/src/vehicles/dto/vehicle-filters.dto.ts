import { IsEnum, IsOptional, IsNumber, IsString, Min, Max } from 'class-validator';
import { VehicleStatus, FuelType, Transmission } from '../entities/vehicle.entity';
import { Type } from 'class-transformer';

export class VehicleFiltersDto {
  @IsOptional()
  @IsString()
  search?: string;

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
  @Type(() => Number)
  @IsNumber()
  @Min(1900)
  minYear?: number;

  @IsOptional()
  @Type(() => Number)
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
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsString()
  officeId?: string;

  @IsOptional()
  @Type(() => Boolean)
  hasGPS?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  hasBluetooth?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  hasAirConditioning?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  hasUSBCable?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
} 