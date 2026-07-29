"use client";

import { useState } from "react";
import { Search, Calendar, Filter, Download, Plus, Clock, CheckCircle2, AlertCircle, Eye, UserCheck } from "lucide-react";
import { CreateBookingModal } from "@/components/dashboard/modals/create-booking-modal";

const MOCK_BOOKINGS = [
  {
    id: "BK-9021",
    customer: "Sarah Williams",
    email: "sarah.w@example.com",
    service: "Emergency Plumbing Pipe Leak",
    technician: "Robert Chen",
    scheduledDate: "Nov 26, 2026",
    timeSlot: "10:00 AM - 12:00 PM",
    amount: "$120.00",
    status: "IN_PROGRESS",
  },
  {
    id: "BK-9020",
    customer: "Michael Scott",
    email: "m.scott@dunder.com",
    service: "Central AC Coil Replacement",
    technician: "Alex Turner",
    scheduledDate: "Nov 25, 2026",
    timeSlot: "02:00 PM - 04:00 PM",
    amount: "$180.00",
    status: "ACCEPTED",
  },
  {
    id: "BK-9019",
    customer: "Emily Watson",
    email: "emily.w@example.com",
    service: "Electrical Panel Safety Check",
    technician: "Marcus Vance",
    scheduledDate: "Nov 24, 2026",
    timeSlot: "09:00 AM - 11:00 AM",
    amount: "$150.00",
    status: "COMPLETED",
  },
  {
    id: "BK-9018",
    customer: "David Miller",
    email: "dmiller@example.com",
    service: "Dishwasher Installation",
    technician: "Unassigned",
    scheduledDate: "Nov 27, 2026",
    timeSlot: "01:00 PM - 03:00 PM",
    amount: "$95.00",
    status: "REQUESTED",
  },
  {
    id: "BK-9017",
    customer: "Jennifer Lopez",
    email: "jlo@example.com",
    service: "Water Heater Inspection",
    technician: "Robert Chen",
    scheduledDate: "Nov 22, 2026",
    timeSlot: "11:00 AM - 01:00 PM",
    amount: "$140.00",
    status: "CANCELLED",
  },
];

export default function AdminBookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredBookings = MOCK_BOOKINGS.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.technician.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-100"><CheckCircle2 className="h-3 w-3" /> Completed</span>;
      case "IN_PROGRESS":
        return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 border border-amber-100"><Clock className="h-3 w-3" /> In Progress</span>;
      case "ACCEPTED":
        return <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700 border border-blue-100"><UserCheck className="h-3 w-3" /> Accepted</span>;
      case "REQUESTED":
        return <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-bold text-stone-700 border border-stone-200"><AlertCircle className="h-3 w-3" /> Pending Dispatch</span>;
      case "CANCELLED":
        return <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-700 border border-rose-100">Cancelled</span>;
      default:
        return <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-bold text-stone-600">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
            Bookings & Dispatches
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
            Monitor live customer service requests, status updates, and technician assignments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 rounded-2xl bg-stone-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-stone-800 cursor-pointer"
          >
            <Plus className="h-4 w-4 text-amber-400" />
            <span>Create Booking</span>
          </button>
          <button className="flex items-center gap-1.5 rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-bold text-stone-700 shadow-xs transition hover:bg-stone-50">
            <Download className="h-4 w-4 text-stone-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-3xl border border-stone-200/80 bg-white p-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by ID, customer name, service..."
            className="w-full rounded-2xl border border-stone-200/80 bg-stone-50 py-2 pl-10 pr-4 text-xs font-medium text-stone-900 placeholder:text-stone-400 outline-none focus:border-amber-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {["ALL", "REQUESTED", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-2xl px-3 py-1.5 text-xs font-bold transition-all shrink-0 ${
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

      {/* Table Container */}
      <div className="rounded-3xl border border-stone-200/80 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-extrabold text-[10px] border-b border-stone-200/80">
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
            <tbody className="divide-y divide-stone-100 font-medium text-stone-900">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{b.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-stone-900">{b.customer}</div>
                    <div className="text-[10px] text-stone-400">{b.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-stone-900">{b.service}</td>
                  <td className="py-3.5 px-4">
                    <span className={b.technician === "Unassigned" ? "text-rose-600 font-bold" : "text-stone-700 font-semibold"}>
                      {b.technician}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-500">
                    <div>{b.scheduledDate}</div>
                    <div className="text-[10px] text-stone-400">{b.timeSlot}</div>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-stone-900">{b.amount}</td>
                  <td className="py-3.5 px-4">{getStatusBadge(b.status)}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="rounded-xl border border-stone-200 bg-white p-1.5 text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Booking Modal */}
      <CreateBookingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
