/**
 * Server-side authentication helpers.
 *
 * These run in Server Components, Route Handlers, and Server Actions where the
 * `cookies()` API is available. They read the auth cookies that the browser
 * sends automatically (httpOnly cookies are readable on the server) and proxy
 * them to the backend with `credentials: "include"`.
 *
 * IMPORTANT: This module imports `next/headers` and `next/navigation`, so it
 * can only be used in Server Components / Route Handlers / Server Actions —
 * never in client components or the edge proxy. For shared constants, use
 * `@/lib/auth-constants`.
 *
 * Docs: API_INTEGRATION.md > Authentication & Cookies
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { API_BASE_URL, ApiError } from "@/lib/api";
import {
  AUTH_COOKIES,
  ROLE_HOME,
  isPublicRoute,
} from "@/lib/auth-constants";
import type { ApiResponse, User, UserRole } from "@/types";

// Re-export shared constants so callers can import everything from one place.
export { AUTH_COOKIES, ROLE_HOME, isPublicRoute };

const BACKEND_API_URL =
  process.env.BACKEND_URL
    ? `${process.env.BACKEND_URL.replace(/\/$/, "")}/api`
    : process.env.NEXT_PUBLIC_BACKEND_URL
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/$/, "")}/api`
    : "https://fixitnow-backend-production-4c0e.up.railway.app/api";

/**
 * Returns the currently authenticated user by forwarding the incoming request
 * cookies to GET /auth/me. Returns `null` when unauthenticated (never throws).
 */
export async function getSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIES.accessToken)?.value;

  // No access token — try a silent refresh using the refresh-token cookie.
  if (!accessToken) {
    const refreshed = await refreshServerSession();
    if (!refreshed) return null;
  }

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  try {
    const response = await fetch(`${BACKEND_API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as ApiResponse<User>;
    if (!payload.success) return null;

    return payload.data;
  } catch {
    return null;
  }
}

/** Calls POST /auth/refresh server-side, forwarding the refresh-token cookie. */
export async function refreshServerSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(AUTH_COOKIES.refreshToken)?.value;
  if (!refreshToken) return false;

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  try {
    const response = await fetch(`${BACKEND_API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Requires an authenticated session. Redirects to /login (with a `redirect`
 * query param) when the user is not signed in.
 */
export async function requireUser(): Promise<User> {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

/**
 * Requires an authenticated session AND a specific role. Redirects to the
 * user's own dashboard if their role doesn't match.
 */
export async function requireRole(role: UserRole): Promise<User> {
  const user = await requireUser();

  if (user.role !== role) {
    redirect(ROLE_HOME[user.role]);
  }

  return user;
}

export { ApiError };
