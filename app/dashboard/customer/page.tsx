import { getSessionUser } from "@/lib/auth";
import { CustomerKpiCards } from "@/components/dashboard/customer-kpi-cards";
import { CustomerAnalytics } from "@/components/dashboard/customer-analytics";
import { CustomerWidget } from "@/components/dashboard/customer-widget";

export const metadata = {
  title: "Dashboard Overview · FixItNow Customer",
};

export default async function CustomerOverviewPage() {
  const user = await getSessionUser();

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Top KPI Cards & Welcome Header */}
      <CustomerKpiCards user={user} />

      {/* Middle Row: Monthly Expense Chart, Live Dispatch Status & Recent Bookings */}
      <CustomerAnalytics />

      {/* Bottom Row: Favorite Pros, Home Health Score & 24/7 Emergency Dispatch */}
      <CustomerWidget />
    </div>
  );
}
