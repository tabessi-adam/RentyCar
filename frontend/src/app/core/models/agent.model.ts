// Interface representing the Agent entity (subset of User + officeId)
// Re-using the User interface from auth.model might be sufficient if needed.
export interface Agent {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  officeId: string;
  role: 'agent'; // Explicitly agent
  // Add createdAt/updatedAt if needed
  createdAt?: string;
  updatedAt?: string;
}

// Based on backend CreateAgentDto
export interface CreateAgentPayload {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  officeId: string;
}

// Based on backend UpdateAgentDto (Partial of Create)
export type UpdateAgentPayload = Partial<Omit<CreateAgentPayload, 'password'>>; // Usually exclude password from direct update payload 