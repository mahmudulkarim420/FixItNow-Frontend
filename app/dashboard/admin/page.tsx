import { AdminKpiCards } from "@/components/dashboard/admin/overview/admin-kpi-cards";
import { AdminAnalyticsSection } from "@/components/dashboard/admin/overview/admin-analytics-section";
import { AdminTeamWidget } from "@/components/dashboard/admin/overview/admin-team-widget";

export const metadata = {
  title: "Dashboard Overview · FixItNow Admin",
};

export default function AdminOverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Top KPI Cards & Title Header */}
      <AdminKpiCards />

      {/* Middle Row: Analytics Bar Chart, Reminders & Projects List */}
      <AdminAnalyticsSection />

      {/* Bottom Row: Team Collaboration Roster, Donut Progress & Time Tracker */}
      <AdminTeamWidget />
    </div>
  );
}
