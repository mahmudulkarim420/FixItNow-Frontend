"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowDownUp,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  DollarSign,
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
  Tag,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

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

interface SortOption {
  value: string;
  label: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  shortLabel: string;
}

const SORT_OPTIONS: SortOption[] = [
  {
    value: "newest",
    label: "Default (Newest & Featured)",
    sortBy: "createdAt",
    sortOrder: "desc",
    shortLabel: "Newest",
  },
  {
    value: "price_asc",
    label: "Price: Low → High",
    sortBy: "price",
    sortOrder: "asc",
    shortLabel: "Price: Low → High",
  },
  {
    value: "price_desc",
    label: "Price: High → Low",
    sortBy: "price",
    sortOrder: "desc",
    shortLabel: "Price: High → Low",
  },
  {
    value: "name_asc",
    label: "Name: A → Z",
    sortBy: "title",
    sortOrder: "asc",
    shortLabel: "Name: A → Z",
  },
];

const PRICE_PRESETS = [
  { label: "All Prices", min: "", max: "" },
  { label: "Under $50", min: "", max: "50" },
  { label: "$50 – $100", min: "50", max: "100" },
  { label: "$100 – $200", min: "100", max: "200" },
  { label: "$200+", min: "200", max: "" },
];

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Unique IDs for accessibility
  const minPriceInputId = useId();
  const maxPriceInputId = useId();
  const sortSelectId = useId();

  // Parse initial query params from URL
  const initialUrlQuery = searchParams?.get("search") || "";
  const initialUrlCategory = searchParams?.get("category") || "All Services";
  const initialUrlMinPrice = searchParams?.get("minPrice") || "";
  const initialUrlMaxPrice = searchParams?.get("maxPrice") || "";
  const initialUrlSort = searchParams?.get("sort") || "newest";
  const initialUrlPage = Math.max(1, parseInt(searchParams?.get("page") || "1", 10) || 1);

  const initialServicesList =
    initialServicesRes?.data && initialServicesRes.data.length > 0
      ? initialServicesRes.data.map(mapApiServiceToUI)
      : initialServicesRes
      ? []
      : mockServices.slice(0, ITEMS_PER_PAGE);

  // Core Filtering and Sorting States
  const [query, setQuery] = useState<string>(initialUrlQuery);
  const [activeCategory, setActiveCategory] = useState<string>(initialUrlCategory);
  const [minPrice, setMinPrice] = useState<string>(initialUrlMinPrice);
  const [maxPrice, setMaxPrice] = useState<string>(initialUrlMaxPrice);
  const [selectedSort, setSelectedSort] = useState<string>(initialUrlSort);
  const [currentPage, setCurrentPage] = useState<number>(initialUrlPage);

  // Intermediate form inputs for the price filter
  const [tempMinPrice, setTempMinPrice] = useState<string>(initialUrlMinPrice);
  const [tempMaxPrice, setTempMaxPrice] = useState<string>(initialUrlMaxPrice);
  const [priceValidationError, setPriceValidationError] = useState<string | null>(null);
  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState<boolean>(
    Boolean(initialUrlMinPrice || initialUrlMaxPrice)
  );

  // Data states
  const [categories, setCategories] = useState<ApiServiceCategory[]>(initialCategories);
  const [servicesList, setServicesList] = useState<RepairService[]>(initialServicesList);
  const [totalPages, setTotalPages] = useState<number>(
    initialServicesRes?.meta?.totalPage ??
      (initialServicesRes ? 1 : Math.ceil(mockServices.length / ITEMS_PER_PAGE))
  );
  const [totalServices, setTotalServices] = useState<number>(
    initialServicesRes?.meta?.total ??
      (initialServicesRes ? 0 : mockServices.length)
  );

  const [isLoading, setIsLoading] = useState<boolean>(!initialServicesRes);
  const [error, setError] = useState<string | null>(null);

  // Saved / Wishlist IDs state
  const [savedIds, setSavedIds] = useState<string[]>([]);
  // User active bookings
  const [userBookings, setUserBookings] = useState<Booking[]>([]);

  const isInitialMount = useRef(true);

  const { user: authUser } = useAuth();
  const isAuthed = isAuthenticated || Boolean(authUser);

  // Update browser URL query parameters without reloading
  const updateUrlParams = useCallback(
    (params: {
      search?: string;
      category?: string;
      minPrice?: string;
      maxPrice?: string;
      sort?: string;
      page?: number;
    }) => {
      if (typeof window === "undefined") return;

      const sp = new URLSearchParams();
      if (params.search?.trim()) sp.set("search", params.search.trim());
      if (params.category && params.category !== "All Services") {
        sp.set("category", params.category);
      }
      if (params.minPrice) sp.set("minPrice", params.minPrice);
      if (params.maxPrice) sp.set("maxPrice", params.maxPrice);
      if (params.sort && params.sort !== "newest") sp.set("sort", params.sort);
      if (params.page && params.page > 1) sp.set("page", params.page.toString());

      const queryString = sp.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(newUrl, { scroll: false });
    },
    [pathname, router]
  );

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

  // Current active sort config
  const currentSortOption = useMemo(() => {
    return (
      SORT_OPTIONS.find((opt) => opt.value === selectedSort) || SORT_OPTIONS[0]
    );
  }, [selectedSort]);

  // Price validation helper
  const validatePrice = useCallback(
    (minVal: string, maxVal: string): { isValid: boolean; message: string | null } => {
      const minTrim = minVal.trim();
      const maxTrim = maxVal.trim();

      if (minTrim !== "") {
        const numMin = parseFloat(minTrim);
        if (isNaN(numMin)) {
          return { isValid: false, message: "Minimum price must be a valid number." };
        }
        if (numMin < 0) {
          return { isValid: false, message: "Minimum price cannot be negative." };
        }
      }

      if (maxTrim !== "") {
        const numMax = parseFloat(maxTrim);
        if (isNaN(numMax)) {
          return { isValid: false, message: "Maximum price must be a valid number." };
        }
        if (numMax < 0) {
          return { isValid: false, message: "Maximum price cannot be negative." };
        }
      }

      if (minTrim !== "" && maxTrim !== "") {
        const numMin = parseFloat(minTrim);
        const numMax = parseFloat(maxTrim);
        if (numMin > numMax) {
          return {
            isValid: false,
            message: "Minimum price cannot be greater than maximum price.",
          };
        }
      }

      return { isValid: true, message: null };
    },
    []
  );

  // Fetch Services from Backend API with all query filters & sorting
  const loadServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Find categoryId if activeCategory is not "All Services"
      const selectedCatObj = categories.find((c) => c.name === activeCategory);
      const categoryId = selectedCatObj ? selectedCatObj.id : undefined;

      const numMinPrice = minPrice.trim() !== "" ? parseFloat(minPrice) : undefined;
      const numMaxPrice = maxPrice.trim() !== "" ? parseFloat(maxPrice) : undefined;

      const response = await fetchServices({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: query.trim() || undefined,
        categoryId,
        minPrice: numMinPrice,
        maxPrice: numMaxPrice,
        sortBy: currentSortOption.sortBy,
        sortOrder: currentSortOption.sortOrder,
      });

      if (response.data && response.data.length > 0) {
        const uiMapped = response.data.map(mapApiServiceToUI);
        setServicesList(uiMapped);
        setTotalServices(response.meta.total);
        setTotalPages(response.meta.totalPage);
      } else {
        // If API returns 0 items for default load, fallback gracefully to mock data for demo completeness
        if (!query && activeCategory === "All Services" && !minPrice && !maxPrice) {
          let filtered = [...mockServices];
          // Apply mock sorting
          if (currentSortOption.sortBy === "price") {
            filtered.sort((a, b) =>
              currentSortOption.sortOrder === "asc"
                ? a.price - b.price
                : b.price - a.price
            );
          } else if (currentSortOption.sortBy === "title") {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
          }
          setServicesList(
            filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
          );
          setTotalServices(filtered.length);
          setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1);
        } else {
          setServicesList([]);
          setTotalServices(0);
          setTotalPages(1);
        }
      }
    } catch (err) {
      console.error("API error loading services, using resilient fallback:", err);
      // Resilient fallback to local data if server is unreachable
      const numMin = minPrice.trim() !== "" ? parseFloat(minPrice) : undefined;
      const numMax = maxPrice.trim() !== "" ? parseFloat(maxPrice) : undefined;

      let filteredMock = mockServices.filter((s) => {
        const matchesCategory =
          activeCategory === "All Services" || s.category === activeCategory;
        const matchesQuery =
          !query ||
          [s.name, s.description, s.longDescription].some((v) =>
            v.toLowerCase().includes(query.toLowerCase())
          );
        const matchesMinPrice =
          numMin === undefined || isNaN(numMin) ? true : s.price >= numMin;
        const matchesMaxPrice =
          numMax === undefined || isNaN(numMax) ? true : s.price <= numMax;

        return (
          matchesCategory &&
          matchesQuery &&
          matchesMinPrice &&
          matchesMaxPrice
        );
      });

      // Apply sorting on fallback mock
      if (currentSortOption.sortBy === "price") {
        filteredMock.sort((a, b) =>
          currentSortOption.sortOrder === "asc"
            ? a.price - b.price
            : b.price - a.price
        );
      } else if (currentSortOption.sortBy === "title") {
        filteredMock.sort((a, b) => a.name.localeCompare(b.name));
      }

      setServicesList(
        filteredMock.slice(
          (currentPage - 1) * ITEMS_PER_PAGE,
          currentPage * ITEMS_PER_PAGE
        )
      );
      setTotalServices(filteredMock.length);
      setTotalPages(Math.ceil(filteredMock.length / ITEMS_PER_PAGE) || 1);
    } finally {
      setIsLoading(false);
    }
  }, [
    activeCategory,
    categories,
    currentPage,
    currentSortOption,
    maxPrice,
    minPrice,
    query,
  ]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (
        initialServicesRes &&
        !initialUrlQuery &&
        initialUrlCategory === "All Services" &&
        !initialUrlMinPrice &&
        !initialUrlMaxPrice &&
        initialUrlSort === "newest" &&
        initialUrlPage === 1
      ) {
        return;
      }
    }
    loadServices();
  }, [loadServices, initialServicesRes, initialUrlCategory, initialUrlMaxPrice, initialUrlMinPrice, initialUrlPage, initialUrlQuery, initialUrlSort]);

  // Synchronize URL search params
  useEffect(() => {
    updateUrlParams({
      search: query,
      category: activeCategory,
      minPrice,
      maxPrice,
      sort: selectedSort,
      page: currentPage,
    });
  }, [activeCategory, currentPage, maxPrice, minPrice, query, selectedSort, updateUrlParams]);

  // Handle Category Selection
  const handleCategorySelect = (categoryName: string) => {
    setActiveCategory(categoryName);
    setCurrentPage(1);
  };

  // Handle Search Query Change
  const handleQueryChange = (val: string) => {
    setQuery(val);
    setCurrentPage(1);
  };

  // Handle Sorting Option Change
  const handleSortChange = (newSortValue: string) => {
    setSelectedSort(newSortValue);
    setCurrentPage(1);
  };

  // Handle Price Filter Application
  const handleApplyPriceFilter = () => {
    const validation = validatePrice(tempMinPrice, tempMaxPrice);
    if (!validation.isValid) {
      setPriceValidationError(validation.message);
      return;
    }

    setPriceValidationError(null);
    setMinPrice(tempMinPrice.trim());
    setMaxPrice(tempMaxPrice.trim());
    setCurrentPage(1);
  };

  // Handle Clear Price Filter
  const handleClearPriceFilter = () => {
    setTempMinPrice("");
    setTempMaxPrice("");
    setMinPrice("");
    setMaxPrice("");
    setPriceValidationError(null);
    setCurrentPage(1);
  };

  // Handle Preset Price Selection
  const handlePresetSelect = (presetMin: string, presetMax: string) => {
    setTempMinPrice(presetMin);
    setTempMaxPrice(presetMax);
    setMinPrice(presetMin);
    setMaxPrice(presetMax);
    setPriceValidationError(null);
    setCurrentPage(1);
  };

  // Handle Reset All Filters
  const handleResetAllFilters = () => {
    setQuery("");
    setActiveCategory("All Services");
    setMinPrice("");
    setMaxPrice("");
    setTempMinPrice("");
    setTempMaxPrice("");
    setPriceValidationError(null);
    setSelectedSort("newest");
    setCurrentPage(1);
  };

  const categoryOptions = [
    "All Services",
    ...Array.from(
      new Set([
        ...categories.map((c) => c.name),
        "Cooling",
        "Plumbing",
        "Electrical",
        "Appliances",
        "Home Care",
      ])
    ),
  ];

  const startIndex = totalServices > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, totalServices);

  // Check if any filter is active
  const hasActivePriceFilter = Boolean(minPrice || maxPrice);
  const hasActiveCategoryFilter = activeCategory !== "All Services";
  const hasActiveSearchFilter = Boolean(query.trim());
  const hasActiveSortFilter = selectedSort !== "newest";
  const hasAnyFilterActive =
    hasActivePriceFilter ||
    hasActiveCategoryFilter ||
    hasActiveSearchFilter ||
    hasActiveSortFilter;

  // Active Price Filter formatted label
  const activePriceLabel = useMemo(() => {
    if (minPrice && maxPrice) return `$${minPrice} – $${maxPrice}`;
    if (minPrice && !maxPrice) return `≥ $${minPrice}`;
    if (!minPrice && maxPrice) return `≤ $${maxPrice}`;
    return "";
  }, [minPrice, maxPrice]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Luxury Glassmorphism Search, Category, Price Filter & Sorting Toolbar */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl sm:rounded-3xl border border-stone-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 sm:p-6 shadow-[0_20px_50px_-20px_rgba(41,37,36,0.15)] dark:shadow-black/40 backdrop-blur-2xl transition-colors">
            <div className="space-y-4">
              {/* Row 1: Search Bar & Search Action Button */}
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <div className="group relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-stone-400 dark:text-slate-400 transition-colors group-focus-within:text-amber-600 dark:group-focus-within:text-amber-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    placeholder="Search AC repair, emergency plumbing, electrical, carpentry..."
                    aria-label="Search repair and maintenance services"
                    className="w-full rounded-xl sm:rounded-2xl border border-stone-200/90 dark:border-slate-700 bg-stone-50/90 dark:bg-slate-800/90 py-2.5 sm:py-3 pl-10 sm:pl-12 pr-12 text-xs sm:text-sm font-semibold text-stone-950 dark:text-slate-100 placeholder:text-stone-400 dark:placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-amber-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-amber-500/10 shadow-2xs"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => handleQueryChange("")}
                      aria-label="Clear search input"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-xs font-bold text-stone-400 dark:text-slate-400 hover:bg-stone-200/60 dark:hover:bg-slate-700 hover:text-stone-800 dark:hover:text-slate-200 transition cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Search Button */}
                <button
                  type="button"
                  onClick={loadServices}
                  aria-label="Apply search query"
                  className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl bg-stone-950 dark:bg-amber-500 text-white dark:text-slate-950 font-extrabold text-xs px-5 sm:px-6 py-2.5 sm:py-3 shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer shrink-0"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400 dark:text-slate-950" />
                  <span>Search</span>
                </button>
              </div>

              {/* Row 2: Category Filter Chips */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
                {categoryOptions.map((catName) => {
                  const Icon = categoryIcons[catName] || Wrench;
                  const isActive = activeCategory === catName;
                  return (
                    <button
                      key={catName}
                      type="button"
                      onClick={() => handleCategorySelect(catName)}
                      aria-pressed={isActive}
                      className={cn(
                        "flex shrink-0 items-center gap-1.5 rounded-xl sm:rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-extrabold transition-all duration-200 cursor-pointer",
                        isActive
                          ? "bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 shadow-md shadow-amber-500/20 border border-amber-300 scale-[1.02]"
                          : "border border-stone-200/80 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-stone-700 dark:text-slate-300 hover:border-amber-300/80 hover:bg-amber-50/60 dark:hover:bg-slate-700 dark:hover:text-slate-100 shadow-2xs"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-3.5 w-3.5 transition-colors",
                          isActive
                            ? "text-stone-950"
                            : "text-amber-600/80 dark:text-amber-400"
                        )}
                      />
                      <span>{catName}</span>
                    </button>
                  );
                })}
              </div>

              {/* Row 3: Filter & Sorting Control Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 border-t border-stone-100 dark:border-slate-800/80 pt-3">
                {/* Left: Price Filter Toggle Button */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPriceFilterOpen((prev) => !prev);
                      setTempMinPrice(minPrice);
                      setTempMaxPrice(maxPrice);
                      setPriceValidationError(null);
                    }}
                    aria-expanded={isPriceFilterOpen}
                    aria-controls="price-filter-panel"
                    aria-label="Toggle price range filter options"
                    className={cn(
                      "flex items-center gap-2 rounded-xl sm:rounded-2xl border px-3.5 py-2 text-xs font-bold transition-all duration-200 shadow-2xs cursor-pointer",
                      isPriceFilterOpen || hasActivePriceFilter
                        ? "border-amber-400 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-extrabold shadow-sm"
                        : "border-stone-200/90 dark:border-slate-700 bg-stone-50/80 dark:bg-slate-800/80 text-stone-700 dark:text-slate-200 hover:border-amber-300 hover:bg-white dark:hover:bg-slate-800"
                    )}
                  >
                    <DollarSign className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Price Range</span>
                    {hasActivePriceFilter && (
                      <span className="rounded-full bg-amber-500 text-stone-950 px-2 py-0.5 text-[10px] font-black">
                        {activePriceLabel}
                      </span>
                    )}
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 text-stone-400 dark:text-slate-400 transition-transform duration-200",
                        isPriceFilterOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Quick clear price button if active */}
                  {hasActivePriceFilter && (
                    <button
                      type="button"
                      onClick={handleClearPriceFilter}
                      title="Clear price filter"
                      aria-label="Clear price filter"
                      className="hidden sm:inline-flex items-center gap-1 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 px-2.5 py-2 text-xs font-bold text-stone-600 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white transition cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                      <span>Reset Price</span>
                    </button>
                  )}
                </div>

                {/* Right: Sorting Select Dropdown */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <label
                    htmlFor={sortSelectId}
                    className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-stone-500 dark:text-slate-400 shrink-0"
                  >
                    <ArrowDownUp className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Sort:</span>
                  </label>

                  <div className="relative">
                    <select
                      id={sortSelectId}
                      value={selectedSort}
                      onChange={(e) => handleSortChange(e.target.value)}
                      aria-label="Sort services by"
                      className="appearance-none rounded-xl sm:rounded-2xl border border-stone-200/90 dark:border-slate-700 bg-stone-50/90 dark:bg-slate-800/90 py-1.5 sm:py-2 pl-3 pr-8 text-xs font-bold text-stone-900 dark:text-slate-100 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 cursor-pointer shadow-2xs"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option
                          key={opt.value}
                          value={opt.value}
                          className="bg-white dark:bg-slate-900 text-stone-900 dark:text-slate-100 font-medium py-1"
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400 dark:text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Row 4: Seamless Inline Collapsible Price Filter Panel with Ultra-Smooth Animation */}
              <AnimatePresence initial={false}>
                {isPriceFilterOpen && (
                  <motion.div
                    key="price-filter-panel"
                    id="price-filter-panel"
                    initial={{ opacity: 0, height: 0, scale: 0.98, y: -6 }}
                    animate={{ opacity: 1, height: "auto", scale: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, scale: 0.98, y: -6 }}
                    transition={{
                      duration: 0.26,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 rounded-2xl sm:rounded-3xl border border-amber-200/90 dark:border-amber-900/50 bg-amber-50/40 dark:bg-slate-800/60 p-4 sm:p-5 shadow-xs transition-colors">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-stone-200/60 dark:border-slate-700/60 pb-2.5">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            <h3 className="text-xs sm:text-sm font-extrabold text-stone-900 dark:text-slate-100">
                              Filter Services by Price Range ($)
                            </h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsPriceFilterOpen(false)}
                            aria-label="Hide price filter panel"
                            className="rounded-full p-1 text-stone-400 hover:bg-stone-200/50 dark:hover:bg-slate-700 hover:text-stone-700 dark:hover:text-slate-200 transition cursor-pointer"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Quick Price Presets */}
                        <div>
                          <p className="text-[11px] font-bold text-stone-600 dark:text-slate-400 mb-2">
                            Quick Price Presets:
                          </p>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {PRICE_PRESETS.map((preset) => {
                              const isPresetActive =
                                tempMinPrice === preset.min &&
                                tempMaxPrice === preset.max;
                              return (
                                <button
                                  key={preset.label}
                                  type="button"
                                  onClick={() =>
                                    handlePresetSelect(preset.min, preset.max)
                                  }
                                  className={cn(
                                    "rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer",
                                    isPresetActive
                                      ? "bg-amber-500 text-stone-950 shadow-xs font-black scale-[1.02]"
                                      : "border border-stone-200/80 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 text-stone-700 dark:text-slate-300 hover:border-amber-300 hover:bg-amber-50/60 dark:hover:bg-slate-700"
                                  )}
                                >
                                  {preset.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Numeric Inputs Grid & Actions */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                          {/* Min Price */}
                          <div className="sm:col-span-4">
                            <label
                              htmlFor={minPriceInputId}
                              className="block text-[11px] font-bold text-stone-700 dark:text-slate-300 mb-1"
                            >
                              Min Price ($)
                            </label>
                            <div className="relative">
                              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 dark:text-slate-500">
                                $
                              </span>
                              <input
                                id={minPriceInputId}
                                type="number"
                                min="0"
                                step="1"
                                placeholder="0"
                                value={tempMinPrice}
                                onChange={(e) => {
                                  setTempMinPrice(e.target.value);
                                  setPriceValidationError(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleApplyPriceFilter();
                                }}
                                className="w-full rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 pl-7 pr-3 text-xs sm:text-sm font-semibold text-stone-950 dark:text-slate-100 placeholder:text-stone-400 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
                              />
                            </div>
                          </div>

                          {/* Max Price */}
                          <div className="sm:col-span-4">
                            <label
                              htmlFor={maxPriceInputId}
                              className="block text-[11px] font-bold text-stone-700 dark:text-slate-300 mb-1"
                            >
                              Max Price ($)
                            </label>
                            <div className="relative">
                              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 dark:text-slate-500">
                                $
                              </span>
                              <input
                                id={maxPriceInputId}
                                type="number"
                                min="0"
                                step="1"
                                placeholder="5000"
                                value={tempMaxPrice}
                                onChange={(e) => {
                                  setTempMaxPrice(e.target.value);
                                  setPriceValidationError(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleApplyPriceFilter();
                                }}
                                className="w-full rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 pl-7 pr-3 text-xs sm:text-sm font-semibold text-stone-950 dark:text-slate-100 placeholder:text-stone-400 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
                              />
                            </div>
                          </div>

                          {/* Buttons */}
                          <div className="sm:col-span-4 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handleClearPriceFilter}
                              className="flex-1 rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2 text-xs font-bold text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-700 transition cursor-pointer text-center"
                            >
                              Clear
                            </button>

                            <button
                              type="button"
                              onClick={handleApplyPriceFilter}
                              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 py-2 text-xs font-black text-stone-950 shadow-md transition hover:bg-amber-400 active:scale-95 cursor-pointer"
                            >
                              <Check className="h-3.5 w-3.5" />
                              <span>Apply</span>
                            </button>
                          </div>
                        </div>

                        {/* Price Validation Error Alert */}
                        <AnimatePresence>
                          {priceValidationError && (
                            <motion.div
                              initial={{ opacity: 0, height: 0, y: -4 }}
                              animate={{ opacity: 1, height: "auto", y: 0 }}
                              exit={{ opacity: 0, height: 0, y: -4 }}
                              transition={{ duration: 0.2 }}
                              role="alert"
                              aria-live="polite"
                              className="overflow-hidden"
                            >
                              <div className="rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 p-3 text-xs font-semibold text-red-700 dark:text-red-300 flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                                <span>{priceValidationError}</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Row 5: Active Filter Pills Bar with Smooth Entrance & Exit */}
              <AnimatePresence>
                {hasAnyFilterActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 border-t border-stone-100 dark:border-slate-800/80 pt-2.5">
                      <span className="text-[11px] font-bold text-stone-400 dark:text-slate-500">
                        Active Filters:
                      </span>

                      {/* Active Category Pill */}
                      {hasActiveCategoryFilter && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 text-[11px] font-bold text-amber-900 dark:text-amber-300">
                          <span>Category: {activeCategory}</span>
                          <button
                            type="button"
                            onClick={() => handleCategorySelect("All Services")}
                            aria-label="Remove category filter"
                            className="rounded-full p-0.5 hover:bg-amber-200/80 dark:hover:bg-amber-800 transition cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}

                      {/* Active Price Pill */}
                      {hasActivePriceFilter && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 text-[11px] font-bold text-amber-900 dark:text-amber-300">
                          <span>Price: {activePriceLabel}</span>
                          <button
                            type="button"
                            onClick={handleClearPriceFilter}
                            aria-label="Remove price filter"
                            className="rounded-full p-0.5 hover:bg-amber-200/80 dark:hover:bg-amber-800 transition cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}

                      {/* Active Search Pill */}
                      {hasActiveSearchFilter && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-stone-200 dark:border-slate-700 bg-stone-100 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-bold text-stone-800 dark:text-slate-200">
                          <span>Search: &quot;{query}&quot;</span>
                          <button
                            type="button"
                            onClick={() => handleQueryChange("")}
                            aria-label="Remove search filter"
                            className="rounded-full p-0.5 hover:bg-stone-200 dark:hover:bg-slate-700 transition cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}

                      {/* Active Sort Pill (if not default) */}
                      {hasActiveSortFilter && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-stone-200 dark:border-slate-700 bg-stone-100 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-bold text-stone-800 dark:text-slate-200">
                          <span>Sorted: {currentSortOption.shortLabel}</span>
                          <button
                            type="button"
                            onClick={() => handleSortChange("newest")}
                            aria-label="Reset sorting to default"
                            className="rounded-full p-0.5 hover:bg-stone-200 dark:hover:bg-slate-700 transition cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}

                      {/* Clear All Filters Button */}
                      <button
                        type="button"
                        onClick={handleResetAllFilters}
                        className="ml-auto text-[11px] font-extrabold text-amber-700 dark:text-amber-400 hover:underline transition cursor-pointer"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section Sub-header */}
          <div className="mb-6 sm:mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
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
              {/* Service Cards Grid */}
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
                        aria-label={`Save ${service.name} to wishlist`}
                        className="absolute right-2 top-2 sm:right-3 sm:top-3 z-20 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/80 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 shadow-md backdrop-blur-md transition-transform active:scale-90 hover:scale-110 cursor-pointer"
                      >
                        <Heart
                          className={cn(
                            "h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors",
                            isSaved
                              ? "fill-rose-500 text-rose-500"
                              : "text-stone-600 dark:text-slate-300 hover:text-rose-500"
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
                    aria-label="Previous page"
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
                          aria-current={isActive ? "page" : undefined}
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
                    aria-label="Next page"
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-700 dark:text-slate-200 shadow-2xs transition hover:bg-stone-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Professional Empty State */
            <div className="rounded-3xl border border-dashed border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mb-4 border border-amber-200 dark:border-amber-800">
                <SlidersHorizontal className="h-6 w-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-slate-100">
                {hasActivePriceFilter
                  ? "No services found in this price range"
                  : "No services match your filters"}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-stone-500 dark:text-slate-400 max-w-md mx-auto">
                {hasActivePriceFilter
                  ? "Try increasing your maximum price, decreasing your minimum price, or clearing your price filters."
                  : "Try searching for general repair terms like \"AC\", \"leak\", or \"wiring\", or reset your active filters."}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {hasActivePriceFilter && (
                  <button
                    type="button"
                    onClick={handleClearPriceFilter}
                    className="rounded-2xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-bold text-stone-800 dark:text-slate-200 shadow-2xs hover:bg-stone-100 dark:hover:bg-slate-700 transition cursor-pointer"
                  >
                    Reset Price Filter
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleResetAllFilters}
                  className="rounded-2xl bg-stone-950 dark:bg-amber-500 px-5 py-2.5 text-xs font-extrabold text-white dark:text-slate-950 shadow-md hover:bg-stone-800 dark:hover:bg-amber-400 transition cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
