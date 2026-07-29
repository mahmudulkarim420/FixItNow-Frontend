"use client";

import { useState } from "react";
import { Star, Search, ShieldCheck, Trash2, CheckCircle2 } from "lucide-react";

const MOCK_REVIEWS = [
  {
    id: "REV-501",
    customer: "David Miller",
    technician: "Alex Turner",
    service: "AC Repair & Servicing",
    rating: 5,
    comment: "Punctual, super friendly, and fixed my AC in under an hour!",
    date: "Jul 29, 2026",
    status: "APPROVED",
  },
  {
    id: "REV-502",
    customer: "Sarah Jenkins",
    technician: "Robert Chen",
    service: "Emergency Plumbing Pipe Leak",
    rating: 5,
    comment: "Excellent master plumber. Solved the leak quickly without any mess.",
    date: "Jul 28, 2026",
    status: "APPROVED",
  },
  {
    id: "REV-503",
    customer: "Spam Account",
    technician: "Marcus Vance",
    service: "Electrical Safety Check",
    rating: 1,
    comment: "Fake review spam text containing inappropriate content.",
    date: "Jul 27, 2026",
    status: "FLAGGED",
  },
];

export default function AdminReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReviews = MOCK_REVIEWS.filter(
    (r) =>
      r.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
            Reviews & Ratings Moderation
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
            Review customer ratings, inspect feedback comments, and moderate flagged reviews.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 rounded-3xl border border-stone-200/80 bg-white p-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reviews, customer name, technician..."
            className="w-full rounded-2xl border border-stone-200/80 bg-stone-50 py-2 pl-10 pr-4 text-xs font-medium text-stone-900 placeholder:text-stone-400 outline-none focus:border-amber-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Reviews Roster */}
      <div className="space-y-4">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3 mb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-xs text-stone-400">{rev.id}</span>
                <span className="text-xs font-bold text-stone-900">{rev.customer}</span>
                <span className="text-xs text-stone-400">reviewed</span>
                <span className="text-xs font-extrabold text-amber-700">{rev.technician}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span>{rev.rating}.0 Rating</span>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    rev.status === "APPROVED"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-rose-50 text-rose-700 border border-rose-100 animate-pulse"
                  }`}
                >
                  {rev.status}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-700 font-medium italic mb-3">
              "{rev.comment}"
            </p>

            <div className="flex items-center justify-between text-[11px] font-semibold text-stone-400 pt-2 border-t border-stone-50">
              <span>Service: {rev.service} • {rev.date}</span>

              <div className="flex items-center gap-2">
                {rev.status === "FLAGGED" && (
                  <button className="flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Approve</span>
                  </button>
                )}
                <button className="flex items-center gap-1 rounded-xl bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600 hover:bg-rose-600 hover:text-white transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
