"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Clock, Plus, CheckCircle2 } from "lucide-react";

const WORKING_DAYS = [
  { day: "Monday", slots: ["09:00 AM - 12:00 PM", "01:00 PM - 05:00 PM"], active: true },
  { day: "Tuesday", slots: ["09:00 AM - 12:00 PM", "01:00 PM - 05:00 PM"], active: true },
  { day: "Wednesday", slots: ["09:00 AM - 12:00 PM", "01:00 PM - 05:00 PM"], active: true },
  { day: "Thursday", slots: ["09:00 AM - 12:00 PM", "01:00 PM - 05:00 PM"], active: true },
  { day: "Friday", slots: ["09:00 AM - 12:00 PM", "01:00 PM - 05:00 PM"], active: true },
  { day: "Saturday", slots: ["10:00 AM - 03:00 PM"], active: true },
  { day: "Sunday", slots: [], active: false },
];

export default function TechnicianSchedulePage() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
            Schedule & Time Slots
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
            Set your weekly working hours and available customer dispatch slots.
          </p>
        </div>

        <button className="flex items-center gap-1.5 rounded-2xl bg-stone-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-stone-800">
          <Plus className="h-4 w-4 text-amber-400" />
          <span>Add Custom Slot</span>
        </button>
      </div>

      {/* Schedule Roster */}
      <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-stone-900">Weekly Availability Matrix</h3>

        <div className="space-y-3">
          {WORKING_DAYS.map((schedule) => (
            <div
              key={schedule.day}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-100"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`h-3 w-3 rounded-full ${
                    schedule.active ? "bg-emerald-500" : "bg-stone-300"
                  }`}
                />
                <span className="text-sm font-bold text-stone-900 w-28">{schedule.day}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {schedule.slots.length > 0 ? (
                  schedule.slots.map((slot) => (
                    <span
                      key={slot}
                      className="rounded-full bg-white px-3 py-1 text-xs font-bold text-stone-800 border border-stone-200 shadow-2xs"
                    >
                      🕒 {slot}
                    </span>
                  ))
                ) : (
                  <span className="text-xs font-medium text-stone-400 italic">Day Off / Off Duty</span>
                )}
              </div>

              <button className="text-xs font-bold text-amber-700 hover:underline self-end sm:self-auto">
                Edit Slots
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
