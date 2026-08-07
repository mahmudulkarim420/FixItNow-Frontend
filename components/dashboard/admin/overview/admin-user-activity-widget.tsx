"use client";

import { useState, useEffect } from "react";
import { Pause, Play, Square } from "lucide-react";
import { getAdminBookings, getAdminUsers } from "@/lib/admin-api";

interface MemberItem {
  id: string;
  name: string;
  role: string;
  status: string;
  statusColor: string;
  avatar: string;
}

export function AdminTeamWidget() {
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [completionPercentage, setCompletionPercentage] = useState(41);
  const [seconds, setSeconds] = useState(5048); // 01:24:08 timer
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    async function loadWidgetData() {
      try {
        const [users, bookings] = await Promise.all([
          getAdminUsers().catch(() => []),
          getAdminBookings().catch(() => []),
        ]);

        const techUsers = users.filter((u) => u.role === "TECHNICIAN");

        if (techUsers.length > 0) {
          setMembers(
            techUsers.map((u, i) => ({
              id: u.id,
              name: u.name,
              role: u.email,
              status: u.status === "ACTIVE" ? "Active Pro" : "Banned",
              statusColor:
                u.status === "ACTIVE"
                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800"
                  : "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-100 dark:border-rose-800",
              avatar:
                u.avatar ||
                `https://images.unsplash.com/photo-${1507003211169 + i * 12}?w=100&auto=format&fit=crop&q=80`,
            }))
          );
        }

        if (bookings.length > 0) {
          const completed = bookings.filter((b) => b.status === "COMPLETED" || b.status === "PAID").length;
          const pct = Math.round((completed / bookings.length) * 100);
          setCompletionPercentage(pct);
        }
      } catch {
        /* Fallback */
      }
    }
    loadWidgetData();
  }, []);

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
      {/* 1. Team Collaboration Roster */}
      <div className="md:col-span-2 lg:col-span-5 rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-3.5 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-slate-100">
            Technician Staff Roster
          </h3>
        </div>

        <div className="space-y-3">
          {members.length === 0 ? (
            <p className="text-xs text-stone-400 dark:text-slate-400 font-medium py-6 text-center">
              No technician staff registered in database yet.
            </p>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between gap-2 group rounded-2xl p-1.5 transition-colors hover:bg-stone-50 dark:hover:bg-slate-800/80"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl object-cover shadow-2xs ring-2 ring-stone-100 dark:ring-slate-700 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-stone-900 dark:text-slate-100 truncate">
                      {member.name}
                    </h4>
                    <p className="text-[10px] font-medium text-stone-400 dark:text-slate-400 truncate max-w-[160px] sm:max-w-[240px]">
                      {member.role}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full border px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold ${member.statusColor}`}
                >
                  {member.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. Project Progress Semi-Circle Gauge */}
      <div className="md:col-span-1 lg:col-span-4 rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
        <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-slate-100">Service Completion Rate</h3>

        {/* Clean, Mathematically Precise Semi Circle Gauge SVG */}
        <div className="relative my-3 sm:my-4 flex flex-col items-center justify-center">
          <svg className="w-48 sm:w-52 h-28 sm:h-32" viewBox="0 0 200 115">
            {/* Base Background Arc */}
            <path
              d="M 25 100 A 75 75 0 0 1 175 100"
              fill="none"
              className="stroke-[#EAE8E4] dark:stroke-slate-800"
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* Dynamic Progress Arc */}
            <path
              d="M 25 100 A 75 75 0 0 1 175 100"
              fill="none"
              className="stroke-[#18181B] dark:stroke-amber-400"
              strokeWidth="18"
              strokeLinecap="round"
              strokeDasharray={`${(completionPercentage / 100) * 236} 236`}
            />
          </svg>

          <div className="absolute top-12 sm:top-14 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-slate-100 tracking-tight">
              {completionPercentage}%
            </span>
            <span className="block text-[10px] sm:text-[11px] font-medium text-stone-400 dark:text-slate-400">
              Completed Ratio
            </span>
          </div>
        </div>

        {/* Legends at bottom */}
        <div className="flex items-center justify-around text-[10px] font-bold text-stone-600 dark:text-slate-300 border-t border-stone-100 dark:border-slate-800 pt-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-stone-900 dark:bg-amber-400" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span>Active</span>
          </div>
        </div>
      </div>

      {/* 3. Time Tracker Widget */}
      <div className="md:col-span-1 lg:col-span-3 relative overflow-hidden rounded-3xl bg-stone-900 dark:bg-slate-900 border border-stone-800 dark:border-slate-800 p-4 sm:p-5 text-white shadow-md flex flex-col justify-between min-h-[180px]">
        <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-amber-500/20 blur-2xl" />

        <div className="relative z-10">
          <h3 className="text-xs font-semibold text-stone-400 dark:text-slate-400">Shift Tracker</h3>
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
            aria-label={isRunning ? "Pause timer" : "Start timer"}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-stone-900 dark:text-slate-100 shadow-md transition-all hover:bg-stone-200 dark:hover:bg-slate-700 active:scale-90 cursor-pointer"
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
            aria-label="Stop timer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-white shadow-md transition-all hover:bg-rose-600 active:scale-90 cursor-pointer"
          >
            <Square className="h-4 w-4 fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
