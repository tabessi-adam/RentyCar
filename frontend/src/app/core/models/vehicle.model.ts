import { Reservation } from './reservation.model';

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

export interface VehicleImage {
  id: string;
  url: string;
  publicId: string;
  vehicleId: string;
  createdAt: string; // Use string for dates from JSON
}

// Interface representing the Vehicle entity
export interface Vehicle {
  id: string;
  status: VehicleStatus;
  baseStatus: VehicleStatus;
  currentStatus: VehicleStatus;
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
  reservations?: Reservation[];
  images?: VehicleImage[];
  // Legacy fields for backward compatibility
  imageUrl?: string;
  imagePublicId?: string;
}

// Based on backend CreateVehicleDto
export interface CreateVehiclePayload {
  status: VehicleStatus;
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
  officeId: string;
}

// Based on backend UpdateVehicleDto (Partial of Create)
export type UpdateVehiclePayload = Partial<CreateVehiclePayload>;

export function isVehicleCurrentlyRented(vehicle: Vehicle): boolean {
  if (!vehicle.reservations) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight for accurate date comparison

  return vehicle.reservations.some(reservation => {
    if (reservation.status !== 'ACCEPTED') return false;
    
    const startDate = new Date(reservation.startDate);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(reservation.endDate);
    endDate.setHours(0, 0, 0, 0);
    
    return startDate <= today && endDate >= today;
  });
}

export function getVehicleCurrentStatus(vehicle: Vehicle): VehicleStatus {
  if (vehicle.status === VehicleStatus.MAINTENANCE) {
    return VehicleStatus.MAINTENANCE;
  }
  return isVehicleCurrentlyRented(vehicle) ? VehicleStatus.RENTED : VehicleStatus.AVAILABLE;
} 