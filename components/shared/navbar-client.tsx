"use client";

import { Home, Wrench, Compass, Info, MessageCircle, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { UserMenu } from "@/components/shared/user-menu";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

interface NavbarClientProps {
  user: User | null;
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

export function NavbarClient({ user }: NavbarClientProps) {
  const pathname = usePathname();
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

  return (
    <>
      {/* Fixed Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4">
          <div className="relative flex h-14 items-center justify-between rounded-full border border-stone-200/70 bg-white/90 px-4 shadow-sm backdrop-blur-md sm:h-16 sm:px-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative h-9 w-9 rounded-full overflow-hidden shrink-0 flex items-center justify-center border border-stone-200/80 shadow-2xs bg-white">
                <Image
                  src="/logo.png"
                  alt="FixItNow Logo"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  priority
                />
              </div>
              <span className="font-bold text-lg sm:text-xl tracking-tight text-stone-900">
                FixItNow<span className="text-amber-500 font-extrabold">.</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden items-center gap-1 lg:flex">
              {DESKTOP_NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "rounded-full px-3 py-2 text-xs font-semibold transition-colors",
                    isActive(link.href)
                      ? "bg-amber-50 text-amber-700"
                      : "text-stone-600 hover:bg-stone-50 hover:text-stone-900",
                  )}
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
                  <Link href="/login" className="hidden rounded-full px-4 py-2 text-xs font-bold text-stone-700 transition hover:bg-stone-100 sm:inline-flex">
                    Log in
                  </Link>
                  <Link href="/register" className="inline-flex rounded-full bg-stone-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-stone-800 sm:px-5">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile bottom utility navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-stone-200/90 bg-white/95 px-1.5 py-1.5 shadow-lg backdrop-blur-lg lg:hidden">
        {MOBILE_TABS.map((tab) => {
          const Icon = tab.icon;
          const tabActive = isActive(tab.href);
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "flex flex-1 flex-col items-center rounded-xl px-1 py-1 text-[10px] transition-colors",
                tabActive ? "bg-amber-50 font-bold text-amber-700" : "text-stone-500 hover:text-stone-900"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="mt-0.5 whitespace-nowrap text-[9px] sm:text-[10px]">{tab.name}</span>
            </Link>
          );
        })}
        <Link
          href={user ? "/dashboard/customer" : "/register"}
          className="ml-1 flex shrink-0 items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1.5 text-[10px] font-bold text-stone-950 shadow-sm hover:bg-amber-600 transition-colors"
        >
          <Zap className="h-3.5 w-3.5" />
          <span>Start</span>
        </Link>
      </nav>
    </>
  );
}
