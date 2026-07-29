"use client";

import { useState } from "react";
import { Settings, Shield, Bell, Save, Lock, Globe } from "lucide-react";

export default function AdminSettingsPage() {
  const [platformFee, setPlatformFee] = useState("10");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
          Platform System Settings
        </h1>
        <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
          Configure platform parameters, commission fees, and system security defaults.
        </p>
      </div>

      {/* Settings Form Container */}
      <div className="rounded-3xl border border-stone-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-6">
        {/* Section 1: Financial & Commission Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Globe className="h-4 w-4 text-amber-500" />
            <span>Financial & Platform Fees</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Platform Commission Fee (%)
              </label>
              <input
                type="number"
                value={platformFee}
                onChange={(e) => setPlatformFee(e.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-semibold text-stone-900 outline-none focus:border-amber-500 focus:bg-white"
              />
              <span className="text-[10px] text-stone-400 font-medium">
                Percentage retained by FixItNow per completed booking.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Default Currency
              </label>
              <select className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-semibold text-stone-900 outline-none focus:border-amber-500 focus:bg-white">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </div>

        <hr className="border-stone-100" />

        {/* Section 2: System Security & Controls */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-500" />
            <span>System Maintenance Controls</span>
          </h3>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-100">
            <div>
              <h4 className="text-xs font-bold text-stone-900">Maintenance Mode</h4>
              <p className="text-[11px] text-stone-400">
                Temporarily pause new customer booking dispatches for system updates.
              </p>
            </div>
            <button
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                maintenanceMode ? "bg-amber-500" : "bg-stone-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  maintenanceMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button className="flex items-center gap-2 rounded-2xl bg-stone-900 px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-stone-800 active:scale-95">
            <Save className="h-4 w-4 text-amber-400" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
