import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";
import { ServiceDetail } from "@/components/services/service-detail";
import { getServiceById, services } from "@/lib/services-data";

type ServicePageProps = {
  params: Promise<{ id: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ id: service.id }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { id } = await params;
  const service = getServiceById(id);

  if (!service) {
    return { title: "Service Not Found" };
  }

  return {
    title: service.name,
    description: service.description,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { id } = await params;
  const service = getServiceById(id);

  if (!service) notFound();

  return (
    <div className="bg-[#F9F7F2]">
      <Navbar />
      <ServiceDetail service={service} />
      <Footer />
    </div>
  );
}
