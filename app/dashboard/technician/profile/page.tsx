"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Save, Loader2, CheckCircle2, AlertCircle, Plus, X } from "lucide-react";
import { getCurrentUser } from "@/lib/api";
import { updateTechnicianProfile } from "@/lib/technician-api";

export default function TechnicianProfilePage() {
  const [bio, setBio] = useState("Licensed HVAC & plumbing specialist servicing residential and commercial systems.");
  const [hourlyRate, setHourlyRate] = useState("55.00");
  const [location, setLocation] = useState("San Francisco, CA");
  const [experience, setExperience] = useState("5");
  const [skills, setSkills] = useState<string[]>(["HVAC & AC Repair", "Emergency Plumbing", "Electrical Safety"]);
  const [newSkillInput, setNewSkillInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadProfileData() {
      try {
        setLoading(true);
        const me = await getCurrentUser();
        const prof = me.technicianProfile as import("@/types").TechnicianProfile | undefined;

        if (prof) {
          if (prof.bio) setBio(prof.bio);
          if (prof.hourlyRate) setHourlyRate(prof.hourlyRate.toString());
          if (prof.location) setLocation(prof.location);
          if (prof.experience) setExperience(prof.experience.toString());
          if (prof.skills && prof.skills.length > 0) setSkills(prof.skills);
        }
      } catch {
        /* Keep defaults */
      } finally {
        setLoading(false);
      }
    }
    loadProfileData();
  }, []);

  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg("");
      setSuccessMsg("");

      await updateTechnicianProfile({
        bio,
        hourlyRate: parseFloat(hourlyRate) || 50,
        location,
        experience: parseInt(experience, 10) || 5,
        skills,
      });

      setSuccessMsg("Technician profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to update profile details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl text-stone-900 dark:text-slate-100">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-slate-100">
          Technician Profile & Skills
        </h1>
        <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500 dark:text-slate-400">
          Update your public technician profile, bio, hourly rate, and verified skill tags in real-time.
        </p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 p-3 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-2xl bg-rose-50 dark:bg-rose-950/60 p-3 text-xs font-bold text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-900">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center gap-2 text-stone-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-stone-200/80 dark:border-slate-800">
          <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
          <span className="text-xs font-bold">Loading profile settings...</span>
        </div>
      ) : (
        /* Form Container */
        <form onSubmit={handleSaveProfile} className="rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-800">
            <ShieldCheck className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
              Verified Pro Badge Active — Your profile is visible to customers in {location || "your area"}.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">Hourly Rate ($ / hr)</label>
              <input
                type="number"
                step="0.50"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-stone-900 dark:text-slate-100 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">Service Location / City</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA"
                className="w-full rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-stone-900 dark:text-slate-100 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">Experience (Years)</label>
              <input
                type="number"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-stone-900 dark:text-slate-100 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">Professional Bio</label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your technical expertise, certifications, and service philosophy..."
              className="w-full rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-stone-900 dark:text-slate-100 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800 resize-none"
            />
          </div>

          {/* Dynamic Skill Tags */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-2">Verified Skill Tags</label>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-full bg-stone-900 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-amber-400 border border-stone-800 dark:border-slate-700"
                >
                  <span>🔧 {skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-stone-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 max-w-sm">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Add new skill (e.g. Leak Detection)..."
                className="flex-1 rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-stone-900 dark:text-slate-100 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="flex items-center gap-1 rounded-2xl bg-amber-500 text-stone-950 px-3 py-2 text-xs font-bold shadow-2xs hover:bg-amber-400 transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-2xl bg-stone-900 dark:bg-amber-500 dark:text-slate-950 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-stone-800 dark:hover:bg-amber-400 active:scale-95 disabled:opacity-50 cursor-pointer"
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
