"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function EmpowerSection() {
  return (
    <section className="py-20 lg:py-28 relative bg-[#F9F7F2]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Overlapping Rounded Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 relative flex justify-center lg:justify-start"
          >
            <div className="relative w-full max-w-md aspect-4/3">
              {/* Back Top-Left Image */}
              <div className="absolute top-0 left-0 w-2/3 h-2/3 rounded-2xl overflow-hidden shadow-md border-4 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&q=80&w=600"
                  alt="Plumbing Repair Work"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Front Bottom-Right Overlapping Image */}
              <div className="absolute bottom-0 right-0 w-3/4 h-3/4 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=700"
                  alt="HVAC Air Conditioning Service"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Right Column: Title & Feature Highlight */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.15] mb-6">
              Empowering Your <br />
              Home, Protecting Your <br />
              Budget.
            </h2>

            {/* Pill Feature Highlight Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-6 w-fit shadow-xs">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span>Transparent Upfront Pricing!</span>
            </div>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
              We connect you with experienced, vetted local specialists who diagnose the root cause and repair with care. No hidden call-out fees, no inflated quotes — just clear, honest service for your peace of mind.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
