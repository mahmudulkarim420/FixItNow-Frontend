"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Loader2,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  PackageX,
} from "lucide-react";
import { AddServiceModal } from "@/components/dashboard/modals/add-service-modal";
import { DeleteConfirmModal } from "@/components/dashboard/modals/delete-confirm-modal";
import { fetchServices, mapApiServiceToUI } from "@/lib/services-api";
import type { RepairService } from "@/lib/services-data";
import { toast } from "sonner";

export default function AdminServicesPage() {
  const [services, setServices] = useState<RepairService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState<"DEFAULT" | "LOW_TO_HIGH" | "HIGH_TO_LOW">("DEFAULT");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingService, setDeletingService] = useState<RepairService | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadServicesList = async () => {
    try {
      setLoading(true);
      const res = await fetchServices();
      if (res && res.data && res.data.length > 0) {
        setServices(res.data.map(mapApiServiceToUI));
      }
    } catch {
      /* Uses existing services fallback if backend empty */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServicesList();
  }, []);

  const confirmDeleteService = () => {
    if (!deletingService) return;
    setServices((prev) => prev.filter((s) => s.id !== deletingService.id));
    toast.success(`Service "${deletingService.name}" removed`);
    setDeletingService(null);
  };

  // Filter calculation logic
  const filteredServices = services
    .filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "ALL" ||
        s.category.toLowerCase() === categoryFilter.toLowerCase() ||
        (categoryFilter === "Cooling" && s.category === "Cooling") ||
        (categoryFilter === "Plumbing" && s.category === "Plumbing") ||
        (categoryFilter === "Electrical" && s.category === "Electrical") ||
        (categoryFilter === "Appliances" && s.category === "Appliances");

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOrder === "LOW_TO_HIGH") return a.price - b.price;
      if (sortOrder === "HIGH_TO_LOW") return b.price - a.price;
      return 0;
    });

  // Auto-reset page when filter or sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, sortOrder]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

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
              placeholder="Search service title, category..."
              className="w-full rounded-2xl border border-stone-200/80 bg-stone-50 py-2 pl-10 pr-4 text-xs font-medium text-stone-900 placeholder:text-stone-400 outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Category & Sorting Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-stone-100">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-[11px] font-bold text-stone-400 flex items-center gap-1 mr-1">
              <Filter className="h-3 w-3 text-amber-500" /> Category:
            </span>
            {["ALL", "Cooling", "Plumbing", "Electrical", "Appliances", "Home Care"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-2xl px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? "bg-amber-500 text-stone-950 shadow-xs"
                    : "bg-stone-50 text-stone-600 hover:bg-stone-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Order Pills */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-stone-400 flex items-center gap-1 mr-1">
              <ArrowUpDown className="h-3 w-3 text-stone-500" /> Sort:
            </span>
            <button
              onClick={() => setSortOrder("DEFAULT")}
              className={`rounded-2xl px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                sortOrder === "DEFAULT"
                  ? "bg-stone-900 text-amber-400 shadow-xs"
                  : "bg-stone-50 text-stone-600 hover:bg-stone-100"
              }`}
            >
              Default
            </button>
            <button
              onClick={() => setSortOrder("LOW_TO_HIGH")}
              className={`rounded-2xl px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                sortOrder === "LOW_TO_HIGH"
                  ? "bg-stone-900 text-amber-400 shadow-xs"
                  : "bg-stone-50 text-stone-600 hover:bg-stone-100"
              }`}
            >
              Price: Low → High
            </button>
            <button
              onClick={() => setSortOrder("HIGH_TO_LOW")}
              className={`rounded-2xl px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                sortOrder === "HIGH_TO_LOW"
                  ? "bg-stone-900 text-amber-400 shadow-xs"
                  : "bg-stone-50 text-stone-600 hover:bg-stone-100"
              }`}
            >
              Price: High → Low
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center gap-2 text-stone-500 bg-white rounded-3xl border border-stone-200/80">
          <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
          <span className="text-xs font-bold">Loading services catalog...</span>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center gap-2 text-stone-400 bg-white rounded-3xl border border-stone-200/80 text-center">
          <PackageX className="h-10 w-10 text-stone-300 stroke-[1.5]" />
          <h3 className="text-sm font-bold text-stone-700">No Services Found</h3>
          <p className="text-xs text-stone-400 max-w-sm">
            {searchTerm || categoryFilter !== "ALL"
              ? "No services match your search and filter criteria."
              : "No services exist in the catalog."}
          </p>
        </div>
      ) : (
        <>
          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {paginatedServices.map((srv) => (
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
                      alt={srv.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute top-2.5 right-2.5 rounded-full bg-stone-900/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-amber-400">
                      {srv.category}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-stone-400 block truncate max-w-[180px]">{srv.id}</span>
                    <h3 className="text-sm font-bold text-stone-900 leading-snug group-hover:text-amber-600 transition-colors">
                      {srv.name}
                    </h3>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-base font-extrabold text-stone-900">${srv.price}</span>
                    <span className="block text-[10px] font-medium text-stone-400">{srv.duration}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button className="flex h-8 w-8 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-900 hover:text-white transition-colors cursor-pointer">
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingService(srv)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
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
                {Math.min(startIndex + itemsPerPage, filteredServices.length)}
              </span>{" "}
              of <span className="font-extrabold text-stone-900">{filteredServices.length}</span> services
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

      {/* Add Service Modal */}
      <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadServicesList}
      />

      {/* Premium Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingService)}
        onClose={() => setDeletingService(null)}
        onConfirm={confirmDeleteService}
        title="Delete Repair Service?"
        description="Are you sure you want to delete this service from your catalog? Customers will no longer be able to browse or book this service."
        itemName={deletingService ? deletingService.name : undefined}
      />
    </div>
  );
}
