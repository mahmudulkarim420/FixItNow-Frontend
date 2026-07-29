"use client";

import Link from "next/link";
import { Star, ShieldCheck, Zap, PhoneCall } from "lucide-react";

const SAVED_PROS = [
  {
    id: "1",
    name: "Alex Turner",
    specialty: "HVAC & AC Expert",
    rating: 4.9,
    jobsDone: 142,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    name: "Robert Chen",
    specialty: "Master Plumber",
    rating: 4.8,
    jobsDone: 98,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    name: "Marcus Vance",
    specialty: "Licensed Electrician",
    rating: 5.0,
    jobsDone: 210,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
  },
];

export function CustomerWidget() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
      {/* 1. Favorite / Saved Technicians (5 cols wide on desktop) */}
      <div className="md:col-span-2 lg:col-span-5 rounded-3xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3.5 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-bold text-stone-900">
            Favorite Technicians
          </h3>
          <Link href="/services" className="text-[11px] font-bold text-amber-600 hover:underline">
            View Catalog →
          </Link>
        </div>

        <div className="space-y-3">
          {SAVED_PROS.map((pro) => (
            <div
              key={pro.id}
              className="flex items-center justify-between gap-2 rounded-2xl p-2 bg-stone-50/80 border border-stone-100 transition-colors hover:bg-stone-100/80"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pro.avatar}
                  alt={pro.name}
                  className="h-9 w-9 rounded-xl object-cover ring-1 ring-stone-200 shrink-0"
                />
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1">
                    <h4 className="text-xs font-bold text-stone-900 truncate">
                      {pro.name}
                    </h4>
                    <ShieldCheck className="h-3 w-3 text-emerald-500 shrink-0" />
                  </div>
                  <p className="text-[10px] font-medium text-stone-400 truncate">
                    {pro.specialty} • {pro.jobsDone} jobs
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="flex items-center gap-0.5 text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  <span>{pro.rating}</span>
                </span>
                <Link
                  href="/services"
                  className="rounded-xl bg-stone-900 px-2.5 py-1 text-[10px] font-bold text-white transition hover:bg-stone-800"
                >
                  Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Home Maintenance Health Score semi-circle gauge (4 cols wide on desktop) */}
      <div className="md:col-span-1 lg:col-span-4 rounded-3xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-xs flex flex-col justify-between">
        <h3 className="text-xs sm:text-sm font-bold text-stone-900">Home Health Score</h3>

        {/* Semi Circle Gauge SVG */}
        <div className="relative my-3 sm:my-4 flex flex-col items-center justify-center">
          <svg className="w-48 sm:w-52 h-28 sm:h-32" viewBox="0 0 200 115">
            {/* Background Arc */}
            <path
              d="M 25 100 A 75 75 0 0 1 175 100"
              fill="none"
              stroke="#EAE8E4"
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* Health Score Arc (85% = ~200 arc length out of 236) */}
            <path
              d="M 25 100 A 75 75 0 0 1 175 100"
              fill="none"
              stroke="#10B981"
              strokeWidth="18"
              strokeLinecap="round"
              strokeDasharray="200 236"
            />
          </svg>

          <div className="absolute top-12 sm:top-14 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              85%
            </span>
            <span className="block text-[10px] sm:text-[11px] font-semibold text-emerald-600">
              Optimal Health
            </span>
          </div>
        </div>

        {/* Legends at bottom */}
        <div className="flex items-center justify-around text-[10px] font-bold text-stone-600 border-t border-stone-100 pt-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>HVAC Checked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>Plumbing OK</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span>Roof Due</span>
          </div>
        </div>
      </div>

      {/* 3. Emergency 24/7 Dispatch Card (3 cols wide on desktop) */}
      <div className="md:col-span-1 lg:col-span-3 relative overflow-hidden rounded-3xl bg-stone-900 p-4 sm:p-5 text-white shadow-md flex flex-col justify-between min-h-[180px]">
        <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-amber-500/20 blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-1 text-amber-400">
            <Zap className="h-4 w-4 fill-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider">24/7 Emergency Dispatch</h3>
          </div>
          <p className="text-[11px] font-medium text-stone-300 mt-1">
            Major pipe leak or electrical outage? Emergency techs available now.
          </p>
        </div>

        <div className="relative z-10 my-3">
          <Link
            href="/services"
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-amber-500 py-3 text-xs font-extrabold text-stone-950 shadow-md transition-all hover:bg-amber-400 active:scale-95"
          >
            <PhoneCall className="h-4 w-4" />
            <span>Dispatch Emergency Tech</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
