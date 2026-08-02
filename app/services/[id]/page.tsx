import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Footer from "@/components/home/footer-section";
import Navbar from "@/components/home/navbar";
import { ServiceDetail, ServiceNotFound } from "@/components/services/service-detail";
import { BreadcrumbsJsonLd, ServiceJsonLd } from "@/components/seo/json-ld";
import { fetchServiceByIdCached, mapApiServiceToUI } from "@/lib/services-api";
import { getServiceById as getMockServiceById } from "@/lib/mock-services-data";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://fixitnow.co").replace(/\/$/, "");

type ServicePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { id } = await params;
  let service = null;

  try {
    const apiService = await fetchServiceByIdCached(id);
    if (apiService) {
      service = mapApiServiceToUI(apiService);
    }
  } catch {
    service = getMockServiceById(id) || null;
  }

  if (!service) {
    return {
      title: "Service Not Found | FixItNow",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${service.name} — Expert Home Repair Services`,
    description: service.description || service.tagline,
    alternates: {
      canonical: `/services/${id}`,
    },
    openGraph: {
      title: `${service.name} — FixItNow Home Services`,
      description: service.description || service.tagline,
      url: `${SITE_URL}/services/${id}`,
      images: service.image ? [{ url: service.image, alt: service.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.name} — FixItNow Home Services`,
      description: service.description || service.tagline,
      images: service.image ? [service.image] : undefined,
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { id } = await params;
  let service = null;

  try {
    const apiService = await fetchServiceByIdCached(id);
    if (apiService) {
      service = mapApiServiceToUI(apiService);
    }
  } catch {
    service = getMockServiceById(id) || null;
  }

  if (!service) {
    return (
      <div className="bg-[#F9F7F2]">
        <Navbar />
        <ServiceNotFound />
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#F9F7F2]">
      <ServiceJsonLd service={service} baseUrl={SITE_URL} />
      <BreadcrumbsJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Services", url: `${SITE_URL}/services` },
          { name: service.name, url: `${SITE_URL}/services/${id}` },
        ]}
      />
      <Navbar />
      <ServiceDetail service={service} />
      <Footer />
    </div>
  );
}
