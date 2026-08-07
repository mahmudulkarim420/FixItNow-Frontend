"use client";

import { useEffect, useState } from "react";
import { Star, MessageSquare, Loader2, AlertCircle } from "lucide-react";
import { getMyCustomerReviews, type Review } from "@/lib/reviews-api";

export default function CustomerReviewsPage() {
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReviews() {
      try {
        setLoading(true);
        setError(null);
        const data = await getMyCustomerReviews();
        setReviewsList(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load submitted reviews");
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl text-stone-900 dark:text-slate-100">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-slate-100">
          My Ratings & Service Feedback
        </h1>
        <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500 dark:text-slate-400">
          View ratings and review comments you submitted for repair technicians.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 text-stone-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-stone-200/80 dark:border-slate-800">
          <Loader2 className="h-6 w-6 animate-spin text-amber-500 mr-2" />
          <span className="text-xs font-bold">Loading your service feedback...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      ) : reviewsList.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center">
          <MessageSquare className="h-8 w-8 text-stone-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-stone-700 dark:text-slate-300 font-bold text-sm">No reviews submitted yet</p>
          <p className="text-stone-400 dark:text-slate-500 text-xs mt-1">
            Once a repair is completed, you can leave ratings and feedback for your technician from your Bookings tab.
          </p>
        </div>
      ) : (
        /* Reviews List */
        <div className="space-y-3.5">
          {reviewsList.map((rev) => {
            const dateStr = rev.createdAt
              ? new Date(rev.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Recent";

            const techName = rev.technicianProfile?.user?.name || "Assigned Technician";
            const serviceTitle = rev.service?.title || rev.booking?.service?.title || "Repair Service";

            return (
              <div
                key={rev.id}
                className="rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs transition-all hover:shadow-md space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                      alt={techName}
                      className="h-9 w-9 rounded-xl object-cover ring-1 ring-stone-200 dark:ring-slate-700"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 dark:text-slate-100">{techName}</h4>
                      <p className="text-[10px] text-stone-400 dark:text-slate-500 font-medium">
                        {serviceTitle} • {dateStr}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-100 dark:border-amber-800">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span>{rev.rating || 5}.0 Rating</span>
                  </div>
                </div>

                <p className="text-xs text-stone-700 dark:text-slate-300 font-medium italic pl-1">
                  &ldquo;{rev.comment || "Great service!"}&rdquo;
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
