"use client";

import { X, Calendar, Clock, User, Phone, Wrench, ShieldCheck, AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { Booking } from "@/types";

interface ViewBookingModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export function ViewBookingModal({ booking, onClose }: ViewBookingModalProps) {
  if (!booking) return null;

  const techName = booking.technicianProfile?.user?.name || "Unassigned Specialist";

  return (
    <AnimatePresence>
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
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 320 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl z-10 border border-stone-100 dark:border-slate-800 text-stone-900 dark:text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-stone-950 shadow-2xs font-bold font-mono">
                BK
              </div>
              <div>
                <h3 className="text-base font-extrabold text-stone-900 dark:text-slate-100 tracking-tight">
                  Booking Details
                </h3>
                <span className="font-mono text-xs text-stone-400 dark:text-slate-400 font-bold">
                  ID: {booking.id}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-stone-400 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800 hover:text-stone-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="mt-4 space-y-4">
            {/* Status & Price Highlight Banner */}
            <div className="flex items-center justify-between rounded-2xl bg-stone-50 dark:bg-slate-800/80 p-3.5 border border-stone-100 dark:border-slate-700">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-slate-400 block">
                  Service Price
                </span>
                <span className="text-xl font-extrabold text-stone-900 dark:text-slate-100">
                  ${booking.servicePrice.toFixed(2)}
                </span>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  booking.status === "COMPLETED" || booking.status === "PAID"
                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800"
                    : booking.status === "IN_PROGRESS"
                    ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-800"
                    : booking.status === "ACCEPTED"
                    ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800"
                    : "bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700"
                }`}
              >
                {booking.status.replace("_", " ")}
              </span>
            </div>

            {/* Grid Information Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-medium">
              {/* Service Requested */}
              <div className="rounded-2xl border border-stone-100 dark:border-slate-800 p-3 bg-stone-50/50 dark:bg-slate-800/50 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Wrench className="h-3 w-3 text-amber-500" /> Service Requested
                </span>
                <p className="font-bold text-stone-900 dark:text-slate-100 leading-tight">
                  {booking.service?.title || "Repair Service"}
                </p>
              </div>

              {/* Customer Info */}
              <div className="rounded-2xl border border-stone-100 dark:border-slate-800 p-3 bg-stone-50/50 dark:bg-slate-800/50 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <User className="h-3 w-3 text-amber-500" /> Customer Details
                </span>
                <p className="font-bold text-stone-900 dark:text-slate-100">
                  {booking.customer?.name || "Customer"}
                </p>
                <p className="text-[11px] text-stone-500 dark:text-slate-400 font-medium">
                  {booking.customer?.email || booking.contactNumber}
                </p>
              </div>

              {/* Technician Info */}
              <div className="rounded-2xl border border-stone-100 dark:border-slate-800 p-3 bg-stone-50/50 dark:bg-slate-800/50 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" /> Dispatch Technician
                </span>
                <p className="font-bold text-stone-900 dark:text-slate-100">{techName}</p>
              </div>

              {/* Contact Phone */}
              <div className="rounded-2xl border border-stone-100 dark:border-slate-800 p-3 bg-stone-50/50 dark:bg-slate-800/50 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Phone className="h-3 w-3 text-blue-500" /> Contact Phone
                </span>
                <p className="font-bold font-mono text-stone-900 dark:text-slate-100">
                  {booking.contactNumber || "N/A"}
                </p>
              </div>

              {/* Schedule Date */}
              <div className="rounded-2xl border border-stone-100 dark:border-slate-800 p-3 bg-stone-50/50 dark:bg-slate-800/50 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-amber-500" /> Scheduled Date
                </span>
                <p className="font-bold text-stone-900 dark:text-slate-100">{booking.scheduledDate}</p>
              </div>

              {/* Time Slot */}
              <div className="rounded-2xl border border-stone-100 dark:border-slate-800 p-3 bg-stone-50/50 dark:bg-slate-800/50 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="h-3 w-3 text-amber-500" /> Time Slot
                </span>
                <p className="font-bold text-stone-900 dark:text-slate-100">{booking.timeSlot}</p>
              </div>
            </div>

            {/* Cancellation Reason if present */}
            {booking.cancellationReason && (
              <div className="rounded-2xl border border-rose-100 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 p-3 text-xs">
                <span className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1 mb-0.5">
                  <AlertCircle className="h-3.5 w-3.5" /> Cancellation Reason:
                </span>
                <p className="text-rose-700 dark:text-rose-400 italic font-medium">
                  &ldquo;{booking.cancellationReason}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="mt-5 pt-3 border-t border-stone-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-2xl bg-stone-900 dark:bg-amber-500 dark:text-slate-950 px-5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-stone-800 dark:hover:bg-amber-400 transition-all cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
