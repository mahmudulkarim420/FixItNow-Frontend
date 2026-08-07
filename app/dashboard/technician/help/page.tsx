"use client";

import { PhoneCall, BookOpen, ExternalLink } from "lucide-react";

export default function TechnicianHelpPage() {
  return (
    <div className="space-y-6 max-w-4xl text-stone-900 dark:text-slate-100">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-slate-100">
          Field Tech Support & Help Desk
        </h1>
        <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500 dark:text-slate-400">
          Field dispatch guidelines, payout schedules, and emergency support contacts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold mb-3 border border-amber-100 dark:border-amber-800">
              <PhoneCall className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-slate-100">24/7 Dispatch Hotline</h3>
            <p className="mt-1 text-xs font-medium text-stone-500 dark:text-slate-400">
              Need assistance on a live customer job site? Reach the dispatch operations center immediately.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 dark:border-slate-800 flex justify-end">
            <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400">+1 (800) 555-FIX-NOW</span>
          </div>
        </div>

        <div className="rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold mb-3 border border-emerald-100 dark:border-emerald-800">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-slate-100">Field Safety Guidelines</h3>
            <p className="mt-1 text-xs font-medium text-stone-500 dark:text-slate-400">
              Best practices for customer interaction, safety checks, and Stripe payout schedules.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 dark:border-slate-800 flex justify-end">
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              Read Guidelines <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
