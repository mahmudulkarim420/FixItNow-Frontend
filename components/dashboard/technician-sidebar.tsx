"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  Star,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Wrench,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/lib/api";

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
    title: "Main Menu",
    items: [
      {
        name: "Overview",
        href: "/dashboard/technician",
        icon: LayoutDashboard,
      },
      {
        name: "Job Requests",
        href: "/dashboard/technician/jobs",
        icon: Briefcase,
        badge: "3 New",
        badgeColor: "bg-amber-100 text-amber-900 font-bold",
      },
      {
        name: "My Services",
        href: "/dashboard/technician/services",
        icon: Wrench,
      },
      {
        name: "Schedule & Slots",
        href: "/dashboard/technician/schedule",
        icon: Clock,
      },
    ],
  },
  {
    title: "Earnings & Feedback",
    items: [
      {
        name: "Earnings Report",
        href: "/dashboard/technician/earnings",
        icon: DollarSign,
      },
      {
        name: "Client Reviews",
        href: "/dashboard/technician/reviews",
        icon: Star,
      },
    ],
  },
  {
    title: "Account & Support",
    items: [
      {
        name: "Pro Profile",
        href: "/dashboard/technician/profile",
        icon: User,
      },
      {
        name: "Settings",
        href: "/dashboard/technician/settings",
        icon: Settings,
      },
    ],
  },
];

interface TechnicianSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function TechnicianSidebar({ mobileOpen, onCloseMobile }: TechnicianSidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    if (onCloseMobile) onCloseMobile();
    try {
      await logoutUser();
    } catch {
      /* Swallow */
    }
    document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  const SidebarContent = (
    <div className="flex flex-col justify-between h-full min-h-0">
      <div className="flex flex-col flex-1 overflow-y-auto pr-1">
        {/* Brand Logo Header */}
        <div className="flex items-center justify-between px-2 py-2 mb-4 shrink-0">
          <Link href="/" onClick={onCloseMobile} className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0 flex items-center justify-center border border-stone-200 bg-white">
              <Image
                src="/logo.png"
                alt="FixItNow Logo"
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-stone-900">
                FixItNow<span className="text-amber-500 font-extrabold">.</span>
              </span>
              <span className="block text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                Pro Technician Portal
              </span>
            </div>
          </Link>

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
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onCloseMobile}
                      className={cn(
                        "group flex items-center justify-between rounded-2xl px-3 py-2.5 text-xs font-semibold transition-all duration-200",
                        isActive
                          ? "bg-amber-500 text-stone-950 shadow-xs font-bold"
                          : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={cn(
                            "h-4 w-4 transition-transform duration-200 group-hover:scale-110",
                            isActive ? "text-stone-950" : "text-stone-400 group-hover:text-stone-900"
                          )}
                        />
                        <span>{item.name}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[9px] font-extrabold",
                            isActive ? "bg-stone-950 text-amber-400" : item.badgeColor
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
            <button
              type="button"
              onClick={handleLogout}
              className="w-full group flex items-center justify-between rounded-2xl px-3 py-2.5 text-xs font-semibold text-rose-600 transition-all duration-200 hover:bg-rose-50 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="h-4 w-4 text-rose-500 transition-transform group-hover:scale-110" />
                <span>Logout</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between rounded-3xl bg-white p-4 sm:p-5 border border-stone-200/70 shadow-sm min-h-[calc(100vh-2.5rem)]">
        {SidebarContent}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="fixed inset-y-0 left-0 w-72 bg-white p-4 shadow-2xl flex flex-col justify-between"
            >
              {SidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
