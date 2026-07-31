import { apiRequest } from "@/lib/api";
import type {
  ApiService,
  Booking,
  BookingStatus,
  TechnicianProfile,
} from "@/types";

export interface CreateServicePayload {
  title: string;
  description: string;
  price: number;
  categoryId: string;
}

export interface UpdateTechnicianProfilePayload {
  bio?: string;
  skills?: string[];
  experience?: number;
  hourlyRate?: number;
  location?: string;
}

/**
 * Fetches all bookings assigned to the authenticated technician (GET /api/technician/bookings).
 * Falls back to GET /api/bookings if needed.
 */
export async function getTechnicianBookings(): Promise<Booking[]> {
  try {
    return await apiRequest<Booking[]>("/technician/bookings", { method: "GET" });
  } catch {
    return await apiRequest<Booking[]>("/bookings", { method: "GET" });
  }
}

/**
 * Updates the status of a booking assigned to the technician (PATCH /api/technician/bookings/{id}).
 */
export function updateTechnicianBookingStatus(
  id: string,
  status: BookingStatus
): Promise<Booking> {
  return apiRequest<Booking>(`/technician/bookings/${id}`, {
    method: "PATCH",
    body: { status },
  });
}

/**
 * Updates the authenticated technician's profile details (PUT /api/technician/profile).
 */
export function updateTechnicianProfile(
  payload: UpdateTechnicianProfilePayload
): Promise<TechnicianProfile> {
  return apiRequest<TechnicianProfile>("/technician/profile", {
    method: "PUT",
    body: payload,
  });
}

/**
 * Updates the technician's weekly schedule availability (PUT /api/technician/availability).
 */
export function updateTechnicianAvailability(
  availability: Record<string, string[]>
): Promise<TechnicianProfile> {
  return apiRequest<TechnicianProfile>("/technician/availability", {
    method: "PUT",
    body: { availability },
  });
}

/**
 * Creates a new service offering for the authenticated technician (POST /api/services).
 */
export function createTechnicianService(
  payload: CreateServicePayload
): Promise<ApiService> {
  return apiRequest<ApiService>("/services", {
    method: "POST",
    body: payload,
  });
}

/**
 * Updates an existing service offering (PATCH /api/services/{id}).
 */
export function updateTechnicianService(
  id: string,
  payload: Partial<CreateServicePayload>
): Promise<ApiService> {
  return apiRequest<ApiService>(`/services/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

/**
 * Deletes a service offering (DELETE /api/services/{id}).
 */
export function deleteTechnicianService(id: string): Promise<null> {
  return apiRequest<null>(`/services/${id}`, {
    method: "DELETE",
  });
}

export interface ApplyTechnicianPayload {
  bio: string;
  skills: string[];
  experience: number;
  hourlyRate: number;
  location: string;
  availability?: Record<string, string[]>;
}

/**
 * Submits an application for a customer to become a technician (POST /api/technician/apply).
 */
export function applyForTechnician(
  payload: ApplyTechnicianPayload
): Promise<TechnicianProfile> {
  return apiRequest<TechnicianProfile>("/technician/apply", {
    method: "POST",
    body: payload,
  });
}

/**
 * Fetches the current user's technician profile and application status (GET /api/technician/application-status).
 */
export function getTechnicianApplicationStatus(): Promise<TechnicianProfile | null> {
  return apiRequest<TechnicianProfile>("/technician/application-status", {
    method: "GET",
  }).catch(() => null);
}

