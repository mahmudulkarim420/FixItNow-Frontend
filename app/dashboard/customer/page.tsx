import { getSessionUser } from "@/lib/auth";
import { CustomerOverviewClient } from "@/components/dashboard/customer-overview-client";

export const metadata = {
  title: "Dashboard Overview · FixItNow Customer",
};

export default async function CustomerOverviewPage() {
  const user = await getSessionUser();

  if (!user) return null;

  return <CustomerOverviewClient user={user} />;
}
