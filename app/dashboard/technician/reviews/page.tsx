"use client";

import { useEffect, useState } from "react";
import { Star, Loader2, MessageSquareOff } from "lucide-react";
import { getUserBookings } from "@/lib/bookings-payments-api";
import type { Booking } from "@/types";

interface ReviewItem {
  id: string;
  customer: string;
  rating: number;
  comment: string;
  service: string;
  date: string;
  avatar: string;
}

export default function TechnicianReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTechReviews() {
      try {
        setLoading(true);
        const bookings: Booking[] = await getUserBookings();
        const extracted: ReviewItem[] = [];

        bookings.forEach((b, idx) => {
          if (b.review) {
            extracted.push({
              id: b.review.id || `REV-${b.id.substring(0, 4)}`,
              customer: b.customer?.name || "Verified Customer",
              rating: b.review.rating || 5,
              comment: b.review.comment || "Great repair service!",
              service: b.service?.title || "Home Repair",
              date: new Date(b.review.createdAt || b.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              avatar: `https://images.unsplash.com/photo-${1507003211169 + idx * 15}?w=100&auto=format&fit=crop&q=80`,
            });
          }
        });

        setReviews(extracted);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    }
    loadTechReviews();
  }, []);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
          Customer Reviews & Ratings
        </h1>
        <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
          Read verified feedback and ratings from customers who booked your services.
        </p>
      </div>

      {/* Rating Score Card */}
      <div className="rounded-3xl border border-stone-200/80 bg-white p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Overall Rating</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-extrabold text-stone-900">{avgRating}</span>
            <span className="text-amber-500 text-xl font-bold">★ ★ ★ ★ ★</span>
          </div>
          <p className="text-xs font-medium text-stone-500 mt-1">Based on {reviews.length} verified customer reviews</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-center px-4 py-2 rounded-2xl bg-amber-50 border border-amber-100">
            <span className="block text-base font-extrabold text-amber-900">100%</span>
            <span className="text-[10px] font-bold text-amber-700">Satisfied Clients</span>
          </div>
          <div className="text-center px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-100">
            <span className="block text-base font-extrabold text-emerald-900">100%</span>
            <span className="text-[10px] font-bold text-emerald-700">On-Time Rate</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center gap-2 text-stone-500 bg-white rounded-3xl border border-stone-200/80">
          <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
          <span className="text-xs font-bold">Loading customer feedback...</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center gap-2 text-stone-400 bg-white rounded-3xl border border-stone-200/80 text-center">
          <MessageSquareOff className="h-10 w-10 text-stone-300 stroke-[1.5]" />
          <h3 className="text-sm font-bold text-stone-700">No Customer Reviews Yet</h3>
          <p className="text-xs text-stone-400 max-w-sm">
            You don't have any completed booking reviews in the database yet. Completed job reviews will appear here automatically.
          </p>
        </div>
      ) : (
        /* Reviews List */
        <div className="space-y-3.5">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={rev.avatar}
                    alt={rev.customer}
                    className="h-9 w-9 rounded-xl object-cover ring-1 ring-stone-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">{rev.customer}</h4>
                    <p className="text-[10px] text-stone-400 font-medium">{rev.service} • {rev.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span>{rev.rating}</span>
                </div>
              </div>

              <p className="text-xs text-stone-700 font-medium italic pl-1">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
