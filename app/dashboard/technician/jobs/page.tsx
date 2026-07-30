"use client";

import { useEffect, useState } from "react";
import { Search, Briefcase, Clock, Phone, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { getTechnicianBookings, updateTechnicianBookingStatus } from "@/lib/technician-api";
import type { Booking, BookingStatus } from "@/types";

export default function TechnicianJobsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await getTechnicianBookings();
      setBookings(data);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    try {
      setUpdatingId(id);
      await updateTechnicianBookingStatus(id, newStatus);
      await fetchJobs();
    } catch {
      /* Refresh on error */
      await fetchJobs();
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredJobs = bookings.filter((j) => {
    const serviceTitle = j.service?.title || "Service Job";
    const customerName = j.customer?.name || "Customer";
    const contact = j.contactNumber || "";

    const matchesSearch =
      j.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination bounds
  const totalItems = filteredJobs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "REQUESTED":
        return <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-bold text-purple-700 border border-purple-100">Requested</span>;
      case "ACCEPTED":
        return <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700 border border-blue-100">Accepted</span>;
      case "IN_PROGRESS":
        return <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 border border-amber-100">In Progress</span>;
      case "COMPLETED":
        return <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-100">Completed</span>;
      case "DECLINED":
      case "CANCELLED":
        return <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-700 border border-rose-100">{status}</span>;
      default:
        return <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-bold text-stone-600">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
          My Active Jobs & Dispatches
        </h1>
        <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
          View assigned service jobs, navigate customer locations, and manage job statuses in real-time.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-3xl border border-stone-200/80 bg-white p-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search job ID, service, customer name..."
            className="w-full rounded-2xl border border-stone-200/80 bg-stone-50 py-2 pl-10 pr-4 text-xs font-medium text-stone-900 placeholder:text-stone-400 outline-none focus:border-amber-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {["ALL", "REQUESTED", "ACCEPTED", "IN_PROGRESS", "COMPLETED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-2xl px-3 py-1.5 text-xs font-bold transition-all ${
                statusFilter === status
                  ? "bg-amber-500 text-stone-950 shadow-xs"
                  : "bg-stone-50 text-stone-600 hover:bg-stone-100"
              }`}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center gap-2 text-stone-500 bg-white rounded-3xl border border-stone-200/80">
          <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
          <span className="text-xs font-bold">Loading active dispatches...</span>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center gap-2 text-stone-400 bg-white rounded-3xl border border-stone-200/80 text-center">
          <Briefcase className="h-10 w-10 text-stone-300 stroke-[1.5]" />
          <h3 className="text-sm font-bold text-stone-700">No Service Jobs Found</h3>
          <p className="text-xs text-stone-400 max-w-sm">
            {searchTerm || statusFilter !== "ALL"
              ? "No job dispatches match your search filters."
              : "No customer service bookings have been assigned to your technician account yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Jobs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {paginatedJobs.map((job) => {
              const isUpdating = updatingId === job.id;
              return (
                <div
                  key={job.id}
                  className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono font-bold text-xs text-stone-400">{job.id.slice(0, 8)}</span>
                      {getStatusBadge(job.status)}
                    </div>

                    <h3 className="text-base font-bold text-stone-900 leading-snug">
                      {job.service?.title || "Service Request"}
                    </h3>

                    <div className="mt-3 space-y-1.5 text-xs text-stone-500 font-medium">
                      <p className="flex items-center gap-2">
                        <span className="font-bold text-stone-900">{job.customer?.name || "Customer"}</span> • {job.contactNumber || "N/A"}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                        <span>{job.scheduledDate} ({job.timeSlot})</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-base font-extrabold text-stone-900">${job.servicePrice}</span>

                    <div className="flex items-center gap-2">
                      {job.status === "REQUESTED" && (
                        <button
                          onClick={() => handleStatusChange(job.id, "ACCEPTED")}
                          disabled={isUpdating}
                          className="flex items-center gap-1 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-stone-950 shadow-xs hover:bg-amber-400 transition-colors disabled:opacity-50"
                        >
                          {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Accept Job"}
                        </button>
                      )}

                      {job.status === "ACCEPTED" && (
                        <button
                          onClick={() => handleStatusChange(job.id, "IN_PROGRESS")}
                          disabled={isUpdating}
                          className="flex items-center gap-1 rounded-xl bg-stone-900 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-stone-800 transition-colors disabled:opacity-50"
                        >
                          {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Start Job"}
                        </button>
                      )}

                      {job.status === "IN_PROGRESS" && (
                        <button
                          onClick={() => handleStatusChange(job.id, "COMPLETED")}
                          disabled={isUpdating}
                          className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 transition-colors disabled:opacity-50"
                        >
                          {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Complete Job"}
                        </button>
                      )}

                      <a
                        href={`tel:${job.contactNumber}`}
                        className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls Bar */}
          {totalItems > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-stone-200/80 bg-white p-4 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-stone-500">
                  Showing <span className="font-bold text-stone-900">{startIndex + 1}</span> to{" "}
                  <span className="font-bold text-stone-900">{endIndex}</span> of{" "}
                  <span className="font-bold text-stone-900">{totalItems}</span> dispatches
                </span>

                <div className="flex items-center gap-1.5 pl-2 border-l border-stone-200">
                  <span className="text-[11px] font-bold text-stone-400">Per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="rounded-xl border border-stone-200 bg-stone-50 px-2 py-1 text-xs font-bold text-stone-800 outline-none focus:border-amber-500"
                  >
                    <option value={2}>2</option>
                    <option value={4}>4</option>
                    <option value={6}>6</option>
                    <option value={10}>10</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 rounded-2xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:hover:bg-stone-50 transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-8 w-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 rounded-2xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:hover:bg-stone-50 transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}



