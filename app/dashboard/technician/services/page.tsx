"use client";

import { useState } from "react";
import { Plus, Wrench, Edit3, Trash2, Tag, DollarSign } from "lucide-react";

const MOCK_TECH_SERVICES = [
  {
    id: "TS-01",
    title: "AC Coil Cleaning & Servicing",
    category: "HVAC & AC",
    rate: "$55.00 / hr",
    status: "ACTIVE",
    completedJobs: 42,
  },
  {
    id: "TS-02",
    title: "Emergency Pipe Leak Repair",
    category: "Plumbing",
    rate: "$60.00 / hr",
    status: "ACTIVE",
    completedJobs: 28,
  },
  {
    id: "TS-03",
    title: "Electrical Breaker Panel Maintenance",
    category: "Electrical",
    rate: "$50.00 / hr",
    status: "ACTIVE",
    completedJobs: 35,
  },
  {
    id: "TS-04",
    title: "Central AC System Inspection",
    category: "HVAC & AC",
    rate: "$45.00 / hr",
    status: "INACTIVE",
    completedJobs: 12,
  },
];

export default function TechnicianServicesPage() {
  return (
    <div className="space-y-6">
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
            My Service Catalog & Rates
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
            Manage your service offerings, set hourly rates, and control your service listing visibility.
          </p>
        </div>

        <button className="flex items-center gap-1.5 rounded-2xl bg-stone-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-stone-800">
          <Plus className="h-4 w-4 text-amber-400" />
          <span>Add New Service Offering</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {MOCK_TECH_SERVICES.map((srv) => (
          <div
            key={srv.id}
            className="group rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-bold text-xs text-stone-400">{srv.id}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    srv.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-stone-100 text-stone-600 border border-stone-200"
                  }`}
                >
                  {srv.status}
                </span>
              </div>

              <span className="rounded-full bg-amber-50 text-amber-900 px-2.5 py-0.5 text-[10px] font-bold border border-amber-100">
                {srv.category}
              </span>

              <h3 className="mt-3 text-base font-bold text-stone-900 group-hover:text-amber-600 transition-colors">
                {srv.title}
              </h3>
              <p className="mt-1 text-xs text-stone-400 font-medium">
                {srv.completedJobs} jobs completed with this service
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-base font-extrabold text-stone-900">{srv.rate}</span>

              <div className="flex items-center gap-2">
                <button className="flex h-8 w-8 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-900 hover:text-white transition-colors">
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
