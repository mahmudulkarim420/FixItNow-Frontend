"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Edit3,
  Trash2,
  X,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  User,
  Mail,
  Lock,
  MapPin,
  DollarSign,
  Briefcase,
  Sparkles,
  Tag,
} from "lucide-react";
import { toast } from "sonner";

import { updateMyProfile, deleteMyProfile } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { User as UserType, TechnicianProfile } from "@/types";

interface ProfileClientProps {
  user: UserType;
  technicianDetails: TechnicianProfile | null;
}

export function ProfileClient({ user, technicianDetails }: ProfileClientProps) {
  const router = useRouter();

  // Modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Edit form state
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState(technicianDetails?.bio || "");
  const [location, setLocation] = useState(technicianDetails?.location || "");
  const [hourlyRate, setHourlyRate] = useState(
    technicianDetails?.hourlyRate?.toString() || ""
  );
  const [experience, setExperience] = useState(
    technicianDetails?.experience?.toString() || ""
  );
  const [skillsInput, setSkillsInput] = useState(
    technicianDetails?.skills?.join(", ") || ""
  );

  // Loading & error states
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Reset form when modal opens
  const handleOpenEdit = () => {
    setName(user.name || "");
    setEmail(user.email || "");
    setPassword("");
    setBio(technicianDetails?.bio || "");
    setLocation(technicianDetails?.location || "");
    setHourlyRate(technicianDetails?.hourlyRate?.toString() || "");
    setExperience(technicianDetails?.experience?.toString() || "");
    setSkillsInput(technicianDetails?.skills?.join(", ") || "");
    setUpdateError(null);
    setIsEditOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError(null);

    // Basic Validation
    if (!name.trim()) {
      setUpdateError("Name cannot be empty.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setUpdateError("Please provide a valid email address.");
      return;
    }
    if (password && password.length < 6) {
      setUpdateError("Password must be at least 6 characters long.");
      return;
    }

    setIsUpdating(true);

    try {
      const payload: Record<string, any> = {};
      if (name !== user.name) payload.name = name.trim();
      if (email !== user.email) payload.email = email.trim();
      if (password) payload.password = password;

      if (user.role === "TECHNICIAN") {
        payload.bio = bio.trim();
        payload.location = location.trim();
        if (hourlyRate) payload.hourlyRate = parseFloat(hourlyRate) || 0;
        if (experience) payload.experience = parseInt(experience, 10) || 0;
        if (skillsInput) {
          payload.skills = skillsInput
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        } else {
          payload.skills = [];
        }
      }

      await updateMyProfile(payload);

      toast.success("Profile updated successfully!");
      setIsEditOpen(false);
      setPassword("");
      router.refresh();
    } catch (err: any) {
      setUpdateError(err.message || "Failed to update profile. Please try again.");
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError(null);

    if (deleteConfirmText.trim().toUpperCase() !== "DELETE") {
      setDeleteError('Please type "DELETE" to confirm account deletion.');
      return;
    }

    setIsDeleting(true);

    try {
      await deleteMyProfile();
      toast.success("Your account has been deleted successfully.");
      setIsDeleteOpen(false);
      router.push("/login");
      router.refresh();
    } catch (err: any) {
      setDeleteError(err.message || "Could not delete account. Please try again.");
      toast.error(err.message || "Could not delete account");
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Profile Action Buttons Header */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Edit Profile Button */}
        <button
          type="button"
          onClick={handleOpenEdit}
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm px-5 py-2.5 sm:py-3 rounded-full shadow-xs transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>

        {/* Delete Account Button */}
        <button
          type="button"
          onClick={() => {
            setDeleteConfirmText("");
            setDeleteError(null);
            setIsDeleteOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs sm:text-sm px-4 py-2.5 sm:py-3 rounded-full border border-rose-200 transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <Trash2 className="w-4 h-4 text-rose-600" />
          <span>Delete Account</span>
        </button>
      </div>

      {/* ================= EDIT PROFILE MODAL ================= */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-stone-200 transition-all my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-stone-900 leading-tight">
                    Edit Profile Details
                  </h2>
                  <p className="text-xs text-stone-500 font-normal">
                    Update your account information and preferences.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Banner */}
            {updateError && (
              <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{updateError}</span>
              </div>
            )}

            {/* Edit Form */}
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-600 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 font-medium text-stone-900 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-600 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 font-medium text-stone-900 transition-all"
                  />
                </div>
              </div>

              {/* Password Optional */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-600 mb-1.5">
                  New Password <span className="text-stone-400 font-normal lowercase">(optional)</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave empty to keep current password"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 font-medium text-stone-900 transition-all"
                  />
                </div>
              </div>

              {/* Technician Specific Fields */}
              {user.role === "TECHNICIAN" && (
                <div className="pt-3 border-t border-stone-100 space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Technician Professional Information
                  </h4>

                  {/* Bio */}
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">
                      Bio / Description
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder="Tell clients about your expertise..."
                      className="w-full p-3 text-sm rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 font-medium text-stone-900 transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Location */}
                    <div>
                      <label className="block text-xs font-bold text-stone-600 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. New York, NY"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-amber-500 font-medium text-stone-900"
                      />
                    </div>

                    {/* Hourly Rate */}
                    <div>
                      <label className="block text-xs font-bold text-stone-600 mb-1">
                        Hourly Rate ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        placeholder="e.g. 50"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-amber-500 font-medium text-stone-900"
                      />
                    </div>

                    {/* Experience */}
                    <div>
                      <label className="block text-xs font-bold text-stone-600 mb-1">
                        Experience (Yrs)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="e.g. 5"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-amber-500 font-medium text-stone-900"
                      />
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">
                      Skills (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      placeholder="e.g. Credit Audit, Score Monitoring, Debt Dispute"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-amber-500 font-medium text-stone-900"
                    />
                  </div>
                </div>
              )}

              {/* Form Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  disabled={isUpdating}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isUpdating ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE ACCOUNT MODAL ================= */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-rose-100 transition-all my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-stone-900 leading-tight">
                    Delete Account
                  </h2>
                  <p className="text-xs text-rose-600 font-bold">
                    Warning: Irreversible Action
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
              Deleting your account will permanently remove your profile, data, and active session from FixItNow.
            </p>

            {/* Error Banner */}
            {deleteError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <form onSubmit={handleDeleteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                  Type <span className="text-rose-600 font-mono font-black">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE here"
                  className="w-full px-4 py-2.5 text-sm font-mono rounded-xl border border-stone-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 font-bold text-stone-900 focus:outline-none uppercase"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsDeleteOpen(false)}
                  disabled={isDeleting}
                  className="px-4 py-2.5 rounded-full text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isDeleting || deleteConfirmText.trim().toUpperCase() !== "DELETE"}
                  className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isDeleting ? "Deleting..." : "Permanently Delete"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
