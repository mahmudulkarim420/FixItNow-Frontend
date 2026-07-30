import { apiRequest } from "@/lib/api";
import type {
  Booking,
  CheckoutSessionResponse,
  CreateBookingPayload,
  Payment,
} from "@/types";

/**
 * Creates a new booking for a service (POST /api/bookings).
 */
export function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  return apiRequest<Booking>("/bookings", {
    method: "POST",
    body: payload,
  });
}

/**
 * Fetches a single booking details by ID (GET /api/bookings/{id}).
 */
export function getBookingById(id: string): Promise<Booking> {
  return apiRequest<Booking>(`/bookings/${id}`, {
    method: "GET",
  });
}

/**
 * Fetches all bookings for the authenticated user (GET /api/bookings).
 */
export function getUserBookings(): Promise<Booking[]> {
  return apiRequest<Booking[]>("/bookings", {
    method: "GET",
  });
}

/**
 * Cancels a booking owned by the authenticated customer (PATCH /api/bookings/{id}/cancel).
 */
export function cancelBooking(id: string, reason: string): Promise<Booking> {
  return apiRequest<Booking>(`/bookings/${id}/cancel`, {
    method: "PATCH",
    body: { reason },
  });
}

/**
 * Creates a Stripe Hosted Checkout session URL for an accepted booking (POST /api/payments/checkout).
 */
export function createCheckoutSession(
  bookingId: string
): Promise<CheckoutSessionResponse> {
  return apiRequest<CheckoutSessionResponse>("/payments/checkout", {
    method: "POST",
    body: { bookingId },
  });
}

/**
 * Fetches payment history for the authenticated customer (GET /api/payments).
 */
export function getUserPaymentHistory(): Promise<Payment[]> {
  return apiRequest<Payment[]>("/payments", {
    method: "GET",
  });
}

