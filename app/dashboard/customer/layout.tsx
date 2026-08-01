import { requireRole } from "@/lib/auth";
import { CustomerLayoutClient } from "@/components/dashboard/customer/layout/customer-layout-client";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole("CUSTOMER");

  return <CustomerLayoutClient user={user}>{children}</CustomerLayoutClient>;
}
