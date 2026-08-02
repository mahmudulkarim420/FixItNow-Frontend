import { ServicesCatalogSkeleton } from "@/components/ui/skeletons";

export default function ServicesLoading() {
  return (
    <div className="min-h-screen bg-[#F9F7F2] text-stone-900">
      {/* Navbar placeholder — the shared layout already renders it */}
      <main className="pt-20 sm:pt-24">
        {/* Hero header skeleton */}
        <section className="relative overflow-hidden px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8 lg:pb-20 animate-pulse">
          <div className="relative mx-auto max-w-7xl">
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-7 space-y-5">
                <div className="h-6 w-48 bg-stone-200 rounded-full" />
                <div className="h-12 w-full max-w-lg bg-stone-200 rounded-xl" />
                <div className="h-5 w-full max-w-md bg-stone-200 rounded-md" />
                <div className="flex gap-4 pt-2">
                  <div className="h-4 w-36 bg-stone-200 rounded-md" />
                  <div className="h-4 w-40 bg-stone-200 rounded-md" />
                  <div className="h-4 w-44 bg-stone-200 rounded-md" />
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="aspect-[4/3] w-full max-w-md mx-auto rounded-3xl bg-stone-200/80 sm:aspect-[16/11]" />
              </div>
            </div>
          </div>
        </section>

        <ServicesCatalogSkeleton />
      </main>
    </div>
  );
}
