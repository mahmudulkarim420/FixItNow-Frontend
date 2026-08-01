"use client";

import {
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  User as UserIcon,
  ChevronDown,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Avatar } from "@/components/shared/avatar";
import { logoutUser } from "@/lib/api";
import { ROLE_HOME } from "@/lib/auth-constants";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

interface UserMenuProps {
  user: User;
}

const ROLE_LABELS: Record<User["role"], string> = {
  CUSTOMER: "Customer",
  TECHNICIAN: "Technician",
  ADMIN: "Admin",
};

const ROLE_BADGE_STYLES: Record<User["role"], string> = {
  CUSTOMER: "bg-sky-50 text-sky-700 ring-sky-600/20",
  TECHNICIAN: "bg-amber-50 text-amber-700 ring-amber-600/20",
  ADMIN: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

/** Hover intent delay (ms) — prevents flicker when crossing gaps. */
const OPEN_DELAY = 80;
const CLOSE_DELAY = 150;

export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearOpenTimer = useCallback(() => {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
  }, []);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const openMenu = useCallback(() => {
    clearCloseTimer();
    clearOpenTimer();
    openTimer.current = setTimeout(() => setOpen(true), OPEN_DELAY);
  }, [clearCloseTimer, clearOpenTimer]);

  const closeMenu = useCallback(() => {
    clearOpenTimer();
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY);
  }, [clearOpenTimer, clearCloseTimer]);

  const toggleMenu = useCallback(() => {
    clearOpenTimer();
    clearCloseTimer();
    setOpen((v) => !v);
  }, [clearOpenTimer, clearCloseTimer]);

  // Close on outside click / Escape.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        clearCloseTimer();
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        clearCloseTimer();
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [clearCloseTimer]);

  // Auto-close on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Cleanup timers on unmount.
  useEffect(() => {
    return () => {
      clearOpenTimer();
      clearCloseTimer();
    };
  }, [clearOpenTimer, clearCloseTimer]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logoutUser();
      toast.success("Signed out successfully");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Could not sign out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  const menuItems = [
    {
      label: "Dashboard",
      href: ROLE_HOME[user.role],
      icon: LayoutDashboard,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: UserIcon,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div
      className="relative"
      ref={menuRef}
      // Desktop: open on hover. Mobile: rely on click (tap).
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
    >
      {/* Trigger */}
      <button
        type="button"
        onClick={toggleMenu}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "group flex items-center gap-2 rounded-full border border-stone-200/70 bg-white/80 py-1 pl-1 pr-2 sm:pr-3",
          "shadow-xs transition-all duration-200 hover:border-amber-300 hover:bg-amber-50/50",
          "focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/20",
          open && "border-amber-300 bg-amber-50/50",
        )}
      >
        <Avatar
          name={user.name}
          src={user.avatar}
          size="sm"
          showStatus
          status={user.status}
        />
        <span className="hidden sm:flex flex-col items-start leading-tight">
          <span className="max-w-[120px] truncate text-xs font-semibold text-stone-900">
            {user.name}
          </span>
          <span className="text-[10px] font-medium text-stone-500">
            {ROLE_LABELS[user.role]}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "hidden sm:block h-4 w-4 text-stone-400 transition-transform duration-200",
            open && "rotate-180 text-amber-600",
          )}
        />
      </button>

      {/* Dropdown */}
      <div
        role="menu"
        className={cn(
          "absolute right-0 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-xl shadow-black/5",
          "transition-all duration-200 ease-out",
          open
            ? "visible opacity-100 translate-y-0 scale-100"
            : "invisible opacity-0 -translate-y-1 scale-95 pointer-events-none",
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-stone-100 bg-gradient-to-br from-stone-50 to-amber-50/40 px-4 py-3.5">
          <Avatar name={user.name} src={user.avatar} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-stone-900">
              {user.name}
            </p>
            <p className="truncate text-xs text-stone-500">{user.email}</p>
          </div>
        </div>

        {/* Role badge */}
        <div className="px-4 pt-3">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset",
              ROLE_BADGE_STYLES[user.role],
            )}
          >
            <ShieldCheck className="h-3 w-3" />
            {ROLE_LABELS[user.role]}
          </span>
        </div>

        {/* Menu items */}
        <nav className="flex flex-col gap-0.5 p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  router.push(item.href);
                }}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-amber-50 hover:text-amber-700"
              >
                <Icon className="h-4 w-4 text-stone-400" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-stone-100 p-2">
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" />
            {loggingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </div>
    </div>
  );
}
