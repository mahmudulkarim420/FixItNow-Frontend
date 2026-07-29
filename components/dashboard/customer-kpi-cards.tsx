"use client";

import Link from "next/link";
import { ArrowUpRight, Plus, Receipt } from "lucide-react";
import type { User } from "@/types";

interface CustomerKpiCardsProps {
  user: User;
}

export function CustomerKpiCards({ user }: CustomerKpiCardsProps) {
  const firstName = user.name ? user.name.split(" ")[0] : "Customer";

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Title & Action Buttons Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
            Welcome back, {firstName} 👋
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
            Track active repair dispatches, manage upcoming home maintenance, and book verified local experts.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto">
          <Link
            href="/services"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-2xl bg-stone-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-stone-800 active:scale-95"
          >
            <Plus className="h-4 w-4 text-amber-400" />
            <span>Book New Repair</span>
          </Link>

          <Link
            href="/dashboard/customer/payments"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-bold text-stone-700 shadow-xs transition-all hover:bg-stone-50 hover:text-stone-900 active:scale-95"
          >
            <Receipt className="h-4 w-4 text-stone-500" />
            <span>Invoices</span>
          </Link>
        </div>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Active Repairs (Featured Gradient) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950 p-4 sm:p-5 text-white shadow-md transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-300">
              Active Repairs
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white transition-all hover:bg-white/20">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 sm:mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              2
            </span>
          </div>

          <div className="mt-3 sm:mt-4 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-1 text-[10px] font-bold text-amber-300 backdrop-blur-md border border-amber-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
              Technician En Route
            </span>
          </div>
        </div>

        {/* Card 2: Completed Services */}
        <div className="group rounded-3xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">
              Completed Services
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-600 transition-colors group-hover:bg-stone-900 group-hover:text-white">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 sm:mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
              14
            </span>
          </div>

          <div className="mt-3 sm:mt-4 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              100% Satisfaction score
            </span>
          </div>
        </div>

        {/* Card 3: Total Spent */}
        <div className="group rounded-3xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">
              Total Investment
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-600 transition-colors group-hover:bg-stone-900 group-hover:text-white">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 sm:mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
              $1,280
            </span>
          </div>

          <div className="mt-3 sm:mt-4 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 border border-amber-100">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Across 14 bookings
            </span>
          </div>
        </div>

        {/* Card 4: Saved Technicians */}
        <div className="group rounded-3xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">
              Favorite Pros
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-600 transition-colors group-hover:bg-stone-900 group-hover:text-white">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 sm:mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
              5
            </span>
          </div>

          <div className="mt-3 sm:mt-4 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-bold text-stone-600">
              Saved for quick rebook
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
