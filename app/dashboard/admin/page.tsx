import { requireRole } from "@/lib/auth";
import { AdminDashboardClient } from "@/components/dashboard/admin-dashboard-client";

export const metadata = {
  title: "Admin Dashboard · FixItNow",
  description: "FixItNow Admin Dashboard - Manage bookings, services, and team dispatches.",
};

export default async function AdminDashboardPage() {
  const user = await requireRole("ADMIN");

  return <AdminDashboardClient user={user} />;
}
