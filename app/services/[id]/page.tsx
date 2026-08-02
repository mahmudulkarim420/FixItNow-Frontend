import type { Metadata } from "next";

import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";
import { getSessionUser } from "@/lib/auth";
import { ServiceDetail, ServiceNotFound } from "@/components/services/service-detail";
import { fetchServiceByIdCached, mapApiServiceToUI } from "@/lib/services-api";
import { getServiceById as getMockServiceById } from "@/lib/services-data";

type ServicePageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const apiService = await fetchServiceByIdCached(id);
    if (apiService) {
      return {
        title: `${apiService.title} | FixItNow Home Services`,
        description: apiService.description,
      };
    }
  } catch {
    const mock = getMockServiceById(id);
    if (mock) {
      return {
        title: `${mock.name} | FixItNow Home Services`,
        description: mock.description,
      };
    }
  }

  return { title: "Service Details | FixItNow" };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { id } = await params;
  const userPromise = getSessionUser();
  let service = null;

  try {
    const apiService = await fetchServiceByIdCached(id);
    if (apiService) {
      service = mapApiServiceToUI(apiService);
    }
  } catch {
    service = getMockServiceById(id) || null;
  }

  const user = await userPromise;

  if (!service) {
    return (
      <div className="bg-[#F9F7F2]">
        <Navbar user={user} />
        <ServiceNotFound />
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#F9F7F2]">
      <Navbar user={user} />
      <ServiceDetail service={service} isAuthenticated={Boolean(user)} />
      <Footer />
    </div>
  );
}
