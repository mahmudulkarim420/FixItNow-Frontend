"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Compass,
  Droplets,
  Home,
  Layers,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Wrench,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  serviceCategories,
  services,
  type ServiceFilter,
} from "@/lib/services-data";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, React.ElementType> = {
  "All Services": Layers,
  Cooling: Wrench,
  Plumbing: Droplets,
  Electrical: Zap,
  Appliances: ShieldCheck,
  "Home Care": Home,
};

const ITEMS_PER_PAGE = 4;

export function ServicesCatalog() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ServiceFilter>("All Services");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when category or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, query]);

  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return services.filter((service) => {
      const matchesCategory =
        activeCategory === "All Services" || service.category === activeCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [service.name, service.category, service.description].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        );

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE) || 1;

  const paginatedServices = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredServices.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredServices, currentPage]);

  const startIndex = filteredServices.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, filteredServices.length);

  return (
    <div className="space-y-12 pb-20">
      {/* Ultra-Premium Search & Category Filter Section */}
      <section className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-stone-200/80 bg-white/80 p-4 sm:p-5 shadow-[0_20px_50px_-25px_rgba(41,37,36,0.15)] backdrop-blur-2xl">
          <div className="flex flex-col gap-4">
            {/* Top Row: Search Input + Live Results Indicator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <label className="relative flex-1">
                <span className="sr-only">Search services</span>
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-600"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search AC tune-up, pipe leaks, electrical, appliances..."
                  className="h-12 w-full rounded-2xl border border-stone-200/90 bg-stone-50/70 pl-12 pr-10 text-xs sm:text-sm font-semibold text-stone-900 shadow-inner outline-none transition placeholder:text-stone-400 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-700 bg-stone-200/70 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                  >
                    ×
                  </button>
                ) : null}
              </label>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-extrabold text-amber-800 border border-amber-200/80 shadow-2xs">
                  <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                  <span>{filteredServices.length} Services Available</span>
                </span>
              </div>
            </div>

            {/* Bottom Row: Category Filter Pills with Icons and Count Chips */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 pt-1 no-scrollbar">
              <div className="flex items-center gap-1.5 pr-2 text-xs font-extrabold uppercase tracking-wider text-stone-400 shrink-0">
                <SlidersHorizontal className="h-4 w-4 text-amber-600" />
                <span>Trade:</span>
              </div>

              {serviceCategories.map((category) => {
                const Icon = categoryIcons[category] || Layers;
                const isSelected = activeCategory === category;
                const catCount =
                  category === "All Services"
                    ? services.length
                    : services.filter((s) => s.category === category).length;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      "group relative flex h-11 shrink-0 items-center gap-2 rounded-2xl px-4 text-xs font-bold transition-all duration-200 focus:outline-none cursor-pointer",
                      isSelected
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-lg shadow-amber-500/25 border border-amber-400 scale-[1.02]"
                        : "bg-stone-50/80 border border-stone-200/80 text-stone-600 hover:bg-white hover:border-amber-300 hover:text-stone-900 hover:shadow-md hover:scale-[1.02]"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-xl transition-colors",
                        isSelected
                          ? "bg-stone-950 text-amber-400"
                          : "bg-white text-stone-500 group-hover:text-amber-600 border border-stone-200"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="tracking-tight">{category}</span>
                    <span
                      className={cn(
                        "ml-0.5 rounded-full px-2 py-0.5 text-[10px] font-extrabold transition-colors",
                        isSelected
                          ? "bg-stone-950 text-amber-400"
                          : "bg-stone-200/80 text-stone-600 group-hover:bg-amber-100 group-hover:text-amber-900"
                      )}
                    >
                      {catCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Column Service Cards Grid */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4 border-b border-stone-200/80 pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
              Complete Catalog
            </p>
            <h2 className="mt-1 text-2xl font-extrabold text-stone-900 sm:text-3xl tracking-tight">
              Explore Services ({filteredServices.length})
            </h2>
          </div>
          <p className="hidden max-w-sm text-right text-xs leading-5 text-stone-500 md:block">
            Clear upfront pricing, vetted local specialists, and a 30-day guarantee on every job.
          </p>
        </div>

        {filteredServices.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedServices.map((service) => (
                <article
                  key={service.id}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-white/90 shadow-[0_12px_35px_-25px_rgba(41,37,36,0.35)] backdrop-blur-md transition duration-300 hover:-translate-y-1.5 hover:border-amber-300 hover:shadow-[0_24px_50px_-20px_rgba(245,158,11,0.25)]"
                >
                  {/* Service / Technician Thumbnail Container */}
                  <Link
                    href={`/services/${service.id}`}
                    className="relative block aspect-[4/3] overflow-hidden bg-stone-100"
                    aria-label={`View ${service.name}`}
                  >
                    <Image
                      src={service.image}
                      alt={`${service.name} professional at work`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-transparent to-transparent" />

                    {/* Top Badge */}
                    <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[11px] font-bold text-stone-900 shadow-xs backdrop-blur-md">
                      {service.badge}
                    </span>

                    {/* Category Pill */}
                    <span className="absolute bottom-3 left-3 rounded-full bg-stone-950/80 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                      {service.category}
                    </span>
                  </Link>

                  {/* Card Main Body */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="flex items-center gap-1 font-extrabold text-stone-800">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {service.rating}
                        <span className="font-normal text-stone-400">
                          ({service.reviews})
                        </span>
                      </span>
                      <span className="flex items-center gap-1 text-stone-500 font-medium">
                        <Clock3 className="h-3.5 w-3.5 text-amber-600" />
                        {service.duration}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-stone-900 leading-snug">
                      <Link
                        href={`/services/${service.id}`}
                        className="outline-none hover:text-amber-700 transition-colors"
                      >
                        {service.name}
                      </Link>
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-stone-500 font-normal">
                      {service.description}
                    </p>

                    {/* Card Footer: Price & CTA Icon Button */}
                    <div className="mt-5 flex items-end justify-between gap-3 border-t border-stone-100 pt-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">
                          {service.priceLabel}
                        </p>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-black text-stone-900">
                            ${service.price}
                          </span>
                          {service.originalPrice ? (
                            <span className="text-xs text-stone-400 line-through">
                              ${service.originalPrice}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <Link
                        href={`/services/${service.id}`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-white transition hover:bg-amber-500 hover:text-stone-950 shadow-xs"
                        aria-label={`Book ${service.name}`}
                      >
                        <ArrowUpRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination Controls Bar */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200/80 pt-6">
              {/* Item Count Range */}
              <p className="text-xs font-semibold text-stone-500">
                Showing <span className="font-extrabold text-stone-900">{startIndex}</span> to{" "}
                <span className="font-extrabold text-stone-900">{endIndex}</span> of{" "}
                <span className="font-extrabold text-stone-900">{filteredServices.length}</span> services
              </p>

              {/* Page Buttons */}
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex h-10 items-center gap-1 rounded-xl border border-stone-200 bg-white px-3.5 text-xs font-bold text-stone-700 transition hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                {/* Page Number Pills */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl text-xs font-extrabold transition cursor-pointer",
                      currentPage === page
                        ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20"
                        : "border border-stone-200 bg-white text-stone-700 hover:bg-amber-50 hover:text-amber-800"
                    )}
                  >
                    {page}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex h-10 items-center gap-1 rounded-xl border border-stone-200 bg-white px-3.5 text-xs font-bold text-stone-700 transition hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white/60 px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-stone-900">
              No matching services found
            </h3>
            <p className="mt-2 max-w-sm text-xs text-stone-500">
              Try typing a different keyword or reset filters to explore all repair options.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveCategory("All Services");
              }}
              className="mt-5 rounded-full bg-stone-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-stone-800 transition cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
