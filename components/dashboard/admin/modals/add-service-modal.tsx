"use client";

import { useState } from "react";
import { X, Wrench, DollarSign, Clock, Layers, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddServiceModal({ isOpen, onClose, onSuccess }: AddServiceModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Plumbing");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("1 - 2 Hours");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) {
      toast.error("Please fill in service title and price.");
      return;
    }

    toast.success(`Service "${title}" created successfully!`);
    if (onSuccess) onSuccess();
    onClose();
    // Reset form
    setTitle("");
    setPrice("");
    setDescription("");
  };

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
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white p-6 shadow-2xl z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-stone-950 shadow-xs">
                  <Wrench className="h-5 w-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-stone-900">Add New Repair Service</h3>
                  <p className="text-xs font-medium text-stone-400">Add a new service offering to the catalog</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Emergency HVAC Coil Repair"
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-semibold text-stone-900 outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-semibold text-stone-900 outline-none focus:border-amber-500 focus:bg-white"
                  >
                    <option value="Plumbing">Plumbing Services</option>
                    <option value="HVAC & AC">HVAC & Air Conditioning</option>
                    <option value="Electrical">Electrical Services</option>
                    <option value="Appliance">Home Appliance</option>
                    <option value="Roofing & Carpentry">Roofing & Carpentry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Base Price ($) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="120.00"
                    className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-semibold text-stone-900 outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Estimated Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="1 - 2 Hours"
                    className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-semibold text-stone-900 outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Service scope details..."
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-semibold text-stone-900 outline-none focus:border-amber-500 focus:bg-white resize-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-2xl bg-stone-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-stone-800 transition-all active:scale-95"
                >
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>Create Service</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
