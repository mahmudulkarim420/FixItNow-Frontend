"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/dashboard/admin-sidebar";
import { AdminHeader } from "@/components/dashboard/admin-header";
import type { User } from "@/types";

interface AdminLayoutClientProps {
  user: User;
  children: React.ReactNode;
}

export function AdminLayoutClient({ user, children }: AdminLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-3 sm:p-5 text-stone-900 font-sans">
      <div className="mx-auto max-w-[1600px] flex flex-col lg:flex-row gap-5">
        {/* Left Sidebar (Shared for all admin routes) */}
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

          {/* Route Content */}
          <div className="flex-1">{children}</div>
        </main>
      </div>
    </div>
  );
}
