/**
 * Loading UI for /profile — shown while the server fetches the session.
 * Mirrors the profile page layout with animated skeleton placeholders.
 */
export default function ProfileLoading() {
  return (
    <main className="min-h-screen bg-[#F9F7F2] pb-24 lg:pb-12">
      {/* Header skeleton */}
      <div className="border-b border-stone-200/60 bg-gradient-to-br from-amber-50 via-white to-stone-50">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-4 py-10 sm:flex-row sm:px-6 sm:py-12 lg:px-8">
          <div className="h-24 w-24 animate-pulse rounded-full bg-stone-200/70 shadow-lg" />
          <div className="flex w-full max-w-sm flex-col items-center gap-3 sm:items-start">
            <div className="h-7 w-48 animate-pulse rounded-lg bg-stone-200/70" />
            <div className="h-4 w-56 animate-pulse rounded-lg bg-stone-200/60" />
            <div className="flex gap-2">
              <div className="h-6 w-24 animate-pulse rounded-full bg-stone-200/60" />
              <div className="h-6 w-28 animate-pulse rounded-full bg-stone-200/60" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-2xl border border-stone-200/70 bg-white p-5"
            >
              <div className="h-11 w-11 animate-pulse rounded-xl bg-stone-200/70" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 animate-pulse rounded bg-stone-200/60" />
                <div className="h-5 w-24 animate-pulse rounded bg-stone-200/70" />
              </div>
            </div>
          ))}
        </div>

        {/* Info skeleton */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-2xl border border-stone-200/70 bg-white p-5"
            >
              <div className="h-10 w-10 animate-pulse rounded-xl bg-stone-200/70" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 animate-pulse rounded bg-stone-200/60" />
                <div className="h-4 w-40 animate-pulse rounded bg-stone-200/70" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
