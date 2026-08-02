import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, CalendarCheck, ShieldCheck, Sparkles, Star, Wrench } from "lucide-react";

import Footer from "@/components/home/footer-section";
import Navbar from "@/components/home/navbar";
import { ServicesCatalog } from "@/components/services/services-catalog";
import { BreadcrumbsJsonLd } from "@/components/seo/json-ld";
import { fetchServiceCategoriesCached, fetchServices } from "@/lib/services-api";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://fixitnow.co").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Professional Home Repair & Maintenance Services Catalog",
  description:
    "Explore trusted AC, plumbing, electrical, appliance, and home care services. Book verified local specialists with transparent upfront pricing.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Professional Home Repair Services Catalog — FixItNow",
    description:
      "Explore trusted AC, plumbing, electrical, appliance, and home care services with clear upfront pricing.",
    url: `${SITE_URL}/services`,
  },
};

const trustPoints = [
  { icon: BadgeCheck, label: "Verified professionals" },
  { icon: ShieldCheck, label: "30-day service guarantee" },
  { icon: CalendarCheck, label: "Same-day & scheduled visits" },
];

export default async function ServicesPage() {
  const [initialCategories, initialServicesRes] = await Promise.all([
    fetchServiceCategoriesCached().catch(() => []),
    fetchServices({ page: 1, limit: 8 }).catch(() => ({
      data: [],
      meta: { page: 1, limit: 8, total: 0, totalPage: 1 },
    })),
  ]);

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-stone-900 selection:bg-amber-200 selection:text-amber-950">
      <BreadcrumbsJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Services", url: `${SITE_URL}/services` },
        ]}
      />
      <Navbar />
      <main className="pt-20 sm:pt-24">
        {/* Header / Hero Section */}
        <section className="relative overflow-hidden px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8 lg:pb-20">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e7e5e4_1px,transparent_1px),linear-gradient(to_bottom,#e7e5e4_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35 [mask-image:radial-gradient(ellipse_65%_75%_at_50%_30%,#000,transparent)]" />
          <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-amber-300/35 blur-3xl" />

          <div className="relative mx-auto max-w-7xl">
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
              {/* Left Column: Heading & Badge */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/90 px-3.5 py-1.5 text-xs font-bold text-amber-800 shadow-2xs backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                  <span>FixItNow Expert Catalog</span>
                </div>
                <h1 className="mt-5 text-3xl font-extrabold tracking-[-0.04em] text-stone-950 sm:text-5xl lg:text-6xl lg:leading-[1.08]">
                  Professional Repair & Maintenance Services
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base lg:text-lg">
                  From urgent cooling breakdowns to everyday plumbing and electrical maintenance, book top-rated local specialists with transparent upfront pricing.
                </p>
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                  {trustPoints.map(({ icon: Icon, label }) => (
                    <span
                      key={label}
                      className="flex items-center gap-2 text-xs font-semibold text-stone-700 sm:text-sm"
                    >
                      <Icon className="h-4 w-4 text-amber-600" />
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: High-End Professional Image Showcase Container */}
              <div className="relative lg:col-span-5">
                <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-3xl border-4 border-white bg-white shadow-[0_25px_60px_-25px_rgba(41,37,36,0.35)] sm:aspect-[16/11]">
                  <Image
                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=85&w=800"
                    alt="Professional FixItNow Technician"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />

                  {/* Floating Glassmorphism Badge */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/40 bg-white/80 p-3.5 shadow-lg backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-stone-950 shadow-sm">
                        <Wrench className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-stone-900">Certified Local Pros</p>
                        <p className="text-[11px] text-stone-600 font-medium">Licensed, Vetted & Insured</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>4.9 / 5.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ServicesCatalog
          initialCategories={initialCategories}
          initialServicesRes={initialServicesRes}
        />
      </main>
      <Footer />
    </div>
  );
}
