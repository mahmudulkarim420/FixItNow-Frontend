"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, Calendar, Clock, MapPin, Phone, Star, Eye } from "lucide-react";

const MOCK_CUSTOMER_BOOKINGS = [
  {
    id: "BK-9021",
    service: "AC Repair & Coil Servicing",
    techName: "Alex Turner",
    techPhone: "+1 (555) 019-2831",
    techAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    scheduledDate: "Today, Nov 29, 2026",
    timeSlot: "02:30 PM - 04:30 PM",
    amount: "$180.00",
    status: "IN_PROGRESS",
  },
  {
    id: "BK-9020",
    service: "Emergency Plumbing Pipe Leak",
    techName: "Robert Chen",
    techPhone: "+1 (555) 234-5678",
    techAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    scheduledDate: "Tomorrow, Nov 30, 2026",
    timeSlot: "10:00 AM - 12:00 PM",
    amount: "$120.00",
    status: "SCHEDULED",
  },
  {
    id: "BK-9019",
    service: "Electrical Panel Safety Check",
    techName: "Marcus Vance",
    techPhone: "+1 (555) 345-6789",
    techAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    scheduledDate: "Jul 24, 2026",
    timeSlot: "09:00 AM - 11:00 AM",
    amount: "$150.00",
    status: "COMPLETED",
  },
  {
    id: "BK-9018",
    service: "Dishwasher Inspection",
    techName: "David Miller",
    techPhone: "+1 (555) 987-6543",
    techAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    scheduledDate: "Jul 18, 2026",
    timeSlot: "01:00 PM - 03:00 PM",
    amount: "$95.00",
    status: "COMPLETED",
  },
];

export default function CustomerBookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredBookings = MOCK_CUSTOMER_BOOKINGS.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.techName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 border border-amber-100 animate-pulse">In Progress</span>;
      case "SCHEDULED":
        return <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700 border border-blue-100">Scheduled</span>;
      case "COMPLETED":
        return <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-100">Completed</span>;
      default:
        return <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-bold text-stone-600">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
            My Bookings & Dispatches
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
            Track active technician arrival times, view repair history, and request new services.
          </p>
        </div>

        <Link
          href="/services"
          className="flex items-center gap-1.5 rounded-2xl bg-stone-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-stone-800 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 text-amber-400" />
          <span>Book New Repair</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-3xl border border-stone-200/80 bg-white p-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search booking ID, service title, technician..."
            className="w-full rounded-2xl border border-stone-200/80 bg-stone-50 py-2 pl-10 pr-4 text-xs font-medium text-stone-900 placeholder:text-stone-400 outline-none focus:border-amber-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "IN_PROGRESS", "SCHEDULED", "COMPLETED"].map((status) => (
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

      {/* Bookings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filteredBookings.map((b) => (
          <div
            key={b.id}
            className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-bold text-xs text-stone-400">{b.id}</span>
                {getStatusBadge(b.status)}
              </div>

              <h3 className="text-base font-bold text-stone-900 leading-snug">{b.service}</h3>

              <div className="mt-3 flex items-center gap-3 p-2.5 rounded-2xl bg-stone-50 border border-stone-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.techAvatar}
                  alt={b.techName}
                  className="h-8 w-8 rounded-xl object-cover ring-1 ring-stone-200"
                />
                <div>
                  <span className="block text-xs font-bold text-stone-900">{b.techName}</span>
                  <span className="block text-[10px] text-stone-400 font-medium">Assigned Field Tech</span>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-xs text-stone-500 font-medium">
                <p className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                  <span>{b.scheduledDate}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                  <span>{b.timeSlot}</span>
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-base font-extrabold text-stone-900">{b.amount}</span>

              <div className="flex items-center gap-2">
                {b.status === "COMPLETED" ? (
                  <button className="flex items-center gap-1 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    <span>Leave Review</span>
                  </button>
                ) : (
                  <button className="flex items-center gap-1 rounded-xl bg-stone-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-stone-800 transition-colors">
                    <Phone className="h-3.5 w-3.5 text-amber-400" />
                    <span>Call Tech</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
