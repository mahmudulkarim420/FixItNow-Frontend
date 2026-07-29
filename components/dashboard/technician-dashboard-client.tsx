"use client";

import { useState } from "react";
import { TechnicianSidebar } from "@/components/dashboard/technician-sidebar";
import { TechnicianHeader } from "@/components/dashboard/technician-header";
import { TechnicianKpiCards } from "@/components/dashboard/technician-kpi-cards";
import { TechnicianAnalytics } from "@/components/dashboard/technician-analytics";
import { TechnicianWidget } from "@/components/dashboard/technician-widget";
import type { User } from "@/types";

interface TechnicianDashboardClientProps {
  user: User;
}

export function TechnicianDashboardClient({
  user,
}: TechnicianDashboardClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-3 sm:p-5 text-stone-900 font-sans">
      <div className="mx-auto max-w-[1600px] flex flex-col lg:flex-row gap-5">
        {/* Left Sidebar (Desktop Static + Mobile Slide-over Drawer) */}
        <TechnicianSidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col gap-5 sm:gap-6 overflow-hidden">
          {/* Header Bar */}
          <TechnicianHeader
            user={user}
            onToggleMobileMenu={() => setMobileMenuOpen(true)}
          />

          {/* Top KPI Cards & Welcome Header */}
          <TechnicianKpiCards user={user} />

          {/* Middle Row: Hours Chart, Next Dispatch Alert & Today's Schedule */}
          <TechnicianAnalytics />

          {/* Bottom Row: Customer Reviews, Verification Score & Active Job Timer */}
          <TechnicianWidget />
        </main>
      </div>
    </div>
  );
}
