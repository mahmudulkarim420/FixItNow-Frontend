"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Save, Loader2 } from "lucide-react";
import { getCurrentUser } from "@/lib/api";
import { updateTechnicianAvailability } from "@/lib/technician-api";

interface DaySchedule {
  day: string;
  key: string;
  slots: string[];
  active: boolean;
}

const DEFAULT_DAYS: DaySchedule[] = [
  { day: "Monday", key: "monday", slots: ["09:00 AM - 12:00 PM", "01:00 PM - 05:00 PM"], active: true },
  { day: "Tuesday", key: "tuesday", slots: ["09:00 AM - 12:00 PM", "01:00 PM - 05:00 PM"], active: true },
  { day: "Wednesday", key: "wednesday", slots: ["09:00 AM - 12:00 PM", "01:00 PM - 05:00 PM"], active: true },
  { day: "Thursday", key: "thursday", slots: ["09:00 AM - 12:00 PM", "01:00 PM - 05:00 PM"], active: true },
  { day: "Friday", key: "friday", slots: ["09:00 AM - 12:00 PM", "01:00 PM - 05:00 PM"], active: true },
  { day: "Saturday", key: "saturday", slots: ["10:00 AM - 03:00 PM"], active: true },
  { day: "Sunday", key: "sunday", slots: [], active: false },
];

export default function TechnicianSchedulePage() {
  const [scheduleData, setScheduleData] = useState<DaySchedule[]>(DEFAULT_DAYS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function loadAvailability() {
      try {
        setLoading(true);
        const me = await getCurrentUser();
        const apiAvail = me.technicianProfile?.availability;

        if (apiAvail && typeof apiAvail === "object") {
          const updated = DEFAULT_DAYS.map((d) => {
            const slots = apiAvail[d.key] || [];
            return {
              ...d,
              slots,
              active: slots.length > 0,
            };
          });
          setScheduleData(updated);
        }
      } catch {
        /* Keep defaults */
      } finally {
        setLoading(false);
      }
    }
    loadAvailability();
  }, []);

  const toggleDayActive = (key: string) => {
    setScheduleData((prev) =>
      prev.map((d) => {
        if (d.key === key) {
          const nextActive = !d.active;
          return {
            ...d,
            active: nextActive,
            slots: nextActive && d.slots.length === 0 ? ["09:00 AM - 05:00 PM"] : d.slots,
          };
        }
        return d;
      })
    );
  };

  const handleSaveSchedule = async () => {
    try {
      setSaving(true);
      setSuccessMsg("");
      const availabilityPayload: Record<string, string[]> = {};

      scheduleData.forEach((d) => {
        availabilityPayload[d.key] = d.active ? d.slots : [];
      });

      await updateTechnicianAvailability(availabilityPayload);
      setSuccessMsg("Weekly schedule matrix saved successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch {
      alert("Failed to save schedule matrix. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl text-stone-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-slate-100">
            Schedule & Time Slots
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500 dark:text-slate-400">
            Set your weekly working hours and available customer dispatch slots in real-time.
          </p>
        </div>

        <button
          onClick={handleSaveSchedule}
          disabled={saving || loading}
          className="flex items-center gap-1.5 rounded-2xl bg-stone-900 dark:bg-amber-500 dark:text-slate-950 px-5 py-2.5 text-xs font-bold text-white shadow-2xs transition hover:bg-stone-800 dark:hover:bg-amber-400 disabled:opacity-50 cursor-pointer"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin text-amber-400 dark:text-slate-950" /> : <Save className="h-4 w-4 text-amber-400 dark:text-slate-950" />}
          <span>Save Weekly Matrix</span>
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 p-3 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center gap-2 text-stone-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-stone-200/80 dark:border-slate-800">
          <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
          <span className="text-xs font-bold">Loading schedule matrix...</span>
        </div>
      ) : (
        /* Schedule Roster */
        <div className="rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100">Weekly Availability Matrix</h3>

          <div className="space-y-3">
            {scheduleData.map((schedule) => (
              <div
                key={schedule.day}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-50 dark:bg-slate-800/70 border border-stone-100 dark:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleDayActive(schedule.key)}
                    className={`h-4 w-4 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                      schedule.active ? "bg-emerald-500" : "bg-stone-300 dark:bg-slate-600"
                    }`}
                  >
                    {schedule.active && <CheckCircle2 className="h-3 w-3 text-white" />}
                  </button>
                  <span className="text-sm font-bold text-stone-900 dark:text-slate-100 w-28">{schedule.day}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 flex-1">
                  {schedule.active && schedule.slots.length > 0 ? (
                    schedule.slots.map((slot) => (
                      <span
                        key={slot}
                        className="rounded-full bg-white dark:bg-slate-900 px-3 py-1 text-xs font-bold text-stone-800 dark:text-slate-200 border border-stone-200 dark:border-slate-700 shadow-2xs"
                      >
                        🕒 {slot}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs font-medium text-stone-400 dark:text-slate-500 italic">Day Off / Off Duty</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => toggleDayActive(schedule.key)}
                  className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline self-end sm:self-auto cursor-pointer"
                >
                  {schedule.active ? "Set Off Duty" : "Enable Slots"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
