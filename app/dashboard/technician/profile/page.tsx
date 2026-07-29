"use client";

import { useState } from "react";
import { UserCheck, ShieldCheck, Wrench, MapPin, DollarSign, Save } from "lucide-react";

export default function TechnicianProfilePage() {
  const [bio, setBio] = useState("Licensed HVAC specialist with 6+ years of experience servicing residential and commercial cooling systems.");
  const [hourlyRate, setHourlyRate] = useState("55.00");
  const [location, setLocation] = useState("San Francisco, CA");

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
          Technician Profile & Skills
        </h1>
        <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
          Update your public technician profile, bio, hourly rate, and verified skill tags.
        </p>
      </div>

      {/* Form Container */}
      <div className="rounded-3xl border border-stone-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50 border border-amber-100">
          <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0" />
          <span className="text-xs font-bold text-amber-900">
            Verified Pro Badge Active — Your profile is visible to customers in San Francisco, CA.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Hourly Rate ($ / hr)</label>
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-semibold text-stone-900 outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Service Location / City</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-semibold text-stone-900 outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Professional Bio</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-semibold text-stone-900 outline-none focus:border-amber-500 focus:bg-white resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-2">Verified Skill Tags</label>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-bold text-amber-400">
              🔧 HVAC & AC Repair
            </span>
            <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-bold text-amber-400">
              🚰 Emergency Plumbing
            </span>
            <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-bold text-amber-400">
              ⚡ Electrical Safety
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-stone-100 flex justify-end">
          <button className="flex items-center gap-2 rounded-2xl bg-stone-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-stone-800 active:scale-95">
            <Save className="h-4 w-4 text-amber-400" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
