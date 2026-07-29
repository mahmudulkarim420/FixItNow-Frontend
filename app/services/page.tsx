import type { Metadata } from "next";
import { BadgeCheck, CalendarCheck, ShieldCheck, Sparkles } from "lucide-react";

import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";
import { ServicesCatalog } from "@/components/services/services-catalog";

export const metadata: Metadata = {
  title: "Home Repair Services",
  description:
    "Explore trusted AC, plumbing, electrical, appliance, and home care services with clear upfront pricing.",
};

const trustPoints = [
  { icon: BadgeCheck, label: "Verified professionals" },
  { icon: ShieldCheck, label: "Service guaranteed" },
  { icon: CalendarCheck, label: "Flexible scheduling" },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#F9F7F2] text-stone-900 selection:bg-amber-200 selection:text-amber-950">
      <Navbar />
      <main className="pt-20 sm:pt-24">
        <section className="relative overflow-hidden px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8 lg:pb-20">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e7e5e4_1px,transparent_1px),linear-gradient(to_bottom,#e7e5e4_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35 [mask-image:radial-gradient(ellipse_65%_75%_at_50%_30%,#000,transparent)]" />
          <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-amber-300/35 blur-3xl" />
          <div className="relative mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/80 px-3 py-1.5 text-xs font-bold text-amber-800">
                <Sparkles className="h-3.5 w-3.5" />
                Home care, simplified
              </div>
              <h1 className="mt-6 text-4xl font-extrabold tracking-[-0.04em] text-stone-950 sm:text-5xl lg:text-6xl lg:leading-[1.05]">
                Expert fixes for a home that feels right.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
                From urgent repairs to everyday upkeep, book a trusted local
                professional with clear pricing and zero guesswork.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {trustPoints.map(({ icon: Icon, label }) => (
                  <span key={label} className="flex items-center gap-2 text-xs font-semibold text-stone-600 sm:text-sm">
                    <Icon className="h-4 w-4 text-amber-600" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <ServicesCatalog />
      </main>
      <Footer />
    </div>
  );
}
