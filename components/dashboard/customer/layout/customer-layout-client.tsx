"use client";

import { useState } from "react";
import { CustomerSidebar } from "@/components/dashboard/customer/layout/customer-sidebar";
import { CustomerHeader } from "@/components/dashboard/customer/layout/customer-header";
import type { User } from "@/types";

interface CustomerLayoutClientProps {
  user: User;
  children: React.ReactNode;
}

export function CustomerLayoutClient({
  user,
  children,
}: CustomerLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-3 sm:p-5 text-stone-900 font-sans">
      <div className="mx-auto max-w-[1600px] flex flex-col lg:flex-row gap-5">
        {/* Left Sidebar (Shared for all customer routes) */}
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

          {/* Route Content */}
          <div className="flex-1">{children}</div>
        </main>
      </div>
    </div>
  );
}
