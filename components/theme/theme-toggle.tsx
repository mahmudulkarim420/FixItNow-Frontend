"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "pill" | "icon" | "minimal";
  showLabel?: boolean;
}

export function ThemeToggle({
  className,
  variant = "default",
  showLabel = false,
}: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        disabled
        className={cn(
          "relative flex items-center justify-center rounded-full p-2 text-stone-500 transition-colors opacity-50",
          className
        )}
      >
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className={cn(
          "group relative flex items-center gap-2 rounded-full border border-stone-200/80 bg-white/80 px-3 py-1.5 text-xs font-semibold shadow-2xs backdrop-blur-md transition-all duration-200",
          "hover:border-amber-400 hover:bg-amber-50/50 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-amber-500/50 dark:hover:bg-slate-800",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
          className
        )}
      >
        <div className="relative h-4 w-4 overflow-hidden">
          <Sun
            className={cn(
              "h-4 w-4 text-amber-500 transition-all duration-300",
              isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
            )}
          />
          <Moon
            className={cn(
              "absolute inset-0 h-4 w-4 text-amber-400 transition-all duration-300",
              isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
            )}
          />
        </div>
        {showLabel && (
          <span className="text-[11px] font-medium text-stone-700 dark:text-slate-300">
            {isDark ? "Dark" : "Light"}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-full border border-stone-200/80 bg-white/90 text-stone-700 shadow-2xs transition-all duration-200",
        "hover:border-amber-300 hover:bg-amber-50/60 hover:text-stone-900 active:scale-95",
        "dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
        className
      )}
    >
      <Sun
        className={cn(
          "h-4 w-4 text-amber-500 transition-all duration-300 transform",
          isDark ? "rotate-90 scale-0 opacity-0 absolute" : "rotate-0 scale-100 opacity-100"
        )}
      />
      <Moon
        className={cn(
          "h-4 w-4 text-amber-400 transition-all duration-300 transform",
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0 absolute"
        )}
      />
    </button>
  );
}
