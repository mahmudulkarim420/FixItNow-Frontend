"use client";

import { useEffect, useState } from "react";
import { User as UserIcon, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { getCurrentUser, updateMyProfile } from "@/lib/api";
import type { User } from "@/types";

export default function CustomerProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setName(currentUser.name || "");
          setEmail(currentUser.email || "");
          setPhone(currentUser.phone || "+1 (555) 019-2831");
          setLocation(currentUser.technicianProfile?.location || "San Francisco, CA");
        }
      } catch (err: any) {
        setMessage({ type: "error", text: err.message || "Failed to load profile data" });
        toast.error(err.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Saving profile and dispatch address...");
    try {
      setSaving(true);
      setMessage(null);
      const updated = await updateMyProfile({
        name,
        email,
        phone,
        location,
      });
      setUser(updated);
      setMessage({ type: "success", text: "Profile & dispatch address updated successfully!" });
      toast.success("Profile & dispatch address updated successfully!", { id: toastId });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to update profile" });
      toast.error(err.message || "Failed to update profile", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl text-stone-900 dark:text-slate-100">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-slate-100">
          My Account & Service Address
        </h1>
        <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500 dark:text-slate-400">
          Manage your contact details, service dispatch address, and account preferences.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-medium flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
              : "bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-12 text-stone-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-stone-200/80 dark:border-slate-800">
          <Loader2 className="h-6 w-6 animate-spin text-amber-500 mr-2" />
          <span className="text-xs font-bold">Loading profile details...</span>
        </div>
      ) : (
        /* Profile Form Container */
        <form onSubmit={handleSaveProfile} className="rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-2xs space-y-5">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-amber-500" />
              <span>Contact & Address Info</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-stone-900 dark:text-slate-100 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-stone-900 dark:text-slate-100 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-stone-900 dark:text-slate-100 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">Service Dispatch City / State</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-stone-900 dark:text-slate-100 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-2xl bg-stone-900 dark:bg-amber-500 dark:text-slate-950 px-5 py-2.5 text-xs font-bold text-white shadow-2xs transition hover:bg-stone-800 dark:hover:bg-amber-400 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin text-amber-400 dark:text-slate-950" /> : <Save className="h-4 w-4 text-amber-400 dark:text-slate-950" />}
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
