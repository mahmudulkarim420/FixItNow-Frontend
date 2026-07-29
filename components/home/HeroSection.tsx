"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, CreditCard, Video, ShieldAlert, Scale, GraduationCap, TrendingUp } from "lucide-react";

export default function HeroSection() {
  const cards = [
    {
      icon: Scale,
      title: "Fix Your Score",
      description: "We challenge questionable negative items with the credit bureaus and creditors to help improve your score.",
    },
    {
      icon: GraduationCap,
      title: "FixIt Masterclass",
      description: "Master financial literacy, dispute strategies, and score building with our step-by-step masterclass.",
    },
    {
      icon: TrendingUp,
      title: "FixIt Monitoring",
      description: "Get real-time 24/7 bureau alerts, score updates, and identity watch to protect your financial profile.",
    },
  ];

  return (
    <section className="relative pt-24 sm:pt-32 pb-16 lg:pt-36 lg:pb-28 overflow-hidden bg-[#FAF8F5]">
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

      {/* Bright Ambient Golden Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 sm:h-80 bg-amber-300/40 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none" />

      {/* Bottom Warm Gradient Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-48 sm:h-64 bg-gradient-to-t from-[#FCD34D]/80 via-[#FDE68A]/40 to-transparent pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
       

        {/* Hero Title & Floating Badges Container */}
        <div className="relative max-w-4xl mx-auto text-center px-1 sm:px-0">
          {/* Floating Badge 1: Top Left - Credit Review */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute -top-3 sm:-top-6 left-0 sm:-left-12 lg:-left-16 flex flex-col items-end z-20"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-[#DDF4FF] border border-[#BDE8FF] shadow-xs text-[#00A3FF] text-[10px] sm:text-xs font-bold"
            >
              <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Credit Review</span>
            </motion.div>
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#00A3FF] fill-current mr-3 sm:mr-4 -mt-0.5 sm:-mt-1 drop-shadow-xs" viewBox="0 0 24 24">
              <path d="M3 3l7 18 3-7 7-3L3 3z" />
            </svg>
          </motion.div>

          {/* Floating Badge 2: Top Right - Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute -top-3 sm:-top-6 right-0 sm:-right-10 lg:-right-12 flex flex-col items-start z-20"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-[#FFF3D6] border border-[#FFE7B3] shadow-xs text-[#E59800] text-[10px] sm:text-xs font-bold"
            >
              <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Video</span>
            </motion.div>
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#E59800] fill-current ml-2 -mt-0.5 sm:-mt-1 drop-shadow-xs" viewBox="0 0 24 24">
              <path d="M3 3l7 18 3-7 7-3L3 3z" />
            </svg>
          </motion.div>

          {/* Floating Badge 3: Bottom Left - Disputes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute -bottom-10 left-0 sm:-left-12 lg:-left-16 flex flex-col items-end z-20"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#8B5CF6] fill-current mr-2 -mb-0.5 sm:-mb-1 rotate-90 drop-shadow-xs z-10" viewBox="0 0 24 24">
              <path d="M3 3l7 18 3-7 7-3L3 3z" />
            </svg>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 1 }}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-[#F0EBFF] border border-[#E1D5FF] shadow-xs text-[#8B5CF6] text-[10px] sm:text-xs font-bold"
            >
              <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Disputes</span>
            </motion.div>
          </motion.div>

          {/* Floating Badge 4: Bottom Right - Monitoring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="absolute -bottom-10 right-0 sm:-right-10 lg:-right-12 flex flex-col items-start z-20"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#FF5252] fill-current ml-2 -mb-0.5 sm:-mb-1 -rotate-45 drop-shadow-xs z-10" viewBox="0 0 24 24">
              <path d="M3 3l7 18 3-7 7-3L3 3z" />
            </svg>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut", delay: 1.5 }}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-[#FFEBEB] border border-[#FFD6D6] shadow-xs text-[#FF5252] text-[10px] sm:text-xs font-bold"
            >
              <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Monitoring</span>
            </motion.div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.18] sm:leading-[1.12] py-4 sm:py-0"
          >
            Fix It Now, <br />
            Change Your Life.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 sm:mt-6 text-xs sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed font-normal px-2"
          >
            We help you remove negative items from your credit report so you can qualify for loans, get better rates, and achieve financial freedom.
          </motion.p>

          {/* Golden CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 sm:mt-8 flex justify-center"
          >
            <a
              href="#get-started"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <span>Get Started</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </motion.div>
        </div>

        {/* 3 Feature Cards Side-by-Side */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-14 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto"
        >
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="p-5 sm:p-7 rounded-2xl bg-white border border-stone-200/60 shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Golden Icon & Title */}
                  <div className="flex items-center gap-2.5 text-[#F59E0B] font-extrabold text-lg sm:text-xl mb-2.5">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2] shrink-0" />
                    <h3>{card.title}</h3>
                  </div>

                  {/* Description */}
                  <p className="text-stone-500 text-xs sm:text-sm leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
