import { requireRole } from "@/lib/auth";
import { TechnicianLayoutClient } from "@/components/dashboard/technician/layout/technician-layout-client";

export default async function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole("TECHNICIAN");

  return <TechnicianLayoutClient user={user}>{children}</TechnicianLayoutClient>;
}
