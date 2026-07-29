import type { Metadata } from "next";

import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";
import { ServiceDetail, ServiceNotFound } from "@/components/services/service-detail";
import { fetchServiceById, mapApiServiceToUI } from "@/lib/services-api";
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
    const apiService = await fetchServiceById(id);
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
  let service = null;

  try {
    const apiService = await fetchServiceById(id);
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
      <Navbar />
      <ServiceDetail service={service} />
      <Footer />
    </div>
  );
}
