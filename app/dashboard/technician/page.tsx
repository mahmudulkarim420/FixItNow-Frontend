import { requireRole } from "@/lib/auth";

export const metadata = { title: "Technician Dashboard · FixItNow" };

export default async function TechnicianDashboard() {
  const user = await requireRole("TECHNICIAN");

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
        Welcome, {user.name.split(" ")[0]} 🔧
      </h1>
      <p className="mt-2 text-zinc-500">
        This is your technician dashboard. Manage your services, bookings, and
        profile here.
      </p>
    </main>
  );
}
