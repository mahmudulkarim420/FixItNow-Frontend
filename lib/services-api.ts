import { cache } from "react";
import { getApiBaseUrl } from "@/lib/api";
import type { RepairService, ServiceCategory } from "@/lib/mock-services-data";
import type {
  ApiService,
  ApiServiceCategory,
  GetServicesParams,
  GetServicesResponse,
} from "@/types";

const fallbackCategoryImages: Record<string, string> = {
  Cooling: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=85&w=800",
  Plumbing: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=85&w=800",
  Electrical: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=85&w=800",
  Appliances: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=85&w=800",
  "Home Care": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=85&w=800",
  Programming: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=85&w=800",
  Default: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=85&w=800",
};

const PUBLIC_DATA_REVALIDATE_SECONDS = 300;

async function publicApiRequest<T>(path: string): Promise<T> {
  const cacheOptions =
    typeof window === "undefined"
      ? { next: { revalidate: PUBLIC_DATA_REVALIDATE_SECONDS } }
      : { cache: "default" as RequestCache };

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    ...cacheOptions,
  });
  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || `Request failed with status ${response.status}`);
  }

  return result.data as T;
}

/**
 * Maps raw backend ApiService model into the full UI RepairService model.
 */
export function mapApiServiceToUI(apiService: ApiService): RepairService {
  const categoryName = apiService.category?.name || "Home Care";
  let category: ServiceCategory = "Home Care";
  if (categoryName.includes("Cool") || categoryName.includes("AC")) category = "Cooling";
  else if (categoryName.includes("Plumb")) category = "Plumbing";
  else if (categoryName.includes("Electr")) category = "Electrical";
  else if (categoryName.includes("Applian")) category = "Appliances";

  const techProf = apiService.technicianProfile;
  const technicianName = techProf?.user?.name || "FixItNow Certified Specialist";
  const image =
    apiService.image ||
    fallbackCategoryImages[categoryName] ||
    fallbackCategoryImages[category] ||
    fallbackCategoryImages.Default;

  return {
    id: apiService.id,
    name: apiService.title,
    shortName: apiService.title.split(" ")[0] || apiService.title,
    category,
    tagline: `Professional ${categoryName.toLowerCase()} solutions for your home.`,
    description: apiService.description,
    longDescription: apiService.description,
    price: apiService.price,
    priceLabel: "Starts at",
    originalPrice: apiService.price ? Math.round(apiService.price * 1.25) : undefined,
    duration: apiService.duration || "60–90 mins",
    rating: apiService.rating || techProf?.averageRating || 4.9,
    reviews: apiService.reviews || techProf?.totalReviews || 48,
    badge: apiService.badge || "Verified Expert",
    image,
    includes: [
      "Full multi-point diagnostic check",
      "Transparent upfront pricing",
      "Genuine spare parts guarantee",
      "Post-repair cleanup & safety verification",
    ],
    features: [
      "Background-checked local technicians",
      "30-day service satisfaction warranty",
      "Same-day or flexible schedule booking",
    ],
    technicianProfileId: apiService.technicianProfileId || techProf?.id,
    technician: {
      id: techProf?.id || apiService.technicianProfileId,
      name: technicianName,
      email: techProf?.user?.email,
      role: `Senior ${categoryName} Specialist`,
      experience: techProf?.experience
        ? `${techProf.experience} years experience`
        : "5+ yrs experience",
      rating: techProf?.averageRating || 4.9,
      jobs: techProf?.totalReviews || 120,
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=85&w=200",
      bio: techProf?.bio || undefined,
      location: techProf?.location || "Available in your area",
      skills: techProf?.skills || undefined,
      hourlyRate: techProf?.hourlyRate || undefined,
      isVerified: techProf?.isVerified ?? true,
    },
  };
}

/**
 * Fetch public technician profile details by technicianProfileId from GET /services/technicians/{id}.
 */
export async function fetchTechnicianProfile(id: string) {
  return publicApiRequest<import("@/types").TechnicianProfile>(`/services/technicians/${id}`);
}

export const fetchTechnicianProfileCached = cache(fetchTechnicianProfile);

/**
 * Fetch all services from GET /api/services with query filtering & pagination.
 */
export async function fetchServices(
  params: GetServicesParams = {}
): Promise<GetServicesResponse> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.search) searchParams.set("search", params.search);
  if (params.categoryId) searchParams.set("categoryId", params.categoryId);
  if (params.minPrice) searchParams.set("minPrice", params.minPrice.toString());
  if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice.toString());
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const queryString = searchParams.toString();
  const path = `/services${queryString ? `?${queryString}` : ""}`;

  const cacheOptions =
    typeof window === "undefined"
      ? { next: { revalidate: PUBLIC_DATA_REVALIDATE_SECONDS } }
      : { cache: "default" as RequestCache };
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    ...cacheOptions,
  });

  if (!response.ok) {
    console.warn(`[fetchServices] Server returned HTTP ${response.status}`);
    return {
      data: [],
      meta: {
        page: params.page || 1,
        limit: params.limit || 8,
        total: 0,
        totalPage: 1,
      },
    };
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to retrieve services.");
  }

  return {
    data: result.data || [],
    meta: result.meta || {
      page: params.page || 1,
      limit: params.limit || 10,
      total: result.data?.length || 0,
      totalPage: 1,
    },
  };
}

/**
 * Fetch single service detail by ID from GET /api/services/{id}.
 */
export async function fetchServiceById(id: string): Promise<ApiService> {
  return publicApiRequest<ApiService>(`/services/${id}`);
}

export const fetchServiceByIdCached = cache(fetchServiceById);

/**
 * Fetch all categories from GET /api/services/categories.
 */
export async function fetchServiceCategories(): Promise<ApiServiceCategory[]> {
  return publicApiRequest<ApiServiceCategory[]>("/services/categories");
}

export const fetchServiceCategoriesCached = cache(fetchServiceCategories);


