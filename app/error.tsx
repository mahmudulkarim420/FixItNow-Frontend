"use client";

import Link from "next/link";
import { ChevronRight, Home, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

import Footer from "@/components/home/Footer";
import { NavbarClient } from "@/components/shared/navbar-client";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception for telemetry/analytics without rendering technical trace to user
    console.error("Global Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F2] text-stone-900 selection:bg-amber-400 selection:text-stone-950">
      <NavbarClient user={null} />

      <main className="flex-1 mx-auto flex items-center justify-center max-w-5xl px-6 py-24 sm:py-32 w-full">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 lg:gap-16 w-full">
          {/* Left Side: Hand-drawn Line-Art Toolbox Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0 flex justify-center items-center"
          >
            <svg
              viewBox="0 0 320 320"
              className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 select-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ground Shadow & Bushes */}
              <ellipse cx="160" cy="265" rx="95" ry="10" fill="#1C1917" opacity="0.15" />
              <path
                d="M 50 255 C 40 225 70 195 90 215 C 100 185 130 195 140 225 C 150 255 50 265 50 255 Z"
                fill="#1C1917"
              />
              <path
                d="M 210 255 C 200 230 220 210 235 225 C 245 205 265 215 270 235 C 275 255 210 265 210 255 Z"
                fill="#1C1917"
              />
              <line x1="30" y1="260" x2="290" y2="260" stroke="#1C1917" strokeWidth="4" strokeLinecap="round" />

              {/* Toolbox Body Fill */}
              <rect
                x="80"
                y="130"
                width="160"
                height="120"
                rx="8"
                fill="#FFFFFF"
                stroke="#1C1917"
                strokeWidth="5"
                strokeLinejoin="round"
              />

              {/* Toolbox Handle Top */}
              <path
                d="M 130 130 L 130 90 C 130 80 190 80 190 90 L 190 130"
                fill="#FFFFFF"
                stroke="#1C1917"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              <line x1="140" y1="105" x2="180" y2="105" stroke="#1C1917" strokeWidth="4" strokeLinecap="round" />

              {/* Metal Clutches / Latches */}
              <rect x="110" y="145" width="16" height="25" rx="2" fill="#FFFFFF" stroke="#1C1917" strokeWidth="4" />
              <rect x="194" y="145" width="16" height="25" rx="2" fill="#FFFFFF" stroke="#1C1917" strokeWidth="4" />

              {/* Sad Face Panel */}
              <rect x="120" y="175" width="80" height="60" rx="4" stroke="#1C1917" strokeWidth="4" fill="#FFFFFF" />

              {/* Left X Eye */}
              <line x1="135" y1="188" x2="147" y2="200" stroke="#1C1917" strokeWidth="4" strokeLinecap="round" />
              <line x1="147" y1="188" x2="135" y2="200" stroke="#1C1917" strokeWidth="4" strokeLinecap="round" />

              {/* Right X Eye */}
              <line x1="173" y1="188" x2="185" y2="200" stroke="#1C1917" strokeWidth="4" strokeLinecap="round" />
              <line x1="185" y1="188" x2="173" y2="200" stroke="#1C1917" strokeWidth="4" strokeLinecap="round" />

              {/* Squiggly Sad Mouth */}
              <path
                d="M 136 220 Q 146 210 160 220 T 184 220"
                fill="none"
                stroke="#1C1917"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Wrench Sticking Out Side */}
              <path
                d="M 230 110 L 255 85 C 262 78 275 90 268 97 L 245 120"
                fill="#FFFFFF"
                stroke="#1C1917"
                strokeWidth="4"
                strokeLinejoin="round"
              />

              {/* Alert Rays */}
              <line x1="60" y1="110" x2="45" y2="95" stroke="#1C1917" strokeWidth="4" strokeLinecap="round" />
              <line x1="50" y1="135" x2="32" y2="135" stroke="#1C1917" strokeWidth="4" strokeLinecap="round" />
              <line x1="58" y1="160" x2="42" y2="172" stroke="#1C1917" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </motion.div>

          {/* Right Side: Clean Typography & Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-center md:text-left max-w-md"
          >
            <h1 className="text-6xl sm:text-7xl font-extrabold text-stone-900 tracking-tight leading-none">
              500
            </h1>

            <h2 className="mt-4 text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              Something went wrong.
            </h2>

            <p className="mt-2 text-stone-600 font-medium text-sm sm:text-base leading-relaxed">
              This page encountered an unexpected glitch while loading. Please try reloading or head back to the website.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex items-center gap-1.5 font-extrabold text-amber-800 hover:text-amber-900 text-base transition group cursor-pointer"
              >
                <RefreshCw className="h-4 w-4 text-amber-800 transition-transform group-hover:rotate-180 duration-500" />
                <span>Try again</span>
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1 text-amber-800" />
              </button>

              <span className="hidden sm:inline text-stone-300">|</span>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 font-bold text-stone-700 hover:text-stone-950 text-base transition group"
              >
                <Home className="h-4 w-4 text-stone-600" />
                <span>Go to website</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
