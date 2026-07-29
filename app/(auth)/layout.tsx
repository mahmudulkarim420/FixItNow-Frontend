import Link from "next/link";
import { redirect } from "next/navigation";
import { Wrench } from "lucide-react";

import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import { getSessionUser } from "@/lib/auth";
import { ROLE_HOME } from "@/lib/auth-constants";

/**
 * Server-side guard for all authentication pages (login, register,
 * forgot/reset password).
 *
 * If a user is already authenticated, they are redirected to their
 * role-specific dashboard BEFORE any auth page is rendered — preventing
 * any flash of the login/register UI.
 *
 * This complements the edge-level check in `proxy.ts`: the proxy handles the
 * fast path (valid access-token cookie), while this layout handles the
 * authoritative path (token refresh + role resolution via GET /auth/me).
 *
 * Layout: premium split-screen. Left = branded illustration panel (hidden on
 * mobile), right = the authentication form card.
 */
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (user) {
    redirect(ROLE_HOME[user.role]);
  }

  return (
    <div className="flex min-h-screen w-full bg-[#F9F7F2]">
      {/* Left: branded illustration panel (desktop/tablet only) */}
      <AuthBrandPanel />

      {/* Right: authentication form */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:w-1/2 lg:px-12 lg:py-12 xl:px-20">
        <div className="auth-form-card w-full max-w-lg">
          {/* Mobile logo (brand panel is hidden on small screens) */}
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-2 text-zinc-900 lg:hidden"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/30">
              <Wrench className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold tracking-tight">FixItNow</span>
          </Link>

          <div className="px-1 py-2 sm:px-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
