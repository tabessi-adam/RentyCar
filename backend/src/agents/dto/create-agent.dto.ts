import { IsString, IsEmail, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateAgentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsUUID()
  @IsNotEmpty()
  officeId: string;
} 