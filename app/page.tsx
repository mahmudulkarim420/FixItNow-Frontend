import type { Metadata } from "next";
import Navbar from "@/components/home/navbar";
import HeroSection from "@/components/home/hero-section";
import ProcessSection from "@/components/home/process-section";
import CtaBanner from "@/components/home/cta-banner";
import EmpowerSection from "@/components/home/empower-section";
import CreditGaugeSection from "@/components/home/credit-gauge-section";
import TestimonialsSection from "@/components/home/testimonials-section";
import Footer from "@/components/home/footer-section";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/json-ld";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://fixitnow.co").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "FixItNow — Trusted Home Repair & Maintenance Services",
  description:
    "Book trusted local experts for AC, plumbing, electrical, appliance, and everyday home repairs with clear upfront pricing.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FixItNow — Trusted Home Repair & Maintenance Services",
    description:
      "Book trusted local experts for AC, plumbing, electrical, appliance, and everyday home repairs with clear upfront pricing.",
    url: SITE_URL,
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-slate-950 text-stone-900 dark:text-slate-100 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-900 transition-colors duration-200">
      <OrganizationJsonLd baseUrl={SITE_URL} />
      <WebSiteJsonLd baseUrl={SITE_URL} />
      {/* 1. Navbar */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. Our Simple 3-Step Home Repair Process */}
        <ProcessSection />

        {/* 4. Call-to-Action Banner */}
        <CtaBanner />

        {/* 5. Empowering Your Home Section */}
        <EmpowerSection />

        {/* 6. Stats & Quality Guarantee Section */}
        <CreditGaugeSection />

        {/* 7. Testimonials Section */}
        <TestimonialsSection />
      </main>

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}
