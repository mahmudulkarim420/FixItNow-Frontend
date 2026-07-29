"use client";

import { useState } from "react";
import { CustomerSidebar } from "@/components/dashboard/customer-sidebar";
import { CustomerHeader } from "@/components/dashboard/customer-header";
import { CustomerKpiCards } from "@/components/dashboard/customer-kpi-cards";
import { CustomerAnalytics } from "@/components/dashboard/customer-analytics";
import { CustomerWidget } from "@/components/dashboard/customer-widget";
import type { User } from "@/types";

interface CustomerDashboardClientProps {
  user: User;
}

export function CustomerDashboardClient({ user }: CustomerDashboardClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-3 sm:p-5 text-stone-900 font-sans">
      <div className="mx-auto max-w-[1600px] flex flex-col lg:flex-row gap-5">
        {/* Left Sidebar (Desktop Static + Mobile Slide-over Drawer) */}
        <CustomerSidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col gap-5 sm:gap-6 overflow-hidden">
          {/* Header Bar */}
          <CustomerHeader
            user={user}
            onToggleMobileMenu={() => setMobileMenuOpen(true)}
          />

          {/* Top KPI Cards & Welcome Header */}
          <CustomerKpiCards user={user} />

          {/* Middle Row: Monthly Expense Chart, Live Dispatch Status & Recent Bookings */}
          <CustomerAnalytics />

          {/* Bottom Row: Favorite Pros, Home Health Score & 24/7 Emergency Dispatch */}
          <CustomerWidget />
        </main>
      </div>
    </div>
  );
}
