"use client";

import { Star, MessageSquare } from "lucide-react";

const RECENT_REVIEWS = [
  {
    id: "REV-101",
    customer: "David Miller",
    rating: 5,
    comment: "Punctual, super friendly, and fixed my AC in under 20 minutes!",
    service: "AC Coil Cleaning",
    date: "Jul 29, 2026",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "REV-102",
    customer: "Sarah Jenkins",
    rating: 5,
    comment: "Extremely professional AC servicing. Highly recommended!",
    service: "Central AC Repair",
    date: "Jul 28, 2026",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "REV-103",
    customer: "James Wilson",
    rating: 4.8,
    comment: "Great work on the main breaker panel installation.",
    service: "Electrical Repair",
    date: "Jul 24, 2026",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
  },
];

export default function TechnicianReviewsPage() {
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
            <span className="text-4xl font-extrabold text-stone-900">4.9</span>
            <span className="text-amber-500 text-xl font-bold">★ ★ ★ ★ ★</span>
          </div>
          <p className="text-xs font-medium text-stone-500 mt-1">Based on 52 verified customer reviews</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-center px-4 py-2 rounded-2xl bg-amber-50 border border-amber-100">
            <span className="block text-base font-extrabold text-amber-900">96%</span>
            <span className="text-[10px] font-bold text-amber-700">5-Star Ratio</span>
          </div>
          <div className="text-center px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-100">
            <span className="block text-base font-extrabold text-emerald-900">100%</span>
            <span className="text-[10px] font-bold text-emerald-700">On-Time Rate</span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3.5">
        {RECENT_REVIEWS.map((rev) => (
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
    </div>
  );
}
