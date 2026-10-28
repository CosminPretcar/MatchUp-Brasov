import type {
  Booking,
  BookingAvailability,
  CreateBookingPayload,
  OwnerBookingStats,
} from '../types/booking';

export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://localhost:7093').replace(/\/+$/, '');

function getToken(): string | null {
  const savedUser = localStorage.getItem('user');
  if (!savedUser) return null;

  try {
    return JSON.parse(savedUser).token || null;
  } catch {
    return null;
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'A apărut o eroare la comunicarea cu serverul.');
  }

  return data as T;
}

export function getMyBookings(): Promise<Booking[]> {
  return apiRequest<Booking[]>('/api/Booking/my-bookings');
}

export function getOwnerBookings(): Promise<Booking[]> {
  return apiRequest<Booking[]>('/api/Booking/owner-bookings');
}

export function getBookingAvailability(
  fieldId: string,
  date: string,
): Promise<BookingAvailability[]> {
  return apiRequest<BookingAvailability[]>(
    `/api/Booking/availability/${fieldId}?date=${encodeURIComponent(date)}`,
  );
}

export function createBooking(
  payload: CreateBookingPayload,
): Promise<{
  message: string;
  bookingId: string;
  fieldId: string;
  playerId: string;
  startTime: string;
  endTime: string;
  status: string;
}> {
  return apiRequest('/api/Booking', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function cancelBooking(bookingId: string): Promise<{
  message: string;
  bookingId: string;
  status: string;
  cancelledAt: string;
}> {
  return apiRequest(`/api/Booking/${bookingId}/cancel`, {
    method: 'PATCH',
  });
}

export function confirmBooking(bookingId: string): Promise<{
  message: string;
  bookingId: string;
  status: string;
  confirmedAt: string;
}> {
  return apiRequest(`/api/Booking/${bookingId}/confirm`, {
    method: 'PATCH',
  });
}

export function cancelBookingAsOwner(
  bookingId: string,
  reason: string,
): Promise<{
  message: string;
  bookingId: string;
  status: string;
  cancelledAt: string;
  cancellationReason: string;
}> {
  return apiRequest(`/api/Booking/${bookingId}/cancel-owner`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  });
}

export function getOwnerBookingStats(): Promise<OwnerBookingStats> {
  return apiRequest<OwnerBookingStats>('/api/Booking/owner-stats');
}

export function deleteCancelledBooking(bookingId: string): Promise<void> {
  return apiRequest<void>(`/api/Booking/${bookingId}`, {
    method: 'DELETE',
  });
}
