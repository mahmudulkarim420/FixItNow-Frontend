"use client";

import { useEffect, useState } from "react";
import { CustomerKpiCards } from "@/components/dashboard/customer/overview/customer-kpi-cards";
import { CustomerAnalytics } from "@/components/dashboard/customer/overview/customer-analytics";
import { CustomerWidget } from "@/components/dashboard/customer/overview/customer-widget";
import { getUserBookings, getUserPaymentHistory } from "@/lib/bookings-payments-api";
import type { User, Booking, Payment } from "@/types";

interface CustomerOverviewClientProps {
  user: User;
}

export function CustomerOverviewClient({ user }: CustomerOverviewClientProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOverviewData() {
      try {
        setLoading(true);
        const [bookingsData, paymentsData] = await Promise.all([
          getUserBookings().catch(() => []),
          getUserPaymentHistory().catch(() => []),
        ]);
        setBookings(bookingsData || []);
        setPayments(paymentsData || []);
      } catch {
        // Fallback to empty state on error
      } finally {
        setLoading(false);
      }
    }
    loadOverviewData();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Top KPI Cards & Welcome Header */}
      <CustomerKpiCards user={user} bookings={bookings} payments={payments} loading={loading} />

      {/* Middle Row: Monthly Expense Chart, Live Dispatch Status & Recent Bookings */}
      <CustomerAnalytics bookings={bookings} payments={payments} loading={loading} />

      {/* Bottom Row: Favorite Pros, Home Health Score & 24/7 Emergency Dispatch */}
      <CustomerWidget />
    </div>
  );
}
