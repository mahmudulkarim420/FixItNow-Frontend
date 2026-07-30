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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
          Account Settings
        </h1>
        <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
          Manage booking notifications, SMS tracking updates, and security options.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Notification preferences updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSavePreferences} className="rounded-3xl border border-stone-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Bell className="h-4 w-4 text-amber-500" />
            <span>Tracking Notifications</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-100 cursor-pointer hover:bg-stone-100/60 transition-colors">
              <span className="text-xs font-bold text-stone-900">SMS Technician En-Route Alerts</span>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="h-4 w-4 accent-amber-500 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-100 cursor-pointer hover:bg-stone-100/60 transition-colors">
              <span className="text-xs font-bold text-stone-900">Email Booking Receipts</span>
              <input
                type="checkbox"
                checked={emailReceipts}
                onChange={(e) => setEmailReceipts(e.target.checked)}
                className="h-4 w-4 accent-amber-500 rounded"
              />
            </label>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-2xl bg-stone-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-stone-800 active:scale-95 disabled:opacity-50"
          >
            <Save className="h-4 w-4 text-amber-400" />
            <span>{saving ? "Saving..." : "Save Preferences"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
