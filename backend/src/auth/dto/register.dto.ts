import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { Role } from '../enums/role.enum';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
  
  @IsUUID()
  @IsOptional()
  officeId?: string;
} 