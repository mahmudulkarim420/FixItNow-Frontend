"use client";

import { Trash2, X, Loader2, ShieldAlert } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  loading?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Permanent Record?",
  description = "Are you sure you want to permanently delete this item? This action will remove the record from the database and cannot be undone.",
  itemName,
  loading = false,
}: DeleteConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-md"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 320 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl z-10 border border-stone-100 dark:border-slate-800 text-stone-900 dark:text-slate-100"
          >
            {/* Header Badge */}
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-800 text-rose-600 dark:text-rose-400 shadow-2xs">
                  <ShieldAlert className="h-6 w-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-stone-900 dark:text-slate-100 tracking-tight">
                    {title}
                  </h3>
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                    High Importance Action
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                disabled={loading}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-stone-400 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800 hover:text-stone-700 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Meaningful Context Content */}
            <div className="mt-4 space-y-3">
              <p className="text-xs leading-relaxed text-stone-600 dark:text-slate-300 font-medium">
                {description}
              </p>

              {itemName && (
                <div className="rounded-2xl border border-rose-100 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/40 p-3 text-xs">
                  <span className="block font-bold text-stone-900 dark:text-slate-200 mb-0.5">Target Record:</span>
                  <span className="font-mono text-rose-700 dark:text-rose-400 font-semibold break-all">
                    &ldquo;{itemName}&rdquo;
                  </span>
                </div>
              )}
            </div>

            {/* Action Footer Buttons */}
            <div className="mt-6 pt-4 border-t border-stone-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-2xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-stone-700 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-700 transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:from-rose-700 hover:to-rose-800 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-rose-200" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                <span>Delete Permanently</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
