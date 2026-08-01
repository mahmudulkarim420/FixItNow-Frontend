"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Heart,
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

import { getUserBookings } from "@/lib/bookings-payments-api";
import {
  fetchServiceCategories,
  fetchServices,
  mapApiServiceToUI,
} from "@/lib/services-api";
import { services as mockServices, type RepairService } from "@/lib/services-data";
import { getSavedServices, toggleSaveService } from "@/lib/saved-services";
import { cn } from "@/lib/utils";
import type { ApiServiceCategory, Booking } from "@/types";

const categoryIcons: Record<string, React.ElementType> = {
  "All Services": Layers,
  Cooling: Wrench,
  Plumbing: Droplets,
  Electrical: Zap,
  Appliances: ShieldCheck,
  "Home Care": Home,
  Programming: Wrench,
};

const ITEMS_PER_PAGE = 8;

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

  // Saved / Wishlist IDs state
  const [savedIds, setSavedIds] = useState<string[]>([]);
  // User active bookings
  const [userBookings, setUserBookings] = useState<Booking[]>([]);

  useEffect(() => {
    getUserBookings()
      .then((res) => {
        if (Array.isArray(res)) setUserBookings(res);
      })
      .catch(() => null);
  }, []);

  useEffect(() => {
    const syncSaved = () => {
      setSavedIds(getSavedServices().map((s) => s.id));
    };
    syncSaved();
    if (typeof window !== "undefined") {
      window.addEventListener("saved-services-updated", syncSaved);
      return () => window.removeEventListener("saved-services-updated", syncSaved);
    }
  }, []);

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
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-3xl border border-stone-200/90 bg-white/80 p-5 shadow-[0_20px_50px_-20px_rgba(41,37,36,0.12)] backdrop-blur-xl sm:p-6 lg:p-8">
            {/* Search Input Bar */}
            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder="Search AC repair, emergency plumbing, electrical safety check..."
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50/80 py-3.5 pl-12 pr-4 text-sm font-semibold text-stone-950 placeholder:text-stone-400 outline-none transition duration-200 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => handleQueryChange("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-700"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadServices}
                  className="flex items-center gap-2 rounded-2xl bg-stone-900 px-5 py-3.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-stone-800 active:scale-95 cursor-pointer"
                >
                  <SlidersHorizontal className="h-4 w-4 text-amber-400" />
                  <span>Search</span>
                </button>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none">
              {categoryOptions.map((catName) => {
                const Icon = categoryIcons[catName] || Wrench;
                const isActive = activeCategory === catName;
                return (
                  <button
                    key={catName}
                    type="button"
                    onClick={() => handleCategorySelect(catName)}
                    className={cn(
                      "flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold transition duration-200 cursor-pointer",
                      isActive
                        ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20"
                        : "border border-stone-200/80 bg-stone-50/80 text-stone-600 hover:border-stone-300 hover:bg-stone-100/80"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", isActive ? "text-stone-950" : "text-stone-400")} />
                    <span>{catName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section Sub-header */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Verified Repair Catalog</span>
              </div>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-stone-950 sm:text-3xl">
                Available Expert Services
              </h2>
            </div>
            <p className="text-xs font-semibold text-stone-500">
              Showing {startIndex}–{endIndex} of {totalServices} certified options
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
              {Array.from({ length: 8 }).map((_, idx) => (
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
                {servicesList.map((service) => {
                  const isSaved = savedIds.includes(service.id);
                  const activeBooking = userBookings.find(
                    (b) =>
                      (b.serviceId === service.id || b.service?.id === service.id) &&
                      b.status !== "COMPLETED" &&
                      b.status !== "CANCELLED" &&
                      b.status !== "DECLINED"
                  );

                  return (
                    <article
                      key={service.id}
                      className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-white/90 shadow-[0_12px_35px_-25px_rgba(41,37,36,0.35)] backdrop-blur-md transition duration-300 hover:-translate-y-1.5 hover:border-amber-300 hover:shadow-[0_24px_50px_-20px_rgba(245,158,11,0.25)] relative"
                    >
                      {/* Wishlist / Save Heart Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleSaveService(service);
                        }}
                        aria-label="Save to wishlist"
                        className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-white/90 shadow-md backdrop-blur-md transition-transform active:scale-90 hover:scale-110"
                      >
                        <Heart
                          className={cn(
                            "h-4 w-4 transition-colors",
                            isSaved ? "fill-rose-500 text-rose-500" : "text-stone-600 hover:text-rose-500"
                          )}
                        />
                      </button>

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

                        {activeBooking ? (
                          <span className="absolute left-3 top-3 rounded-full border border-amber-300 bg-amber-500 px-3 py-1 text-[10px] font-black uppercase text-stone-950 shadow-md">
                            Active Booking ({activeBooking.status})
                          </span>
                        ) : (
                          <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[11px] font-bold text-stone-900 shadow-xs backdrop-blur-md">
                            {service.badge}
                          </span>
                        )}

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
                            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-950 text-amber-400 shadow-sm transition duration-200 hover:bg-amber-500 hover:text-stone-950 active:scale-95"
                            aria-label={`Book ${service.name}`}
                          >
                            <ArrowUpRight className="h-5 w-5" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-stone-200 bg-white text-stone-700 shadow-xs transition hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      const isActive = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCurrentPage(pageNum)}
                          className={cn(
                            "h-10 min-w-10 rounded-2xl text-xs font-extrabold transition cursor-pointer",
                            isActive
                              ? "bg-amber-500 text-stone-950 shadow-md"
                              : "border border-stone-200 bg-white text-stone-700 hover:bg-stone-100"
                          )}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-stone-200 bg-white text-stone-700 shadow-xs transition hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center">
              <p className="text-base font-bold text-stone-800">No services match your search</p>
              <p className="mt-1 text-xs text-stone-500">
                Try searching for general terms like &quot;repair&quot;, &quot;AC&quot;, &quot;leak&quot;, or clear your filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveCategory("All Services");
                }}
                className="mt-4 rounded-2xl bg-stone-900 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-stone-800 transition cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
