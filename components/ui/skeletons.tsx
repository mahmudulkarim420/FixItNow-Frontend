import React from "react";

export function ServiceCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-white/70 shadow-xs backdrop-blur-md animate-pulse">
      <div className="aspect-[4/3] bg-stone-200/80" />
      <div className="p-5 space-y-4">
        <div className="h-3 w-1/3 bg-stone-200 rounded-full" />
        <div className="h-5 w-3/4 bg-stone-200 rounded-md" />
        <div className="h-4 w-full bg-stone-200 rounded-md" />
        <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
          <div className="h-6 w-20 bg-stone-200 rounded-md" />
          <div className="h-10 w-10 bg-stone-200 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function ServicesCatalogSkeleton() {
  return (
    <div className="space-y-12 pb-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-3xl border border-stone-200/90 bg-white/80 p-5 shadow-xs backdrop-blur-xl sm:p-6 lg:p-8 animate-pulse">
            <div className="h-12 w-full bg-stone-200/80 rounded-2xl mb-6" />
            <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-9 w-28 bg-stone-200/80 rounded-2xl shrink-0" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end animate-pulse">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-stone-200 rounded-full" />
              <div className="h-7 w-64 bg-stone-200 rounded-lg" />
            </div>
            <div className="h-4 w-40 bg-stone-200 rounded-md" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <ServiceCardSkeleton key={idx} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServiceDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-6">
          <div className="h-4 w-32 bg-stone-200 rounded-full" />
          <div className="h-10 w-3/4 bg-stone-200 rounded-xl" />
          <div className="h-5 w-full bg-stone-200 rounded-md" />
          <div className="aspect-[16/10] w-full rounded-3xl bg-stone-200/80" />
          <div className="space-y-3 pt-4">
            <div className="h-6 w-48 bg-stone-200 rounded-md" />
            <div className="h-4 w-full bg-stone-200 rounded-md" />
            <div className="h-4 w-5/6 bg-stone-200 rounded-md" />
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 space-y-6 shadow-sm">
            <div className="h-8 w-1/2 bg-stone-200 rounded-lg" />
            <div className="h-12 w-full bg-stone-200 rounded-2xl" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-stone-200 rounded-md" />
              <div className="h-4 w-3/4 bg-stone-200 rounded-md" />
            </div>
            <div className="h-12 w-full bg-amber-200/80 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] p-4 sm:p-6 space-y-6 font-sans animate-pulse">
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-stone-200 rounded-xl" />
          <div className="h-4 w-72 bg-stone-200 rounded-md" />
        </div>
        <div className="h-10 w-10 rounded-full bg-stone-200" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="p-5 rounded-3xl border border-stone-200 bg-white space-y-3 shadow-2xs">
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-stone-200 rounded-md" />
              <div className="h-8 w-8 rounded-xl bg-stone-200" />
            </div>
            <div className="h-8 w-20 bg-stone-200 rounded-lg" />
            <div className="h-3 w-32 bg-stone-200 rounded-md" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 rounded-3xl border border-stone-200 bg-white space-y-4 shadow-2xs">
          <div className="h-6 w-40 bg-stone-200 rounded-md" />
          <div className="h-64 w-full bg-stone-200/60 rounded-2xl" />
        </div>
        <div className="lg:col-span-4 p-6 rounded-3xl border border-stone-200 bg-white space-y-4 shadow-2xs">
          <div className="h-6 w-32 bg-stone-200 rounded-md" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-12 w-full bg-stone-200/60 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
