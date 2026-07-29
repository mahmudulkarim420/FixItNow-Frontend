import { requireRole } from "@/lib/auth";
import { TechnicianDashboardClient } from "@/components/dashboard/technician-dashboard-client";

export const metadata = {
  title: "Technician Dashboard · FixItNow",
  description: "FixItNow Technician Dashboard - Manage job dispatches, earnings, and availability.",
};

export default async function TechnicianDashboardPage() {
  const user = await requireRole("TECHNICIAN");

  return <TechnicianDashboardClient user={user} />;
}
