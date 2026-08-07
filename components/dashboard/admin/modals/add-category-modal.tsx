"use client";

import { useState } from "react";
import { X, FolderTree, Sparkles, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { createAdminCategory } from "@/lib/admin-api";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddCategoryModal({ isOpen, onClose, onSuccess }: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Please fill in category name.");
      return;
    }

    try {
      setLoading(true);
      await createAdminCategory({ name, description: description || undefined });
      toast.success(`Category "${name}" added successfully!`);
      if (onSuccess) onSuccess();
      onClose();
      setName("");
      setDescription("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create category";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-6 shadow-2xl z-10 text-stone-900 dark:text-slate-100"
          >
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-stone-950 shadow-2xs">
                  <FolderTree className="h-5 w-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-stone-900 dark:text-slate-100">Add Service Category</h3>
                  <p className="text-xs font-medium text-stone-400 dark:text-slate-400">Create a new service taxonomy category</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-stone-400 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800 hover:text-stone-700 dark:hover:text-slate-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Solar & Renewable Energy"
                  className="w-full rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-stone-900 dark:text-slate-100 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">Category Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Scope & overview of services under this category..."
                  className="w-full rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-stone-900 dark:text-slate-100 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-stone-700 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-700 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-1.5 rounded-2xl bg-stone-900 dark:bg-amber-500 dark:text-slate-950 px-5 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-stone-800 dark:hover:bg-amber-400 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-amber-400 dark:text-slate-950" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-amber-400 dark:text-slate-950" />
                  )}
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
