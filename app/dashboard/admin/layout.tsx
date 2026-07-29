import { requireRole } from "@/lib/auth";
import { AdminLayoutClient } from "@/components/dashboard/admin-layout-client";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole("ADMIN");

  return <AdminLayoutClient user={user}>{children}</AdminLayoutClient>;
}
