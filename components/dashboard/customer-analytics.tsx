"use client";

import Link from "next/link";
import { Clock, Phone, ArrowUpRight } from "lucide-react";
import type { Booking, Payment } from "@/types";

interface CustomerAnalyticsProps {
  bookings?: Booking[];
  payments?: Payment[];
  loading?: boolean;
}

export function CustomerAnalytics({ bookings = [], payments = [], loading = false }: CustomerAnalyticsProps) {
  // Find live/active booking (IN_PROGRESS > ACCEPTED > REQUESTED)
  const activeBooking =
    bookings.find((b) => b.status === "IN_PROGRESS") ||
    bookings.find((b) => b.status === "ACCEPTED") ||
    bookings.find((b) => b.status === "REQUESTED");

  // Recent 4 bookings
  const recentBookings = bookings.slice(0, 4);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "ACCEPTED":
      case "SCHEDULED":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "COMPLETED":
      case "PAID":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "CANCELLED":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-stone-50 text-stone-700 border-stone-100";
    }
  };

  // Sample bar height calculation based on payments
  const monthlyData = [
    { day: "Feb", height: "40%", label: "$120" },
    { day: "Mar", height: "65%", label: "$210" },
    { day: "Apr", height: "50%", label: "$150" },
    { day: "May", height: "85%", label: "$340", active: true },
    { day: "Jun", height: "95%", label: "$410", primary: true },
    { day: "Jul", height: "60%", label: "$190" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
      {/* 1. Monthly Repair Expense Bar Chart */}
      <div className="md:col-span-2 lg:col-span-5 flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-stone-900">
            Maintenance Spending
          </h3>
          <span className="text-[11px] font-semibold text-stone-400">
            Avg: $235 / month
          </span>
        </div>

        {/* Custom Bar Chart */}
        <div className="my-5 sm:my-6 flex items-end justify-between gap-1.5 sm:gap-2 h-40 sm:h-44 px-1 sm:px-2">
          {monthlyData.map((item, idx) => (
            <div key={idx} className="relative flex flex-col items-center flex-1 h-full justify-end group">
              {item.label && (
                <span className="absolute -top-7 rounded-full bg-stone-900 px-2 py-0.5 text-[9px] font-bold text-amber-400 shadow-xs">
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

      {/* 2. Live Active Dispatch Status Card */}
      <div className="md:col-span-1 lg:col-span-3 flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs sm:text-sm font-bold text-stone-900">Active Live Dispatch</h3>
            <span className="rounded-full bg-amber-500/10 text-amber-700 px-2 py-0.5 text-[10px] font-bold animate-pulse">
              {activeBooking ? activeBooking.status.replace("_", " ") : "Standby"}
            </span>
          </div>

          {loading ? (
            <div className="mt-3 text-xs text-stone-400 font-medium">Loading active status...</div>
          ) : activeBooking ? (
            <div className="mt-3 space-y-2">
              <h4 className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
                {activeBooking.service?.title || "Home Repair Dispatch"}
              </h4>

              <div className="flex items-center gap-2 py-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt={activeBooking.technicianProfile?.user?.name || "Technician"}
                  className="h-7 w-7 rounded-xl object-cover ring-1 ring-stone-200"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-stone-900 leading-tight">
                    {activeBooking.technicianProfile?.user?.name || "Assigned Field Tech"}
                  </span>
                  <span className="text-[9px] font-medium text-stone-400">Certified Specialist</span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-stone-500">
                <p className="flex items-center gap-1.5 font-medium">
                  <Clock className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                  <span>{activeBooking.scheduledDate} • {activeBooking.timeSlot}</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-3 rounded-2xl bg-stone-50 border border-stone-100 text-center">
              <p className="text-xs font-bold text-stone-700">No Active Repair En Route</p>
              <p className="text-[10px] text-stone-400 mt-0.5">Need help? Book a local verified pro anytime.</p>
            </div>
          )}
        </div>

        <Link
          href="/services"
          className="mt-5 sm:mt-6 w-full flex items-center justify-center gap-2 rounded-2xl bg-stone-900 py-2.5 sm:py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-stone-800 active:scale-95"
        >
          <Phone className="h-4 w-4 text-amber-400" />
          <span>Book Repair</span>
        </Link>
      </div>

      {/* 3. Recent Bookings Queue */}
      <div className="md:col-span-1 lg:col-span-4 rounded-3xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3.5 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-bold text-stone-900">Recent Bookings</h3>
          <Link href="/dashboard/customer/bookings" className="text-[10px] font-bold text-amber-600 hover:underline">
            View All →
          </Link>
        </div>

        <div className="space-y-3">
          {loading ? (
            <p className="text-xs text-stone-400 font-medium py-4 text-center">Loading recent dispatches...</p>
          ) : recentBookings.length > 0 ? (
            recentBookings.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between gap-2 group rounded-2xl p-1.5 transition-colors hover:bg-stone-50"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                    alt={b.technicianProfile?.user?.name || "Tech"}
                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl object-cover shadow-xs ring-2 ring-stone-100 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-stone-900 group-hover:text-amber-600 transition-colors truncate">
                      {b.service?.title || "Home Repair Service"}
                    </h4>
                    <p className="text-[10px] font-medium text-stone-400 truncate">
                      {b.scheduledDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-extrabold text-stone-900">
                    ${b.servicePrice || b.service?.price || 0}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${getStatusBadgeClass(
                      b.status
                    )}`}
                  >
                    {b.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-stone-400 font-medium py-4 text-center">No bookings found yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
