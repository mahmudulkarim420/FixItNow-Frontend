"use client";

import { useState } from "react";
import { User, MapPin, Phone, Mail, Save } from "lucide-react";

export default function CustomerProfilePage() {
  const [address, setAddress] = useState("742 Evergreen Terrace, Suite 4B, San Francisco, CA");
  const [phone, setPhone] = useState("+1 (555) 019-2831");

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
          My Account & Service Address
        </h1>
        <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
          Manage your contact details, service dispatch address, and account preferences.
        </p>
      </div>

      {/* Profile Form Container */}
      <div className="rounded-3xl border border-stone-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-5">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <User className="h-4 w-4 text-amber-500" />
            <span>Contact & Address Info</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-semibold text-stone-900 outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Service Dispatch Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-semibold text-stone-900 outline-none focus:border-amber-500 focus:bg-white"
            />
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
