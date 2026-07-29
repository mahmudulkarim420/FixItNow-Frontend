"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Calendar, Check, Clock, Home, ShieldCheck, Sparkles, UserCheck } from "lucide-react";
import { Suspense, useEffect, useState } from "react";

import Footer from "@/components/home/Footer";
import { NavbarClient } from "@/components/shared/navbar-client";
import { getBookingById } from "@/lib/bookings-payments-api";
import type { Booking } from "@/types";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      getBookingById(bookingId)
        .then((res) => {
          if (res) setBooking(res);
        })
        .catch(() => {
          /* Swallow error for fallback view */
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [bookingId]);

  return (
    <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6 lg:pt-36">
      <div className="rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-10 text-center shadow-xl backdrop-blur-md">
        {/* Success Icon Badge */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/30">
          <Check className="h-10 w-10 stroke-[3]" />
        </div>

        <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-1 text-xs font-extrabold text-amber-800 border border-amber-200/80">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          <span>Payment & Appointment Confirmed</span>
        </div>

        <h1 className="mt-3 text-3xl font-extrabold text-stone-950 sm:text-4xl tracking-tight">
          Payment Successful!
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
          Your payment has been processed and your service booking is officially confirmed. Our certified technician will arrive at the scheduled time slot.
        </p>

        {/* Booking Details Card */}
        {booking ? (
          <div className="mt-8 rounded-2xl border border-stone-200/80 bg-stone-50/70 p-5 text-left space-y-3.5">
            <div className="flex items-center justify-between border-b border-stone-200/60 pb-3">
              <span className="text-xs font-extrabold uppercase text-stone-400">Booking ID</span>
              <span className="font-mono text-xs font-bold text-stone-900">{booking.id}</span>
            </div>

            {booking.service ? (
              <div className="flex items-center justify-between border-b border-stone-200/60 pb-3">
                <span className="text-xs font-extrabold uppercase text-stone-400">Service</span>
                <span className="text-xs font-bold text-stone-900">{booking.service.title}</span>
              </div>
            ) : null}

            <div className="flex items-center justify-between border-b border-stone-200/60 pb-3">
              <span className="text-xs font-extrabold uppercase text-stone-400">Scheduled Visit</span>
              <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-amber-600" />
                {booking.scheduledDate} ({booking.timeSlot})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-stone-400">Total Paid</span>
              <span className="text-lg font-black text-amber-800">${booking.servicePrice}</span>
            </div>
          </div>
        ) : null}

        {/* Trust Badges */}
        <div className="mt-8 grid grid-cols-2 gap-3 text-left">
          <div className="flex items-center gap-2.5 rounded-xl border border-stone-200/70 bg-white p-3 text-xs font-bold text-stone-700">
            <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0" />
            <span>30-Day Work Warranty</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-stone-200/70 bg-white p-3 text-xs font-bold text-stone-700">
            <UserCheck className="h-4 w-4 text-amber-600 shrink-0" />
            <span>Background Checked Pro</span>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard/customer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-6 py-3.5 text-xs font-extrabold text-stone-950 shadow-md transition hover:bg-amber-400"
          >
            <span>View My Bookings Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-6 py-3.5 text-xs font-bold text-stone-700 hover:bg-stone-50 transition"
          >
            <Home className="h-4 w-4" />
            <span>Browse More Services</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#F9F7F2] text-stone-900">
      <NavbarClient user={null} />
      <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-xs font-bold text-stone-500">Loading payment status...</div>}>
        <PaymentSuccessContent />
      </Suspense>
      <Footer />
    </div>
  );
}
