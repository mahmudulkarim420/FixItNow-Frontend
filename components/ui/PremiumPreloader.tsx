"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function PremiumPreloader() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if preloader was already shown in this session for instant subsequent loads
    if (typeof window !== "undefined" && sessionStorage.getItem("fixitnow_preloader_seen")) {
      setIsLoaded(true);
      return;
    }

    // Smooth, elegant progress animation with extended display time for luxury feel
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("fixitnow_preloader_seen", "true");
          }
          setTimeout(() => setIsLoaded(true), 250);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 7;
        return next > 100 ? 100 : next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {!isLoaded && (
        <motion.div
          key="minimal-luxury-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -12,
            transition: { duration: 0.75, ease: [0.65, 0, 0.35, 1] },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF8F5] text-stone-900 overflow-hidden font-sans select-none"
        >
          {/* Subtle Soft Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-50/60 via-[#FAF8F5] to-[#F5F2EC] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center px-6">
            {/* Minimal Logo Mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-6 relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex items-center justify-center border-2 border-stone-200/80 bg-white shadow-xs"
            >
              <Image
                src="/logo.png"
                alt="FixItNow Logo"
                fill
                className="object-cover"
                priority
              />
            </motion.div>

            {/* Brand Title: High Luxury Letter Spacing */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-2 text-center"
            >
              <h1 className="text-xl sm:text-2xl font-light tracking-[0.45em] text-stone-900 uppercase font-serif pl-[0.45em]">
                FIXITNOW
              </h1>
              <p className="text-[10px] sm:text-[11px] font-medium tracking-[0.35em] text-amber-800/80 uppercase pl-[0.35em]">
                EXPERT HOME CARE
              </p>
            </motion.div>

            {/* Minimalist Progress Line & Percentage */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex flex-col items-center gap-3"
            >
              {/* Thin Progress Track */}
              <div className="w-36 sm:w-44 h-[1.5px] bg-stone-300/60 rounded-full relative overflow-hidden">
                <motion.div
                  className="h-full bg-stone-900 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                />
              </div>

              {/* Counter */}
              <span className="text-[10px] font-medium tracking-[0.25em] text-stone-500 font-mono pl-[0.25em]">
                {progress}%
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
