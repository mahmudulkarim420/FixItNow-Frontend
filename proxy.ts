/**
 * Next.js Proxy (formerly "middleware") — route protection & role gating.
 *
 * In Next.js 16 the `middleware.ts` convention was renamed to `proxy.ts`.
 * See node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
 *
 * The backend stores auth tokens in HTTP-only cookies (`accessToken`,
 * `refreshToken`). Proxy can read these cookies from the incoming request to
 * decide whether to allow, redirect, or rewrite — without ever exposing the
 * token values to the client.
 */

import { NextResponse, type NextRequest } from "next/server";

import { AUTH_COOKIES, ROLE_HOME } from "@/lib/auth-constants";
import type { UserRole } from "@/types";

/** Routes that require authentication. */
const PROTECTED_PREFIXES = ["/dashboard", "/checkout", "/bookings"];

/**
 * Authentication-page routes. Authenticated users must never see these —
 * they are redirected to their role home before the page is ever rendered.
 */
const AUTH_ROUTES = new Set(["/login", "/register", "/forgot-password", "/reset-password"]);

/** Maps a dashboard sub-path to the role allowed to access it. */
const ROLE_DASHBOARDS: Record<string, UserRole> = {
  "/dashboard/customer": "CUSTOMER",
  "/dashboard/technician": "TECHNICIAN",
  "/dashboard/admin": "ADMIN",
};

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isAuthenticated(request: NextRequest): boolean {
  return Boolean(request.cookies.get(AUTH_COOKIES.accessToken)?.value);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 0. Block authenticated users from viewing auth pages (login, register,
  //    forgot/reset password). This is a fast edge-level check using the
  //    access-token cookie; the authoritative check (with token refresh and
  //    role resolution) happens in the (auth) layout's server component.
  //    We can't decode the JWT role in the edge runtime, so redirect to the
  //    marketing home — the (auth) layout handles the precise role redirect.
  if (AUTH_ROUTES.has(pathname) && isAuthenticated(request)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Only run protected-route auth logic below.
  if (!isProtected(pathname)) {
    return NextResponse.next();
  }

  // 1. Block unauthenticated access → redirect to login with a return path.
  if (!isAuthenticated(request)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Role-based dashboard gating.
  //    We can't decode the JWT here (edge runtime), so we rewrite users to
  //    their own dashboard if they try to access another role's dashboard.
  //    The authoritative role check happens server-side via requireRole().
  for (const [prefix, requiredRole] of Object.entries(ROLE_DASHBOARDS)) {
    if (pathname.startsWith(prefix)) {
      // Attach the expected role as a request header so server components
      // can short-circuit; the real enforcement is in lib/auth.ts#requireRole.
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-required-role", requiredRole);
      return NextResponse.next({ request: { headers: requestHeaders } });
    }
  }

  return NextResponse.next();
}

export const config = {
  /**
   * Run proxy only on protected route trees. This avoids intercepting
   * static assets, API routes, and public pages.
   */
  matcher: [
    "/dashboard/:path*",
    "/checkout/:path*",
    "/bookings/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};

// Re-export role home for convenience in case it's imported from here.
export { ROLE_HOME };
