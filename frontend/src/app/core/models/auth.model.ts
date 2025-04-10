import { Role } from './role.enum';

export interface User {
  id: string;
  name?: string;
  email: string;
  role: Role;
  phoneNumber?: string;
  accessToken?: string;
  officeId?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: Role.CLIENT;
  officeId?: string;
}