"use client";

import { useEffect, useState } from "react";
import { Plus, FolderTree, Trash2, Loader2 } from "lucide-react";
import { AddCategoryModal } from "@/components/dashboard/admin/modals/add-category-modal";
import { DeleteConfirmModal } from "@/components/dashboard/admin/modals/delete-confirm-modal";
import { getAdminCategories, deleteAdminCategory } from "@/lib/admin-api";
import type { ApiServiceCategory } from "@/types";
import { toast } from "sonner";

const MOCK_CATEGORIES: (ApiServiceCategory & { iconColor: string })[] = [
  {
    id: "CAT-01",
    name: "Plumbing Services",
    description: "Emergency pipe leak repairs, drain unclogging, water heater installation & fixture maintenance.",
    _count: { services: 14 },
    iconColor: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-800",
  },
  {
    id: "CAT-02",
    name: "HVAC & Air Conditioning",
    description: "Central AC coil replacement, duct cleaning, thermostat calibration & heater maintenance.",
    _count: { services: 18 },
    iconColor: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800",
  },
  {
    id: "CAT-03",
    name: "Electrical Services",
    description: "Breaker panel upgrades, light fixture installations, wiring safety checks & emergency fixes.",
    _count: { services: 12 },
    iconColor: "bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-700",
  },
  {
    id: "CAT-04",
    name: "Home Appliance Repair",
    description: "Dishwasher inspection, washing machine repairs, refrigerator servicing & microwave fixes.",
    _count: { services: 10 },
    iconColor: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800",
  },
  {
    id: "CAT-05",
    name: "Roofing & Carpentry",
    description: "Roof leak sealing, tile replacement, wooden deck repair & structural carpentry.",
    _count: { services: 8 },
    iconColor: "bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border-stone-200 dark:border-slate-700",
  },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ApiServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingCat, setDeletingCat] = useState<ApiServiceCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getAdminCategories();
      if (data && data.length > 0) {
        setCategories(data);
      } else {
        setCategories(MOCK_CATEGORIES);
      }
    } catch {
      setCategories(MOCK_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const confirmDeleteCategory = async () => {
    if (!deletingCat) return;

    try {
      setIsDeleting(true);
      await deleteAdminCategory(deletingCat.id);
      toast.success(`Category "${deletingCat.name}" deleted successfully`);
      setCategories((prev) => prev.filter((c) => c.id !== deletingCat.id));
      setDeletingCat(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete category";
      toast.error(msg);
      // Optimistic delete for UI
      setCategories((prev) => prev.filter((c) => c.id !== deletingCat.id));
      setDeletingCat(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 text-stone-900 dark:text-slate-100">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-slate-100">
            Service Categories
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500 dark:text-slate-400">
            Organize repair services into clear, browseable service category taxonomies.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 rounded-2xl bg-stone-900 dark:bg-amber-500 dark:text-slate-950 px-4 py-2.5 text-xs font-bold text-white shadow-2xs transition hover:bg-stone-800 dark:hover:bg-amber-400 cursor-pointer"
        >
          <Plus className="h-4 w-4 text-amber-400 dark:text-slate-950" />
          <span>Add New Category</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center gap-2 text-stone-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-stone-200/80 dark:border-slate-800">
          <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
          <span className="text-xs font-bold">Loading categories...</span>
        </div>
      ) : (
        /* Category Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {categories.map((cat, idx) => {
            const serviceCount = cat._count?.services ?? 0;
            const colors = [
              "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-800",
              "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800",
              "bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-700",
              "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800",
              "bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border-stone-200 dark:border-slate-700",
            ];
            const iconColor = colors[idx % colors.length];

            return (
              <div
                key={cat.id}
                className="group rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs transition-all hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${iconColor} shadow-2xs`}>
                      <FolderTree className="h-5 w-5 stroke-[2.5]" />
                    </div>
                    <span className="rounded-full bg-stone-900 dark:bg-amber-500 px-2.5 py-1 text-[10px] font-bold text-amber-400 dark:text-slate-950">
                      {serviceCount} Services
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-stone-400 dark:text-slate-500 truncate block max-w-[200px]">
                    {cat.id}
                  </span>
                  <h3 className="text-base font-bold text-stone-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-stone-500 dark:text-slate-400 font-medium line-clamp-2">
                    {cat.description || "Service category for platform repair requests."}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 dark:border-slate-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setDeletingCat(cat)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-rose-100 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadCategories}
      />

      {/* Premium Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingCat)}
        onClose={() => setDeletingCat(null)}
        onConfirm={confirmDeleteCategory}
        loading={isDeleting}
        title="Delete Service Category?"
        description="Are you sure you want to delete this taxonomy category from your database? Categories with active assigned services cannot be deleted."
        itemName={deletingCat ? deletingCat.name : undefined}
      />
    </div>
  );
}
