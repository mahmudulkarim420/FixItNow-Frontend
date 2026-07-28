"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Scale, Sparkles } from "lucide-react";

export default function ProcessSection() {
  return (
    <section id="process" className="py-20 lg:py-28 relative bg-[#F9F7F2]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Heading & Paragraph */}
          <div className="lg:col-span-5 pt-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.15] mb-6">
              Our Simple 3-Step <br />
              Credit Repair Process
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Our proven method makes repairing your credit simple, transparent, and effective. Here is how we turn your credit goals into reality.
            </p>
          </div>

          {/* Right Column: 3-Step Asymmetrical Cards Layout */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Row: Step 1 and Step 2 side-by-side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Step 1: AUDIT */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl overflow-hidden bg-white/90 border border-stone-200/70 p-4 shadow-xs"
              >
                <div className="relative h-44 w-full rounded-xl overflow-hidden mb-4">
                  <Image
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600"
                    alt="Credit Audit Consultation"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 text-xs font-bold shadow-xs flex items-center gap-1.5">
                    <span>AUDIT</span>
                    <Search className="w-3.5 h-3.5 text-amber-700" />
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  We analyze your credit report to identify errors, inaccurate items, and negative marks.
                </p>
              </motion.div>

              {/* Step 2: DISPUTE */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-2xl overflow-hidden bg-white/90 border border-stone-200/70 p-4 shadow-xs"
              >
                <div className="relative h-44 w-full rounded-xl overflow-hidden mb-4">
                  <Image
                    src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600"
                    alt="Strategic Dispute Challenge"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 text-xs font-bold shadow-xs flex items-center gap-1.5">
                    <span>DISPUTE</span>
                    <Scale className="w-3.5 h-3.5 text-amber-700" />
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  We file strategic dispute letters directly with major credit bureaus and creditors.
                </p>
              </motion.div>
            </div>

            {/* Bottom Row: Step 3 RESTORE Wide Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl overflow-hidden bg-white/90 border border-stone-200/70 p-4 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
            >
              {/* Couple photo on left */}
              <div className="relative h-48 sm:h-52 sm:col-span-7 rounded-xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                  alt="Credit Restoration Success"
                  fill
                  className="object-cover"
                />
              </div>

              {/* RESTORE details on right */}
              <div className="sm:col-span-5 p-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 text-xs font-bold mb-3">
                  <span>RESTORE</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  Watch your credit score improve as inaccurate negative items get removed and your profile is restored.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
