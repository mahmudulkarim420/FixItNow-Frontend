"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowRight, CreditCard, Home, Loader2, RefreshCw } from "lucide-react";
import { Suspense, useState } from "react";

import Footer from "@/components/home/Footer";
import { NavbarClient } from "@/components/shared/navbar-client";
import { createCheckoutSession } from "@/lib/bookings-payments-api";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRetryPayment = async () => {
    if (!bookingId) return;
    setRetrying(true);
    setError(null);

    try {
      const checkoutRes = await createCheckoutSession(bookingId);
      if (checkoutRes && checkoutRes.url) {
        window.location.href = checkoutRes.url;
      } else {
        throw new Error("Could not initialize Stripe Checkout.");
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj?.message || "Payment retry failed. Please try again from your dashboard.");
      setRetrying(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 pb-20 pt-28 sm:px-6 lg:pt-36">
      <div className="rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-10 text-center shadow-xl backdrop-blur-md">
        {/* Cancel Warning Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-100 text-amber-700">
          <AlertTriangle className="h-8 w-8 text-amber-600" />
        </div>

        <h1 className="mt-5 text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Payment Process Cancelled
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
          You cancelled the checkout session before completing payment. Your booking request has been saved in your account.
        </p>

        {error ? (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-800 border border-red-200 text-left">
            {error}
          </div>
        ) : null}

        {/* Retry & Navigation Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          {bookingId ? (
            <button
              type="button"
              disabled={retrying}
              onClick={handleRetryPayment}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-6 py-3.5 text-xs font-extrabold text-stone-950 shadow-md transition hover:bg-amber-400 disabled:opacity-50 cursor-pointer"
            >
              {retrying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-stone-950" />
                  <span>Connecting to Stripe...</span>
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 text-stone-950" />
                  <span>Retry Stripe Payment</span>
                </>
              )}
            </button>
          ) : null}

          <Link
            href="/services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-6 py-3.5 text-xs font-bold text-stone-700 hover:bg-stone-50 transition"
          >
            <Home className="h-4 w-4" />
            <span>Return to Services</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-[#F9F7F2] text-stone-900">
      <NavbarClient user={null} />
      <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-xs font-bold text-stone-500">Loading...</div>}>
        <PaymentCancelContent />
      </Suspense>
      <Footer />
    </div>
  );
}
