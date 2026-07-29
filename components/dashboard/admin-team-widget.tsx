"use client";

import { useState, useEffect } from "react";
import { Plus, Pause, Play, Square } from "lucide-react";

const TEAM_MEMBERS = [
  {
    id: "1",
    name: "Alexandra Deff",
    role: "Working on Github Project Repository",
    status: "Completed",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    name: "Edwin Adenike",
    role: "Working on Integrate User Authentication System",
    status: "In Progress",
    statusColor: "bg-amber-50 text-amber-700 border-amber-100",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    name: "Isaac Oluwatemilorun",
    role: "Working on Develop Search and Filter Functionality",
    status: "Pending",
    statusColor: "bg-rose-50 text-rose-700 border-rose-100",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "4",
    name: "David Oshodi",
    role: "Working on Responsive Layout for Homepage",
    status: "In Progress",
    statusColor: "bg-amber-50 text-amber-700 border-amber-100",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
  },
];

export function AdminTeamWidget() {
  const [seconds, setSeconds] = useState(5048); // 01:24:08 in seconds
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
      {/* 1. Team Collaboration Roster */}
      <div className="md:col-span-2 lg:col-span-5 rounded-3xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3.5 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-bold text-stone-900">
            Team Collaboration
          </h3>
          <button
            type="button"
            className="flex items-center gap-1 rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-bold text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <Plus className="h-3 w-3" />
            <span>Add Member</span>
          </button>
        </div>

        <div className="space-y-3">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between gap-2 group rounded-2xl p-1.5 transition-colors hover:bg-stone-50"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl object-cover shadow-xs ring-2 ring-stone-100 shrink-0"
                />
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-stone-900 truncate">
                    {member.name}
                  </h4>
                  <p className="text-[10px] font-medium text-stone-400 truncate max-w-[160px] sm:max-w-[240px]">
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
          ))}
        </div>
      </div>

      {/* 2. Project Progress Semi-Circle Gauge */}
      <div className="md:col-span-1 lg:col-span-4 rounded-3xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-xs flex flex-col justify-between">
        <h3 className="text-xs sm:text-sm font-bold text-stone-900">Project Progress</h3>

        {/* Clean, Mathematically Precise Semi Circle Gauge SVG */}
        <div className="relative my-3 sm:my-4 flex flex-col items-center justify-center">
          <svg className="w-48 sm:w-52 h-28 sm:h-32" viewBox="0 0 200 115">
            {/* Base Background Arc (Pending - 100% of arc) */}
            <path
              d="M 25 100 A 75 75 0 0 1 175 100"
              fill="none"
              stroke="#EAE8E4"
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* In Progress Arc (Amber - 70% of arc) */}
            <path
              d="M 25 100 A 75 75 0 0 1 175 100"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="18"
              strokeLinecap="round"
              strokeDasharray="165 236"
            />
            {/* Completed Arc (Dark Stone - 41% of arc) */}
            <path
              d="M 25 100 A 75 75 0 0 1 175 100"
              fill="none"
              stroke="#18181B"
              strokeWidth="18"
              strokeLinecap="round"
              strokeDasharray="96.6 236"
            />
          </svg>

          <div className="absolute top-12 sm:top-14 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              41%
            </span>
            <span className="block text-[10px] sm:text-[11px] font-medium text-stone-400">
              Project Ended
            </span>
          </div>
        </div>

        {/* Legends at bottom */}
        <div className="flex items-center justify-around text-[10px] font-bold text-stone-600 border-t border-stone-100 pt-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-stone-900" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-stone-300" />
            <span>Pending</span>
          </div>
        </div>
      </div>

      {/* 3. Time Tracker Widget */}
      <div className="md:col-span-1 lg:col-span-3 relative overflow-hidden rounded-3xl bg-stone-900 p-4 sm:p-5 text-white shadow-md flex flex-col justify-between min-h-[180px]">
        <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-amber-500/20 blur-2xl" />

        <div className="relative z-10">
          <h3 className="text-xs font-semibold text-stone-400">Time Tracker</h3>
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
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-stone-900 shadow-md transition-all hover:bg-stone-200 active:scale-90"
          >
            {isRunning ? (
              <Pause className="h-4 w-4 fill-stone-900" />
            ) : (
              <Play className="h-4 w-4 fill-stone-900 ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsRunning(false);
              setSeconds(0);
            }}
            aria-label="Stop timer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-white shadow-md transition-all hover:bg-rose-600 active:scale-90"
          >
            <Square className="h-4 w-4 fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
