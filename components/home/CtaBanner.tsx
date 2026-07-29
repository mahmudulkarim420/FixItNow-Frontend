"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="py-14 relative bg-[#F9F7F2]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl bg-[#FEF3C7] border border-amber-200/80 py-12 px-6 sm:px-12 text-center shadow-2xs"
        >
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-stone-900 leading-tight mb-4">
              Need an urgent fix or routine home maintenance?
            </h2>

            <p className="text-stone-700 text-sm sm:text-base max-w-2xl mb-8 leading-relaxed font-normal">
              Connect with top-rated local repair experts today. Instant booking, transparent quotes, and zero hidden fees.
            </p>

            <Link
              href="/services"
              className="group inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm uppercase tracking-wider px-8 py-3.5 rounded-full transition-all duration-200 active:scale-95 shadow-sm"
            >
              <span>Explore All Services</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-400" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
