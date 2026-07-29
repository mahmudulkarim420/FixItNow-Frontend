import { requireRole } from "@/lib/auth";

export const metadata = { title: "Admin Dashboard · FixItNow" };

export default async function AdminDashboard() {
  const user = await requireRole("ADMIN");

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
        Admin Console
      </h1>
      <p className="mt-2 text-zinc-500">
        Signed in as {user.name}. Manage users, bookings, payments, and
        categories here.
      </p>
    </main>
  );
}
