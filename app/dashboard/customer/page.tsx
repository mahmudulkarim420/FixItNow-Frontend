import { requireRole } from "@/lib/auth";
import { CustomerDashboardClient } from "@/components/dashboard/customer-dashboard-client";

export const metadata = {
  title: "Customer Dashboard · FixItNow",
  description: "FixItNow Customer Dashboard - Manage your bookings, home repairs, and payment invoices.",
};

export default async function CustomerDashboardPage() {
  const user = await requireRole("CUSTOMER");

  return <CustomerDashboardClient user={user} />;
}
