"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  Star,
  Bookmark,
  User,
  Settings,
  LogOut,
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
        name: "Dashboard",
        href: "/dashboard/customer",
        icon: LayoutDashboard,
      },
      {
        name: "My Bookings",
        href: "/dashboard/customer/bookings",
        icon: Calendar,
        badge: "Active",
        badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-bold",
      },
      {
        name: "Saved Services",
        href: "/dashboard/customer/saved",
        icon: Bookmark,
      },
    ],
  },
  {
    title: "Finance & History",
    items: [
      {
        name: "Payments",
        href: "/dashboard/customer/payments",
        icon: CreditCard,
      },
      {
        name: "My Reviews",
        href: "/dashboard/customer/reviews",
        icon: Star,
      },
    ],
  },
  {
    title: "Account & Support",
    items: [
      {
        name: "Profile",
        href: "/dashboard/customer/profile",
        icon: User,
      },
      {
        name: "Settings",
        href: "/dashboard/customer/settings",
        icon: Settings,
      },
    ],
  },
];

interface CustomerSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function CustomerSidebar({ mobileOpen, onCloseMobile }: CustomerSidebarProps) {
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
            <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0 flex items-center justify-center border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xs">
              <Image
                src="/logo.png"
                alt="FixItNow Logo"
                fill
                sizes="40px"
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-stone-900 dark:text-slate-100">
                FixItNow<span className="text-amber-500 font-extrabold">.</span>
              </span>
              <span className="block text-[10px] font-semibold text-stone-400 dark:text-slate-400 uppercase tracking-wider">
                Customer Portal
              </span>
            </div>
          </Link>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close sidebar"
              className="lg:hidden flex h-8 w-8 items-center justify-center rounded-xl text-stone-400 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800 hover:text-stone-700 dark:hover:text-slate-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="space-y-5 flex-1">
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="px-3 text-[10px] font-extrabold text-stone-400 dark:text-slate-400 uppercase tracking-wider mb-1.5">
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
                          ? "bg-amber-500 text-stone-950 shadow-2xs font-bold"
                          : "text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800/80 hover:text-stone-900 dark:hover:text-slate-100"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={cn(
                            "h-4 w-4 transition-transform duration-200 group-hover:scale-110",
                            isActive ? "text-stone-950" : "text-stone-400 dark:text-slate-400 group-hover:text-stone-900 dark:group-hover:text-slate-100"
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
          <div className="pt-2 border-t border-stone-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full group flex items-center justify-between rounded-2xl px-3 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 transition-all duration-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="h-4 w-4 text-rose-500 dark:text-rose-400 transition-transform group-hover:scale-110" />
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
      <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 p-4 sm:p-5 border border-stone-200/70 dark:border-slate-800 shadow-2xs min-h-[calc(100vh-2.5rem)] transition-colors">
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
              className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 p-4 shadow-2xl flex flex-col justify-between"
            >
              {SidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
