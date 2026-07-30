import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { API_BASE_URL } from "@/lib/api";

/**
 * POST / GET /logout — server route that calls the backend logout endpoint
 * (forwarding cookies) and then redirects to the login page.
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

export async function GET(request: NextRequest): Promise<NextResponse> {
  return POST(request);
}
