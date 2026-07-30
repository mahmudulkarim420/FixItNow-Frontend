import { apiRequest } from "@/lib/api";
import type { Booking } from "@/types";

export interface CreateReviewPayload {
  bookingId: string;
  rating: number;
  comment?: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId?: string;
  technicianProfileId?: string;
  rating: number;
  comment: string;
  createdAt: string;
  customer?: { name: string; email?: string };
  technicianProfile?: { id?: string; user?: { name: string } };
  service?: { title: string };
  booking?: { service?: { title: string } };
}

/**
 * Creates a review for a completed booking (POST /api/reviews).
 * Access: CUSTOMER
 */
export function createReview(payload: CreateReviewPayload): Promise<Review> {
  return apiRequest<Review>("/reviews", {
    method: "POST",
    body: payload,
  });
}

/**
 * Fetches customer reviews by querying GET /api/reviews or extracting from customer bookings.
 */
export async function getMyCustomerReviews(): Promise<Review[]> {
  try {
    const res = await apiRequest<Review[]>("/reviews", { method: "GET" });
    if (Array.isArray(res) && res.length > 0) return res;
  } catch {
    /* fallback to extracting from user bookings */
  }

  try {
    const bookings = await apiRequest<Booking[]>("/bookings", { method: "GET" });
    const reviews: Review[] = [];
    (bookings || []).forEach((b) => {
      if (b.review) {
        reviews.push({
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
        });
      }
    });
    return reviews;
  } catch {
    return [];
  }
}

/**
 * Fetches all platform reviews by querying /api/reviews or extracting from bookings.
 */
export async function getAllReviews(): Promise<Review[]> {
  try {
    const res = await apiRequest<Review[]>("/reviews", { method: "GET" });
    if (Array.isArray(res)) return res;
  } catch {
    /* fallback to extracting from admin bookings */
  }

  try {
    const bookings = await apiRequest<Booking[]>("/admin/bookings", { method: "GET" });
    const reviews: Review[] = [];
    bookings.forEach((b) => {
      if (b.review) {
        reviews.push({
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
        });
      }
    });
    return reviews;
  } catch {
    return [];
  }
}

/**
 * Fetches public reviews for a specific technician profile from GET /api/services/technicians/{id}.
 */
export async function getTechnicianReviews(
  technicianProfileId: string
): Promise<Review[]> {
  try {
    const profile = await apiRequest<import("@/types").TechnicianProfile>(
      `/services/technicians/${technicianProfileId}`,
      { method: "GET" }
    );
    if (profile && profile.reviews) {
      return profile.reviews.map((r) => ({
        id: r.id,
        bookingId: "",
        rating: r.rating,
        comment: r.comment,
        createdAt: new Date().toISOString(),
        customer: r.customer,
      }));
    }
    return [];
  } catch {
    return [];
  }
}
