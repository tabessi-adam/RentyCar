// Interface representing the Office entity
export interface Office {
  id: string;
  name: string;
  address: string;
  phoneNumber?: string;
  createdAt: string; // Use string for dates
  updatedAt: string; // Use string for dates
  // Relations usually omitted in basic list/detail views
  // agents?: Partial<Agent>[];
  // vehicles?: Partial<Vehicle>[];
}

// Based on backend CreateOfficeDto
export interface CreateOfficePayload {
  name: string;
  address: string;
  phoneNumber?: string;
}

// Based on backend UpdateOfficeDto (Partial of Create)
export type UpdateOfficePayload = Partial<CreateOfficePayload>; 