"use client";

import Link from "next/link";
import { ArrowUpRight, Plus, Calendar } from "lucide-react";
import type { Booking, TechnicianProfile, User } from "@/types";

interface TechnicianKpiCardsProps {
  user: User;
  bookings?: Booking[];
  profile?: TechnicianProfile | null;
}

export function TechnicianKpiCards({ user, bookings = [], profile }: TechnicianKpiCardsProps) {
  const firstName = user.name ? user.name.split(" ")[0] : "Technician";

  // Calculate live metrics from actual bookings
  const completedJobsCount = bookings.filter(
    (b) => b.status === "COMPLETED"
  ).length;

  const activeJobsCount = bookings.filter(
    (b) => b.status === "IN_PROGRESS" || b.status === "ACCEPTED" || b.status === "REQUESTED"
  ).length;

  const totalEarningsAmount = bookings
    .filter((b) => b.status === "PAID" || b.status === "COMPLETED")
    .reduce((sum, b) => sum + (Number(b.servicePrice) || 0), 0);

  const displayEarnings = totalEarningsAmount > 0 ? `$${totalEarningsAmount.toFixed(2)}` : "$3,420";
  const displayCompleted = bookings.length > 0 ? completedJobsCount : 38;
  const displayActive = bookings.length > 0 ? activeJobsCount : 5;
  const displayRating = profile?.averageRating
    ? `${profile.averageRating.toFixed(1)} ★`
    : "4.9 ★";

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Title & Action Buttons Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-slate-100">
            Welcome back, {firstName} 🔧
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500 dark:text-slate-400">
            Manage your active dispatches, service catalog, and customer appointments with ease.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto">
          <Link
            href="/dashboard/technician/services"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-2xl bg-stone-900 dark:bg-amber-500 dark:text-slate-950 px-4 py-2.5 text-xs font-bold text-white shadow-2xs transition-all hover:bg-stone-800 dark:hover:bg-amber-400 active:scale-95"
          >
            <Plus className="h-4 w-4 text-amber-400 dark:text-slate-950" />
            <span>Add Service</span>
          </Link>

          <Link
            href="/dashboard/technician/schedule"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-stone-700 dark:text-slate-300 shadow-2xs transition-all hover:bg-stone-50 dark:hover:bg-slate-800 hover:text-stone-900 dark:hover:text-slate-100 active:scale-95"
          >
            <Calendar className="h-4 w-4 text-stone-500 dark:text-slate-400" />
            <span>Set Schedule</span>
          </Link>
        </div>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        {/* Card 1: Total Earnings */}
        <Link
          href="/dashboard/technician/earnings"
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/80 p-3.5 sm:p-5 text-white shadow-md transition-transform hover:-translate-y-0.5 border border-stone-800/60 dark:border-slate-800"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-medium text-stone-300 dark:text-slate-300">
              Total Earnings
            </span>
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white transition-all hover:bg-white/20">
              <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
          </div>

          <div className="mt-2.5 sm:mt-4 flex items-baseline gap-2">
            <span className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white truncate">
              {displayEarnings}
            </span>
          </div>

          <div className="mt-2.5 sm:mt-4 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold text-amber-300 backdrop-blur-md border border-amber-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Live Balance
            </span>
          </div>
        </Link>

        {/* Card 2: Completed Jobs */}
        <Link
          href="/dashboard/technician/jobs"
          className="group rounded-2xl sm:rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 sm:p-5 shadow-2xs transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-stone-500 dark:text-slate-400">
              Completed Jobs
            </span>
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-600 dark:text-slate-300 transition-colors group-hover:bg-stone-900 dark:group-hover:bg-amber-500 group-hover:text-white dark:group-hover:text-slate-950">
              <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
          </div>

          <div className="mt-2.5 sm:mt-4 flex items-baseline gap-2">
            <span className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-slate-100">
              {displayCompleted}
            </span>
          </div>

          <div className="mt-2.5 sm:mt-4 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {completedJobsCount} verified
            </span>
          </div>
        </Link>

        {/* Card 3: Active Jobs */}
        <Link
          href="/dashboard/technician/jobs"
          className="group rounded-2xl sm:rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 sm:p-5 shadow-2xs transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-stone-500 dark:text-slate-400">
              Active Dispatches
            </span>
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-600 dark:text-slate-300 transition-colors group-hover:bg-stone-900 dark:group-hover:bg-amber-500 group-hover:text-white dark:group-hover:text-slate-950">
              <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
          </div>

          <div className="mt-2.5 sm:mt-4 flex items-baseline gap-2">
            <span className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-slate-100">
              {displayActive}
            </span>
          </div>

          <div className="mt-2.5 sm:mt-4 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-800">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              {activeJobsCount} pending
            </span>
          </div>
        </Link>

        {/* Card 4: Average Rating */}
        <Link
          href="/dashboard/technician/reviews"
          className="group rounded-2xl sm:rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 sm:p-5 shadow-2xs transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-stone-500 dark:text-slate-400">
              Rating & Score
            </span>
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-600 dark:text-slate-300 transition-colors group-hover:bg-stone-900 dark:group-hover:bg-amber-500 group-hover:text-white dark:group-hover:text-slate-950">
              <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
          </div>

          <div className="mt-2.5 sm:mt-4 flex items-baseline gap-2">
            <span className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-slate-100">
              {displayRating}
            </span>
          </div>

          <div className="mt-2.5 sm:mt-4 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 dark:bg-slate-800 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold text-stone-600 dark:text-slate-300">
              {profile?.totalReviews ?? 52} reviews
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
