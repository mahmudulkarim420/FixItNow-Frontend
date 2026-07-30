"use client";

import { useEffect, useState } from "react";
import { Plus, Wrench, Edit3, Trash2, Tag, DollarSign, Loader2, X, AlertCircle } from "lucide-react";
import { fetchServices, fetchServiceCategories } from "@/lib/services-api";
import { createTechnicianService, updateTechnicianService, deleteTechnicianService } from "@/lib/technician-api";
import type { ApiService, ApiServiceCategory } from "@/types";

export default function TechnicianServicesPage() {
  const [services, setServices] = useState<ApiService[]>([]);
  const [categories, setCategories] = useState<ApiServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ApiService | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [srvRes, cats] = await Promise.all([
        fetchServices({ limit: 50 }).catch(() => ({ data: [] })),
        fetchServiceCategories().catch(() => []),
      ]);

      setServices(srvRes.data || []);
      setCategories(cats || []);
      if (cats.length > 0) setCategoryId(cats[0].id);
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setTitle("");
    setDescription("");
    setPrice("50.00");
    if (categories.length > 0) setCategoryId(categories[0].id);
    setErrorMsg("");
    setModalOpen(true);
  };

  const openEditModal = (srv: ApiService) => {
    setEditingService(srv);
    setTitle(srv.title);
    setDescription(srv.description);
    setPrice(srv.price.toString());
    setCategoryId(srv.categoryId);
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !price || !categoryId) {
      setErrorMsg("Please fill out all required service fields.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg("");

      if (editingService) {
        await updateTechnicianService(editingService.id, {
          title,
          description,
          price: parseFloat(price),
          categoryId,
        });
      } else {
        await createTechnicianService({
          title,
          description,
          price: parseFloat(price),
          categoryId,
        });
      }

      setModalOpen(false);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to save service offering.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this service offering?")) return;
    try {
      await deleteTechnicianService(id);
      await loadData();
    } catch (err: any) {
      alert(err?.message || "Failed to delete service.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
            My Service Catalog & Rates
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
            Manage your service offerings, set pricing, and control your service listing visibility.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 rounded-2xl bg-stone-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-stone-800 cursor-pointer"
        >
          <Plus className="h-4 w-4 text-amber-400" />
          <span>Add New Service Offering</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center gap-2 text-stone-500 bg-white rounded-3xl border border-stone-200/80">
          <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
          <span className="text-xs font-bold">Loading service catalog...</span>
        </div>
      ) : services.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center gap-2 text-stone-400 bg-white rounded-3xl border border-stone-200/80 text-center">
          <Wrench className="h-10 w-10 text-stone-300 stroke-[1.5]" />
          <h3 className="text-sm font-bold text-stone-700">No Services Registered Yet</h3>
          <p className="text-xs text-stone-400 max-w-sm">
            Create your first service offering to start receiving customer job bookings.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-2 flex items-center gap-1.5 rounded-2xl bg-amber-500 px-4 py-2 text-xs font-bold text-stone-950 shadow-sm hover:bg-amber-400 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Create First Service</span>
          </button>
        </div>
      ) : (
        /* Services Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="group rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono font-bold text-xs text-stone-400">{srv.id.slice(0, 8)}</span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                    ACTIVE
                  </span>
                </div>

                <span className="rounded-full bg-amber-50 text-amber-900 px-2.5 py-0.5 text-[10px] font-bold border border-amber-100">
                  {srv.category?.name || "General Service"}
                </span>

                <h3 className="mt-3 text-base font-bold text-stone-900 group-hover:text-amber-600 transition-colors">
                  {srv.title}
                </h3>
                <p className="mt-1 text-xs text-stone-500 font-medium line-clamp-2">
                  {srv.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-base font-extrabold text-stone-900">${srv.price.toFixed(2)}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(srv)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-900 hover:text-white transition-colors cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(srv.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900">
                {editingService ? "Edit Service Offering" : "Add New Service Offering"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-xl p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 rounded-2xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 border border-rose-100">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Emergency Pipe Repair"
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-semibold text-stone-900 outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Service Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-semibold text-stone-900 outline-none focus:border-amber-500 focus:bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-semibold text-stone-900 outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the scope of work and what is included..."
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-semibold text-stone-900 outline-none focus:border-amber-500 focus:bg-white resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-2xl border border-stone-200 px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 rounded-2xl bg-stone-900 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-stone-800 disabled:opacity-50 cursor-pointer"
                >
                  {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingService ? "Save Changes" : "Create Service"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

