// Interface representing the Review entity
export interface Review {
  id: string;
  rating: number;
  comment?: string;
  clientId: string;
  vehicleId: string;
  createdAt: string; // Use string for dates
  updatedAt: string; // Use string for dates
  // Optional populated data (if backend sends it)
  client?: { id: string; name: string }; // Example partial client
  vehicle?: { id: string; brand: string; model: string }; // Example partial vehicle
}

// Based on backend CreateReviewDto
export interface CreateReviewPayload {
  rating: number;
  comment?: string;
  vehicleId: string;
}

// Based on backend UpdateReviewDto
export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
} 