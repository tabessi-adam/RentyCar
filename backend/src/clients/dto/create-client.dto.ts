import { IsEnum } from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

export class CreateClientDto {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  @IsEnum(Role)
  role: Role;
} 