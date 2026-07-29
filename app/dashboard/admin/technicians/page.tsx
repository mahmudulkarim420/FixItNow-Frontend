"use client";

import { useState } from "react";
import { Search, ShieldCheck, Star, Wrench, UserCheck, AlertTriangle, MoreVertical } from "lucide-react";

const MOCK_TECHS = [
  {
    id: "TECH-101",
    name: "Alex Turner",
    email: "alex.t@fixitnow.com",
    skills: ["HVAC", "AC Repair", "Duct Cleaning"],
    experience: "6 Years",
    hourlyRate: "$55.00/hr",
    rating: "4.9 ★ (142 jobs)",
    isVerified: true,
    status: "ACTIVE",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "TECH-102",
    name: "Robert Chen",
    email: "robert.c@fixitnow.com",
    skills: ["Plumbing", "Pipe Sealing", "Water Heaters"],
    experience: "8 Years",
    hourlyRate: "$60.00/hr",
    rating: "4.8 ★ (98 jobs)",
    isVerified: true,
    status: "ACTIVE",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "TECH-103",
    name: "Marcus Vance",
    email: "marcus.v@fixitnow.com",
    skills: ["Electrical", "Breaker Panel", "Wiring"],
    experience: "5 Years",
    hourlyRate: "$50.00/hr",
    rating: "5.0 ★ (210 jobs)",
    isVerified: true,
    status: "ACTIVE",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "TECH-104",
    name: "David Miller",
    email: "david.m@fixitnow.com",
    skills: ["Appliance", "Dishwashers", "Refrigerators"],
    experience: "3 Years",
    hourlyRate: "$45.00/hr",
    rating: "4.6 ★ (24 jobs)",
    isVerified: false,
    status: "PENDING_VERIFICATION",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  },
];

export default function AdminTechniciansPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTechs = MOCK_TECHS.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
            Technicians & Field Staff
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
            Verify technician skill profiles, monitor job completion ratings, and manage dispatches.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 rounded-3xl border border-stone-200/80 bg-white p-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search technician name, email..."
            className="w-full rounded-2xl border border-stone-200/80 bg-stone-50 py-2 pl-10 pr-4 text-xs font-medium text-stone-900 placeholder:text-stone-400 outline-none focus:border-amber-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Technician Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filteredTechs.map((tech) => (
          <div
            key={tech.id}
            className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tech.avatar}
                    alt={tech.name}
                    className="h-12 w-12 rounded-2xl object-cover ring-2 ring-stone-100 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-bold text-stone-900">{tech.name}</h3>
                      {tech.isVerified ? (
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                    <p className="text-xs text-stone-400 font-medium">{tech.email}</p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    tech.isVerified
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-amber-50 text-amber-700 border border-amber-100"
                  }`}
                >
                  {tech.isVerified ? "Verified Pro" : "Pending Verify"}
                </span>
              </div>

              {/* Skills Tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {tech.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-bold text-stone-700"
                  >
                    🔧 {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-stone-900">{tech.hourlyRate}</span>
                <span className="block text-[10px] font-semibold text-amber-600">{tech.rating}</span>
              </div>

              <div className="flex items-center gap-2">
                {!tech.isVerified && (
                  <button className="rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-stone-950 shadow-xs hover:bg-amber-400 transition-colors">
                    Verify Pro
                  </button>
                )}
                <button className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
