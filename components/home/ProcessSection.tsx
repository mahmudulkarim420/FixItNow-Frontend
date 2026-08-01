"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Search, CalendarCheck, Sparkles } from "lucide-react";

export default function ProcessSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 relative bg-[#F9F7F2] scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Heading & Paragraph */}
          <div className="lg:col-span-5 pt-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.15] mb-6">
              Our Simple 3-Step <br />
              Home Repair Process
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Getting your home back in top shape is quick, transparent, and hassle-free. Here is how we connect you with trusted local repair specialists.
            </p>
          </div>

          {/* Right Column: 3-Step Asymmetrical Cards Layout */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Row: Step 1 and Step 2 side-by-side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Step 1: SELECT SERVICE */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl overflow-hidden bg-white/90 border border-stone-200/70 p-4 shadow-xs"
              >
                <div className="relative h-44 w-full rounded-xl overflow-hidden mb-4">
                  <Image
                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600"
                    alt="Select Repair Service"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                    quality={80}
                    loading="lazy"
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 text-xs font-bold shadow-xs flex items-center gap-1.5">
                    <span>1. SELECT</span>
                    <Search className="w-3.5 h-3.5 text-amber-700" />
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  Browse upfront pricing and select the exact AC, plumbing, electrical, or appliance repair you need.
                </p>
              </motion.div>

              {/* Step 2: MATCH & SCHEDULE */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-2xl overflow-hidden bg-white/90 border border-stone-200/70 p-4 shadow-xs"
              >
                <div className="relative h-44 w-full rounded-xl overflow-hidden mb-4">
                  <Image
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600"
                    alt="Schedule Expert Technician"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                    quality={80}
                    loading="lazy"
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 text-xs font-bold shadow-xs flex items-center gap-1.5">
                    <span>2. SCHEDULE</span>
                    <CalendarCheck className="w-3.5 h-3.5 text-amber-700" />
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  Get matched with a certified, background-checked local specialist for your preferred date and time slot.
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
              {/* Photo on left */}
              <div className="relative h-48 sm:h-52 sm:col-span-7 rounded-xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800"
                  alt="Comfortable restored home"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                  quality={80}
                  loading="lazy"
                  className="object-cover"
                />
              </div>

              {/* RESTORE details on right */}
              <div className="sm:col-span-5 p-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 text-xs font-bold mb-3">
                  <span>3. RESTORE</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  Our expert completes the job safely and tidily, backed by our 30-day workmanship guarantee.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
