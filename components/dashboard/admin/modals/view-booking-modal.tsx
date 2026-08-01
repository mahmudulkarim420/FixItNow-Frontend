"use client";

import { X, Calendar, Clock, DollarSign, User, Phone, Wrench, ShieldCheck, AlertCircle } from "lucide-react";
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
          className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white p-6 shadow-2xl z-10 border border-stone-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-stone-950 shadow-xs font-bold font-mono">
                BK
              </div>
              <div>
                <h3 className="text-base font-extrabold text-stone-900 tracking-tight">
                  Booking Details
                </h3>
                <span className="font-mono text-xs text-stone-400 font-bold">
                  ID: {booking.id}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="mt-4 space-y-4">
            {/* Status & Price Highlight Banner */}
            <div className="flex items-center justify-between rounded-2xl bg-stone-50 p-3.5 border border-stone-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  Service Price
                </span>
                <span className="text-xl font-extrabold text-stone-900">
                  ${booking.servicePrice.toFixed(2)}
                </span>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  booking.status === "COMPLETED" || booking.status === "PAID"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : booking.status === "IN_PROGRESS"
                    ? "bg-amber-50 text-amber-700 border border-amber-100"
                    : booking.status === "ACCEPTED"
                    ? "bg-blue-50 text-blue-700 border border-blue-100"
                    : "bg-stone-100 text-stone-700 border border-stone-200"
                }`}
              >
                {booking.status.replace("_", " ")}
              </span>
            </div>

            {/* Grid Information Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-medium">
              {/* Service Requested */}
              <div className="rounded-2xl border border-stone-100 p-3 bg-stone-50/50 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                  <Wrench className="h-3 w-3 text-amber-500" /> Service Requested
                </span>
                <p className="font-bold text-stone-900 leading-tight">
                  {booking.service?.title || "Repair Service"}
                </p>
              </div>

              {/* Customer Info */}
              <div className="rounded-2xl border border-stone-100 p-3 bg-stone-50/50 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                  <User className="h-3 w-3 text-amber-500" /> Customer Details
                </span>
                <p className="font-bold text-stone-900">
                  {booking.customer?.name || "Customer"}
                </p>
                <p className="text-[11px] text-stone-500 font-medium">
                  {booking.customer?.email || booking.contactNumber}
                </p>
              </div>

              {/* Technician Info */}
              <div className="rounded-2xl border border-stone-100 p-3 bg-stone-50/50 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" /> Dispatch Technician
                </span>
                <p className="font-bold text-stone-900">{techName}</p>
              </div>

              {/* Contact Phone */}
              <div className="rounded-2xl border border-stone-100 p-3 bg-stone-50/50 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                  <Phone className="h-3 w-3 text-blue-500" /> Contact Phone
                </span>
                <p className="font-bold font-mono text-stone-900">
                  {booking.contactNumber || "N/A"}
                </p>
              </div>

              {/* Schedule Date */}
              <div className="rounded-2xl border border-stone-100 p-3 bg-stone-50/50 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-amber-500" /> Scheduled Date
                </span>
                <p className="font-bold text-stone-900">{booking.scheduledDate}</p>
              </div>

              {/* Time Slot */}
              <div className="rounded-2xl border border-stone-100 p-3 bg-stone-50/50 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="h-3 w-3 text-amber-500" /> Time Slot
                </span>
                <p className="font-bold text-stone-900">{booking.timeSlot}</p>
              </div>
            </div>

            {/* Cancellation Reason if present */}
            {booking.cancellationReason && (
              <div className="rounded-2xl border border-rose-100 bg-rose-50 p-3 text-xs">
                <span className="font-bold text-rose-800 flex items-center gap-1 mb-0.5">
                  <AlertCircle className="h-3.5 w-3.5" /> Cancellation Reason:
                </span>
                <p className="text-rose-700 italic font-medium">
                  "{booking.cancellationReason}"
                </p>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="mt-5 pt-3 border-t border-stone-100 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-2xl bg-stone-900 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-stone-800 transition-all cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
