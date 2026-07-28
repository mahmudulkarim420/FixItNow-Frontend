"use client";

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, CheckCircle2, DollarSign, Briefcase } from "lucide-react";

export default function CreditGaugeSection() {
  const bulletPoints = [
    {
      icon: TrendingUp,
      text: "Turn low scores into approval-ready scores",
    },
    {
      icon: CheckCircle2,
      text: "Remove inaccurate marks from your credit report",
    },
    {
      icon: DollarSign,
      text: "Lower interest rates on future loans & mortgages",
    },
    {
      icon: Briefcase,
      text: "Access 24/7 credit watch and alerts",
    },
  ];

  return (
    <section className="py-20 lg:py-28 relative bg-[#F9F7F2]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading, Subtitle, Bullet List & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.15] mb-6">
              Credit repair that changes <br />
              more than your score.
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-8">
              Our credit restoration services empower you to qualify for better loan rates, secure your dream home, and unlock premier credit card rewards.
            </p>

            {/* Bullet Points */}
            <div className="space-y-4 mb-8">
              {bulletPoints.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-amber-100/90 text-amber-700 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-stone-800">{item.text}</span>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div>
              <a
                href="#get-started"
                className="group inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>

          {/* Right Column: Visual Credit Score Gauge Meter Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 relative flex justify-center"
          >
            <div className="relative w-full max-w-lg p-8 sm:p-10 rounded-3xl bg-white border border-stone-200/80 shadow-md">
              {/* Floating Bureau Pills */}
              {/* Experian Pill Top Right */}
              <div className="absolute top-6 right-6 px-3.5 py-1.5 rounded-full bg-stone-50 border border-stone-200 shadow-xs flex items-center gap-2 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="text-stone-500">Credit Score</span>
                <span className="text-stone-900 font-bold">750</span>
              </div>

              {/* TransUnion Pill Middle Left */}
              <div className="absolute top-24 left-6 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200 shadow-xs flex items-center gap-2 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                <span className="text-stone-500">TransUnion</span>
                <span className="text-stone-900 font-bold">765</span>
              </div>

              {/* Equifax Pill Bottom Left */}
              <div className="absolute bottom-10 left-6 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200 shadow-xs flex items-center gap-2 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-stone-500">Equifax</span>
                <span className="text-stone-900 font-bold">780</span>
              </div>

              {/* Semicircular SVG Gauge Meter */}
              <div className="flex flex-col items-center pt-10 pb-4">
                <div className="relative w-64 h-36 flex items-end justify-center">
                  <svg className="w-full h-full" viewBox="0 0 200 110">
                    <defs>
                      <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#EF4444" />
                        <stop offset="40%" stopColor="#F59E0B" />
                        <stop offset="75%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                    {/* Background Arc */}
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="#F3F4F6"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    {/* Gradient Arc */}
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="url(#gaugeGradient)"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    {/* Gauge Needle */}
                    <g transform="translate(100, 100) rotate(45)">
                      <polygon points="-4,-5 0,-70 4,-5" fill="#18181B" />
                      <circle cx="0" cy="0" r="7" fill="#18181B" />
                      <circle cx="0" cy="0" r="3" fill="#F59E0B" />
                    </g>
                  </svg>
                </div>

                {/* Score Text */}
                <div className="text-center mt-2">
                  <div className="text-xs uppercase font-extrabold tracking-widest text-stone-900">
                    CREDIT SCORE
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
