"use client";

import { Star, MessageSquare } from "lucide-react";

const MY_REVIEWS = [
  {
    id: "REV-101",
    techName: "Alex Turner",
    service: "AC Repair & Coil Servicing",
    rating: 5,
    comment: "Punctual, super friendly, and fixed my AC in under 20 minutes!",
    date: "Jul 29, 2026",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "REV-102",
    techName: "Robert Chen",
    service: "Emergency Plumbing Pipe Leak",
    rating: 5,
    comment: "Excellent master plumber. Solved the leak quickly without any mess.",
    date: "Jul 28, 2026",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
  },
];

export default function CustomerReviewsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
          My Ratings & Service Feedback
        </h1>
        <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
          View ratings and review comments you submitted for repair technicians.
        </p>
      </div>

      {/* Reviews List */}
      <div className="space-y-3.5">
        {MY_REVIEWS.map((rev) => (
          <div
            key={rev.id}
            className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={rev.avatar}
                  alt={rev.techName}
                  className="h-9 w-9 rounded-xl object-cover ring-1 ring-stone-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">{rev.techName}</h4>
                  <p className="text-[10px] text-stone-400 font-medium">{rev.service} • {rev.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span>{rev.rating}.0 Rating</span>
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
