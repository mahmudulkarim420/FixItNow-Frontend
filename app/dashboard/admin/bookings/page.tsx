"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Download,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  UserCheck,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from "lucide-react";
import { CreateBookingModal } from "@/components/dashboard/customer/modals/create-booking-modal";
import { ViewBookingModal } from "@/components/dashboard/admin/modals/view-booking-modal";
import { getAdminBookings } from "@/lib/admin-api";
import type { Booking } from "@/types";

const MOCK_BOOKINGS: Booking[] = [
  {
    id: "BK-9021",
    customerId: "usr-1",
    serviceId: "srv-1",
    servicePrice: 120.0,
    contactNumber: "+1234567890",
    scheduledDate: "2026-11-26",
    timeSlot: "10:00 AM - 12:00 PM",
    status: "IN_PROGRESS",
    createdAt: "2026-11-20T00:00:00.000Z",
    updatedAt: "2026-11-20T00:00:00.000Z",
    customer: { name: "Sarah Williams", email: "sarah.w@example.com" },
    service: { id: "srv-1", title: "Emergency Plumbing Pipe Leak", description: "", price: 120, categoryId: "c1", createdAt: "", updatedAt: "" },
    technicianProfile: { id: "t1", user: { name: "Robert Chen" } },
  },
  {
    id: "BK-9020",
    customerId: "usr-2",
    serviceId: "srv-2",
    servicePrice: 180.0,
    contactNumber: "+1234567891",
    scheduledDate: "2026-11-25",
    timeSlot: "02:00 PM - 04:00 PM",
    status: "ACCEPTED",
    createdAt: "2026-11-19T00:00:00.000Z",
    updatedAt: "2026-11-19T00:00:00.000Z",
    customer: { name: "Michael Scott", email: "m.scott@dunder.com" },
    service: { id: "srv-2", title: "Central AC Coil Replacement", description: "", price: 180, categoryId: "c2", createdAt: "", updatedAt: "" },
    technicianProfile: { id: "t2", user: { name: "Alex Turner" } },
  },
  {
    id: "BK-9019",
    customerId: "usr-3",
    serviceId: "srv-3",
    servicePrice: 150.0,
    contactNumber: "+1234567892",
    scheduledDate: "2026-11-24",
    timeSlot: "09:00 AM - 11:00 AM",
    status: "COMPLETED",
    createdAt: "2026-11-18T00:00:00.000Z",
    updatedAt: "2026-11-18T00:00:00.000Z",
    customer: { name: "Emily Watson", email: "emily.w@example.com" },
    service: { id: "srv-3", title: "Electrical Panel Safety Check", description: "", price: 150, categoryId: "c3", createdAt: "", updatedAt: "" },
    technicianProfile: { id: "t3", user: { name: "Marcus Vance" } },
  },
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await getAdminBookings();
      if (data && data.length > 0) {
        setBookings(data);
      } else {
        setBookings(MOCK_BOOKINGS);
      }
    } catch {
      setBookings(MOCK_BOOKINGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const custName = b.customer?.name || "Customer";
    const serviceTitle = b.service?.title || "Repair Service";
    const techName = b.technicianProfile?.user?.name || "Unassigned";

    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      custName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      techName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "PAID":
        return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800"><CheckCircle2 className="h-3 w-3" /> Completed</span>;
      case "IN_PROGRESS":
        return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-800"><Clock className="h-3 w-3" /> In Progress</span>;
      case "ACCEPTED":
        return <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 text-[10px] font-bold text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800"><UserCheck className="h-3 w-3" /> Accepted</span>;
      case "REQUESTED":
        return <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-bold text-stone-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700"><AlertCircle className="h-3 w-3" /> Pending</span>;
      case "CANCELLED":
      case "DECLINED":
        return <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 text-[10px] font-bold text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-800">Cancelled</span>;
      default:
        return <span className="rounded-full bg-stone-100 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-bold text-stone-600 dark:text-slate-300">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 text-stone-900 dark:text-slate-100">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-slate-100">
            Bookings & Dispatches
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500 dark:text-slate-400">
            Monitor live customer service requests, status updates, and technician assignments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 rounded-2xl bg-stone-900 dark:bg-amber-500 dark:text-slate-950 px-4 py-2.5 text-xs font-bold text-white shadow-2xs transition hover:bg-stone-800 dark:hover:bg-amber-400 cursor-pointer"
          >
            <Plus className="h-4 w-4 text-amber-400 dark:text-slate-950" />
            <span>Create Booking</span>
          </button>
          <button className="flex items-center gap-1.5 rounded-2xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-stone-700 dark:text-slate-200 shadow-2xs transition hover:bg-stone-50 dark:hover:bg-slate-700 cursor-pointer">
            <Download className="h-4 w-4 text-stone-500 dark:text-slate-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-2xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by ID, customer name, service..."
            className="w-full rounded-2xl border border-stone-200/80 dark:border-slate-800 bg-stone-50 dark:bg-slate-800 py-2 pl-10 pr-4 text-xs font-medium text-stone-900 dark:text-slate-100 placeholder:text-stone-400 dark:placeholder:text-slate-500 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {["ALL", "REQUESTED", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-2xl px-3 py-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer ${
                statusFilter === status
                  ? "bg-amber-500 text-stone-950 shadow-2xs"
                  : "bg-stone-50 dark:bg-slate-800 text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-700"
              }`}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-2 text-stone-500 dark:text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
            <span className="text-xs font-bold">Loading platform bookings...</span>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center gap-2 text-stone-400 dark:text-slate-500 text-center">
            <Inbox className="h-10 w-10 text-stone-300 dark:text-slate-600 stroke-[1.5]" />
            <h3 className="text-sm font-bold text-stone-700 dark:text-slate-300">No Bookings Found</h3>
            <p className="text-xs text-stone-400 dark:text-slate-500 max-w-sm">
              {searchTerm || statusFilter !== "ALL"
                ? "No bookings match your filter criteria."
                : "No platform bookings registered yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-slate-800/80 text-stone-500 dark:text-slate-400 uppercase tracking-wider font-extrabold text-[10px] border-b border-stone-200/80 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Booking ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Technician</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-slate-800 font-medium text-stone-900 dark:text-slate-100">
                {paginatedBookings.map((b) => {
                  const techName = b.technicianProfile?.user?.name || "Unassigned";
                  return (
                    <tr key={b.id} className="hover:bg-stone-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900 dark:text-slate-100 truncate max-w-[120px]">{b.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900 dark:text-slate-100">{b.customer?.name || "Customer"}</div>
                        <div className="text-[10px] text-stone-400 dark:text-slate-500">{b.customer?.email || b.contactNumber}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-stone-900 dark:text-slate-100">{b.service?.title || "Repair Service"}</td>
                      <td className="py-3.5 px-4">
                        <span className={techName === "Unassigned" ? "text-rose-600 dark:text-rose-400 font-bold" : "text-stone-700 dark:text-slate-300 font-semibold"}>
                          {techName}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-500 dark:text-slate-400">
                        <div>{b.scheduledDate}</div>
                        <div className="text-[10px] text-stone-400 dark:text-slate-500">{b.timeSlot}</div>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-stone-900 dark:text-slate-100">${b.servicePrice}</td>
                      <td className="py-3.5 px-4">{getStatusBadge(b.status)}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-700 hover:text-stone-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls Footer */}
      {!loading && filteredBookings.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xs text-stone-900 dark:text-slate-100">
          <span className="text-xs font-semibold text-stone-500 dark:text-slate-400">
            Showing <span className="font-extrabold text-stone-900 dark:text-slate-100">{startIndex + 1}</span>–
            <span className="font-extrabold text-stone-900 dark:text-slate-100">
              {Math.min(startIndex + itemsPerPage, filteredBookings.length)}
            </span>{" "}
            of <span className="font-extrabold text-stone-900 dark:text-slate-100">{filteredBookings.length}</span> bookings
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-2xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-600 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer transition-colors"
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
                      ? "bg-amber-500 text-stone-950 shadow-2xs"
                      : "bg-stone-50 dark:bg-slate-800 text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-2xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-600 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Create Booking Modal */}
      <CreateBookingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadBookings}
      />

      {/* View Booking Detail Modal */}
      <ViewBookingModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
}
