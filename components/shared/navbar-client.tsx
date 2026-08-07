"use client";

import { Home, Wrench, Compass, Info, MessageCircle, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { UserMenu } from "@/components/shared/user-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ROLE_HOME } from "@/lib/auth-constants";
import { cn } from "@/lib/utils";
import type { User } from "@/types";
import { useAuth } from "@/components/auth/auth-provider";

interface NavbarClientProps {
  user?: User | null;
}

const DESKTOP_NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Be a Technician", href: "/be-a-technician" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const MOBILE_TABS = [
  { id: "home", name: "Home", href: "/", icon: Home },
  { id: "services", name: "Services", href: "/services", icon: Wrench },
  { id: "process", name: "How it works", href: "/how-it-works", icon: Compass },
  { id: "about", name: "About", href: "/about", icon: Info },
  { id: "contact", name: "Contact", href: "/contact", icon: MessageCircle },
];

export function NavbarClient({ user: initialUser }: NavbarClientProps) {
  const pathname = usePathname();
  const { user: authUser, isLoading } = useAuth();
  const currentUser = initialUser !== undefined ? initialUser : authUser;
  const [hash, setHash] = useState("");

  useEffect(() => {
    setHash(window.location.hash);
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const isActive = (href: string) => {
    const [targetPath, targetHash] = href.split("#");

    if (targetHash) {
      return pathname === targetPath && hash === `#${targetHash}`;
    }

    if (targetPath === "/") {
      return pathname === "/" && !hash;
    }

    return pathname === targetPath || pathname.startsWith(`${targetPath}/`);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleTabClick = (href: string) => (e: React.MouseEvent) => {
    if (href === "/" && pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleStartClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Fixed Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4">
          <div className="relative flex h-14 items-center justify-between rounded-full border border-stone-200/70 bg-white/90 px-4 shadow-xs backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 sm:h-16 sm:px-6">
            {/* Logo */}
            <Link href="/" onClick={handleLogoClick} className="flex items-center gap-2.5 group">
              <div className="relative h-9 w-9 rounded-full overflow-hidden shrink-0 flex items-center justify-center border border-stone-200/80 bg-white dark:border-slate-700 dark:bg-slate-800 shadow-2xs">
                <Image
                  src="/logo.png"
                  alt="FixItNow Logo"
                  fill
                  sizes="36px"
                  className="object-cover transition-transform group-hover:scale-105"
                  priority
                />
              </div>
              <span className="font-bold text-lg sm:text-xl tracking-tight text-stone-900 dark:text-slate-100">
                FixItNow<span className="text-amber-500 font-extrabold">.</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden items-center gap-1 lg:flex">
              {DESKTOP_NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={handleTabClick(link.href)}
                  className={cn(
                    "rounded-full px-3 py-2 text-xs font-semibold transition-colors",
                    isActive(link.href)
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                      : "text-stone-600 hover:bg-stone-50 hover:text-stone-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-slate-100"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right side: Theme Toggle & Auth */}
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              {initialUser === undefined && isLoading ? (
                <div className="h-9 w-20 sm:w-24 rounded-full bg-stone-200/80 dark:bg-slate-800 animate-pulse" />
              ) : currentUser ? (
                <UserMenu user={currentUser} />
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link
                    href="/login"
                    className="inline-flex rounded-full bg-stone-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-stone-800 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400 sm:px-5"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile bottom utility navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between border-t border-stone-200/90 bg-white/95 px-1.5 py-1.5 shadow-lg backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/95 lg:hidden">
        {MOBILE_TABS.map((tab) => {
          const Icon = tab.icon;
          const tabActive = isActive(tab.href);
          return (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={handleTabClick(tab.href)}
              className={cn(
                "flex flex-1 min-w-0 flex-col items-center justify-center rounded-xl px-0.5 py-1 transition-colors",
                tabActive
                  ? "bg-amber-50 font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                  : "text-stone-500 hover:text-stone-900 dark:text-slate-400 dark:hover:text-slate-200"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="mt-0.5 truncate text-[8.5px] sm:text-[10px] leading-tight">{tab.name}</span>
            </Link>
          );
        })}
        <Link
          href={currentUser ? ROLE_HOME[currentUser.role] : "/register"}
          onClick={handleStartClick}
          className="ml-0.5 flex shrink-0 items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1.5 text-[9.5px] sm:text-[10px] font-bold text-stone-950 shadow-xs hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-400 transition-colors"
        >
          <Zap className="h-3.5 w-3.5 shrink-0" />
          <span>Start</span>
        </Link>
      </nav>
    </>
  );
}
