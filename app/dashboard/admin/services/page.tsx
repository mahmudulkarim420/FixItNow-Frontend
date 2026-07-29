"use client";

import { useState } from "react";
import { Plus, Search, Wrench, Edit3, Trash2, Tag, DollarSign, Star } from "lucide-react";
import { AddServiceModal } from "@/components/dashboard/modals/add-service-modal";

const MOCK_SERVICES = [
  {
    id: "SRV-101",
    title: "Emergency Plumbing Pipe Leak Repair",
    category: "Plumbing",
    price: "$120.00",
    rating: "4.9 ★ (84)",
    duration: "1 - 2 Hours",
    status: "ACTIVE",
    image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "SRV-102",
    title: "Central AC Coil Replacement & Servicing",
    category: "HVAC & AC",
    price: "$180.00",
    rating: "4.8 ★ (120)",
    duration: "2 - 3 Hours",
    status: "ACTIVE",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "SRV-103",
    title: "Electrical Breaker Panel Safety Check",
    category: "Electrical",
    price: "$150.00",
    rating: "5.0 ★ (62)",
    duration: "1 Hour",
    status: "ACTIVE",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "SRV-104",
    title: "Dishwasher Inspection & Drain Clean",
    category: "Appliance",
    price: "$95.00",
    rating: "4.7 ★ (45)",
    duration: "1 Hour",
    status: "ACTIVE",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "SRV-105",
    title: "Roof Tile & Gutter Leak Maintenance",
    category: "Roofing & Carpentry",
    price: "$210.00",
    rating: "4.9 ★ (38)",
    duration: "3 - 4 Hours",
    status: "INACTIVE",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&auto=format&fit=crop&q=80",
  },
];

export default function AdminServicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredServices = MOCK_SERVICES.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
            Services Catalog
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
            Manage repair service offerings, pricing rates, and category associations.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 rounded-2xl bg-stone-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-stone-800 cursor-pointer"
        >
          <Plus className="h-4 w-4 text-amber-400" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="flex items-center gap-3 rounded-3xl border border-stone-200/80 bg-white p-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search service title, category..."
            className="w-full rounded-2xl border border-stone-200/80 bg-stone-50 py-2 pl-10 pr-4 text-xs font-medium text-stone-900 placeholder:text-stone-400 outline-none focus:border-amber-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="group overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-4 shadow-xs transition-all hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between"
          >
            <div>
              {/* Image Banner */}
              <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-stone-100 mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={srv.image}
                  alt={srv.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-2.5 right-2.5 rounded-full bg-stone-900/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-amber-400">
                  {srv.category}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-stone-400">{srv.id}</span>
                <h3 className="text-sm font-bold text-stone-900 leading-snug group-hover:text-amber-600 transition-colors">
                  {srv.title}
                </h3>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-base font-extrabold text-stone-900">{srv.price}</span>
                <span className="block text-[10px] font-medium text-stone-400">{srv.duration}</span>
              </div>

              <div className="flex items-center gap-1.5">
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

      {/* Add Service Modal */}
      <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
