"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, Calendar, Clock, Phone, Star, X, CreditCard, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getUserBookings, createCheckoutSession, cancelBooking } from "@/lib/bookings-payments-api";
import { createReview } from "@/lib/reviews-api";
import type { Booking } from "@/types";

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Payment processing state
  const [payingBookingId, setPayingBookingId] = useState<string | null>(null);

  // Modal states
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);

  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserBookings();
      setBookings(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load bookings");
      toast.error(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handlePayNow = async (bookingId: string) => {
    const toastId = toast.loading("Connecting to secure Stripe Checkout...");
    try {
      setPayingBookingId(bookingId);
      const res = await createCheckoutSession(bookingId);
      if (res?.url) {
        toast.success("Redirecting to Stripe payment page...", { id: toastId });
        window.location.href = res.url;
      } else {
        toast.error("Failed to generate payment session", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to start payment checkout", { id: toastId });
      setPayingBookingId(null);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancellingBooking) return;
    const toastId = toast.loading("Cancelling repair booking dispatch...");
    try {
      setIsSubmittingCancel(true);
      await cancelBooking(cancellingBooking.id, cancelReason || "Customer requested cancellation");
      toast.success(`Booking #${cancellingBooking.id.substring(0, 8)} cancelled successfully.`, { id: toastId });
      setCancellingBooking(null);
      setCancelReason("");
      await fetchBookings();
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel booking", { id: toastId });
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  const handleConfirmReview = async () => {
    if (!reviewingBooking) return;
    const toastId = toast.loading("Submitting technician review...");
    try {
      setIsSubmittingReview(true);
      await createReview({
        bookingId: reviewingBooking.id,
        rating,
        comment: reviewComment,
      });
      toast.success("Thank you! Your review has been published.", { id: toastId });
      setReviewingBooking(null);
      setReviewComment("");
      setRating(5);
      await fetchBookings();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review", { id: toastId });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const serviceTitle = b.service?.title || "";
    const techName = b.technicianProfile?.user?.name || "";
    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      techName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return <span className="rounded-full bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-800 animate-pulse">In Progress</span>;
      case "ACCEPTED":
        return <span className="rounded-full bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 text-[10px] font-bold text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">Accepted - Payment Due</span>;
      case "REQUESTED":
        return <span className="rounded-full bg-stone-100 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-bold text-stone-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700">Pending Acceptance</span>;
      case "PAID":
        return <span className="rounded-full bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 text-[10px] font-bold text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-800">Paid & Scheduled</span>;
      case "COMPLETED":
        return <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">Completed</span>;
      case "CANCELLED":
        return <span className="rounded-full bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 text-[10px] font-bold text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-800">{status}</span>;
      default:
        return <span className="rounded-full bg-stone-100 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-bold text-stone-600 dark:text-slate-300">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 text-stone-900 dark:text-slate-100">
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-slate-100">
            My Bookings & Dispatches
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500 dark:text-slate-400">
            Track active technician arrival times, view repair history, pay invoices, and request new services.
          </p>
        </div>

        <Link
          href="/services"
          className="flex items-center gap-1.5 rounded-2xl bg-stone-900 dark:bg-amber-500 dark:text-slate-950 px-4 py-2.5 text-xs font-bold text-white shadow-2xs transition hover:bg-stone-800 dark:hover:bg-amber-400 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4 text-amber-400 dark:text-slate-950" />
          <span>Book New Repair</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-2xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search booking ID, service title, technician..."
            className="w-full rounded-2xl border border-stone-200/80 dark:border-slate-800 bg-stone-50 dark:bg-slate-800 py-2 pl-10 pr-4 text-xs font-medium text-stone-900 dark:text-slate-100 placeholder:text-stone-400 dark:placeholder:text-slate-500 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["ALL", "REQUESTED", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-2xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                statusFilter === status
                  ? "bg-amber-500 text-stone-950 shadow-2xs"
                  : "bg-stone-50 dark:bg-slate-800 text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-700"
              }`}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Loading & Error States */}
      {loading ? (
        <div className="flex items-center justify-center p-12 text-stone-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-stone-200/80 dark:border-slate-800">
          <Loader2 className="h-6 w-6 animate-spin text-amber-500 mr-2" />
          <span className="text-xs font-bold">Loading your dispatches...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center">
          <p className="text-stone-700 dark:text-slate-300 font-bold text-sm">No dispatches found</p>
          <p className="text-stone-400 dark:text-slate-500 text-xs mt-1">Book a service from our catalog to get started.</p>
          <Link
            href="/services"
            className="mt-4 inline-flex items-center gap-1.5 rounded-2xl bg-stone-900 dark:bg-amber-500 dark:text-slate-950 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-stone-800 dark:hover:bg-amber-400 cursor-pointer"
          >
            Browse Services
          </Link>
        </div>
      ) : (
        /* Bookings Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredBookings.map((b) => {
            const isAccepted = b.status === "ACCEPTED";
            const isCompleted = b.status === "COMPLETED";
            const isCancelable =
              b.status !== "IN_PROGRESS" &&
              b.status !== "COMPLETED" &&
              b.status !== "CANCELLED" &&
              b.status !== "DECLINED";
            const hasReview = Boolean(b.review);

            return (
              <div
                key={b.id}
                className="rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono font-bold text-xs text-stone-400 dark:text-slate-500">
                      ID: {b.id.substring(0, 8)}...
                    </span>
                    {getStatusBadge(b.status)}
                  </div>

                  <h3 className="text-base font-bold text-stone-900 dark:text-slate-100 leading-snug">
                    {b.service?.title || "Home Maintenance Repair"}
                  </h3>

                  <div className="mt-3 flex items-center gap-3 p-2.5 rounded-2xl bg-stone-50 dark:bg-slate-800/80 border border-stone-100 dark:border-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                      alt={b.technicianProfile?.user?.name || "Tech"}
                      className="h-8 w-8 rounded-xl object-cover ring-1 ring-stone-200 dark:ring-slate-700"
                    />
                    <div>
                      <span className="block text-xs font-bold text-stone-900 dark:text-slate-100">
                        {b.technicianProfile?.user?.name || "Assigned Technician"}
                      </span>
                      <span className="block text-[10px] text-stone-400 dark:text-slate-400 font-medium">Verified Field Expert</span>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-stone-500 dark:text-slate-400 font-medium">
                    <p className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-stone-400 dark:text-slate-500 shrink-0" />
                      <span>{b.scheduledDate}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-stone-400 dark:text-slate-500 shrink-0" />
                      <span>{b.timeSlot}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-stone-400 dark:text-slate-500 shrink-0" />
                      <span>{b.contactNumber}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-base font-extrabold text-stone-900 dark:text-slate-100">
                    ${b.servicePrice || b.service?.price || 0}
                  </span>

                  <div className="flex items-center gap-2">
                    {isAccepted && (
                      <button
                        onClick={() => handlePayNow(b.id)}
                        disabled={payingBookingId === b.id}
                        className="flex items-center gap-1.5 rounded-xl bg-amber-500 text-stone-950 px-3.5 py-1.5 text-xs font-extrabold shadow-2xs hover:bg-amber-400 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {payingBookingId === b.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CreditCard className="h-3.5 w-3.5" />
                        )}
                        <span>Pay Now</span>
                      </button>
                    )}

                    {isCompleted && !hasReview && (
                      <button
                        onClick={() => setReviewingBooking(b)}
                        className="flex items-center gap-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 px-3 py-1.5 text-xs font-bold text-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors border border-amber-200 dark:border-amber-800 cursor-pointer"
                      >
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        <span>Leave Review</span>
                      </button>
                    )}

                    {isCancelable && (
                      <button
                        onClick={() => setCancellingBooking(b)}
                        className="flex items-center gap-1 rounded-xl border border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      >
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Modal */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 border border-stone-200/80 dark:border-slate-800 text-stone-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-stone-900 dark:text-slate-100">Cancel Repair Booking</h3>
              <button onClick={() => setCancellingBooking(null)} className="text-stone-400 dark:text-slate-400 hover:text-stone-600 dark:hover:text-slate-200 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-stone-500 dark:text-slate-400">
              Are you sure you want to cancel dispatch for{" "}
              <strong className="text-stone-800 dark:text-slate-200">{cancellingBooking.service?.title}</strong>?
            </p>
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">Reason for cancellation</label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="E.g., No longer needed, scheduled date mistake..."
                className="w-full rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 p-2.5 text-xs font-medium text-stone-900 dark:text-slate-100 outline-none focus:border-amber-500 resize-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100 dark:border-slate-800">
              <button
                onClick={() => setCancellingBooking(null)}
                className="rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 px-4 py-2 text-xs font-bold text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-700 cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={isSubmittingCancel}
                className="flex items-center gap-1.5 rounded-2xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
              >
                {isSubmittingCancel && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Confirm Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 border border-stone-200/80 dark:border-slate-800 text-stone-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-stone-900 dark:text-slate-100">Leave Technician Review</h3>
              <button onClick={() => setReviewingBooking(null)} className="text-stone-400 dark:text-slate-400 hover:text-stone-600 dark:hover:text-slate-200 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-stone-500 dark:text-slate-400">
              Rate your experience for <strong className="text-stone-800 dark:text-slate-200">{reviewingBooking.service?.title}</strong>
            </p>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">Rating</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating ? "fill-amber-400 text-amber-400" : "text-stone-300 dark:text-slate-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">Feedback Comment</label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience with the technician..."
                className="w-full rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 p-2.5 text-xs font-medium text-stone-900 dark:text-slate-100 outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100 dark:border-slate-800">
              <button
                onClick={() => setReviewingBooking(null)}
                className="rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 px-4 py-2 text-xs font-bold text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReview}
                disabled={isSubmittingReview}
                className="flex items-center gap-1.5 rounded-2xl bg-amber-500 text-stone-950 px-4 py-2 text-xs font-bold hover:bg-amber-400 disabled:opacity-50 cursor-pointer"
              >
                {isSubmittingReview && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Submit Review</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
