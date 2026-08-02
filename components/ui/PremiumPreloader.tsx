"use client";

import { useCallback, useEffect, useSyncExternalStore, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function PremiumPreloader() {
  const isMounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const [isLoaded, setIsLoaded] = useState(() => {
    if (typeof window === "undefined") return true;
    return Boolean(sessionStorage.getItem("fixitnow_preloader_seen"));
  });

  const dismissLoader = useCallback(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) return;

    // First visit: record session flag and dismiss immediately without artificial delay
    sessionStorage.setItem("fixitnow_preloader_seen", "true");
    const timer = setTimeout(dismissLoader, 0);
    return () => clearTimeout(timer);
  }, [isLoaded, dismissLoader]);

  if (!isMounted || isLoaded) return null;

  return (
    <AnimatePresence mode="wait">
      {!isLoaded && (
        <motion.div
          key="minimal-luxury-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.2, ease: "easeOut" },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF8F5] text-stone-900 overflow-hidden font-sans select-none pointer-events-none"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-50/60 via-[#FAF8F5] to-[#F5F2EC] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15 }}
              className="mb-4 relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex items-center justify-center border-2 border-stone-200/80 bg-white shadow-xs"
            >
              <Image
                src="/logo.png"
                alt="FixItNow Logo"
                fill
                className="object-cover"
                priority
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="space-y-1 text-center"
            >
              <h1 className="text-xl sm:text-2xl font-light tracking-[0.45em] text-stone-900 uppercase font-serif pl-[0.45em]">
                FIXITNOW
              </h1>
              <p className="text-[10px] sm:text-[11px] font-medium tracking-[0.35em] text-amber-800/80 uppercase pl-[0.35em]">
                EXPERT HOME CARE
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

