import { getSessionUser } from "@/lib/auth";
import { TechnicianKpiCards } from "@/components/dashboard/technician-kpi-cards";
import { TechnicianAnalytics } from "@/components/dashboard/technician-analytics";
import { TechnicianWidget } from "@/components/dashboard/technician-widget";

export const metadata = {
  title: "Dashboard Overview · FixItNow Technician",
};

export default async function TechnicianOverviewPage() {
  const user = await getSessionUser();

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Top KPI Cards & Welcome Header */}
      <TechnicianKpiCards user={user} />

      {/* Middle Row: Hours Chart, Next Dispatch Alert & Today's Schedule */}
      <TechnicianAnalytics />

      {/* Bottom Row: Customer Reviews, Verification Score & Active Job Timer */}
      <TechnicianWidget />
    </div>
  );
}
