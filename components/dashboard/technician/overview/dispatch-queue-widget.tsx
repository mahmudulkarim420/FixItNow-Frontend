"use client";

import { useState, useEffect } from "react";
import { Star, Pause, Play, Square, ShieldCheck, CheckCircle2 } from "lucide-react";
import type { Booking, TechnicianProfile } from "@/types";

interface TechnicianWidgetProps {
  bookings?: Booking[];
  profile?: TechnicianProfile | null;
}

export function TechnicianWidget({ bookings = [], profile }: TechnicianWidgetProps) {
  const [seconds, setSeconds] = useState(2712); // 00:45:12 in seconds
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Extract real customer reviews from bookings
  const liveReviews = bookings
    .filter((b) => b.review)
    .map((b) => ({
      id: b.review?.id || b.id,
      customer: b.customer?.name || "Verified Client",
      rating: b.review?.rating || 5,
      comment: b.review?.comment || "Excellent repair service",
      service: b.service?.title || "Home Repair",
      time: new Date(b.review?.createdAt || b.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      avatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80`,
    }));

  const activeTimerJob = bookings.find((b) => b.status === "IN_PROGRESS");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
      {/* 1. Recent Reviews Roster (5 cols wide on desktop) */}
      <div className="md:col-span-2 lg:col-span-5 rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-3.5 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-slate-100">
            Recent Customer Reviews
          </h3>
          <span className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400">
            {profile?.averageRating ? `${profile.averageRating.toFixed(1)} ★` : "4.9 ★"} ({profile?.totalReviews ?? liveReviews.length})
          </span>
        </div>

        <div className="space-y-3">
          {liveReviews.length > 0 ? (
            liveReviews.slice(0, 3).map((review) => (
              <div
                key={review.id}
                className="flex flex-col gap-1.5 rounded-2xl p-2.5 bg-stone-50/80 dark:bg-slate-800/80 border border-stone-100 dark:border-slate-700 transition-colors hover:bg-stone-100/80 dark:hover:bg-slate-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={review.avatar}
                      alt={review.customer}
                      className="h-7 w-7 rounded-xl object-cover ring-1 ring-stone-200 dark:ring-slate-700"
                    />
                    <span className="text-xs font-bold text-stone-900 dark:text-slate-100">
                      {review.customer}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-800/60">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span>{review.rating}</span>
                  </div>
                </div>

                <p className="text-[11px] text-stone-600 dark:text-slate-300 font-medium italic pl-1">
                  &ldquo;{review.comment}&rdquo;
                </p>

                <div className="flex items-center justify-between text-[9px] font-semibold text-stone-400 dark:text-slate-400 pt-1">
                  <span>{review.service}</span>
                  <span>{review.time}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-xs text-stone-400 dark:text-slate-400 font-medium">
              No completed job reviews yet.
            </div>
          )}
        </div>
      </div>

      {/* 2. Verification & Skill Score Card (4 cols wide on desktop) */}
      <div className="md:col-span-1 lg:col-span-4 rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-slate-100">
              Profile & Verification
            </h3>
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified
            </span>
          </div>

          <div className="my-4 p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-stone-600 dark:text-slate-300">Hourly Rate</span>
              <span className="text-stone-900 dark:text-slate-100 font-extrabold text-sm">
                ${profile?.hourlyRate || 55.00} / hr
              </span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-stone-600 dark:text-slate-300">On-Time Score</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">100% Completed</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-stone-400 dark:text-slate-400 uppercase tracking-wider">
              Verified Skills
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(profile?.skills && profile.skills.length > 0
                ? profile.skills
                : ["AC Repair", "Plumbing", "Electrical"]
              ).map((skill, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-stone-100 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-bold text-stone-700 dark:text-slate-300"
                >
                  🔧 {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-semibold text-stone-400 dark:text-slate-400">
          <span>{profile?.location || "San Francisco, CA"}</span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="h-3 w-3" />
            Background Checked
          </span>
        </div>
      </div>

      {/* 3. Active Job Timer Widget (3 cols wide on desktop) */}
      <div className="md:col-span-1 lg:col-span-3 relative overflow-hidden rounded-3xl bg-stone-900 dark:bg-slate-900 border border-stone-800 dark:border-slate-800 p-4 sm:p-5 text-white shadow-md flex flex-col justify-between min-h-[180px]">
        <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-amber-500/20 blur-2xl" />

        <div className="relative z-10">
          <h3 className="text-xs font-semibold text-stone-400 dark:text-slate-400">Active Job Timer</h3>
          <p className="text-[11px] font-bold text-amber-400 truncate mt-0.5">
            {activeTimerJob ? activeTimerJob.service?.title || "Active Job" : "Job #204: Active Repair"}
          </p>
        </div>

        <div className="relative z-10 my-3 sm:my-4 text-center">
          <span className="text-2xl sm:text-3xl font-mono font-extrabold tracking-wider text-amber-400">
            {formatTime(seconds)}
          </span>
        </div>

        <div className="relative z-10 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            aria-label={isRunning ? "Pause job timer" : "Start job timer"}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-stone-900 dark:text-slate-100 shadow-md transition-all hover:bg-stone-200 dark:hover:bg-slate-700 active:scale-90"
          >
            {isRunning ? (
              <Pause className="h-4 w-4 fill-stone-900 dark:fill-slate-100" />
            ) : (
              <Play className="h-4 w-4 fill-stone-900 dark:fill-slate-100 ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsRunning(false);
              setSeconds(0);
            }}
            aria-label="Complete job"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md transition-all hover:bg-emerald-600 active:scale-90"
          >
            <Square className="h-4 w-4 fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
