"use client";

import { useEffect, useState } from "react";
import { Video, Plus, Wrench, Layers, Layout, Zap, CheckCircle2, Clock } from "lucide-react";
import { getAdminBookings } from "@/lib/admin-api";
import type { Booking } from "@/types";

export function AdminAnalyticsSection() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    async function loadBookings() {
      try {
        const data = await getAdminBookings();
        if (data && data.length > 0) {
          setBookings(data);
        }
      } catch {
        /* Fallback */
      }
    }
    loadBookings();
  }, []);

  // Compute daily dispatches from real database bookings
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const dayCounts = [0, 0, 0, 0, 0, 0, 0];

  bookings.forEach((b) => {
    const d = new Date(b.createdAt || b.scheduledDate);
    if (!isNaN(d.getTime())) {
      dayCounts[d.getDay()] += 1;
    }
  });

  const maxCount = Math.max(...dayCounts, 1);
  const weeklyData = daysOfWeek.map((day, idx) => {
    const count = dayCounts[idx];
    const pct = Math.round((count / maxCount) * 100) || 15;
    return {
      day,
      height: `${pct}%`,
      active: count > 0 && idx === 3,
      primary: count === maxCount && maxCount > 1,
      label: count > 0 ? `${count} jobs` : undefined,
    };
  });

  const recentServiceBookings = bookings.slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
      {/* 1. Service Activity Analytics Bar Chart */}
      <div className="md:col-span-2 lg:col-span-5 flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-stone-900">Service Activity & Weekly Dispatches</h3>
        </div>

        {/* Custom Bar Chart */}
        <div className="my-5 sm:my-6 flex items-end justify-between gap-1.5 sm:gap-2 h-40 sm:h-44 px-1 sm:px-2">
          {weeklyData.map((item, idx) => (
            <div key={idx} className="relative flex flex-col items-center flex-1 h-full justify-end group">
              {item.label && (
                <span className="absolute -top-7 rounded-full bg-stone-900 px-2 py-0.5 text-[9px] font-bold text-amber-400 shadow-xs animate-bounce whitespace-nowrap z-10">
                  {item.label}
                </span>
              )}

              <div
                style={{ height: item.height }}
                className={`w-full rounded-2xl transition-all duration-300 ${
                  item.primary
                    ? "bg-stone-900"
                    : item.active
                    ? "bg-amber-500 shadow-xs"
                    : "bg-stone-100 border border-dashed border-stone-300 group-hover:bg-stone-200"
                }`}
              />
              <span className="mt-2.5 text-[11px] sm:text-xs font-bold text-stone-400">
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Reminders Card */}
      <div className="md:col-span-1 lg:col-span-3 flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-stone-900">Dispatch Reminders</h3>
          <div className="mt-3 sm:mt-4 space-y-1">
            <h4 className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
              Field Technician Standup
            </h4>
            <p className="text-xs font-medium text-stone-400">
              Today: 02.00 PM - 02.30 PM
            </p>
          </div>
        </div>

        <button
          type="button"
          className="mt-5 sm:mt-6 w-full flex items-center justify-center gap-2 rounded-2xl bg-stone-900 py-2.5 sm:py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-stone-800 active:scale-95 cursor-pointer"
        >
          <Video className="h-4 w-4 text-amber-400" />
          <span>Start Standup</span>
        </button>
      </div>

      {/* 3. Recent Service Bookings */}
      <div className="md:col-span-1 lg:col-span-4 rounded-3xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3.5 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-bold text-stone-900">Recent Service Requests</h3>
        </div>

        <div className="space-y-3">
          {recentServiceBookings.length === 0 ? (
            <p className="text-xs text-stone-400 font-medium py-6 text-center">
              No recent service requests in database yet.
            </p>
          ) : (
            recentServiceBookings.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between group rounded-2xl p-1.5 transition-colors hover:bg-stone-50"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100 shadow-xs">
                    <Wrench className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.5]" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-stone-900 group-hover:text-amber-600 transition-colors truncate">
                      {b.service?.title || "Home Repair Service"}
                    </h4>
                    <p className="text-[10px] font-medium text-stone-400 truncate">
                      Customer: {b.customer?.name || b.contactNumber}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
