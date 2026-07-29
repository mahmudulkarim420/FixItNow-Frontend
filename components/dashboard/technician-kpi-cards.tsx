"use client";

import { ArrowUpRight, Plus, Calendar } from "lucide-react";
import type { User } from "@/types";

interface TechnicianKpiCardsProps {
  user: User;
}

export function TechnicianKpiCards({ user }: TechnicianKpiCardsProps) {
  const firstName = user.name ? user.name.split(" ")[0] : "Technician";

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Title & Action Buttons Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
            Welcome back, {firstName} 🔧
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
            Manage your active dispatches, service catalog, and customer appointments with ease.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto">
          <button
            type="button"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-2xl bg-stone-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-stone-800 active:scale-95"
          >
            <Plus className="h-4 w-4 text-amber-400" />
            <span>Add Service</span>
          </button>

          <button
            type="button"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-bold text-stone-700 shadow-xs transition-all hover:bg-stone-50 hover:text-stone-900 active:scale-95"
          >
            <Calendar className="h-4 w-4 text-stone-500" />
            <span>Set Schedule</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Total Earnings (Featured Gradient) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950 p-4 sm:p-5 text-white shadow-md transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-300">
              Total Earnings
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white transition-all hover:bg-white/20">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 sm:mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              $3,420
            </span>
          </div>

          <div className="mt-3 sm:mt-4 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-1 text-[10px] font-bold text-amber-300 backdrop-blur-md border border-amber-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              +18% from last month
            </span>
          </div>
        </div>

        {/* Card 2: Completed Jobs */}
        <div className="group rounded-3xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">
              Completed Jobs
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-600 transition-colors group-hover:bg-stone-900 group-hover:text-white">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 sm:mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
              38
            </span>
          </div>

          <div className="mt-3 sm:mt-4 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              +6 completed this month
            </span>
          </div>
        </div>

        {/* Card 3: Active Jobs */}
        <div className="group rounded-3xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">
              Active Jobs
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
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 border border-amber-100">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              2 Dispatched today
            </span>
          </div>
        </div>

        {/* Card 4: Average Rating */}
        <div className="group rounded-3xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">
              Rating & Score
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-600 transition-colors group-hover:bg-stone-900 group-hover:text-white">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 sm:mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
              4.9 ★
            </span>
          </div>

          <div className="mt-3 sm:mt-4 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-bold text-stone-600">
              Based on 52 reviews
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
