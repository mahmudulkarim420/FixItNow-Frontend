"use client";

import { useEffect, useState } from "react";
import { Shield, Bell, Save, Globe, Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SettingsState {
  platformFee: string;
  defaultCurrency: string;
  minWithdrawal: string;
  autoDispatch: boolean;
  maxDistanceKm: string;
  maintenanceMode: boolean;
  enforce2FA: boolean;
  sessionTimeoutMin: string;
  emailAlerts: boolean;
  smsAlerts: boolean;
}

const DEFAULT_SETTINGS: SettingsState = {
  platformFee: "10",
  defaultCurrency: "USD",
  minWithdrawal: "50",
  autoDispatch: true,
  maxDistanceKm: "25",
  maintenanceMode: false,
  enforce2FA: false,
  sessionTimeoutMin: "60",
  emailAlerts: true,
  smsAlerts: true,
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("fixitnow_admin_settings");
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch {
        /* Fallback */
      }
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 600));
      localStorage.setItem("fixitnow_admin_settings", JSON.stringify(settings));
      toast.success("Platform settings saved & updated successfully!");
    } catch {
      toast.error("Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-2 text-stone-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-stone-200/80 dark:border-slate-800">
        <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
        <span className="text-xs font-bold">Loading settings...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl text-stone-900 dark:text-slate-100">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-slate-100">
            Platform System Settings
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500 dark:text-slate-400">
            Configure platform parameters, commission fees, automated dispatches, and system security defaults.
          </p>
        </div>
      </div>

      {/* Settings Form Container */}
      <div className="rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-2xs space-y-6">
        {/* Section 1: Financial & Commission Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 flex items-center gap-2">
            <Globe className="h-4 w-4 text-amber-500" />
            <span>Financial & Platform Fees</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
                Platform Commission Fee (%)
              </label>
              <input
                type="number"
                value={settings.platformFee}
                onChange={(e) => setSettings({ ...settings, platformFee: e.target.value })}
                className="w-full rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-stone-900 dark:text-slate-100 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
              />
              <span className="text-[10px] text-stone-400 dark:text-slate-500 font-medium block mt-1">
                Retained per completed job.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
                Default Currency
              </label>
              <select
                value={settings.defaultCurrency}
                onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                className="w-full rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-stone-900 dark:text-slate-100 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
              </select>
              <span className="text-[10px] text-stone-400 dark:text-slate-500 font-medium block mt-1">
                Primary billing currency.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
                Min Payout Withdrawal ($)
              </label>
              <input
                type="number"
                value={settings.minWithdrawal}
                onChange={(e) => setSettings({ ...settings, minWithdrawal: e.target.value })}
                className="w-full rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-stone-900 dark:text-slate-100 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
              />
              <span className="text-[10px] text-stone-400 dark:text-slate-500 font-medium block mt-1">
                Technician minimum threshold.
              </span>
            </div>
          </div>
        </div>

        <hr className="border-stone-100 dark:border-slate-800" />

        {/* Section 2: Automated Dispatch & Matching */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            <span>Automated Technician Matching</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/70 border border-stone-100 dark:border-slate-800">
              <div>
                <h4 className="text-xs font-bold text-stone-900 dark:text-slate-100">Auto Smart Dispatch</h4>
                <p className="text-[11px] text-stone-400 dark:text-slate-400 font-medium">
                  Automatically assign nearest verified pro on job booking.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, autoDispatch: !settings.autoDispatch })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  settings.autoDispatch ? "bg-emerald-500" : "bg-stone-300 dark:bg-slate-600"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.autoDispatch ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
                Max Dispatch Radius (km)
              </label>
              <input
                type="number"
                value={settings.maxDistanceKm}
                onChange={(e) => setSettings({ ...settings, maxDistanceKm: e.target.value })}
                className="w-full rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-stone-900 dark:text-slate-100 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
              />
              <span className="text-[10px] text-stone-400 dark:text-slate-500 font-medium block mt-1">
                Maximum geographic radius for dispatches.
              </span>
            </div>
          </div>
        </div>

        <hr className="border-stone-100 dark:border-slate-800" />

        {/* Section 3: System Security & Controls */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-500" />
            <span>System Maintenance & Security Controls</span>
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/70 border border-stone-100 dark:border-slate-800">
              <div>
                <h4 className="text-xs font-bold text-stone-900 dark:text-slate-100">Maintenance Mode</h4>
                <p className="text-[11px] text-stone-400 dark:text-slate-400 font-medium">
                  Temporarily pause new customer booking dispatches for system upgrades.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  settings.maintenanceMode ? "bg-rose-500" : "bg-stone-300 dark:bg-slate-600"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.maintenanceMode ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/70 border border-stone-100 dark:border-slate-800">
              <div>
                <h4 className="text-xs font-bold text-stone-900 dark:text-slate-100">Enforce Admin 2FA</h4>
                <p className="text-[11px] text-stone-400 dark:text-slate-400 font-medium">
                  Require two-factor authentication for administrative log ins.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, enforce2FA: !settings.enforce2FA })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  settings.enforce2FA ? "bg-amber-500" : "bg-stone-300 dark:bg-slate-600"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.enforce2FA ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <hr className="border-stone-100 dark:border-slate-800" />

        {/* Section 4: Notifications & Alerts */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 flex items-center gap-2">
            <Bell className="h-4 w-4 text-amber-500" />
            <span>Automated System Notifications</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/70 border border-stone-100 dark:border-slate-800">
              <div>
                <h4 className="text-xs font-bold text-stone-900 dark:text-slate-100">Email Dispatch Alerts</h4>
                <p className="text-[11px] text-stone-400 dark:text-slate-400 font-medium">
                  Send instant email receipts to customers on booking.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, emailAlerts: !settings.emailAlerts })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  settings.emailAlerts ? "bg-amber-500" : "bg-stone-300 dark:bg-slate-600"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.emailAlerts ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/70 border border-stone-100 dark:border-slate-800">
              <div>
                <h4 className="text-xs font-bold text-stone-900 dark:text-slate-100">SMS Push Notifications</h4>
                <p className="text-[11px] text-stone-400 dark:text-slate-400 font-medium">
                  Dispatch SMS notifications to field technicians.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, smsAlerts: !settings.smsAlerts })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  settings.smsAlerts ? "bg-amber-500" : "bg-stone-300 dark:bg-slate-600"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.smsAlerts ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-100 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-2xl bg-stone-900 dark:bg-amber-500 dark:text-slate-950 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-stone-800 dark:hover:bg-amber-400 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin text-amber-400 dark:text-slate-950" />
            ) : (
              <Save className="h-4 w-4 text-amber-400 dark:text-slate-950" />
            )}
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </form>
  );
}
