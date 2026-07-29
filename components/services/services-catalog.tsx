"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Droplets,
  Home,
  Layers,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Wrench,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import {
  fetchServiceCategories,
  fetchServices,
  mapApiServiceToUI,
} from "@/lib/services-api";
import { services as mockServices, type RepairService } from "@/lib/services-data";
import { cn } from "@/lib/utils";
import type { ApiServiceCategory } from "@/types";

const categoryIcons: Record<string, React.ElementType> = {
  "All Services": Layers,
  Cooling: Wrench,
  Plumbing: Droplets,
  Electrical: Zap,
  Appliances: ShieldCheck,
  "Home Care": Home,
  Programming: Wrench,
};

const ITEMS_PER_PAGE = 4;

export function ServicesCatalog() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All Services");
  const [categories, setCategories] = useState<ApiServiceCategory[]>([]);
  const [servicesList, setServicesList] = useState<RepairService[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalServices, setTotalServices] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load API categories on mount
  useEffect(() => {
    let isMounted = true;
    fetchServiceCategories()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((err) => {
        console.warn("Could not load API categories, using defaults:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Services from Backend API
  const loadServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Find categoryId if activeCategory is not "All Services"
      const selectedCatObj = categories.find((c) => c.name === activeCategory);
      const categoryId = selectedCatObj ? selectedCatObj.id : undefined;

      const response = await fetchServices({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: query.trim() || undefined,
        categoryId,
      });

      if (response.data && response.data.length > 0) {
        const uiMapped = response.data.map(mapApiServiceToUI);
        setServicesList(uiMapped);
        setTotalServices(response.meta.total);
        setTotalPages(response.meta.totalPage);
      } else {
        // If API returns 0 items for default load, fallback gracefully to mock data for demo completeness
        if (!query && activeCategory === "All Services") {
          setServicesList(mockServices.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE));
          setTotalServices(mockServices.length);
          setTotalPages(Math.ceil(mockServices.length / ITEMS_PER_PAGE));
        } else {
          setServicesList([]);
          setTotalServices(0);
          setTotalPages(1);
        }
      }
    } catch (err) {
      console.error("API error loading services:", err);
      // Fallback to local data if server is unreachable
      const filteredMock = mockServices.filter((s) => {
        const matchesCategory = activeCategory === "All Services" || s.category === activeCategory;
        const matchesQuery = !query || [s.name, s.description].some((v) => v.toLowerCase().includes(query.toLowerCase()));
        return matchesCategory && matchesQuery;
      });
      setServicesList(filteredMock.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE));
      setTotalServices(filteredMock.length);
      setTotalPages(Math.ceil(filteredMock.length / ITEMS_PER_PAGE) || 1);
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, categories, currentPage, query]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  // Reset to page 1 on search or category filter change
  const handleCategorySelect = (categoryName: string) => {
    setActiveCategory(categoryName);
    setCurrentPage(1);
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setCurrentPage(1);
  };

  const categoryOptions = [
    "All Services",
    ...Array.from(new Set([...categories.map((c) => c.name), "Cooling", "Plumbing", "Electrical", "Appliances", "Home Care"])),
  ];

  const startIndex = totalServices > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, totalServices);

  return (
    <div className="space-y-12 pb-20">
      {/* Ultra-Premium Search & Category Filter Section (Mobile Responsive) */}
      <section className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl sm:rounded-3xl border border-stone-200/80 bg-white/80 p-3.5 sm:p-5 shadow-[0_20px_50px_-25px_rgba(41,37,36,0.15)] backdrop-blur-2xl">
          <div className="flex flex-col gap-3.5 sm:gap-4">
            {/* Search Input + Live Results Indicator */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-3 sm:pb-4">
              <label className="relative flex-1 w-full">
                <span className="sr-only">Search services</span>
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 sm:left-4 top-1/2 h-4 sm:h-5 w-4 sm:w-5 -translate-y-1/2 text-amber-600"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => handleQueryChange(event.target.value)}
                  placeholder="Search AC, plumbing, electrical, appliances..."
                  className="h-11 sm:h-12 w-full rounded-xl sm:rounded-2xl border border-stone-200/90 bg-stone-50/70 pl-10 sm:pl-12 pr-9 sm:pr-10 text-xs sm:text-sm font-semibold text-stone-900 shadow-inner outline-none transition placeholder:text-stone-400 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => handleQueryChange("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-700 bg-stone-200/70 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                  >
                    ×
                  </button>
                ) : null}
              </label>

              <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-extrabold text-amber-800 border border-amber-200/80 shadow-2xs">
                  <Sparkles className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span>{totalServices} Services</span>
                </span>
                <span className="text-[11px] font-bold text-stone-400 sm:hidden">
                  Swipe trades →
                </span>
              </div>
            </div>

            {/* Mobile Touch-Optimized Scrollable Category Pills */}
            <div className="relative">
              <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 pt-1 snap-x snap-mandatory scrollbar-none scroll-smooth -mx-1 px-1">
                <div className="flex items-center gap-1 pr-1 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-stone-400 shrink-0">
                  <SlidersHorizontal className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-amber-600" />
                  <span className="hidden sm:inline">Trade:</span>
                </div>

                {categoryOptions.map((category) => {
                  const Icon = categoryIcons[category] || Layers;
                  const isSelected = activeCategory === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleCategorySelect(category)}
                      className={cn(
                        "group relative flex h-10 sm:h-11 shrink-0 snap-start items-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl px-3 sm:px-4 text-xs font-bold transition-all duration-200 focus:outline-none cursor-pointer touch-manipulation select-none",
                        isSelected
                          ? "bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md sm:shadow-lg shadow-amber-500/25 border border-amber-400 scale-[1.02]"
                          : "bg-stone-50/90 border border-stone-200/80 text-stone-600 hover:bg-white hover:border-amber-300 hover:text-stone-900 active:scale-95"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-5 sm:h-6 w-5 sm:w-6 items-center justify-center rounded-lg sm:rounded-xl transition-colors shrink-0",
                          isSelected
                            ? "bg-stone-950 text-amber-400"
                            : "bg-white text-stone-500 group-hover:text-amber-600 border border-stone-200"
                        )}
                      >
                        <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      </span>
                      <span className="tracking-tight whitespace-nowrap">{category}</span>
                    </button>
                  );
                })}
              </div>

              {/* Edge Gradient Scroll Hint on Mobile */}
              <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-white via-white/80 to-transparent sm:hidden" />
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Column Service Cards Grid */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4 border-b border-stone-200/80 pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
              Live API Catalog
            </p>
            <h2 className="mt-1 text-2xl font-extrabold text-stone-900 sm:text-3xl tracking-tight">
              Explore Services ({totalServices})
            </h2>
          </div>
          <p className="hidden max-w-sm text-right text-xs leading-5 text-stone-500 md:block">
            Verified backend API listing with transparent pricing and instant booking.
          </p>
        </div>

        {/* Error Notification */}
        {error ? (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-800 shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={loadServices}
              className="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 font-bold text-red-900 hover:bg-red-200 transition cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </button>
          </div>
        ) : null}

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-white/70 shadow-xs backdrop-blur-md animate-pulse"
              >
                <div className="aspect-[4/3] bg-stone-200/80" />
                <div className="p-5 space-y-4">
                  <div className="h-3 w-1/3 bg-stone-200 rounded-full" />
                  <div className="h-5 w-3/4 bg-stone-200 rounded-md" />
                  <div className="h-4 w-full bg-stone-200 rounded-md" />
                  <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
                    <div className="h-6 w-16 bg-stone-200 rounded-md" />
                    <div className="h-10 w-10 bg-stone-200 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : servicesList.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {servicesList.map((service) => (
                <article
                  key={service.id}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-white/90 shadow-[0_12px_35px_-25px_rgba(41,37,36,0.35)] backdrop-blur-md transition duration-300 hover:-translate-y-1.5 hover:border-amber-300 hover:shadow-[0_24px_50px_-20px_rgba(245,158,11,0.25)]"
                >
                  <Link
                    href={`/services/${service.id}`}
                    className="relative block aspect-[4/3] overflow-hidden bg-stone-100"
                    aria-label={`View ${service.name}`}
                  >
                    <Image
                      src={service.image}
                      alt={`${service.name} service`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-transparent to-transparent" />

                    <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[11px] font-bold text-stone-900 shadow-xs backdrop-blur-md">
                      {service.badge}
                    </span>

                    <span className="absolute bottom-3 left-3 rounded-full bg-stone-950/80 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                      {service.category}
                    </span>
                  </Link>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="flex items-center gap-1 font-extrabold text-stone-800">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{service.rating} Rating</span>
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

            {/* Dynamic API Pagination Controls Bar */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200/80 pt-6">
              <p className="text-xs font-semibold text-stone-500">
                Showing <span className="font-extrabold text-stone-900">{startIndex}</span> to{" "}
                <span className="font-extrabold text-stone-900">{endIndex}</span> of{" "}
                <span className="font-extrabold text-stone-900">{totalServices}</span> services
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex h-10 items-center gap-1 rounded-xl border border-stone-200 bg-white px-3.5 text-xs font-bold text-stone-700 transition hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

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
                handleQueryChange("");
                handleCategorySelect("All Services");
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
