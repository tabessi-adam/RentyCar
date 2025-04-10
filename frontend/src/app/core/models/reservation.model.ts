// Corresponds to enum in update-reservation.dto.ts
export enum ReservationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  CANCELLED = 'CANCELLED',
}

// Interface representing the Reservation entity
// Includes potential populated relation data for display
export interface Reservation {
  id: string;
  clientId: string;
  vehicleId: string;
  startDate: string; // Use string for dates from JSON
  endDate: string;   // Use string for dates from JSON
  status: ReservationStatus;
  totalDays: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  // Optional populated data (if backend sends it)
  client?: { id: string; name: string; email: string }; // Example partial client
  vehicle?: { id: string; brand: string; model: string; year: number }; // Example partial vehicle
}

// Based on backend CreateReservationDto
export interface CreateReservationPayload {
  vehicleId: string;
  startDate: string; // Send as string in ISO format (e.g., yyyy-MM-dd)
  totalDays: number;
}

// Based on backend UpdateReservationDto
export interface UpdateReservationPayload {
  startDate?: string; // Send as string in ISO format
  totalDays?: number;
  status?: ReservationStatus;
}

// Interface for updating only the status
export interface UpdateReservationStatusPayload {
  status: ReservationStatus;
} 