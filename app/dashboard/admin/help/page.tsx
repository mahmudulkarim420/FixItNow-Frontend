"use client";

import { BookOpen, ExternalLink, FileText } from "lucide-react";

export default function AdminHelpPage() {
  return (
    <div className="space-y-6 max-w-4xl text-stone-900 dark:text-slate-100">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-slate-100">
          Admin Documentation & Support Desk
        </h1>
        <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500 dark:text-slate-400">
          Developer API integration specs, operational guides, and emergency system support contacts.
        </p>
      </div>

      {/* Quick Docs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold mb-3 border border-amber-100 dark:border-amber-800">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-slate-100">Backend API Specification</h3>
            <p className="mt-1 text-xs font-medium text-stone-500 dark:text-slate-400">
              Detailed endpoint contracts for Auth, Bookings, Service Catalog, and Stripe Payment webhooks.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 dark:border-slate-800 flex justify-end">
            <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
              API_INTEGRATION.md <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold mb-3 border border-emerald-100 dark:border-emerald-800">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-slate-100">Platform Deployment Guide</h3>
            <p className="mt-1 text-xs font-medium text-stone-500 dark:text-slate-400">
              Steps for configuring environment variables, Prisma database migrations, and Next.js production builds.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 dark:border-slate-800 flex justify-end">
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              PROJECT_REPORT.md <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
