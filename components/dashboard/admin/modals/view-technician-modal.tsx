"use client";

import { X, ShieldCheck, AlertTriangle, Mail, Wrench } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export interface TechItemModalData {
  id: string;
  name: string;
  email: string;
  skills: string[];
  hourlyRate: string;
  rating: string;
  isVerified: boolean;
  avatar: string;
}

interface ViewTechnicianModalProps {
  tech: TechItemModalData | null;
  onClose: () => void;
}

export function ViewTechnicianModal({ tech, onClose }: ViewTechnicianModalProps) {
  if (!tech) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/70 backdrop-blur-md"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 320 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl z-10 border border-stone-100 dark:border-slate-800 text-stone-900 dark:text-slate-100"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-xl text-stone-400 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800 hover:text-stone-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Profile Header */}
          <div className="flex flex-col items-center text-center pb-4 border-b border-stone-100 dark:border-slate-800">
            <div className="relative mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tech.avatar}
                alt={tech.name}
                className="h-20 w-20 rounded-3xl object-cover ring-4 ring-amber-100 dark:ring-amber-950/60 shadow-md"
              />
              <span
                className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white dark:border-slate-900 shadow-2xs ${
                  tech.isVerified ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                }`}
              >
                {tech.isVerified ? <ShieldCheck className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
              </span>
            </div>

            <h3 className="text-lg font-extrabold text-stone-900 dark:text-slate-100 flex items-center gap-1.5">
              {tech.name}
            </h3>

            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-stone-500 dark:text-slate-400 font-medium">
              <Mail className="h-3.5 w-3.5 text-stone-400 dark:text-slate-500" />
              <span>{tech.email}</span>
            </div>

            <div className="mt-2.5 flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-0.5 text-[10px] font-bold ${
                  tech.isVerified
                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800"
                    : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-800"
                }`}
              >
                {tech.isVerified ? "Verified Professional" : "Pending Verification"}
              </span>
              <span className="font-mono text-[10px] font-bold text-stone-400 dark:text-slate-500">
                ID: {tech.id}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="rounded-2xl border border-stone-100 dark:border-slate-800 bg-stone-50 dark:bg-slate-800/60 p-3 text-center">
              <span className="text-[10px] font-bold text-stone-400 dark:text-slate-400 uppercase tracking-wider block">
                Hourly Billing Rate
              </span>
              <span className="text-base font-extrabold text-stone-900 dark:text-slate-100 mt-0.5 block">
                {tech.hourlyRate}
              </span>
            </div>

            <div className="rounded-2xl border border-stone-100 dark:border-slate-800 bg-stone-50 dark:bg-slate-800/60 p-3 text-center">
              <span className="text-[10px] font-bold text-stone-400 dark:text-slate-400 uppercase tracking-wider block">
                Platform Rating
              </span>
              <span className="text-base font-extrabold text-amber-600 dark:text-amber-400 mt-0.5 block">
                {tech.rating}
              </span>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="space-y-2 mb-5">
            <span className="text-xs font-bold text-stone-900 dark:text-slate-100 block">
              Certified Technical Skills:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {tech.skills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 rounded-2xl bg-amber-50 dark:bg-amber-950/60 px-3 py-1 text-xs font-bold text-amber-800 dark:text-amber-300 border border-amber-100 dark:border-amber-800"
                >
                  <Wrench className="h-3 w-3 text-amber-600 dark:text-amber-400" /> {s}
                </span>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-stone-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-2xl bg-stone-900 dark:bg-amber-500 dark:text-slate-950 px-5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-stone-800 dark:hover:bg-amber-400 transition-all cursor-pointer"
            >
              Close Profile
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
