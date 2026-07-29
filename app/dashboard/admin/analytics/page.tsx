"use client";

import { BarChart3, TrendingUp, Users, Calendar, Wrench, ArrowUpRight } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
            Platform Analytics & Growth Reports
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
            Comprehensive analytics on booking trends, technician efficiency, and platform revenue.
          </p>
        </div>
      </div>

      {/* Analytics KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Monthly Active Users</span>
          <div className="mt-2 text-3xl font-extrabold text-stone-900">1,420</div>
          <span className="mt-2 inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
            ↑ +24% growth
          </span>
        </div>

        <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Total Bookings Completed</span>
          <div className="mt-2 text-3xl font-extrabold text-stone-900">328</div>
          <span className="mt-2 inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
            96% Completion rate
          </span>
        </div>

        <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Avg Job Resolution Time</span>
          <div className="mt-2 text-3xl font-extrabold text-stone-900">1.8 Hours</div>
          <span className="mt-2 inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
            -15 mins faster
          </span>
        </div>

        <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Average Review Score</span>
          <div className="mt-2 text-3xl font-extrabold text-stone-900">4.85 ★</div>
          <span className="mt-2 inline-block rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
            From 412 ratings
          </span>
        </div>
      </div>

      {/* Analytics Visual Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Demanded Services */}
        <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs">
          <h3 className="text-sm font-bold text-stone-900 mb-4">Top Demanded Service Categories</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-stone-900 mb-1">
                <span>HVAC & Air Conditioning</span>
                <span>42% of dispatches</span>
              </div>
              <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-[42%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-stone-900 mb-1">
                <span>Emergency Plumbing</span>
                <span>31% of dispatches</span>
              </div>
              <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-stone-900 rounded-full w-[31%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-stone-900 mb-1">
                <span>Electrical Services</span>
                <span>18% of dispatches</span>
              </div>
              <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full w-[18%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Technicians */}
        <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs">
          <h3 className="text-sm font-bold text-stone-900 mb-4">Top Performing Technicians</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-stone-50">
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-sm text-amber-500">#1</span>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Marcus Vance</h4>
                  <p className="text-[10px] text-stone-400">210 Completed Jobs • 5.0 Rating</p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-stone-900">$10,500 Earned</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-stone-50">
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-sm text-stone-400">#2</span>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Alex Turner</h4>
                  <p className="text-[10px] text-stone-400">142 Completed Jobs • 4.9 Rating</p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-stone-900">$7,810 Earned</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
