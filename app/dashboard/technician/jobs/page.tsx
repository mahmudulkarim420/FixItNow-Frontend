"use client";

import { useState } from "react";
import { Search, Briefcase, MapPin, Clock, Phone, Navigation, CheckCircle2 } from "lucide-react";

const MOCK_JOBS = [
  {
    id: "JOB-201",
    service: "Emergency Plumbing Pipe Leak Fix",
    customer: "Robert Chen",
    phone: "+1 (555) 234-5678",
    address: "124 Oak Street, Suite 4B",
    time: "Today, 10:00 AM - 12:00 PM",
    price: "$120.00",
    status: "IN_PROGRESS",
  },
  {
    id: "JOB-202",
    service: "Central AC Coil Replacement",
    customer: "Sarah Jenkins",
    phone: "+1 (555) 876-5432",
    address: "742 Evergreen Terrace",
    time: "Today, 02:30 PM - 04:30 PM",
    price: "$180.00",
    status: "EN_ROUTE",
  },
  {
    id: "JOB-203",
    service: "Electrical Panel Safety Check",
    customer: "Michael Scott",
    phone: "+1 (555) 345-6789",
    address: "1725 Slough Avenue",
    time: "Tomorrow, 09:00 AM - 11:00 AM",
    price: "$150.00",
    status: "SCHEDULED",
  },
  {
    id: "JOB-204",
    service: "Dishwasher Inspection",
    customer: "Emily Watson",
    phone: "+1 (555) 987-6543",
    address: "555 California Street",
    time: "Jul 27, 2026",
    price: "$95.00",
    status: "COMPLETED",
  },
];

export default function TechnicianJobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredJobs = MOCK_JOBS.filter((j) => {
    const matchesSearch =
      j.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 border border-amber-100">In Progress</span>;
      case "EN_ROUTE":
        return <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700 border border-blue-100">En Route</span>;
      case "SCHEDULED":
        return <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-bold text-stone-700 border border-stone-200">Scheduled</span>;
      case "COMPLETED":
        return <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-100">Completed</span>;
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
          View assigned service jobs, navigate customer locations, and manage job statuses.
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
            placeholder="Search job ID, service, customer address..."
            className="w-full rounded-2xl border border-stone-200/80 bg-stone-50 py-2 pl-10 pr-4 text-xs font-medium text-stone-900 placeholder:text-stone-400 outline-none focus:border-amber-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "EN_ROUTE", "IN_PROGRESS", "SCHEDULED", "COMPLETED"].map((status) => (
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

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-bold text-xs text-stone-400">{job.id}</span>
                {getStatusBadge(job.status)}
              </div>

              <h3 className="text-base font-bold text-stone-900 leading-snug">{job.service}</h3>

              <div className="mt-3 space-y-1.5 text-xs text-stone-500 font-medium">
                <p className="flex items-center gap-2">
                  <span className="font-bold text-stone-900">{job.customer}</span> • {job.phone}
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                  <span>{job.address}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                  <span>{job.time}</span>
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-base font-extrabold text-stone-900">{job.price}</span>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors">
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call</span>
                </button>
                <button className="flex items-center gap-1.5 rounded-xl bg-stone-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-stone-800 transition-colors">
                  <Navigation className="h-3.5 w-3.5 text-amber-400" />
                  <span>Navigate</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
