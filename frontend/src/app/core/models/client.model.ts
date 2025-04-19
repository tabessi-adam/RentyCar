import { Role } from "./role.enum";

// Based on backend CreateClientDto
export interface CreateClientPayload {
  name: string;
  email: string;
  password: string; // Password might be handled separately in a real app
  phoneNumber?: string;
  role: Role.CLIENT; // Typically forced to CLIENT when creating via this route
}

// Based on backend UpdateClientDto (Partial of Create)
export interface UpdateClientPayload {
  name?: string;
  email?: string;
  password?: string; // Consider a dedicated password change flow
  phoneNumber?: string;
  // Role changes might be restricted
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
} 