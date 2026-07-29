"use client";

import { HelpCircle, BookOpen, ExternalLink, MessageSquare, ShieldAlert, FileText } from "lucide-react";

export default function AdminHelpPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
          Admin Documentation & Support Desk
        </h1>
        <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
          Developer API integration specs, operational guides, and emergency system support contacts.
        </p>
      </div>

      {/* Quick Docs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 font-bold mb-3">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Backend API Specification</h3>
            <p className="mt-1 text-xs font-medium text-stone-500">
              Detailed endpoint contracts for Auth, Bookings, Service Catalog, and Stripe Payment webhooks.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex justify-end">
            <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
              API_INTEGRATION.md <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 font-bold mb-3">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Platform Deployment Guide</h3>
            <p className="mt-1 text-xs font-medium text-stone-500">
              Steps for configuring environment variables, Prisma database migrations, and Next.js production builds.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex justify-end">
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
              PROJECT_REPORT.md <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
