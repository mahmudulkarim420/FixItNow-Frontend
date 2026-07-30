"use client";

import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Clock, Plus, CheckCircle2, Save, Loader2, AlertCircle } from "lucide-react";
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
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
            Schedule & Time Slots
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
            Set your weekly working hours and available customer dispatch slots in real-time.
          </p>
        </div>

        <button
          onClick={handleSaveSchedule}
          disabled={saving || loading}
          className="flex items-center gap-1.5 rounded-2xl bg-stone-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-stone-800 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin text-amber-400" /> : <Save className="h-4 w-4 text-amber-400" />}
          <span>Save Weekly Matrix</span>
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700 border border-emerald-100">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center gap-2 text-stone-500 bg-white rounded-3xl border border-stone-200/80">
          <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
          <span className="text-xs font-bold">Loading schedule matrix...</span>
        </div>
      ) : (
        /* Schedule Roster */
        <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-stone-900">Weekly Availability Matrix</h3>

          <div className="space-y-3">
            {scheduleData.map((schedule) => (
              <div
                key={schedule.day}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-100"
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleDayActive(schedule.key)}
                    className={`h-4 w-4 rounded-full flex items-center justify-center transition-colors ${
                      schedule.active ? "bg-emerald-500" : "bg-stone-300"
                    }`}
                  >
                    {schedule.active && <CheckCircle2 className="h-3 w-3 text-white" />}
                  </button>
                  <span className="text-sm font-bold text-stone-900 w-28">{schedule.day}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 flex-1">
                  {schedule.active && schedule.slots.length > 0 ? (
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

                <button
                  type="button"
                  onClick={() => toggleDayActive(schedule.key)}
                  className="text-xs font-bold text-amber-700 hover:underline self-end sm:self-auto"
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

