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
import { useCallback, useEffect, useRef, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { getUserBookings } from "@/lib/bookings-payments-api";
import {
  fetchServiceCategories,
  fetchServices,
  mapApiServiceToUI,
} from "@/lib/services-api";
import { services as mockServices, type RepairService } from "@/lib/mock-services-data";
import { getSavedServices, toggleSaveService } from "@/lib/saved-services";
import { cn } from "@/lib/utils";
import type { ApiServiceCategory, Booking, GetServicesResponse } from "@/types";

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

interface ServicesCatalogProps {
  initialCategories?: ApiServiceCategory[];
  initialServicesRes?: GetServicesResponse;
  isAuthenticated?: boolean;
}

export function ServicesCatalog({
  initialCategories = [],
  initialServicesRes,
  isAuthenticated = false,
}: ServicesCatalogProps = {}) {
  const initialServicesList =
    initialServicesRes?.data && initialServicesRes.data.length > 0
      ? initialServicesRes.data.map(mapApiServiceToUI)
      : initialServicesRes
      ? []
      : mockServices.slice(0, ITEMS_PER_PAGE);

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All Services");
  const [categories, setCategories] = useState<ApiServiceCategory[]>(initialCategories);
  const [servicesList, setServicesList] = useState<RepairService[]>(initialServicesList);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(
    initialServicesRes?.meta?.totalPage ??
      (initialServicesRes ? 1 : Math.ceil(mockServices.length / ITEMS_PER_PAGE))
  );
  const [totalServices, setTotalServices] = useState(
    initialServicesRes?.meta?.total ??
      (initialServicesRes ? 0 : mockServices.length)
  );

  const [isLoading, setIsLoading] = useState(!initialServicesRes);
  const [error, setError] = useState<string | null>(null);

  // Saved / Wishlist IDs state
  const [savedIds, setSavedIds] = useState<string[]>([]);
  // User active bookings
  const [userBookings, setUserBookings] = useState<Booking[]>([]);

  const isInitialMount = useRef(true);

  const { user: authUser } = useAuth();
  const isAuthed = isAuthenticated || Boolean(authUser);

  useEffect(() => {
    if (!isAuthed) return;
    getUserBookings()
      .then((res) => {
        if (Array.isArray(res)) setUserBookings(res);
      })
      .catch(() => null);
  }, [isAuthed]);

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

  // Load API categories on mount only if initialCategories were not supplied
  useEffect(() => {
    if (initialCategories.length > 0) return;
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
  }, [initialCategories]);

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
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (initialServicesRes) {
        return; // Skip initial mount fetch since server provided data
      }
    }
    loadServices();
  }, [loadServices, initialServicesRes]);

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
    <div className="space-y-6 sm:space-y-10 pb-16">
      {/* Luxury Glassmorphism Search & Category Filter Section */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-stone-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-3.5 sm:p-5 lg:p-6 shadow-[0_20px_50px_-20px_rgba(41,37,36,0.15)] dark:shadow-black/40 backdrop-blur-2xl transition-colors">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-amber-300/30 dark:bg-amber-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-amber-500/15 dark:bg-amber-500/5 blur-3xl" />

            <div className="relative z-10 space-y-3 sm:space-y-4">
              {/* Search Input Bar */}
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <div className="group relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-stone-400 dark:text-slate-400 transition-colors group-focus-within:text-amber-600 dark:group-focus-within:text-amber-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    placeholder="Search AC repair, emergency plumbing, electrical..."
                    className="w-full rounded-xl sm:rounded-2xl border border-stone-200/90 dark:border-slate-700 bg-stone-50/90 dark:bg-slate-800/90 py-2.5 sm:py-3 pl-10 sm:pl-12 pr-10 text-xs sm:text-sm font-semibold text-stone-950 dark:text-slate-100 placeholder:text-stone-400 dark:placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-amber-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-amber-500/10 shadow-2xs"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => handleQueryChange("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-xs font-bold text-stone-400 dark:text-slate-400 hover:bg-stone-200/60 dark:hover:bg-slate-700 hover:text-stone-800 dark:hover:text-slate-200 transition"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={loadServices}
                    className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl bg-stone-950 dark:bg-amber-500 text-white dark:text-slate-950 font-extrabold text-xs px-4 sm:px-6 py-2.5 sm:py-3 shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer shrink-0"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400 dark:text-slate-950" />
                    <span>Search</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
                {categoryOptions.map((catName) => {
                  const Icon = categoryIcons[catName] || Wrench;
                  const isActive = activeCategory === catName;
                  return (
                    <button
                      key={catName}
                      type="button"
                      onClick={() => handleCategorySelect(catName)}
                      className={cn(
                        "flex shrink-0 items-center gap-1.5 rounded-xl sm:rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-extrabold transition-all duration-200 cursor-pointer",
                        isActive
                          ? "bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 shadow-md shadow-amber-500/20 border border-amber-300 scale-[1.02]"
                          : "border border-stone-200/80 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-stone-700 dark:text-slate-300 hover:border-amber-300/80 hover:bg-amber-50/60 dark:hover:bg-slate-700 dark:hover:text-slate-100 shadow-2xs"
                      )}
                    >
                      <Icon className={cn("h-3.5 w-3.5 transition-colors", isActive ? "text-stone-950" : "text-amber-600/80 dark:text-amber-400")} />
                      <span>{catName}</span>
                    </button>
                  );
                })}
              </div>
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
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Verified Repair Catalog</span>
              </div>
              <h2 className="mt-1 text-xl font-extrabold tracking-tight text-stone-950 dark:text-slate-100 sm:text-2xl lg:text-3xl">
                Available Expert Services
              </h2>
            </div>
            <p className="text-xs font-semibold text-stone-500 dark:text-slate-400">
              Showing {startIndex}–{endIndex} of {totalServices} certified options
            </p>
          </div>

          {/* Error Notification */}
          {error ? (
            <div className="mb-6 flex items-center justify-between rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 p-4 text-xs font-semibold text-red-800 dark:text-red-300 shadow-2xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={loadServices}
                className="flex items-center gap-1 rounded-lg bg-red-100 dark:bg-red-900/60 px-3 py-1.5 font-bold text-red-900 dark:text-red-200 hover:bg-red-200 transition cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Retry
              </button>
            </div>
          ) : null}

          {/* Loading Skeletons */}
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 shadow-2xs backdrop-blur-md animate-pulse"
                >
                  <div className="aspect-[4/3] bg-stone-200/80 dark:bg-slate-800" />
                  <div className="p-3 sm:p-5 space-y-2 sm:space-y-4">
                    <div className="h-3 w-1/3 bg-stone-200 dark:bg-slate-800 rounded-full" />
                    <div className="h-4 sm:h-5 w-3/4 bg-stone-200 dark:bg-slate-800 rounded-md" />
                    <div className="h-3 sm:h-4 w-full bg-stone-200 dark:bg-slate-800 rounded-md" />
                    <div className="pt-2 sm:pt-4 border-t border-stone-100 dark:border-slate-800 flex justify-between items-center">
                      <div className="h-5 sm:h-6 w-12 sm:w-16 bg-stone-200 dark:bg-slate-800 rounded-md" />
                      <div className="h-8 w-8 sm:h-10 sm:w-10 bg-stone-200 dark:bg-slate-800 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : servicesList.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
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
                      className="group flex min-w-0 flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-xs sm:shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-1.5 hover:border-amber-300 dark:hover:border-amber-500/50 relative"
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
                        className="absolute right-2 top-2 sm:right-3 sm:top-3 z-20 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/80 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 shadow-md backdrop-blur-md transition-transform active:scale-90 hover:scale-110"
                      >
                        <Heart
                          className={cn(
                            "h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors",
                            isSaved ? "fill-rose-500 text-rose-500" : "text-stone-600 dark:text-slate-300 hover:text-rose-500"
                          )}
                        />
                      </button>

                      <Link
                        href={`/services/${service.id}`}
                        className="relative block aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-slate-800"
                        aria-label={`View ${service.name}`}
                      >
                        <Image
                          src={service.image}
                          alt={`${service.name} service`}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition duration-500 group-hover:scale-[1.05]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />

                        {activeBooking ? (
                          <span className="absolute left-2 top-2 sm:left-3 sm:top-3 rounded-full border border-amber-300 bg-amber-500 px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-black uppercase text-stone-950 shadow-md">
                            Active ({activeBooking.status})
                          </span>
                        ) : (
                          <span className="absolute left-2 top-2 sm:left-3 sm:top-3 rounded-full border border-white/70 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[11px] font-bold text-stone-900 dark:text-slate-100 shadow-2xs backdrop-blur-md truncate max-w-[80%]">
                            {service.badge}
                          </span>
                        )}

                        <span className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 rounded-full bg-stone-950/80 px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-bold text-white backdrop-blur-md">
                          {service.category}
                        </span>
                      </Link>

                      <div className="flex flex-1 flex-col p-3 sm:p-5">
                        <div className="flex items-center justify-between gap-1.5 sm:gap-3 text-[10px] sm:text-xs">
                          <span className="flex items-center gap-1 font-extrabold text-stone-800 dark:text-slate-200">
                            <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-amber-400 text-amber-400" />
                            <span>{service.rating}</span>
                          </span>
                        </div>

                        <h3 className="mt-1.5 sm:mt-3 text-xs sm:text-lg font-bold text-stone-900 dark:text-slate-100 leading-snug line-clamp-2">
                          <Link
                            href={`/services/${service.id}`}
                            className="outline-none hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                          >
                            {service.name}
                          </Link>
                        </h3>
                        <p className="mt-1 line-clamp-2 text-[10px] sm:text-xs leading-3.5 sm:leading-5 text-stone-500 dark:text-slate-400 font-normal">
                          {service.description}
                        </p>

                        <div className="mt-3 sm:mt-5 flex items-end justify-between gap-2 border-t border-stone-100 dark:border-slate-800 pt-2.5 sm:pt-4">
                          <div>
                            <p className="text-[9px] sm:text-[10px] font-bold uppercase text-stone-400 dark:text-slate-400 tracking-wider">
                              {service.priceLabel}
                            </p>
                            <div className="flex items-baseline gap-1">
                              <span className="text-base sm:text-2xl font-black text-stone-900 dark:text-slate-100">
                                ${service.price}
                              </span>
                              {service.originalPrice ? (
                                <span className="text-[10px] sm:text-xs text-stone-400 dark:text-slate-400 line-through">
                                  ${service.originalPrice}
                                </span>
                              ) : null}
                            </div>
                          </div>

                          <Link
                            href={`/services/${service.id}`}
                            className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-stone-950 dark:bg-amber-500 text-amber-400 dark:text-slate-950 shadow-2xs transition duration-200 hover:bg-amber-500 hover:text-stone-950 dark:hover:bg-amber-400 active:scale-95 shrink-0"
                            aria-label={`Book ${service.name}`}
                          >
                            <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
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
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-700 dark:text-slate-200 shadow-2xs transition hover:bg-stone-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
                              : "border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-700"
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
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-700 dark:text-slate-200 shadow-2xs transition hover:bg-stone-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center">
              <p className="text-base font-bold text-stone-800 dark:text-slate-100">No services match your search</p>
              <p className="mt-1 text-xs text-stone-500 dark:text-slate-400">
                Try searching for general terms like &quot;repair&quot;, &quot;AC&quot;, &quot;leak&quot;, or clear your filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveCategory("All Services");
                }}
                className="mt-4 rounded-2xl bg-stone-900 dark:bg-amber-500 px-5 py-2.5 text-xs font-bold text-white dark:text-slate-950 shadow-2xs hover:bg-stone-800 dark:hover:bg-amber-400 transition cursor-pointer"
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
