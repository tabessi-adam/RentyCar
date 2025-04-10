export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  RENTED = 'RENTED',
  MAINTENANCE = 'MAINTENANCE',
}

export enum FuelType {
  PETROL = 'PETROL',
  DIESEL = 'DIESEL',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID',
}

export enum Transmission {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC',
}

// Interface representing the Vehicle entity
export interface Vehicle {
  id: string;
  status: VehicleStatus;
  brand: string;
  model: string;
  year: number;
  fuelType: FuelType;
  transmission: Transmission;
  pricePerDay: number;
  hasGPS: boolean;
  hasBluetooth: boolean;
  hasAirConditioning: boolean;
  hasUSBCable: boolean;
  officeId: string;
  createdAt: string; // Use string for dates from JSON
  updatedAt: string; // Use string for dates from JSON
  // office?: any; // Relation data usually not sent/needed in list/detail views
}

// Based on backend CreateVehicleDto
export interface CreateVehiclePayload {
  status?: VehicleStatus;
  brand: string;
  model: string;
  year: number;
  fuelType: FuelType;
  transmission: Transmission;
  pricePerDay: number;
  hasGPS?: boolean;
  hasBluetooth?: boolean;
  hasAirConditioning?: boolean;
  hasUSBCable?: boolean;
  officeId: string; // Required by DTO
}

// Based on backend UpdateVehicleDto (Partial of Create)
export type UpdateVehiclePayload = Partial<CreateVehiclePayload>; 