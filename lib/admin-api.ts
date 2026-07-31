import { apiRequest } from "@/lib/api";
import type {
  ApiServiceCategory,
  Booking,
  User,
  UserStatus,
} from "@/types";

export interface AdminPayment {
  id: string;
  bookingId: string;
  amount: number;
  transactionId?: string | null;
  provider: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
  booking?: Booking;
}

export interface AdminReview {
  id: string;
  bookingId?: string;
  customerId?: string;
  technicianProfileId?: string;
  rating: number;
  comment: string;
  createdAt: string;
  customer?: { name: string; email?: string };
  technicianProfile?: { id: string; user?: { name: string } };
  booking?: { service?: { title: string } };
  service?: { title: string };
  status?: "APPROVED" | "FLAGGED";
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
}

/* ------------------------------------------------------------------ */
/* Admin Users Endpoints                                               */
/* ------------------------------------------------------------------ */

/** GET /api/admin/users — Returns all registered users in system. */
export function getAdminUsers(): Promise<User[]> {
  return apiRequest<User[]>("/admin/users", {
    method: "GET",
  });
}

/** PATCH /api/admin/users/{id} — Updates status (ACTIVE | BANNED) of a user account. */
export function updateAdminUserStatus(
  id: string,
  status: UserStatus
): Promise<User> {
  return apiRequest<User>(`/admin/users/${id}`, {
    method: "PATCH",
    body: { status },
  });
}

/* ------------------------------------------------------------------ */
/* Admin Bookings Endpoints                                           */
/* ------------------------------------------------------------------ */

/** GET /api/admin/bookings — Returns all platform bookings. */
export function getAdminBookings(): Promise<Booking[]> {
  return apiRequest<Booking[]>("/admin/bookings", {
    method: "GET",
  });
}

/** GET /api/admin/bookings/{id} — Returns single booking details. */
export function getAdminBookingById(id: string): Promise<Booking> {
  return apiRequest<Booking>(`/admin/bookings/${id}`, {
    method: "GET",
  });
}

/* ------------------------------------------------------------------ */
/* Admin Payments Endpoints                                           */
/* ------------------------------------------------------------------ */

/** GET /api/admin/payments — Returns all transaction records. */
export function getAdminPayments(): Promise<AdminPayment[]> {
  return apiRequest<AdminPayment[]>("/admin/payments", {
    method: "GET",
  });
}

/** GET /api/admin/payments/{id} — Returns single payment details. */
export function getAdminPaymentById(id: string): Promise<AdminPayment> {
  return apiRequest<AdminPayment>(`/admin/payments/${id}`, {
    method: "GET",
  });
}

/* ------------------------------------------------------------------ */
/* Admin Categories Endpoints                                         */
/* ------------------------------------------------------------------ */

/** GET /api/admin/categories — Returns all categories with service counts. */
export function getAdminCategories(): Promise<ApiServiceCategory[]> {
  return apiRequest<ApiServiceCategory[]>("/admin/categories", {
    method: "GET",
  });
}

/** POST /api/admin/categories — Creates a new service category. */
export function createAdminCategory(
  payload: CreateCategoryPayload
): Promise<ApiServiceCategory> {
  return apiRequest<ApiServiceCategory>("/admin/categories", {
    method: "POST",
    body: payload,
  });
}

/** PATCH /api/admin/categories/{id} — Updates a service category. */
export function updateAdminCategory(
  id: string,
  payload: UpdateCategoryPayload
): Promise<ApiServiceCategory> {
  return apiRequest<ApiServiceCategory>(`/admin/categories/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

/** DELETE /api/admin/categories/{id} — Deletes a service category. */
export function deleteAdminCategory(id: string): Promise<null> {
  return apiRequest<null>(`/admin/categories/${id}`, {
    method: "DELETE",
  });
}

/* ------------------------------------------------------------------ */
/* Admin Reviews Endpoints                                            */
/* ------------------------------------------------------------------ */

/** GET /api/admin/reviews — Fetches platform reviews from DB. */
export async function getAdminReviews(): Promise<AdminReview[]> {
  try {
    const res = await apiRequest<AdminReview[]>("/admin/reviews", { method: "GET" });
    if (Array.isArray(res)) return res;
  } catch {
    /* fallback to general reviews or bookings extraction if needed */
  }

  try {
    const res = await apiRequest<AdminReview[]>("/reviews", { method: "GET" });
    if (Array.isArray(res)) return res;
  } catch {
    /* fallback */
  }

  // Fallback: extract reviews from bookings
  const bookings = await getAdminBookings();
  const extracted: AdminReview[] = [];

  bookings.forEach((b) => {
    if (b.review) {
      extracted.push({
        id: b.review.id || `REV-${b.id.substring(0, 4)}`,
        bookingId: b.id,
        customerId: b.customerId,
        technicianProfileId: b.technicianProfileId,
        rating: b.review.rating || 5,
        comment: b.review.comment || "",
        createdAt: b.review.createdAt || b.createdAt,
        customer: b.customer,
        technicianProfile: b.technicianProfile,
        service: b.service ? { title: b.service.title } : undefined,
        status: "APPROVED",
      });
    }
  });

  return extracted;
}

/** DELETE /api/admin/reviews/{id} — Deletes a review from DB. */
export function deleteAdminReview(id: string): Promise<null> {
  return apiRequest<null>(`/admin/reviews/${id}`, {
    method: "DELETE",
  });
}

export interface TechnicianApplication {
  id: string;
  userId: string;
  bio?: string | null;
  skills: string[];
  experience: number;
  hourlyRate: number;
  location: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt?: string;
  };
}

/** GET /api/admin/technician-applications — Returns all technician applications. */
export function getAdminTechnicianApplications(): Promise<TechnicianApplication[]> {
  return apiRequest<TechnicianApplication[]>("/admin/technician-applications", {
    method: "GET",
  });
}

/** PATCH /api/admin/technician-applications/{id} — Reviews (APPROVE or REJECT) an application. */
export function reviewAdminTechnicianApplication(
  id: string,
  status: "APPROVED" | "REJECTED"
): Promise<TechnicianApplication> {
  return apiRequest<TechnicianApplication>(`/admin/technician-applications/${id}`, {
    method: "PATCH",
    body: { status },
  });
}

