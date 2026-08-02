"use client";

import { useEffect, useState } from "react";
import { TechnicianKpiCards } from "@/components/dashboard/technician/overview/technician-stat-cards";
import { TechnicianAnalytics } from "@/components/dashboard/technician/overview/technician-workload-chart";
import { TechnicianWidget } from "@/components/dashboard/technician/overview/dispatch-queue-widget";
import { getTechnicianBookings } from "@/lib/technician-api";
import { getCurrentUser } from "@/lib/api";
import type { Booking, TechnicianProfile, User } from "@/types";

interface TechnicianOverviewClientProps {
  initialUser: User;
}

export function TechnicianOverviewClient({ initialUser }: TechnicianOverviewClientProps) {
  const [user, setUser] = useState<User>(initialUser);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<TechnicianProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [freshUser, freshBookings] = await Promise.all([
          getCurrentUser().catch(() => initialUser),
          getTechnicianBookings().catch(() => []),
        ]);

        setUser(freshUser);
        setBookings(freshBookings);

        if (freshUser.technicianProfile) {
          setProfile(freshUser.technicianProfile as TechnicianProfile);
        }
      } catch {
        /* Keep initial state */
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [initialUser]);

  return (
    <div className="flex flex-col gap-6">
      {/* Top KPI Cards & Welcome Header */}
      <TechnicianKpiCards user={user} bookings={bookings} profile={profile} />

      {/* Middle Row: Hours Chart, Next Dispatch Alert & Assigned Schedule */}
      <TechnicianAnalytics bookings={bookings} />

      {/* Bottom Row: Customer Reviews, Verification Score & Active Job Timer */}
      <TechnicianWidget bookings={bookings} profile={profile} />
    </div>
  );
}
