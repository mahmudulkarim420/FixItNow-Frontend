import { requireRole } from "@/lib/auth";

export const metadata = { title: "Customer Dashboard · FixItNow" };

export default async function CustomerDashboard() {
  const user = await requireRole("CUSTOMER");

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
        Welcome, {user.name.split(" ")[0]} 👋
      </h1>
      <p className="mt-2 text-zinc-500">
        This is your customer dashboard. Book services, track bookings, and
        manage payments here.
      </p>
    </main>
  );
}
