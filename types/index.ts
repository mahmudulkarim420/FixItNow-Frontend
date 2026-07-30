/**
 * Shared application types for FixItNow frontend.
 * Mirrors the backend response envelope described in API_INTEGRATION.md.
 */

export type UserRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

export type UserStatus = "ACTIVE" | "BANNED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  /** Optional — present when the backend enriches the profile. */
  phone?: string | null;
  /** Optional — URL to the user's avatar image. */
  avatar?: string | null;
  technicianProfile?: {
    id: string;
    bio?: string | null;
    skills?: string[] | null;
    experience?: number | null;
    hourlyRate?: number | null;
    location?: string | null;
    totalReviews?: number;
    averageRating?: number;
    availability?: Record<string, string[]> | null;
    isVerified?: boolean;
  } | null;
}

export interface TechnicianProfile {
  id: string;
  userId: string;
  bio?: string | null;
  skills?: string[] | null;
  experience?: number | null;
  hourlyRate?: number | null;
  location?: string | null;
  totalReviews?: number;
  averageRating?: number;
  availability?: Record<string, string[]> | null;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    email: string;
    status?: UserStatus;
  };
  services?: Array<{
    id: string;
    title: string;
    price: number;
    description: string;
  }>;
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    customer?: { name: string };
  }>;
}

export interface AuthSession {
  user: User;
}

/** Standard success envelope returned by the backend. */
export interface ApiSuccessResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: T;
}

/** Error envelope returned by the backend global error handler. */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errorSources?: { path: string; message: string }[];
  stack?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/** Shape of the payload sent to POST /auth/register. */
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "TECHNICIAN";
}

/** Shape of the payload sent to POST /auth/login. */
export interface LoginPayload {
  email: string;
  password: string;
}

/** Shape of the payload sent to PATCH /auth/me. */
export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  experience?: number;
  hourlyRate?: number;
  location?: string;
}

export interface ApiServiceCategory {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    services: number;
  };
}

export interface ApiTechnicianSummary {
  id: string;
  bio?: string | null;
  skills?: string[] | null;
  experience?: number | null;
  hourlyRate?: number | null;
  location?: string | null;
  totalReviews?: number | null;
  averageRating?: number | null;
  isVerified?: boolean | null;
  user?: {
    name: string;
    email: string;
    status?: UserStatus;
  };
}

export interface ApiService {
  id: string;
  title: string;
  description: string;
  price: number;
  categoryId: string;
  technicianProfileId?: string;
  createdAt: string;
  updatedAt: string;
  category?: ApiServiceCategory;
  technicianProfile?: ApiTechnicianSummary;
  image?: string;
  badge?: string;
  rating?: number;
  reviews?: number;
  duration?: string;
}

export interface GetServicesParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetServicesResponse {
  data: ApiService[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export type BookingStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "DECLINED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "PAID";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface CreateBookingPayload {
  serviceId: string;
  scheduledDate: string;
  timeSlot: string;
  contactNumber: string;
}

export interface Booking {
  id: string;
  customerId: string;
  serviceId: string;
  technicianProfileId?: string;
  servicePrice: number;
  contactNumber: string;
  scheduledDate: string;
  timeSlot: string;
  status: BookingStatus;
  cancellationReason?: string | null;
  createdAt: string;
  updatedAt: string;
  service?: ApiService;
  customer?: { name: string; email: string };
  technicianProfile?: { id: string; user?: { name: string; email?: string } };
  review?: { id?: string; rating?: number; comment?: string; createdAt?: string } | null;
}

export interface CheckoutSessionResponse {
  url: string;
  sessionId: string;
}


