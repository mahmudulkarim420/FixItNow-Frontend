"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  UserCheck,
  Briefcase,
  DollarSign,
  MapPin,
  Loader2,
} from "lucide-react";
import {
  getAdminTechnicianApplications,
  reviewAdminTechnicianApplication,
  type TechnicianApplication,
} from "@/lib/admin-api";
import { toast } from "sonner";

export default function AdminTechnicianApplicationsPage() {
  const [applications, setApplications] = useState<TechnicianApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "PENDING" | "APPROVED" | "REJECTED"
  >("ALL");

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminTechnicianApplications();
      setApplications(data || []);
    } catch (err) {
      console.error("Failed to load technician applications:", err);
      toast.error("Could not fetch technician applications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleReview = async (id: string, status: "APPROVED" | "REJECTED") => {
    setUpdatingId(id);
    try {
      const updated = await reviewAdminTechnicianApplication(id, status);
      toast.success(
        status === "APPROVED"
          ? "Technician application APPROVED! User promoted to Technician."
          : "Technician application REJECTED."
      );
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? updated : app))
      );
    } catch (err: any) {
      console.error("Failed to review application:", err);
      toast.error(err.message || "Failed to update application status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesStatus =
      statusFilter === "ALL" || app.approvalStatus === statusFilter;
    const nameStr = app.user?.name || "";
    const emailStr = app.user?.email || "";
    const locStr = app.location || "";
    const skillsStr = (app.skills || []).join(" ");
    const matchesSearch =
      !searchTerm ||
      [nameStr, emailStr, locStr, skillsStr]
        .some((val) => val.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const pendingCount = applications.filter(
    (a) => a.approvalStatus === "PENDING"
  ).length;

  return (
    <div className="space-y-8 text-stone-900 dark:text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 font-bold text-xs uppercase mb-1">
            <UserCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Verification Queue ({pendingCount} Pending)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-slate-100 tracking-tight">
            Technician Applications
          </h1>
          <p className="text-stone-500 dark:text-slate-400 text-xs sm:text-sm">
            Review applicant qualifications and promote approved customers to certified Technicians.
          </p>
        </div>
      </div>

      {/* Search & Status Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search applicant name, email, skills, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-slate-100 placeholder:text-stone-400 dark:placeholder:text-slate-500 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer shrink-0 ${
                statusFilter === st
                  ? "bg-amber-500 text-stone-950 shadow-2xs"
                  : "bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-700"
              }`}
            >
              {st === "ALL"
                ? "All"
                : st === "PENDING"
                ? `Pending (${pendingCount})`
                : st}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List Grid */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-stone-300 dark:border-slate-700 p-12 text-center">
          <UserCheck className="w-10 h-10 text-stone-400 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="font-bold text-stone-800 dark:text-slate-200 text-sm">No Applications Found</h3>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
            {searchTerm || statusFilter !== "ALL"
              ? "No technician applications match your filter criteria."
              : "No customer applications have been submitted yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => {
            const isAppPending = app.approvalStatus === "PENDING";
            const isAppApproved = app.approvalStatus === "APPROVED";
            const isAppRejected = app.approvalStatus === "REJECTED";
            const isBusy = updatingId === app.id;

            return (
              <div
                key={app.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border p-6 transition-all duration-200 shadow-2xs flex flex-col lg:flex-row gap-6 justify-between lg:items-center ${
                  isAppPending
                    ? "border-amber-200/90 dark:border-amber-800/80 bg-amber-50/10 dark:bg-amber-950/20"
                    : isAppApproved
                    ? "border-emerald-200/70 dark:border-emerald-800/80"
                    : "border-stone-200 dark:border-slate-800"
                }`}
              >
                {/* Left: Applicant Details */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-base font-extrabold text-stone-900 dark:text-slate-100">
                      {app.user?.name || "Applicant"}
                    </h3>
                    <span className="text-xs text-stone-500 dark:text-slate-400 font-medium">
                      ({app.user?.email})
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        isAppPending
                          ? "bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                          : isAppApproved
                          ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          : "bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                      }`}
                    >
                      {isAppPending && <Clock className="w-3.5 h-3.5" />}
                      {isAppApproved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                      {isAppRejected && <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />}
                      {app.approvalStatus}
                    </span>
                  </div>

                  {/* Bio */}
                  {app.bio && (
                    <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed font-normal italic bg-stone-50 dark:bg-slate-800/70 p-3 rounded-xl border border-stone-200/60 dark:border-slate-800 max-w-2xl">
                      &ldquo;{app.bio}&rdquo;
                    </p>
                  )}

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      {app.experience} Years Exp.
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ${app.hourlyRate}/hr Requested
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-500 dark:text-slate-400" />
                      {app.location || "N/A"}
                    </span>
                  </div>

                  {/* Skills List */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-bold text-stone-400 dark:text-slate-500 uppercase tracking-wider mr-1">
                      Skills:
                    </span>
                    {app.skills && app.skills.length > 0 ? (
                      app.skills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-slate-200 text-[11px] font-extrabold border border-stone-200 dark:border-slate-700"
                        >
                          {sk}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-stone-400 dark:text-slate-500">None specified</span>
                    )}
                  </div>
                </div>

                {/* Right: Approve / Reject Buttons */}
                <div className="flex items-center gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100 dark:border-slate-800">
                  {isBusy ? (
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-500 dark:text-slate-400">
                      <Loader2 className="w-4 h-4 animate-spin text-amber-600 dark:text-amber-400" />
                      <span>Updating...</span>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleReview(app.id, "APPROVED")}
                        disabled={isAppApproved}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                          isAppApproved
                            ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 cursor-not-allowed opacity-80"
                            : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 shadow-2xs"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isAppApproved ? "Approved" : "Approve & Promote"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReview(app.id, "REJECTED")}
                        disabled={isAppRejected}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                          isAppRejected
                            ? "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 cursor-not-allowed opacity-80"
                            : "bg-stone-100 dark:bg-slate-800 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/30 active:scale-95 border border-stone-200 dark:border-slate-700"
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                        <span>{isAppRejected ? "Rejected" : "Reject"}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
