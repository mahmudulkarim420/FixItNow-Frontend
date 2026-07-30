"use client";

import { useEffect, useState } from "react";
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Filter,
  ChevronLeft,
  ChevronRight,
  UserX,
} from "lucide-react";
import { getAdminUsers } from "@/lib/admin-api";
import type { User } from "@/types";

interface TechItem {
  id: string;
  name: string;
  email: string;
  skills: string[];
  hourlyRate: string;
  rating: string;
  isVerified: boolean;
  avatar: string;
}

const MOCK_TECHS: TechItem[] = [
  {
    id: "TECH-101",
    name: "Alex Turner",
    email: "alex.t@fixitnow.com",
    skills: ["HVAC", "AC Repair", "Duct Cleaning"],
    hourlyRate: "$55.00/hr",
    rating: "4.9 ★ (142 jobs)",
    isVerified: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "TECH-102",
    name: "Robert Chen",
    email: "robert.c@fixitnow.com",
    skills: ["Plumbing", "Pipe Sealing", "Water Heaters"],
    hourlyRate: "$60.00/hr",
    rating: "4.8 ★ (98 jobs)",
    isVerified: true,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "TECH-103",
    name: "Marcus Vance",
    email: "marcus.v@fixitnow.com",
    skills: ["Electrical", "Breaker Panel", "Wiring"],
    hourlyRate: "$50.00/hr",
    rating: "5.0 ★ (210 jobs)",
    isVerified: true,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "TECH-104",
    name: "David Oshodi",
    email: "david.o@fixitnow.com",
    skills: ["General Care", "Carpentry", "Painting"],
    hourlyRate: "$45.00/hr",
    rating: "4.7 ★ (45 jobs)",
    isVerified: false,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  },
];

export default function AdminTechniciansPage() {
  const [techs, setTechs] = useState<TechItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [verifyFilter, setVerifyFilter] = useState<"ALL" | "VERIFIED" | "PENDING">("ALL");
  const [skillFilter, setSkillFilter] = useState("ALL");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    async function loadTechnicians() {
      try {
        setLoading(true);
        const users = await getAdminUsers();
        const techUsers = users.filter((u) => u.role === "TECHNICIAN");

        if (techUsers.length > 0) {
          setTechs(
            techUsers.map((u, i) => ({
              id: u.id,
              name: u.name,
              email: u.email,
              skills: i % 2 === 0 ? ["HVAC", "Plumbing"] : ["Electrical", "General Maintenance"],
              hourlyRate: "$50.00/hr",
              rating: "4.9 ★ (Certified)",
              isVerified: u.status === "ACTIVE",
              avatar:
                u.avatar ||
                `https://images.unsplash.com/photo-${
                  1507003211169 + i * 10
                }?w=100&auto=format&fit=crop&q=80`,
            }))
          );
        } else {
          setTechs(MOCK_TECHS);
        }
      } catch {
        setTechs(MOCK_TECHS);
      } finally {
        setLoading(false);
      }
    }
    loadTechnicians();
  }, []);

  // Filter calculation logic
  const filteredTechs = techs.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesVerify =
      verifyFilter === "ALL" ||
      (verifyFilter === "VERIFIED" && t.isVerified) ||
      (verifyFilter === "PENDING" && !t.isVerified);

    const matchesSkill =
      skillFilter === "ALL" ||
      t.skills.some((s) => s.toLowerCase().includes(skillFilter.toLowerCase()));

    return matchesSearch && matchesVerify && matchesSkill;
  });

  // Auto-reset page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, verifyFilter, skillFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredTechs.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTechs = filteredTechs.slice(startIndex, startIndex + itemsPerPage);

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

      {/* Filter & Controls Bar */}
      <div className="space-y-3 rounded-3xl border border-stone-200/80 bg-white p-4 shadow-xs">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search technician name, email, skill..."
              className="w-full rounded-2xl border border-stone-200/80 bg-stone-50 py-2 pl-10 pr-4 text-xs font-medium text-stone-900 placeholder:text-stone-400 outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Verification & Skill Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-stone-100">
          {/* Verification Filter Pills */}
          <div className="flex items-center gap-1.5 py-1">
            <span className="text-[11px] font-bold text-stone-400 flex items-center gap-1 mr-1">
              <Filter className="h-3 w-3 text-amber-500" /> Status:
            </span>
            {(["ALL", "VERIFIED", "PENDING"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVerifyFilter(v)}
                className={`rounded-2xl px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                  verifyFilter === v
                    ? "bg-amber-500 text-stone-950 shadow-xs"
                    : "bg-stone-50 text-stone-600 hover:bg-stone-100"
                }`}
              >
                {v === "ALL" ? "All Staff" : v === "VERIFIED" ? "Verified Pros" : "Pending Verify"}
              </button>
            ))}
          </div>

          {/* Skill Specialty Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] font-bold text-stone-400 mr-1">Skill:</span>
            {["ALL", "HVAC", "Plumbing", "Electrical"].map((skill) => (
              <button
                key={skill}
                onClick={() => setSkillFilter(skill)}
                className={`rounded-2xl px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                  skillFilter === skill
                    ? "bg-stone-900 text-amber-400 shadow-xs"
                    : "bg-stone-50 text-stone-600 hover:bg-stone-100"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center gap-2 text-stone-500 bg-white rounded-3xl border border-stone-200/80">
          <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
          <span className="text-xs font-bold">Loading technician roster...</span>
        </div>
      ) : filteredTechs.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center gap-2 text-stone-400 bg-white rounded-3xl border border-stone-200/80 text-center">
          <UserX className="h-10 w-10 text-stone-300 stroke-[1.5]" />
          <h3 className="text-sm font-bold text-stone-700">No Technicians Found</h3>
          <p className="text-xs text-stone-400 max-w-sm">
            {searchTerm || verifyFilter !== "ALL" || skillFilter !== "ALL"
              ? "No technicians match your filter criteria."
              : "No technicians registered in database yet."}
          </p>
        </div>
      ) : (
        <>
          {/* Technician Roster Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {paginatedTechs.map((tech) => (
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

                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-end text-right">
                  <div>
                    <span className="text-xs font-extrabold text-stone-900 block">{tech.hourlyRate}</span>
                    <span className="block text-[10px] font-semibold text-amber-600">{tech.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-3xl border border-stone-200/80 bg-white p-4 shadow-xs">
            <span className="text-xs font-semibold text-stone-500">
              Showing <span className="font-extrabold text-stone-900">{startIndex + 1}</span>–
              <span className="font-extrabold text-stone-900">
                {Math.min(startIndex + itemsPerPage, filteredTechs.length)}
              </span>{" "}
              of <span className="font-extrabold text-stone-900">{filteredTechs.length}</span> technicians
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="flex h-9 w-9 items-center justify-center rounded-2xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 cursor-pointer transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-9 w-9 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-amber-500 text-stone-950 shadow-xs"
                        : "bg-stone-50 text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-2xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 cursor-pointer transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
