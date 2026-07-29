"use client";

import { Video, Plus, Code, Layers, Layout, Zap, CheckCircle2 } from "lucide-react";

const WEEKLY_DATA = [
  { day: "S", height: "45%", active: false },
  { day: "M", height: "70%", active: false },
  { day: "T", height: "55%", active: true, label: "74%" },
  { day: "W", height: "90%", active: false, primary: true },
  { day: "T", height: "65%", active: false },
  { day: "F", height: "40%", active: false },
  { day: "S", height: "50%", active: false },
];

const RECENT_PROJECTS = [
  {
    id: "1",
    title: "Develop API Endpoints",
    dueDate: "Nov 26, 2024",
    icon: Code,
    color: "text-amber-500 bg-amber-50",
  },
  {
    id: "2",
    title: "Onboarding Flow",
    dueDate: "Nov 28, 2024",
    icon: Layers,
    color: "text-emerald-500 bg-emerald-50",
  },
  {
    id: "3",
    title: "Build Dashboard",
    dueDate: "Nov 30, 2024",
    icon: Layout,
    color: "text-blue-500 bg-blue-50",
  },
  {
    id: "4",
    title: "Optimize Page Load",
    dueDate: "Dec 5, 2024",
    icon: Zap,
    color: "text-amber-600 bg-amber-100",
  },
  {
    id: "5",
    title: "Cross-Browser Testing",
    dueDate: "Dec 6, 2024",
    icon: CheckCircle2,
    color: "text-indigo-500 bg-indigo-50",
  },
];

export function AdminAnalyticsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
      {/* 1. Project Analytics Bar Chart (Full on mobile/tablet, 5 cols on lg desktop) */}
      <div className="md:col-span-2 lg:col-span-5 flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-stone-900">Project Analytics</h3>
        </div>

        {/* Custom Bar Chart */}
        <div className="my-5 sm:my-6 flex items-end justify-between gap-1.5 sm:gap-2 h-40 sm:h-44 px-1 sm:px-2">
          {WEEKLY_DATA.map((item, idx) => (
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

      {/* 2. Reminders Card (1 col on tablet, 3 cols on lg desktop) */}
      <div className="md:col-span-1 lg:col-span-3 flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-stone-900">Reminders</h3>
          <div className="mt-3 sm:mt-4 space-y-1">
            <h4 className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
              Meeting with Arc Company
            </h4>
            <p className="text-xs font-medium text-stone-400">
              Time : 02.00 pm - 04.00 pm
            </p>
          </div>
        </div>

        <button
          type="button"
          className="mt-5 sm:mt-6 w-full flex items-center justify-center gap-2 rounded-2xl bg-stone-900 py-2.5 sm:py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-stone-800 active:scale-95"
        >
          <Video className="h-4 w-4 text-amber-400" />
          <span>Start Meeting</span>
        </button>
      </div>

      {/* 3. Project / Service List (1 col on tablet, 4 cols on lg desktop) */}
      <div className="md:col-span-1 lg:col-span-4 rounded-3xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3.5 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-bold text-stone-900">Project</h3>
          <button
            type="button"
            className="flex items-center gap-1 rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-bold text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <Plus className="h-3 w-3" />
            <span>New</span>
          </button>
        </div>

        <div className="space-y-3">
          {RECENT_PROJECTS.map((proj) => {
            const Icon = proj.icon;
            return (
              <div
                key={proj.id}
                className="flex items-center justify-between group rounded-2xl p-1.5 transition-colors hover:bg-stone-50"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl ${proj.color} shadow-xs`}>
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.5]" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-stone-900 group-hover:text-amber-600 transition-colors truncate">
                      {proj.title}
                    </h4>
                    <p className="text-[10px] font-medium text-stone-400 truncate">
                      Due date: {proj.dueDate}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
