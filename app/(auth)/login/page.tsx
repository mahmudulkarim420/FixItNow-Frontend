import Link from "next/link";
import { Suspense } from "react";

import { LoginForm } from "@/app/(auth)/login/login-form";

export const metadata = {
  title: "Sign in · FixItNow",
  description: "Sign in to your FixItNow account.",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-2 text-center">
        <span className="mx-auto mb-1 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
          Welcome back
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Sign in to FixItNow
        </h1>
        <p className="text-sm text-zinc-500">
          Manage your bookings, services, and appointments.
        </p>
      </div>

      {/* useSearchParams() requires a Suspense boundary during prerender. */}
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>

      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-black/10 pt-5 text-sm">
        <span className="text-zinc-500">{"Don't have an account?"}</span>
        <Link
          href="/register"
          className="font-semibold text-amber-600 transition-colors hover:text-amber-700"
        >
          Create one
        </Link>
      </div>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="flex flex-col gap-5">
      <div className="h-11 w-full animate-pulse rounded-xl bg-zinc-200/60" />
      <div className="h-11 w-full animate-pulse rounded-xl bg-zinc-200/60" />
      <div className="h-12 w-full animate-pulse rounded-xl bg-amber-200/60" />
    </div>
  );
}
