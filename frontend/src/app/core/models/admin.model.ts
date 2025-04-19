import { Role } from "./role.enum";

// Interface representing the Admin entity (subset of User)
// Re-using the User interface from auth.model might be sufficient if needed.
export interface Admin {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: 'admin'; // Explicitly admin
  // Add createdAt/updatedAt if needed
  createdAt?: string;
  updatedAt?: string;
}

// Based on backend CreateAdminDto
export interface CreateAdminPayload {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

// Based on backend UpdateAdminDto (Partial of Create)
export type UpdateAdminPayload = Partial<Omit<CreateAdminPayload, 'password'>>; // Usually exclude password from direct update payload 