"use client";

import { Home, Layers, Compass, Star, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { UserMenu } from "@/components/shared/user-menu";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

interface NavbarClientProps {
  user: User | null;
}

const DESKTOP_NAV_LINKS = [
  { name: "App", href: "#app" },
  { name: "How It Works", href: "#process" },
  { name: "Services", href: "#services" },
  { name: "Pricing", href: "#pricing" },
  { name: "Blog", href: "#blog" },
  { name: "About Us", href: "#about" },
  { name: "Contact", href: "#contact" },
];

const MOBILE_TABS = [
  { id: "home", name: "Home", href: "/", icon: Home },
  { id: "services", name: "Services", href: "#services", icon: Layers },
  { id: "process", name: "Process", href: "#process", icon: Compass },
  { id: "reviews", name: "Reviews", href: "#testimonials", icon: Star },
  { id: "cta", name: "Start", href: "#get-started", icon: Zap, isCta: true },
];

export function NavbarClient({ user }: NavbarClientProps) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("home");

  return (
    <>
      {/* Fixed Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4">
          <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 rounded-full bg-white/90 backdrop-blur-md border border-stone-200/50 shadow-xs">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-white font-black text-sm shadow-xs group-hover:scale-105 transition-transform">
                <span className="leading-none">F</span>
              </div>
              <span className="font-bold text-lg sm:text-xl tracking-tight text-stone-900">
                FixItNow<span className="text-amber-500 font-extrabold">.</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6">
              {DESKTOP_NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right side: auth-aware */}
            <div className="flex items-center gap-2 sm:gap-3">
              {user ? (
                <UserMenu user={user} />
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link
                    href="/login"
                    className="hidden sm:inline-flex items-center text-xs font-bold text-stone-700 hover:text-stone-900 px-4 py-2 rounded-full transition-colors hover:bg-stone-100"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-5 sm:px-6 py-2.5 rounded-full uppercase tracking-wider transition-all duration-200 shadow-xs active:scale-95"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-stone-200/90 shadow-lg px-2 py-1.5 flex items-center justify-around">
        {MOBILE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id || pathname === tab.href;

          if (tab.isCta) {
            return (
              <Link
                key={tab.id}
                href={user ? "/dashboard/customer" : tab.href}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-full font-bold text-xs shadow-xs active:scale-95 transition-all shrink-0"
              >
                <Zap className="w-3.5 h-3.5 fill-white text-white" />
                <span>{tab.name}</span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl transition-all duration-200",
                isActive
                  ? "text-amber-600 font-bold bg-amber-50/70"
                  : "text-stone-500 hover:text-stone-900 font-medium",
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "w-4 h-4",
                    isActive ? "text-amber-600" : "text-stone-500",
                  )}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">
                {tab.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
