"use client";

import { useState } from "react";
import { X, Calendar, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateBookingModal({ isOpen, onClose, onSuccess }: CreateBookingModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("Emergency Plumbing Pipe Leak");
  const [date, setDate] = useState("2026-11-28");
  const [timeSlot, setTimeSlot] = useState("10:00 AM - 12:00 PM");
  const [technician, setTechnician] = useState("Robert Chen");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) {
      toast.error("Please fill in customer name and phone number.");
      return;
    }

    toast.success(`Booking created for ${customerName}!`);
    if (onSuccess) onSuccess();
    onClose();
    // Reset
    setCustomerName("");
    setCustomerEmail("");
    setPhone("");
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
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto text-stone-900 dark:text-slate-100"
          >
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-stone-950 shadow-2xs">
                  <Calendar className="h-5 w-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-stone-900 dark:text-slate-100">Create New Booking</h3>
                  <p className="text-xs font-medium text-stone-400 dark:text-slate-400">Dispatch a new customer service request</p>
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Sarah Williams"
                    className="w-full rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-stone-900 dark:text-slate-100 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">Contact Phone *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-stone-900 dark:text-slate-100 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">Customer Email</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-stone-900 dark:text-slate-100 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">Select Service</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-stone-900 dark:text-slate-100 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
                >
                  <option value="Emergency Plumbing Pipe Leak">Emergency Plumbing Pipe Leak ($120.00)</option>
                  <option value="Central AC Coil Replacement">Central AC Coil Replacement ($180.00)</option>
                  <option value="Electrical Panel Safety Check">Electrical Panel Safety Check ($150.00)</option>
                  <option value="Dishwasher Inspection">Dishwasher Inspection ($95.00)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-stone-900 dark:text-slate-100 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">Time Slot</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-stone-900 dark:text-slate-100 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
                  >
                    <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                    <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                    <option value="01:00 PM - 03:00 PM">01:00 PM - 03:00 PM</option>
                    <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">Assign Technician</label>
                <select
                  value={technician}
                  onChange={(e) => setTechnician(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-stone-900 dark:text-slate-100 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
                >
                  <option value="Robert Chen">Robert Chen (Plumbing)</option>
                  <option value="Alex Turner">Alex Turner (HVAC)</option>
                  <option value="Marcus Vance">Marcus Vance (Electrical)</option>
                  <option value="Unassigned">Leave Unassigned</option>
                </select>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-stone-700 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-2xl bg-stone-900 dark:bg-amber-500 dark:text-slate-950 px-5 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-stone-800 dark:hover:bg-amber-400 transition-all active:scale-95 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-amber-400 dark:text-slate-950" />
                  <span>Dispatch Booking</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
