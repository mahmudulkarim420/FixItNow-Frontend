import Navbar from "@/components/home/Navbar";
import HeroSection from "@/components/home/HeroSection";
import ProcessSection from "@/components/home/ProcessSection";
import CtaBanner from "@/components/home/CtaBanner";
import EmpowerSection from "@/components/home/EmpowerSection";
import CreditGaugeSection from "@/components/home/CreditGaugeSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import Footer from "@/components/home/Footer";

export const metadata = {
  title: "FixItNow | Fix Your Credit, Change Your Life",
  description:
    "A premier credit repair platform helping you analyze, dispute inaccurate negative items, rebuild your score, and achieve total financial freedom.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-900">
      {/* 1. Navbar */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. Our Simple 3-Step Credit Repair Process */}
        <ProcessSection />

        {/* 4. Call-to-Action Banner */}
        <CtaBanner />

        {/* 5. Empowering Your Credit... Section */}
        <EmpowerSection />

        {/* 6. Stats & Credit Gauge Section */}
        <CreditGaugeSection />

        {/* 7. Testimonials Section */}
        <TestimonialsSection />
      </main>

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}
