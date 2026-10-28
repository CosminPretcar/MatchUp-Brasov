export type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Expired';

export interface Booking {
  id: string;
  fieldId: string;
  fieldName: string;
  playerId: string;
  playerName: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  createdAt: string;
  confirmedAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
}

export interface OwnerBookingStats {
  pendingCount: number;
  confirmedCount: number;
  estimatedRevenue: number;
  occupancyPercentage: number;
  activeFieldCount: number;
}

export interface BookingAvailability {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface CreateBookingPayload {
  fieldId: string;
  startTime: string;
}