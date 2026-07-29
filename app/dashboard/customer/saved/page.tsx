"use client";

import Link from "next/link";
import { Star, ShieldCheck, Wrench, Heart, Phone } from "lucide-react";

const SAVED_PROS = [
  {
    id: "PRO-01",
    name: "Alex Turner",
    specialty: "HVAC & Air Conditioning Specialist",
    rating: "4.9 ★ (142 reviews)",
    hourlyRate: "$55.00 / hr",
    isVerified: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "PRO-02",
    name: "Robert Chen",
    specialty: "Master Plumber & Pipe Leak Expert",
    rating: "4.8 ★ (98 reviews)",
    hourlyRate: "$60.00 / hr",
    isVerified: true,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "PRO-03",
    name: "Marcus Vance",
    specialty: "Licensed Electrical Contractor",
    rating: "5.0 ★ (210 reviews)",
    hourlyRate: "$50.00 / hr",
    isVerified: true,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
  },
];

export default function CustomerSavedProsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
          Saved Technicians & Pros
        </h1>
        <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
          Quickly rebook trusted, verified local technicians saved in your favorites list.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {SAVED_PROS.map((pro) => (
          <div
            key={pro.id}
            className="group rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pro.avatar}
                    alt={pro.name}
                    className="h-12 w-12 rounded-2xl object-cover ring-2 ring-stone-100 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="text-base font-bold text-stone-900">{pro.name}</h3>
                      <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                    </div>
                    <p className="text-xs text-stone-400 font-medium">{pro.specialty}</p>
                  </div>
                </div>

                <button aria-label="Remove from saved" className="text-rose-500 hover:scale-110 transition-transform">
                  <Heart className="h-5 w-5 fill-rose-500" />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs font-bold">
                <span className="text-amber-600">{pro.rating}</span>
                <span className="text-stone-900 font-extrabold">{pro.hourlyRate}</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-end">
              <Link
                href="/services"
                className="w-full flex items-center justify-center gap-1 rounded-xl bg-stone-900 py-2 text-xs font-bold text-white shadow-xs hover:bg-stone-800 transition-colors"
              >
                <span>Book Again</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
