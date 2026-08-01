/**
 * Centralized API client for the FixItNow backend.
 *
 * The backend uses HTTP-only cookies (`accessToken`, `refreshToken`) for auth,
 * so every request is sent with `credentials: "include"`. The frontend never
 * reads the tokens directly — they are attached automatically by the browser.
 *
 * Docs: API_INTEGRATION.md > Authentication & Cookies
 */

import type {
  ApiErrorResponse,
  ApiResponse,
  ApiSuccessResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from "@/types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "/api";

/** A typed error thrown when the backend returns a non-2xx response. */
export class ApiError extends Error {
  readonly statusCode: number;
  readonly errorSources?: { path: string; message: string }[];

  constructor(
    message: string,
    statusCode: number,
    errorSources?: { path: string; message: string }[],
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errorSources = errorSources;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Internal flag to prevent infinite refresh loops. */
  _retry?: boolean;
}

/**
 * Core fetch wrapper that:
 *  - prefixes the API base URL
 *  - sends JSON + credentials
 *  - parses the standard response envelope
 *  - silently refreshes the access token once on 401
 */
export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers, _retry, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: "include",
    cache: "no-store",
  });

  // Attempt a single silent token refresh on 401, then replay the request.
  if (response.status === 401 && !_retry && !path.startsWith("/auth/")) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiRequest<T>(path, { ...options, _retry: true });
    }
  }

  const payload = (await response.json().catch(() => null)) as
    | ApiResponse<T>
    | null;

  if (!response.ok || !payload || !payload.success) {
    const error = payload as ApiErrorResponse | null;
    throw new ApiError(
      error?.message ?? `Request failed with status ${response.status}`,
      response.status,
      error?.errorSources,
    );
  }

  return (payload as ApiSuccessResponse<T>).data;
}

/** Calls POST /auth/refresh to rotate the HTTP-only cookies. */
export async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Auth endpoints                                                      */
/* ------------------------------------------------------------------ */

/** POST /auth/register — registers a new user (CUSTOMER or TECHNICIAN). */
export function registerUser(payload: RegisterPayload): Promise<User> {
  return apiRequest<User>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

/** POST /auth/login — authenticates and sets auth cookies. */
export function loginUser(payload: LoginPayload): Promise<User> {
  return apiRequest<User>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

/** GET /auth/me — returns the currently authenticated user. */
export function getCurrentUser(): Promise<User> {
  return apiRequest<User>("/auth/me", { method: "GET" });
}

/** POST /auth/logout — clears the auth cookies. */
export async function logoutUser(): Promise<void> {
  await apiRequest<null>("/auth/logout", { method: "POST" }).catch(() => {
    /* Swallow — we clear client state regardless. */
  });
}

/** GET /services/technicians/{id} — fetches public technician profile details. */
export function getTechnicianProfile(id: string): Promise<import("@/types").TechnicianProfile> {
  return apiRequest<import("@/types").TechnicianProfile>(`/services/technicians/${id}`, { method: "GET" });
}

/** PATCH /auth/me — updates authenticated user profile. */
export function updateMyProfile(payload: import("@/types").UpdateProfilePayload): Promise<User> {
  return apiRequest<User>("/auth/me", {
    method: "PATCH",
    body: payload,
  });
}

/** DELETE /auth/me — deletes authenticated user account. */
export function deleteMyProfile(): Promise<null> {
  return apiRequest<null>("/auth/me", {
    method: "DELETE",
  });
}
