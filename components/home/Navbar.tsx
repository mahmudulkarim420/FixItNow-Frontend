"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, Layers, Compass, Star, Zap, User } from "lucide-react";

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("home");

  const desktopNavLinks = [
    { name: "App", href: "#app" },
    { name: "How It Works", href: "#process" },
    { name: "Services", href: "#services" },
    { name: "Pricing", href: "#pricing" },
    { name: "Blog", href: "#blog" },
    { name: "About Us", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  const mobileTabs = [
    { id: "home", name: "Home", href: "#", icon: Home },
    { id: "services", name: "Services", href: "#services", icon: Layers },
    { id: "process", name: "Process", href: "#process", icon: Compass },
    { id: "reviews", name: "Reviews", href: "#testimonials", icon: Star },
    { id: "cta", name: "Start", href: "#get-started", icon: Zap, isCta: true },
  ];

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
              {desktopNavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Right Action & Mobile Top Right User Button */}
            <div className="flex items-center gap-3">
              {/* User Profile Avatar Icon with Yellow Notification Badge */}
              <div className="relative">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 cursor-pointer hover:bg-amber-200 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white"></span>
              </div>

              {/* Desktop Dark Pill CTA Button */}
              <Link
                href="#get-started"
                className="hidden sm:inline-flex bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-6 py-2.5 rounded-full uppercase tracking-wider transition-all duration-200 shadow-xs active:scale-95"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Non-Floating Edge-to-Edge Mobile Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-stone-200/90 shadow-lg px-2 py-1.5 flex items-center justify-around">
        {mobileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isCta) {
            return (
              <Link
                key={tab.id}
                href={tab.href}
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
              className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-amber-600 font-bold bg-amber-50/70"
                  : "text-stone-500 hover:text-stone-900 font-medium"
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-600" : "text-stone-500"}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{tab.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
