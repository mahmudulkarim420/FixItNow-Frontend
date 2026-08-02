import type { MetadataRoute } from "next";
import { fetchServices } from "@/lib/services-api";
import { services as mockServices } from "@/lib/mock-services-data";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://fixitnow.co").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/be-a-technician`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  let serviceRoutes: MetadataRoute.Sitemap = [];

  try {
    const apiRes = await fetchServices({ page: 1, limit: 100 }).catch(() => null);
    const serviceItems = apiRes?.data && apiRes.data.length > 0
      ? apiRes.data
      : mockServices;

    serviceRoutes = serviceItems.map((s) => ({
      url: `${SITE_URL}/services/${s.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    serviceRoutes = mockServices.map((s) => ({
      url: `${SITE_URL}/services/${s.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  }

  return [...staticRoutes, ...serviceRoutes];
}
