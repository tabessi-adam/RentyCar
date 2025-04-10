import { Role } from "./role.enum";

// Based on backend Admin entity for creation payload
export interface CreateAdminPayload {
  name: string;
  email: string;
  password: string; // Handled by backend hashing
  phoneNumber?: string;
  role: Role.ADMIN; // Should always be ADMIN
}

// Based on backend Admin entity for update payload (partial)
export interface UpdateAdminPayload {
  name?: string;
  email?: string;
  password?: string; // Consider separate password change flow
  phoneNumber?: string;
  // Role change likely not applicable/allowed
} 