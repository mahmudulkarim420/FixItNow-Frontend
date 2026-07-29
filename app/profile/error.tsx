"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { useEffect } from "react";

/**
 * Error boundary for /profile — shown if the server component throws
 * (e.g. backend unreachable while fetching the session).
 */
export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("Profile page error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F9F7F2] px-4">
      <div className="w-full max-w-md rounded-3xl border border-stone-200/70 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <AlertTriangle className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-xl font-bold text-stone-900">
          Couldn't load your profile
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          We had trouble fetching your account details. Please check your
          connection and try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-stone-800 active:scale-95"
        >
          <RotateCcw className="h-4 w-4" />
          Try again
        </button>
      </div>
    </main>
  );
}
