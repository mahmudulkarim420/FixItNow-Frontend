"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User as UserIcon,
  Settings,
  LogOut,
  Mail,
  Sparkles,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Trash2,
  X,
  ShieldCheck,
  Wrench,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar } from "@/components/shared/avatar";
import { updateMyProfile, deleteMyProfile, logoutUser } from "@/lib/api";
import { ROLE_HOME } from "@/lib/auth-constants";
import type { User as UserType, TechnicianProfile } from "@/types";

interface ProfileLayoutProps {
  user: UserType;
  technicianDetails: TechnicianProfile | null;
}

export function ProfileLayout({ user, technicianDetails }: ProfileLayoutProps) {
  const router = useRouter();

  // Form states
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [location, setLocation] = useState(technicianDetails?.location || "");
  const [bio, setBio] = useState(technicianDetails?.bio || "");
  const [hourlyRate, setHourlyRate] = useState(
    technicianDetails?.hourlyRate?.toString() || ""
  );
  const [experience, setExperience] = useState(
    technicianDetails?.experience?.toString() || ""
  );
  const [skills, setSkills] = useState(
    technicianDetails?.skills?.join(", ") || ""
  );

  // Password fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Loading & Error states
  const [isUpdating, setIsUpdating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Delete modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Logout state
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Handle Logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Could not log out. Redirecting...");
      router.push("/login");
    }
  };

  // Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    // Validations
    if (!name.trim()) {
      setFormError("Full name is required.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setFormError("A valid email address is required.");
      return;
    }
    if (newPassword) {
      if (newPassword.length < 6) {
        setFormError("New password must be at least 6 characters long.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setFormError("New passwords do not match.");
        return;
      }
    }

    setIsUpdating(true);

    try {
      const payload: Record<string, any> = {};
      if (name !== user.name) payload.name = name.trim();
      if (email !== user.email) payload.email = email.trim();
      if (phone !== (user.phone || "")) payload.phone = phone.trim();
      if (newPassword) payload.password = newPassword;

      if (user.role === "TECHNICIAN") {
        payload.bio = bio.trim();
        payload.location = location.trim();
        if (hourlyRate) payload.hourlyRate = parseFloat(hourlyRate) || 0;
        if (experience) payload.experience = parseInt(experience, 10) || 0;
        if (skills) {
          payload.skills = skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        } else {
          payload.skills = [];
        }
      }

      await updateMyProfile(payload);

      setFormSuccess("Profile saved successfully!");
      toast.success("Profile saved successfully!");
      setNewPassword("");
      setConfirmPassword("");
      router.refresh();
    } catch (err: any) {
      setFormError(err.message || "Failed to update profile.");
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Account Deletion
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmText.trim().toUpperCase() !== "DELETE") {
      toast.error('Please type "DELETE" to confirm.');
      return;
    }

    setIsDeleting(true);
    try {
      await deleteMyProfile();
      toast.success("Account deleted successfully.");
      setIsDeleteOpen(false);
      router.push("/login");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete account.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-4 sm:my-8 px-2 sm:px-4">
      {/* Main 2-Column Card Wrapper */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-stone-200/90 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[640px]">
        
        {/* ================= LEFT SIDEBAR PANEL (DARK STONE BRAND ACCENT) ================= */}
        <div className="w-full lg:w-72 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 lg:rounded-l-3xl p-6 lg:p-8 flex flex-col justify-between text-white shrink-0">
          <div>
            {/* Top User Header */}
            <div className="flex flex-col items-center text-center pb-8 border-b border-stone-800">
              <div className="relative mb-3">
                <Avatar
                  name={user.name}
                  src={user.avatar}
                  size="xl"
                  showStatus
                  status={user.status}
                  className="ring-4 ring-amber-500/30 shadow-lg"
                />
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-white">
                Welcome, {user.name.split(" ")[0]}
              </h2>
              <p className="text-xs text-stone-400 mt-1 font-medium flex items-center justify-center gap-1">
                <Mail className="w-3.5 h-3.5 opacity-70 text-amber-400" />
                <span className="truncate max-w-[180px]">{user.email}</span>
              </p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 mt-3 backdrop-blur-xs">
                {user.role === "ADMIN" && <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
                {user.role === "TECHNICIAN" && <Wrench className="w-3.5 h-3.5 text-amber-400" />}
                {user.role === "CUSTOMER" && <UserRound className="w-3.5 h-3.5 text-amber-400" />}
                <span>{user.role}</span>
              </span>
            </div>

            {/* Navigation Menu Links */}
            <nav className="mt-8 space-y-2">
              <Link
                href={ROLE_HOME[user.role]}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-stone-300 hover:bg-stone-800 hover:text-amber-400 transition-all duration-200"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <div className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20">
                <div className="flex items-center gap-3">
                  <UserIcon className="w-4 h-4 text-stone-950" />
                  <span>My Profile</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-stone-950 animate-pulse" />
              </div>

              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-stone-300 hover:bg-stone-800 hover:text-amber-400 transition-all duration-200"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>

          {/* Log Out Button at Bottom of Sidebar */}
          <div className="pt-8 mt-8 border-t border-stone-800">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-stone-300 hover:bg-rose-500/20 hover:text-rose-300 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
              ) : (
                <LogOut className="w-4 h-4 text-rose-400" />
              )}
              <span>{isLoggingOut ? "Signing out..." : "Log Out"}</span>
            </button>
          </div>
        </div>

        {/* ================= RIGHT MAIN PANEL (WHITE BACKGROUND) ================= */}
        <div className="flex-1 p-6 lg:p-10 bg-white dark:bg-slate-900 text-stone-900 dark:text-slate-100">
          {/* Main Title Header */}
          <div className="mb-8 pb-4 border-b border-stone-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-stone-900 dark:text-slate-100">
                Your personal profile info
              </h1>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-1 font-medium">
                Manage your account credentials, contact information, and preferences.
              </p>
            </div>

            {/* Account Deletion Secondary Trigger */}
            <button
              type="button"
              onClick={() => setIsDeleteOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 px-3 py-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Delete Account</span>
            </button>
          </div>

          {/* Form Banner Alerts */}
          {formError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {formSuccess && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          {/* Main Profile Form */}
          <form onSubmit={handleSaveProfile} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* ------------ COLUMN 1: (1) PROFILE ------------ */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 text-xs font-black flex items-center justify-center shadow-2xs">
                    1
                  </span>
                  <h3 className="text-xs font-black uppercase tracking-widest text-stone-800 dark:text-slate-200">
                    PROFILE DETAILS
                  </h3>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 dark:text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Full name"
                    className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50/60 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 font-semibold text-stone-900 dark:text-slate-100 transition-all"
                  />
                </div>

                {/* Your Email */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 dark:text-slate-300 mb-1.5">
                    Your e-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="mail@example.com"
                    className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50/60 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 font-semibold text-stone-900 dark:text-slate-100 transition-all"
                  />
                </div>

                {/* Personal Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 dark:text-slate-300 mb-1.5">
                    Personal phone number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50/60 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 font-semibold text-stone-900 dark:text-slate-100 transition-all"
                  />
                </div>

                {/* Location / City */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 dark:text-slate-300 mb-1.5">
                    Country, City
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. New York, USA"
                    className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50/60 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 font-semibold text-stone-900 dark:text-slate-100 transition-all"
                  />
                </div>

                {/* Technician Extra Fields (Bio & Skills) */}
                {user.role === "TECHNICIAN" && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-stone-600 dark:text-slate-300 mb-1.5">
                        Bio / About Info
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        placeholder="Brief summary about your skills..."
                        className="w-full p-4 text-xs sm:text-sm rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50/60 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 font-semibold text-stone-900 dark:text-slate-100 transition-all resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-600 dark:text-slate-300 mb-1.5">
                          Hourly Rate ($)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(e.target.value)}
                          placeholder="e.g. 50"
                          className="w-full px-4 py-3 text-xs rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50/60 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-amber-500 font-semibold text-stone-900 dark:text-slate-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-600 dark:text-slate-300 mb-1.5">
                          Experience (Yrs)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                          placeholder="e.g. 5"
                          className="w-full px-4 py-3 text-xs rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50/60 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-amber-500 font-semibold text-stone-900 dark:text-slate-100"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* ------------ COLUMN 2: (2) PASSWORD & SECURITY ------------ */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 text-xs font-black flex items-center justify-center shadow-2xs">
                      2
                    </span>
                    <h3 className="text-xs font-black uppercase tracking-widest text-stone-800 dark:text-slate-200">
                      PASSWORD & SECURITY
                    </h3>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-bold text-stone-600 dark:text-slate-300 mb-1.5">
                      New password <span className="text-stone-400 dark:text-slate-500 font-normal">(optional)</span>
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50/60 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 font-semibold text-stone-900 dark:text-slate-100 transition-all"
                    />
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-xs font-bold text-stone-600 dark:text-slate-300 mb-1.5">
                      Confirm new password <span className="text-stone-400 dark:text-slate-500 font-normal">(optional)</span>
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50/60 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 font-semibold text-stone-900 dark:text-slate-100 transition-all"
                    />
                  </div>

                  {/* Account Metadata Summary Box */}
                  <div className="mt-6 p-4.5 rounded-2xl bg-stone-50 dark:bg-slate-800/80 border border-stone-200/80 dark:border-slate-700 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-stone-600 dark:text-slate-300 font-semibold">
                      <span>Account Role</span>
                      <span className="font-extrabold text-stone-900 dark:text-slate-100">{user.role}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-stone-600 dark:text-slate-300 font-semibold">
                      <span>Account Status</span>
                      <span className="font-black text-emerald-600 dark:text-emerald-400 uppercase text-[10px] bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                        {user.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-stone-600 dark:text-slate-300 font-semibold">
                      <span>Member Since</span>
                      <span className="font-semibold text-stone-700 dark:text-slate-300">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Button: "Correct, Save info" */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full py-4 px-6 rounded-2xl bg-amber-500 dark:bg-amber-500 dark:text-slate-950 hover:bg-amber-600 dark:hover:bg-amber-400 disabled:opacity-60 text-white font-bold text-sm tracking-wide shadow-lg shadow-amber-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>{isUpdating ? "Saving..." : "Correct, Save info"}</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* ================= DELETE ACCOUNT CONFIRMATION MODAL ================= */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-rose-100 dark:border-slate-800 text-stone-900 dark:text-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-900">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-slate-100">Delete Account</h3>
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                    Irreversible Action
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-500 dark:text-slate-400 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-300 leading-relaxed mb-4">
              Deleting your account will permanently wipe your profile and active session.
            </p>

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
                  Type <span className="text-rose-600 dark:text-rose-400 font-mono font-black">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-4 py-3 font-mono text-sm rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-rose-500 focus:outline-none font-bold uppercase text-stone-900 dark:text-slate-100"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDeleteOpen(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-full text-xs font-bold text-stone-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDeleting || deleteConfirmText.trim().toUpperCase() !== "DELETE"}
                  className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isDeleting ? "Deleting..." : "Permanently Delete"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
