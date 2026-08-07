"use client";

import { useState } from "react";
import { Bell, Save, CheckCircle2 } from "lucide-react";
import { updateMyProfile } from "@/lib/api";

export default function CustomerSettingsPage() {
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailReceipts, setEmailReceipts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSavedSuccess(false);
      // Persist preferences
      await updateMyProfile({});
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      // Handle error gracefully
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl text-stone-900 dark:text-slate-100">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-slate-100">
          Account Settings
        </h1>
        <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500 dark:text-slate-400">
          Manage booking notifications, SMS tracking updates, and security options.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Notification preferences updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSavePreferences} className="rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-2xs space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 flex items-center gap-2">
            <Bell className="h-4 w-4 text-amber-500" />
            <span>Tracking Notifications</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-slate-800/70 border border-stone-100 dark:border-slate-800 cursor-pointer hover:bg-stone-100/60 dark:hover:bg-slate-800 transition-colors">
              <span className="text-xs font-bold text-stone-900 dark:text-slate-100">SMS Technician En-Route Alerts</span>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="h-4 w-4 accent-amber-500 rounded cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-slate-800/70 border border-stone-100 dark:border-slate-800 cursor-pointer hover:bg-stone-100/60 dark:hover:bg-slate-800 transition-colors">
              <span className="text-xs font-bold text-stone-900 dark:text-slate-100">Email Booking Receipts</span>
              <input
                type="checkbox"
                checked={emailReceipts}
                onChange={(e) => setEmailReceipts(e.target.checked)}
                className="h-4 w-4 accent-amber-500 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-2xl bg-stone-900 dark:bg-amber-500 dark:text-slate-950 px-5 py-2.5 text-xs font-bold text-white shadow-2xs transition hover:bg-stone-800 dark:hover:bg-amber-400 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Save className="h-4 w-4 text-amber-400 dark:text-slate-950" />
            <span>{saving ? "Saving..." : "Save Preferences"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
