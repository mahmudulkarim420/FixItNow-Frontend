"use client";

import { Search, Mail, Bell, Menu } from "lucide-react";
import type { User } from "@/types";

interface AdminHeaderProps {
  user: User;
  onToggleMobileMenu?: () => void;
}

export function AdminHeader({ user, onToggleMobileMenu }: AdminHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 py-2">
      {/* Left Row: Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-2.5 flex-1 w-full">
        {/* Mobile Hamburger Button (Visible only on < lg screens) */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          aria-label="Toggle navigation menu"
          className="lg:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-stone-200/80 bg-white text-stone-700 shadow-xs transition-all hover:bg-stone-50 active:scale-95"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search Input Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search task, booking, tech..."
            className="w-full rounded-2xl border border-stone-200/80 bg-white py-2.5 pl-10 pr-10 text-xs font-medium text-stone-900 placeholder:text-stone-400 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs"
          />
          <div className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-0.5 rounded-lg border border-stone-200 bg-stone-50 px-1.5 py-0.5 text-[10px] font-semibold text-stone-400">
            <span>⌘</span>
            <span>F</span>
          </div>
        </div>
      </div>

      {/* Right Controls: Notifications, Mail, Admin User Profile Info */}
      <div className="flex items-center justify-between md:justify-end gap-2.5">
        <div className="flex items-center gap-2">
          {/* Mail Icon Button */}
          <button
            type="button"
            aria-label="Messages"
            className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-stone-200/80 bg-white text-stone-600 shadow-xs transition-all hover:bg-stone-50 hover:text-stone-900 active:scale-95"
          >
            <Mail className="h-4 w-4" />
          </button>

          {/* Bell Notifications Button */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-stone-200/80 bg-white text-stone-600 shadow-xs transition-all hover:bg-stone-50 hover:text-stone-900 active:scale-95"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
          </button>
        </div>

        {/* Admin Profile Badge */}
        <div className="flex items-center gap-2.5 rounded-2xl border border-stone-200/80 bg-white p-1.5 pr-3.5 shadow-xs transition-all hover:border-stone-300">
          <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-amber-500 font-bold text-stone-950 text-xs shadow-xs shrink-0">
            {user.avatar ? (
              // Standard img with alt text
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              <span>{getInitials(user.name)}</span>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-bold text-stone-900 leading-tight truncate max-w-[100px] sm:max-w-[140px]">
              {user.name}
            </span>
            <span className="hidden sm:block text-[10px] font-medium text-stone-400 max-w-[130px] truncate">
              {user.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
