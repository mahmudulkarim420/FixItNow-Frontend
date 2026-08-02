"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/auth-provider";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function RootPreloader() {
  const isMounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { isLoading } = useAuth();

  // Keep preloader active during SSR or while auth session hydration is pending
  const showPreloader = !isMounted || isLoading;

  return (
    <AnimatePresence mode="wait">
      {showPreloader && (
        <motion.div
          key="voyage-root-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] text-white overflow-hidden font-sans select-none pointer-events-auto"
        >
          {/* Subtle VOYΛGE monochrome radial spotlight */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-900/50 via-[#050505] to-black pointer-events-none" />

          {/* Glowing background halo behind logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

          <div className="relative z-10 flex flex-col items-center text-center px-6">
            {/* Logo container with micro-pulse & glowing ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative mb-6"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-0.5 bg-gradient-to-b from-stone-400/40 via-stone-700/20 to-transparent shadow-2xl">
                <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-black border border-stone-800">
                  <Image
                    src="/logo.png"
                    alt="FixItNow Logo"
                    fill
                    sizes="96px"
                    className="object-cover p-1"
                    priority
                  />
                </div>
              </div>

              {/* Pulsing ring animation */}
              <div className="absolute -inset-2 rounded-full border border-white/10 animate-ping opacity-25 pointer-events-none" />
            </motion.div>

            {/* Typography - VOYΛGE Minimalist Aesthetics */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="space-y-2 text-center"
            >
              <h1 className="text-xl sm:text-2xl font-light tracking-[0.45em] sm:tracking-[0.55em] text-white uppercase font-serif pl-[0.45em] sm:pl-[0.55em]">
                FIXITNOW
              </h1>
              <p className="text-[10px] sm:text-[11px] font-medium tracking-[0.35em] text-stone-400/80 uppercase pl-[0.35em]">
                EXPERT HOME CARE
              </p>
            </motion.div>

            {/* Ultra-sleek minimalist linear progress indicator */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mt-8 w-36 sm:w-44 h-[2px] bg-stone-900 rounded-full overflow-hidden relative"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-[shimmer_1.4s_infinite] -translate-x-full" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
