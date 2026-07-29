/**
 * Pure constants shared across edge runtime (proxy), client components,
 * and server components. This file must NOT import any `next/*` server-only
 * APIs so it can be bundled anywhere.
 */

import type { UserRole } from "@/types";

/** Cookie names set by the backend (httpOnly — readable on the server only). */
export const AUTH_COOKIES = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
} as const;

/** Routes each role is allowed to land on after login. */
export const ROLE_HOME: Record<UserRole, string> = {
  CUSTOMER: "/dashboard/customer",
  TECHNICIAN: "/dashboard/technician",
  ADMIN: "/dashboard/admin",
};

/** Public routes that should never trigger an auth redirect. */
export const PUBLIC_ROUTES = new Set([
  "/",
  "/login",
  "/register",
  "/forgot-password",
]);

export function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.has(pathname)) return true;
  return pathname.startsWith("/services") || pathname.startsWith("/technicians");
}
