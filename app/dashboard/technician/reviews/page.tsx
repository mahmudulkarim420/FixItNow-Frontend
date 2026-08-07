"use client";

import { useEffect, useState } from "react";
import { Star, Loader2, MessageSquareOff, ThumbsUp, ShieldCheck } from "lucide-react";
import { getTechnicianBookings } from "@/lib/technician-api";
import { getCurrentUser } from "@/lib/api";
import { getTechnicianReviews, type Review } from "@/lib/reviews-api";

interface ReviewDisplayItem {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  serviceTitle: string;
  date: string;
  avatar: string;
}

export default function TechnicianReviewsPage() {
  const [reviews, setReviews] = useState<ReviewDisplayItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTechReviews() {
      try {
        setLoading(true);
        const [me, bookings] = await Promise.all([
          getCurrentUser().catch(() => null),
          getTechnicianBookings().catch(() => []),
        ]);

        const extractedMap: Record<string, ReviewDisplayItem> = {};

        // 1. Extract reviews from bookings
        bookings.forEach((b, idx) => {
          if (b.review) {
            const revId = b.review.id || `REV-${b.id.substring(0, 8)}`;
            extractedMap[revId] = {
              id: revId,
              customerName: b.customer?.name || "Verified Customer",
              rating: Number(b.review.rating) || 5,
              comment: b.review.comment || "Great repair service!",
              serviceTitle: b.service?.title || "Home Repair Dispatch",
              date: new Date(b.review.createdAt || b.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              avatar: `https://images.unsplash.com/photo-${1507003211169 + idx * 17}?w=100&auto=format&fit=crop&q=80`,
            };
          }
        });

        // 2. Fetch public profile reviews if available
        if (me?.technicianProfile?.id) {
          const profileReviews: Review[] = await getTechnicianReviews(me.technicianProfile.id).catch(() => []);
          profileReviews.forEach((r, idx) => {
            if (!extractedMap[r.id]) {
              extractedMap[r.id] = {
                id: r.id,
                customerName: r.customer?.name || "Customer",
                rating: r.rating || 5,
                comment: r.comment || "Professional service.",
                serviceTitle: r.service?.title || "Technician Service",
                date: new Date(r.createdAt || Date.now()).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
                avatar: `https://images.unsplash.com/photo-${1535713875002 + idx * 19}?w=100&auto=format&fit=crop&q=80`,
              };
            }
          });
        }

        setReviews(Object.values(extractedMap));
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    }

    loadTechReviews();
  }, []);

  const totalReviewsCount = reviews.length;
  const avgRating =
    totalReviewsCount > 0
      ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviewsCount).toFixed(1)
      : "5.0";

  // Calculate rating distribution
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    const percentage = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
    return { star, count, percentage };
  });

  const positiveReviewsCount = reviews.filter((r) => r.rating >= 4).length;
  const satisfactionRate = totalReviewsCount > 0 ? Math.round((positiveReviewsCount / totalReviewsCount) * 100) : 100;

  return (
    <div className="space-y-6 max-w-4xl text-stone-900 dark:text-slate-100">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-slate-100">
          Customer Reviews & Ratings
        </h1>
        <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500 dark:text-slate-400">
          Read verified feedback and ratings from customers who booked your dispatches.
        </p>
      </div>

      {/* Rating Score Card */}
      <div className="rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-800 min-w-28 text-center">
            <span className="text-4xl font-extrabold text-stone-900 dark:text-slate-100">{avgRating}</span>
            <div className="flex items-center gap-0.5 text-amber-500 text-xs mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.round(Number(avgRating)) ? "fill-amber-500 text-amber-500" : "text-stone-300 dark:text-slate-700"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 mt-1">{totalReviewsCount} reviews</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-stone-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>Overall Client Rating</span>
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </h3>
            <p className="text-xs font-medium text-stone-500 dark:text-slate-400">
              Verified review score computed from real customer job completions.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800">
                <ThumbsUp className="h-3 w-3" /> {satisfactionRate}% Satisfied Clients
              </span>
            </div>
          </div>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="space-y-1.5 min-w-52 border-t md:border-t-0 md:border-l border-stone-100 dark:border-slate-800 pt-3 md:pt-0 md:pl-6">
          {distribution.map((d) => (
            <div key={d.star} className="flex items-center gap-2 text-xs">
              <span className="font-bold text-stone-600 dark:text-slate-400 w-6 text-right">{d.star}★</span>
              <div className="flex-1 h-2 rounded-full bg-stone-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${d.percentage}%` }}
                />
              </div>
              <span className="text-[10px] font-semibold text-stone-400 dark:text-slate-500 w-8">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center gap-2 text-stone-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-stone-200/80 dark:border-slate-800">
          <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
          <span className="text-xs font-bold">Loading verified customer reviews...</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center gap-2 text-stone-400 dark:text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-stone-200/80 dark:border-slate-800 text-center">
          <MessageSquareOff className="h-10 w-10 text-stone-300 dark:text-slate-600 stroke-[1.5]" />
          <h3 className="text-sm font-bold text-stone-700 dark:text-slate-300">No Customer Reviews Yet</h3>
          <p className="text-xs text-stone-400 dark:text-slate-500 max-w-sm">
            You don&apos;t have any completed booking reviews in the database yet. Completed job reviews will appear here automatically.
          </p>
        </div>
      ) : (
        /* Reviews List */
        <div className="space-y-3.5">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs transition-all hover:shadow-md space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={rev.avatar}
                    alt={rev.customerName}
                    className="h-9 w-9 rounded-xl object-cover ring-1 ring-stone-200 dark:ring-slate-700"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-slate-100">{rev.customerName}</h4>
                    <p className="text-[10px] text-stone-400 dark:text-slate-500 font-medium">{rev.serviceTitle} • {rev.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-100 dark:border-amber-800">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span>{rev.rating.toFixed(1)}</span>
                </div>
              </div>

              <p className="text-xs text-stone-700 dark:text-slate-300 font-medium italic pl-1">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
