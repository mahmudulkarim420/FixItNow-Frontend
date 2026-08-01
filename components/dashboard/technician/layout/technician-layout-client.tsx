"use client";

import { useState } from "react";
import { TechnicianSidebar } from "@/components/dashboard/technician/layout/technician-sidebar";
import { TechnicianHeader } from "@/components/dashboard/technician/layout/technician-header";
import type { User } from "@/types";

interface TechnicianLayoutClientProps {
  user: User;
  children: React.ReactNode;
}

export function TechnicianLayoutClient({
  user,
  children,
}: TechnicianLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-3 sm:p-5 text-stone-900 font-sans">
      <div className="mx-auto max-w-[1600px] flex flex-col lg:flex-row gap-5">
        {/* Left Sidebar (Shared for all technician routes) */}
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

          {/* Route Content */}
          <div className="flex-1">{children}</div>
        </main>
      </div>
    </div>
  );
}
