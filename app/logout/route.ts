import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { API_BASE_URL } from "@/lib/api";

/**
 * POST /logout — server route that calls the backend logout endpoint
 * (forwarding cookies) and then redirects to the login page.
 *
 * We use a Route Handler (not a Server Action) so it can be invoked from a
 * plain link/button via fetch and works even if React state is stale.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const cookieHeader = request.headers.get("cookie") ?? "";

  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });
  } catch {
    /* Swallow — we clear client state regardless. */
  }

  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
  return response;
}
