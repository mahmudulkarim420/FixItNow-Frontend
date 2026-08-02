"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Wrench,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowRight,
  DollarSign,
  Briefcase,
  MapPin,
  Sparkles,
  Calendar,
} from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { useAuth } from "@/components/auth/auth-provider";
import {
  applyForTechnician,
  getTechnicianApplicationStatus,
  type ApplyTechnicianPayload,
} from "@/lib/technician-api";
import type { TechnicianProfile } from "@/types";

const SKILL_OPTIONS = [
  "Pipe Fitting & Plumbing",
  "Electrical & House Rewiring",
  "AC Jet Wash & Gas Refill",
  "Washing Machine & Appliance Fix",
  "Carpentry & Furniture Fitting",
  "Wall Painting & Damp Proofing",
  "Smart Home & Fixture Setup",
  "General Home Maintenance",
];

const DEFAULT_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function BeATechnicianPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<TechnicianProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [bio, setBio] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "Pipe Fitting & Plumbing",
  ]);
  const [experience, setExperience] = useState<number>(3);
  const [hourlyRate, setHourlyRate] = useState<number>(45);
  const [location, setLocation] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>(DEFAULT_DAYS);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      if (!user) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const appStatus = await getTechnicianApplicationStatus().catch(() => null);
        setProfile(appStatus);
        if (appStatus) {
          if (appStatus.bio) setBio(appStatus.bio);
          if (appStatus.skills && appStatus.skills.length > 0)
            setSelectedSkills(appStatus.skills);
          if (appStatus.experience) setExperience(appStatus.experience);
          if (appStatus.hourlyRate) setHourlyRate(appStatus.hourlyRate);
          if (appStatus.location) setLocation(appStatus.location);
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [user]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!user) {
      setErrorMessage("Please log in to submit your technician application.");
      return;
    }

    if (!bio.trim() || bio.trim().length < 10) {
      setErrorMessage("Please enter a bio describing your work experience (min 10 characters).");
      return;
    }

    if (selectedSkills.length === 0) {
      setErrorMessage("Please select at least one primary service skill.");
      return;
    }

    if (!location.trim()) {
      setErrorMessage("Please enter your primary service location/city.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: ApplyTechnicianPayload = {
        bio: bio.trim(),
        skills: selectedSkills,
        experience,
        hourlyRate,
        location: location.trim(),
        availability: { days: selectedDays },
      };

      const updated = await applyForTechnician(payload);
      setProfile(updated);
      setSuccessMessage("Your technician application has been submitted successfully! Status is now PENDING review.");
    } catch (err: any) {
      console.error("Submission failed:", err);
      setErrorMessage(err.message || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status checks
  const isApproved =
    user?.role === "TECHNICIAN" ||
    (profile && profile.approvalStatus === "APPROVED");
  const isPending = profile && profile.approvalStatus === "PENDING" && !isApproved;
  const isRejected = profile && profile.approvalStatus === "REJECTED" && !isApproved;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-900">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-10">
          {/* Page Banner Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Join Our Verified Pro Network
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900">
              Become a FixItNow Technician
            </h1>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Earn steady income, choose your service areas, and connect with thousands of local homeowners needing skilled repairs.
            </p>
          </div>

          {/* Value Props Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col items-center text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Competitive Earnings</h3>
              <p className="text-xs text-stone-500">Set your hourly rates and keep 100% of earned tips.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col items-center text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Flexible Schedule</h3>
              <p className="text-xs text-stone-500">Work when you want. Set your preferred working days.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col items-center text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Verified Badge</h3>
              <p className="text-xs text-stone-500">Gain instant client trust with FixItNow verification.</p>
            </div>
          </div>

          {/* Conditional Views Based on Application Status */}

          {isLoading ? (
            <div className="bg-white rounded-3xl p-12 border border-stone-200 text-center animate-pulse space-y-4">
              <div className="h-6 w-48 bg-stone-200 rounded-full mx-auto" />
              <div className="h-4 w-64 bg-stone-200 rounded-full mx-auto" />
            </div>
          ) : !user ? (
            /* Logged Out view prompt */
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-sm text-center space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <Wrench className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-extrabold text-stone-900">
                Sign In to Apply
              </h2>
              <p className="text-stone-600 text-sm max-w-md mx-auto">
                You need a FixItNow account to submit your technician application. Log in or create your account to continue.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <Link
                  href="/login?redirect=/be-a-technician"
                  className="px-6 py-3 rounded-2xl bg-stone-900 text-white font-bold text-sm hover:bg-stone-800 transition cursor-pointer"
                >
                  Log In to Apply
                </Link>
                <Link
                  href="/register?redirect=/be-a-technician"
                  className="px-6 py-3 rounded-2xl bg-amber-500 text-stone-950 font-bold text-sm hover:bg-amber-400 transition cursor-pointer"
                >
                  Create Account
                </Link>
              </div>
            </div>
          ) : isApproved ? (
            /* Approved Status View */
            <div className="bg-emerald-50/90 rounded-3xl p-8 border border-emerald-200 shadow-sm space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-200/80 text-emerald-900 text-xs font-extrabold uppercase">
                    APPLICATION APPROVED & ACTIVE
                  </span>
                  <h2 className="text-2xl font-extrabold text-stone-900">
                    Welcome to the Technician Network!
                  </h2>
                  <p className="text-emerald-950 text-sm leading-relaxed">
                    Your application has been verified and approved by FixItNow Admin. Your account role is officially upgraded to **Technician**.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-emerald-200/60 space-y-3">
                <h4 className="text-xs font-extrabold uppercase text-stone-400">Verified Profile Details</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-stone-500 block">Status:</span>
                    <span className="font-bold text-emerald-700">Verified Pro</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Experience:</span>
                    <span className="font-bold text-stone-900">{profile?.experience} Years</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Hourly Rate:</span>
                    <span className="font-bold text-stone-900">${profile?.hourlyRate}/hr</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Location:</span>
                    <span className="font-bold text-stone-900">{profile?.location}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-start">
                <Link
                  href="/dashboard/technician"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-stone-900 text-white font-bold text-sm hover:bg-stone-800 transition cursor-pointer"
                >
                  <span>Go to Technician Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </Link>
              </div>
            </div>
          ) : isPending ? (
            /* Pending Status View */
            <div className="bg-amber-50/90 rounded-3xl p-8 border border-amber-200 shadow-sm space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-200 text-amber-950 text-xs font-extrabold uppercase">
                    APPLICATION PENDING REVIEW
                  </span>
                  <h2 className="text-2xl font-extrabold text-stone-900">
                    Application Under Review
                  </h2>
                  <p className="text-stone-700 text-sm leading-relaxed">
                    Thank you for applying! Our admin team is currently verifying your submitted skill credentials and service profile. Once reviewed, your role will be upgraded to Technician.
                  </p>
                </div>
              </div>

              {/* Submitted Details Summary */}
              <div className="bg-white rounded-2xl p-5 border border-amber-200/60 space-y-3">
                <h4 className="text-xs font-extrabold uppercase text-stone-400">Submitted Application Summary</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-stone-500 block">Applicant:</span>
                    <span className="font-bold text-stone-900">{user.name} ({user.email})</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Experience:</span>
                    <span className="font-bold text-stone-900">{profile?.experience} Years</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Requested Rate:</span>
                    <span className="font-bold text-stone-900">${profile?.hourlyRate}/hr</span>
                  </div>
                </div>

                <div className="pt-2 text-xs">
                  <span className="text-stone-500 block">Primary Skills:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {profile?.skills?.map((s, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Application Form View (Unapplied or Re-applying after Rejection) */
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm space-y-8">
              {isRejected && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>
                    Your previous application was not approved. You can update your skills, experience, and hourly rate below and re-submit your application for admin review.
                  </span>
                </div>
              )}

              {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div className="border-b border-stone-100 pb-5">
                <h2 className="text-xl font-extrabold text-stone-900">
                  Technician Verification Form
                </h2>
                <p className="text-stone-500 text-xs mt-1">
                  Fill out your professional background to be listed as a certified technician.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Pre-filled Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200/60">
                  <div>
                    <label className="text-xs font-bold text-stone-600 block mb-1">Full Name</label>
                    <input
                      type="text"
                      disabled
                      value={user.name}
                      className="w-full rounded-xl border border-stone-200 bg-stone-100 px-3.5 py-2.5 text-xs font-semibold text-stone-700 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-600 block mb-1">Email Address</label>
                    <input
                      type="text"
                      disabled
                      value={user.email}
                      className="w-full rounded-xl border border-stone-200 bg-stone-100 px-3.5 py-2.5 text-xs font-semibold text-stone-700 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Professional Bio */}
                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1.5">
                    Professional Bio & Experience Summary <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe your expertise, certifications, and years working in plumbing, electrical, HVAC, or appliance repairs..."
                    className="w-full rounded-2xl border border-stone-200 bg-stone-50/60 px-4 py-3 text-xs font-medium text-stone-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                    required
                  />
                </div>

                {/* Skills Selection */}
                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-2">
                    Primary Service Skills <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SKILL_OPTIONS.map((skill) => {
                      const isSelected = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                            isSelected
                              ? "bg-amber-500 text-stone-950 shadow-xs"
                              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                          }`}
                        >
                          {skill} {isSelected && "✓"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Experience & Hourly Rate */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1.5">
                      Years of Experience <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={experience}
                      onChange={(e) => setExperience(Number(e.target.value))}
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50/60 px-4 py-2.5 text-xs font-bold text-stone-900 outline-none focus:border-amber-500 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1.5">
                      Desired Hourly Rate ($/hr) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={300}
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Number(e.target.value))}
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50/60 px-4 py-2.5 text-xs font-bold text-stone-900 outline-none focus:border-amber-500 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1.5">
                      Service Location / Area <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Gulshan, Dhaka"
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50/60 px-4 py-2.5 text-xs font-bold text-stone-900 outline-none focus:border-amber-500 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                {/* Working Days */}
                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-2">
                    Available Service Days
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                      (day) => {
                        const isSelected = selectedDays.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(day)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                              isSelected
                                ? "bg-stone-900 text-white border-stone-900"
                                : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-500 text-stone-950 font-extrabold text-sm shadow-md hover:bg-amber-400 active:scale-95 transition disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting
                      ? "Submitting Application..."
                      : isRejected
                      ? "Re-submit Application for Review"
                      : "Submit Application for Admin Review"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
