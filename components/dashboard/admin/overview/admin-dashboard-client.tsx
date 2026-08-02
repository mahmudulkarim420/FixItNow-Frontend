"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/dashboard/admin/layout/admin-sidebar";
import { AdminHeader } from "@/components/dashboard/admin/layout/admin-header";
import { AdminKpiCards } from "@/components/dashboard/admin/overview/admin-stat-cards";
import { AdminAnalyticsSection } from "@/components/dashboard/admin/overview/admin-analytics-section";
import { AdminTeamWidget } from "@/components/dashboard/admin/overview/admin-user-activity-widget";
import type { User } from "@/types";

interface AdminDashboardClientProps {
  user: User;
}

export function AdminDashboardClient({ user }: AdminDashboardClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-3 sm:p-5 text-stone-900 font-sans">
      <div className="mx-auto max-w-[1600px] flex flex-col lg:flex-row gap-5">
        {/* Left Sidebar (Desktop Static + Mobile Drawer) */}
        <AdminSidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col gap-5 sm:gap-6 overflow-hidden">
          {/* Header Bar */}
          <AdminHeader
            user={user}
            onToggleMobileMenu={() => setMobileMenuOpen(true)}
          />

          {/* Top KPI Cards & Title Header */}
          <AdminKpiCards />

          {/* Middle Row: Analytics Bar Chart, Reminders & Projects List */}
          <AdminAnalyticsSection />

          {/* Bottom Row: Team Collaboration Roster, Donut Progress & Time Tracker */}
          <AdminTeamWidget />
        </main>
      </div>
    </div>
  );
}
