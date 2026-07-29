"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Wrench,
  Calendar,
  DollarSign,
  Star,
  UserCheck,
  Settings,
  HelpCircle,
  LogOut,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavGroup {
  title: string;
  items: {
    name: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
    badgeColor?: string;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Technician Menu",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard/technician",
        icon: LayoutDashboard,
      },
      {
        name: "My Jobs",
        href: "/dashboard/technician/jobs",
        icon: Briefcase,
        badge: "5 Active",
        badgeColor: "bg-amber-500 text-stone-950 font-extrabold",
      },
      {
        name: "My Services",
        href: "/dashboard/technician/services",
        icon: Wrench,
        badge: "4 Active",
        badgeColor: "bg-stone-900 text-amber-400 font-bold",
      },
      {
        name: "Schedule & Slots",
        href: "/dashboard/technician/schedule",
        icon: Calendar,
      },
    ],
  },
  {
    title: "Performance & Earnings",
    items: [
      {
        name: "Earnings",
        href: "/dashboard/technician/earnings",
        icon: DollarSign,
      },
      {
        name: "Reviews & Ratings",
        href: "/dashboard/technician/reviews",
        icon: Star,
        badge: "4.9 ★",
        badgeColor: "bg-amber-100 text-amber-900 font-bold",
      },
    ],
  },
  {
    title: "Account & Profile",
    items: [
      {
        name: "Profile & Skills",
        href: "/dashboard/technician/profile",
        icon: UserCheck,
      },
      {
        name: "Settings",
        href: "/dashboard/technician/settings",
        icon: Settings,
      },
      {
        name: "Help & Support",
        href: "/dashboard/technician/help",
        icon: HelpCircle,
      },
    ],
  },
];

interface TechnicianSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function TechnicianSidebar({
  mobileOpen,
  onCloseMobile,
}: TechnicianSidebarProps) {
  const pathname = usePathname();

  const SidebarContent = (
    <div className="flex flex-col justify-between h-full min-h-0">
      <div className="flex flex-col flex-1 overflow-y-auto pr-1">
        {/* Brand Logo Header */}
        <div className="flex items-center justify-between px-2 py-2 mb-4 shrink-0">
          <Link href="/dashboard/technician" onClick={onCloseMobile} className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-stone-950 shadow-sm transition-transform group-hover:scale-105">
              <Wrench className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-stone-900">
                FixItNow<span className="text-amber-500 font-extrabold">.</span>
              </span>
              <span className="block text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                Tech Portal
              </span>
            </div>
          </Link>

          {/* Close button for mobile drawer */}
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close sidebar"
              className="lg:hidden flex h-8 w-8 items-center justify-center rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="space-y-5 flex-1">
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="px-3 text-[10px] font-extrabold text-stone-400 uppercase tracking-wider mb-1.5">
                {group.title}
              </p>
              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/dashboard/technician"
                      ? pathname === "/dashboard/technician"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onCloseMobile}
                      className={cn(
                        "group relative flex items-center justify-between rounded-2xl px-3 py-2.5 text-xs font-semibold transition-all duration-200",
                        isActive
                          ? "bg-amber-50 text-amber-900 font-bold shadow-xs"
                          : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-amber-500 rounded-r-full" />
                        )}
                        <Icon
                          className={cn(
                            "h-4 w-4 transition-transform group-hover:scale-110",
                            isActive ? "text-amber-600" : "text-stone-400 group-hover:text-stone-700"
                          )}
                        />
                        <span>{item.name}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[9px] shadow-2xs",
                            item.badgeColor || "bg-stone-900 text-amber-400 font-bold"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}

          {/* Logout Action */}
          <div className="pt-2 border-t border-stone-100">
            <Link
              href="/logout"
              onClick={onCloseMobile}
              className="group flex items-center justify-between rounded-2xl px-3 py-2.5 text-xs font-semibold text-rose-600 transition-all duration-200 hover:bg-rose-50"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="h-4 w-4 text-rose-500 transition-transform group-hover:scale-110" />
                <span>Logout</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Permanent Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between rounded-3xl bg-white p-4 sm:p-5 border border-stone-200/70 shadow-sm min-h-[calc(100vh-2.5rem)]">
        {SidebarContent}
      </aside>

      {/* 2. Mobile / Tablet Animated Overlay Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop Fade */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
              onClick={onCloseMobile}
            />

            {/* Slide-in Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white p-5 shadow-2xl overflow-y-auto"
            >
              {SidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
