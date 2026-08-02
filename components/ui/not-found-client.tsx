"use client";

import Link from "next/link";
import { ChevronRight, Wrench } from "lucide-react";
import { motion } from "framer-motion";

import Footer from "@/components/home/Footer";
import { NavbarClient } from "@/components/shared/navbar-client";

export function NotFoundClient() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F2] text-stone-900 selection:bg-amber-400 selection:text-stone-950">
      <NavbarClient user={null} />

      <main className="flex-1 mx-auto flex items-center justify-center max-w-5xl px-6 py-24 sm:py-32 w-full">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 lg:gap-16 w-full">
          {/* Left Side: Hand-drawn Line-Art Illustration */}
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
              <ellipse cx="160" cy="270" rx="90" ry="10" fill="#1C1917" opacity="0.15" />
              <path
                d="M 50 260 C 40 230 70 200 90 220 C 100 190 130 200 140 230 C 150 260 50 270 50 260 Z"
                fill="#1C1917"
              />
              <path
                d="M 210 260 C 200 235 220 215 235 230 C 245 210 265 220 270 240 C 275 260 210 270 210 260 Z"
                fill="#1C1917"
              />
              <line x1="30" y1="265" x2="290" y2="265" stroke="#1C1917" strokeWidth="4" strokeLinecap="round" />

              {/* Milk Carton Body Fill */}
              <path
                d="M 100 130 L 130 65 L 190 65 L 220 130 L 220 260 L 100 260 Z"
                fill="#FFFFFF"
                stroke="#1C1917"
                strokeWidth="5"
                strokeLinejoin="round"
              />

              {/* Milk Carton Top Fold Detail */}
              <path
                d="M 125 65 L 125 50 L 195 50 L 195 65"
                fill="#FFFFFF"
                stroke="#1C1917"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              <circle cx="160" cy="85" r="16" stroke="#1C1917" strokeWidth="4" fill="#FFFFFF" />

              {/* Slanted Roof Line */}
              <line x1="100" y1="130" x2="220" y2="130" stroke="#1C1917" strokeWidth="5" />
              <line x1="190" y1="65" x2="220" y2="130" stroke="#1C1917" strokeWidth="5" />
              <line x1="190" y1="65" x2="190" y2="260" stroke="#1C1917" strokeWidth="4" />

              {/* Sad Face Panel */}
              <rect x="112" y="150" width="62" height="60" rx="4" stroke="#1C1917" strokeWidth="4" fill="#FFFFFF" />

              {/* Left X Eye */}
              <line x1="124" y1="164" x2="134" y2="174" stroke="#1C1917" strokeWidth="4" strokeLinecap="round" />
              <line x1="134" y1="164" x2="124" y2="174" stroke="#1C1917" strokeWidth="4" strokeLinecap="round" />

              {/* Right X Eye */}
              <line x1="152" y1="164" x2="162" y2="174" stroke="#1C1917" strokeWidth="4" strokeLinecap="round" />
              <line x1="162" y1="164" x2="152" y2="174" stroke="#1C1917" strokeWidth="4" strokeLinecap="round" />

              {/* Squiggly Sad Mouth */}
              <path
                d="M 125 194 Q 133 186 143 194 T 161 194"
                fill="none"
                stroke="#1C1917"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Side Motion Rays */}
              <line x1="75" y1="115" x2="60" y2="100" stroke="#1C1917" strokeWidth="4" strokeLinecap="round" />
              <line x1="70" y1="140" x2="50" y2="140" stroke="#1C1917" strokeWidth="4" strokeLinecap="round" />
              <line x1="78" y1="165" x2="62" y2="178" stroke="#1C1917" strokeWidth="4" strokeLinecap="round" />
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
              404
            </h1>

            <h2 className="mt-4 text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              Something&apos;s missing.
            </h2>

            <p className="mt-2 text-stone-600 font-medium text-sm sm:text-base leading-relaxed">
              This page is missing or you assembled the link incorrectly.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 font-extrabold text-amber-800 hover:text-amber-900 text-base transition group"
              >
                <span>Go to website</span>
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1 text-amber-800" />
              </Link>

              <span className="hidden sm:inline text-stone-300">|</span>

              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 font-bold text-stone-700 hover:text-stone-950 text-base transition group"
              >
                <Wrench className="h-4 w-4 text-amber-600" />
                <span>Browse Services</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
