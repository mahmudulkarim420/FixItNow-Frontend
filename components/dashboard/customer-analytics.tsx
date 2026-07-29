"use client";

import { MapPin, Clock, Phone, Navigation, Wrench, ShieldCheck } from "lucide-react";

const MONTHLY_SPENDING = [
  { day: "Feb", height: "40%", active: false },
  { day: "Mar", height: "65%", active: false },
  { day: "Apr", height: "50%", active: false },
  { day: "May", height: "85%", active: true, label: "$340" },
  { day: "Jun", height: "95%", active: false, primary: true },
  { day: "Jul", height: "60%", active: false },
];

const RECENT_BOOKINGS = [
  {
    id: "1",
    service: "AC Repair & Coil Servicing",
    techName: "Alex Turner",
    techAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    date: "Today, 02:30 PM",
    price: "$180",
    status: "In Progress",
    statusColor: "bg-amber-50 text-amber-700 border-amber-100",
  },
  {
    id: "2",
    service: "Emergency Plumbing Pipe Leak",
    techName: "Robert Chen",
    techAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    date: "Tomorrow, 10:00 AM",
    price: "$120",
    status: "Scheduled",
    statusColor: "bg-blue-50 text-blue-700 border-blue-100",
  },
  {
    id: "3",
    service: "Electrical Panel Safety Check",
    techName: "Marcus Vance",
    techAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    date: "Jul 24, 2026",
    price: "$150",
    status: "Completed",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  {
    id: "4",
    service: "Dishwasher Inspection",
    techName: "David Miller",
    techAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    date: "Jul 18, 2026",
    price: "$95",
    status: "Completed",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
];

export function CustomerAnalytics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
      {/* 1. Monthly Repair Expense Bar Chart */}
      <div className="md:col-span-2 lg:col-span-5 flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-stone-900">
            Maintenance Spending
          </h3>
          <span className="text-[11px] font-semibold text-stone-400">
            Avg: $210 / month
          </span>
        </div>

        {/* Custom Bar Chart */}
        <div className="my-5 sm:my-6 flex items-end justify-between gap-1.5 sm:gap-2 h-40 sm:h-44 px-1 sm:px-2">
          {MONTHLY_SPENDING.map((item, idx) => (
            <div key={idx} className="relative flex flex-col items-center flex-1 h-full justify-end group">
              {item.label && (
                <span className="absolute -top-7 rounded-full bg-stone-900 px-2 py-0.5 text-[9px] font-bold text-amber-400 shadow-xs animate-bounce">
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
              En Route
            </span>
          </div>

          <div className="mt-3 space-y-2">
            <h4 className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
              AC Repair & Servicing
            </h4>

            <div className="flex items-center gap-2 py-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="Alex Turner"
                className="h-7 w-7 rounded-xl object-cover ring-1 ring-stone-200"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-stone-900 leading-tight">Alex Turner</span>
                <span className="text-[9px] font-medium text-stone-400">HVAC Specialist</span>
              </div>
            </div>

            <div className="space-y-1 text-xs text-stone-500">
              <p className="flex items-center gap-1.5 font-medium">
                <Clock className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                <span>Arriving in ~15 mins</span>
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="mt-5 sm:mt-6 w-full flex items-center justify-center gap-2 rounded-2xl bg-stone-900 py-2.5 sm:py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-stone-800 active:scale-95"
        >
          <Phone className="h-4 w-4 text-amber-400" />
          <span>Call Technician</span>
        </button>
      </div>

      {/* 3. Recent Bookings Queue */}
      <div className="md:col-span-1 lg:col-span-4 rounded-3xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3.5 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-bold text-stone-900">Recent Bookings</h3>
        </div>

        <div className="space-y-3">
          {RECENT_BOOKINGS.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between gap-2 group rounded-2xl p-1.5 transition-colors hover:bg-stone-50"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={booking.techAvatar}
                  alt={booking.techName}
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl object-cover shadow-xs ring-2 ring-stone-100 shrink-0"
                />
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-stone-900 group-hover:text-amber-600 transition-colors truncate">
                    {booking.service}
                  </h4>
                  <p className="text-[10px] font-medium text-stone-400 truncate">
                    {booking.techName} • {booking.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-extrabold text-stone-900">
                  {booking.price}
                </span>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${booking.statusColor}`}
                >
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
