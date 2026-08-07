"use client";

import { Search, Mail, Bell, Menu, Sparkles } from "lucide-react";
import type { User } from "@/types";
import { ThemeToggle } from "@/components/theme/theme-toggle";

interface CustomerHeaderProps {
  user: User;
  onToggleMobileMenu?: () => void;
}

export function CustomerHeader({
  user,
  onToggleMobileMenu,
}: CustomerHeaderProps) {
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
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          aria-label="Toggle navigation menu"
          className="lg:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-stone-700 dark:text-slate-300 shadow-2xs transition-all hover:bg-stone-50 dark:hover:bg-slate-800 active:scale-95 cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search Input Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search plumbing, AC, electrical pros..."
            className="w-full rounded-2xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 pl-10 pr-10 text-xs font-medium text-stone-900 dark:text-slate-100 placeholder:text-stone-400 dark:placeholder:text-slate-500 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
          />
          <div className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-0.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-stone-400 dark:text-slate-400">
            <span>⌘</span>
            <span>F</span>
          </div>
        </div>
      </div>

      {/* Right Controls: ThemeToggle, Notifications, Messages, Customer Profile */}
      <div className="flex items-center justify-between md:justify-end gap-2.5">
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Mail / Messages Button */}
          <button
            type="button"
            aria-label="Messages"
            className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-stone-600 dark:text-slate-300 shadow-2xs transition-all hover:bg-stone-50 dark:hover:bg-slate-800 hover:text-stone-900 dark:hover:text-slate-100 active:scale-95 cursor-pointer"
          >
            <Mail className="h-4 w-4" />
          </button>

          {/* Bell Notifications Button */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-stone-600 dark:text-slate-300 shadow-2xs transition-all hover:bg-stone-50 dark:hover:bg-slate-800 hover:text-stone-900 dark:hover:text-slate-100 active:scale-95 cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900" />
          </button>
        </div>

        {/* Customer Profile Badge */}
        <div className="flex items-center gap-2.5 rounded-2xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 pr-3.5 shadow-2xs transition-all hover:border-stone-300 dark:hover:border-slate-700">
          <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-amber-500 font-bold text-stone-950 text-xs shadow-2xs shrink-0">
            {user.avatar ? (
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
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-stone-900 dark:text-slate-100 leading-tight truncate max-w-[100px] sm:max-w-[130px]">
                {user.name}
              </span>
              <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
            </div>
            <span className="hidden sm:block text-[10px] font-medium text-stone-400 dark:text-slate-400 max-w-[130px] truncate">
              {user.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
