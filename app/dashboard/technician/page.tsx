import { getSessionUser } from "@/lib/auth";
import { TechnicianOverviewClient } from "@/components/dashboard/technician/overview/technician-overview-client";

export const metadata = {
  title: "Dashboard Overview · FixItNow Technician",
};

export default async function TechnicianOverviewPage() {
  const user = await getSessionUser();

  if (!user) return null;

  return <TechnicianOverviewClient initialUser={user} />;
}

