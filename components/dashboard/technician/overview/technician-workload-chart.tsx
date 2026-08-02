"use client";

import Link from "next/link";
import { Navigation, Plus, MapPin, Clock, Wrench } from "lucide-react";
import type { Booking } from "@/types";

const WEEKLY_HOURS = [
  { day: "S", height: "35%", active: false },
  { day: "M", height: "65%", active: false },
  { day: "T", height: "80%", active: true, label: "8.5 hrs" },
  { day: "W", height: "95%", active: false, primary: true },
  { day: "T", height: "60%", active: false },
  { day: "F", height: "75%", active: false },
  { day: "S", height: "40%", active: false },
];

interface TechnicianAnalyticsProps {
  bookings?: Booking[];
}

export function TechnicianAnalytics({ bookings = [] }: TechnicianAnalyticsProps) {
  // Find next upcoming job (or fallback to latest booking / sample)
  const nextJob = bookings.find(
    (b) => b.status === "IN_PROGRESS" || b.status === "ACCEPTED" || b.status === "REQUESTED"
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return { text: "In Progress", color: "bg-amber-50 text-amber-700 border-amber-100" };
      case "ACCEPTED":
        return { text: "Accepted", color: "bg-blue-50 text-blue-700 border-blue-100" };
      case "COMPLETED":
        return { text: "Completed", color: "bg-emerald-50 text-emerald-700 border-emerald-100" };
      case "REQUESTED":
        return { text: "New Request", color: "bg-purple-50 text-purple-700 border-purple-100" };
      default:
        return { text: status, color: "bg-stone-100 text-stone-700 border-stone-200" };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
      {/* 1. Weekly Hours / Workload Bar Chart */}
      <div className="md:col-span-2 lg:col-span-5 flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-stone-200/80 bg-white p-3.5 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
            Weekly Hours Worked
          </h3>
          <span className="text-[10px] sm:text-[11px] font-semibold text-stone-400 shrink-0">
            Total: {bookings.length > 0 ? `${bookings.length * 2.5} hrs` : "42.5 hrs"}
          </span>
        </div>

        {/* Custom Stylized Bar Chart */}
        <div className="mt-4 sm:mt-5 flex items-end justify-between gap-1.5 sm:gap-2 h-36 sm:h-40 px-1">
          {WEEKLY_HOURS.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group">
              {item.label && (
                <span className="mb-1 rounded-full bg-stone-900 px-1.5 py-0.5 text-[8.5px] sm:text-[9px] font-extrabold text-amber-400 shadow-xs whitespace-nowrap transition-transform group-hover:scale-110">
                  {item.label}
                </span>
              )}

              <div
                style={{ height: item.height }}
                className={`w-full rounded-xl sm:rounded-2xl transition-all duration-300 ${
                  item.primary
                    ? "bg-stone-900"
                    : item.active
                    ? "bg-amber-500 shadow-xs"
                    : "bg-stone-100 border border-dashed border-stone-300 group-hover:bg-stone-200"
                }`}
              />
              <span className="mt-2 text-[10px] sm:text-xs font-bold text-stone-400">
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Next Job Alert / Navigation Card */}
      <div className="md:col-span-1 lg:col-span-3 flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs sm:text-sm font-bold text-stone-900">Next Dispatch</h3>
            <span className="rounded-full bg-amber-500/10 text-amber-700 px-2 py-0.5 text-[10px] font-bold">
              {nextJob ? "Active Job" : "Next Slot"}
            </span>
          </div>

          <div className="mt-3 space-y-2">
            <h4 className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
              {nextJob?.service?.title || "Central AC Coil Repair"}
            </h4>

            <div className="space-y-1 text-xs text-stone-500">
              <p className="flex items-center gap-1.5 font-medium">
                <MapPin className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                <span>{nextJob?.customer?.name ? `Customer: ${nextJob.customer.name}` : "742 Evergreen Terrace"}</span>
              </p>
              <p className="flex items-center gap-1.5 font-medium">
                <Clock className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                <span>Slot: {nextJob?.timeSlot || "Today: 02:30 PM - 04:30 PM"}</span>
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/technician/jobs"
          className="mt-5 sm:mt-6 w-full flex items-center justify-center gap-2 rounded-2xl bg-stone-900 py-2.5 sm:py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-stone-800 active:scale-95"
        >
          <Navigation className="h-4 w-4 text-amber-400" />
          <span>View Job Dispatches</span>
        </Link>
      </div>

      {/* 3. Today's Job Queue */}
      <div className="md:col-span-1 lg:col-span-4 rounded-3xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3.5 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-bold text-stone-900">Assigned Schedule</h3>
          <Link
            href="/dashboard/technician/schedule"
            className="flex items-center gap-1 rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-bold text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <Plus className="h-3 w-3" />
            <span>Add Slot</span>
          </Link>
        </div>

        <div className="space-y-3">
          {bookings.length > 0 ? (
            bookings.slice(0, 4).map((job) => {
              const badge = getStatusBadge(job.status);
              return (
                <div
                  key={job.id}
                  className="flex items-center justify-between gap-2 group rounded-2xl p-1.5 transition-colors hover:bg-stone-50"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 font-bold shadow-xs">
                      <Wrench className="h-4 w-4" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-stone-900 group-hover:text-amber-600 transition-colors truncate">
                        {job.service?.title || "Home Repair"}
                      </h4>
                      <p className="text-[10px] font-medium text-stone-400 truncate">
                        {job.customer?.name || "Client"} • {job.timeSlot}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-extrabold text-stone-900">
                      ${job.servicePrice}
                    </span>
                    <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${badge.color}`}>
                      {badge.text}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-6 text-center text-xs text-stone-400 font-medium">
              No live dispatches scheduled yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

