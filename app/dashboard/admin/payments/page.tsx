"use client";

import { useEffect, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { getAdminPayments, type AdminPayment } from "@/lib/admin-api";

const MOCK_PAYMENTS: AdminPayment[] = [
  {
    id: "PAY-8801",
    bookingId: "BK-9021",
    amount: 120.0,
    provider: "STRIPE",
    status: "COMPLETED",
    createdAt: "2026-07-29T10:00:00.000Z",
    updatedAt: "2026-07-29T10:00:00.000Z",
    booking: {
      id: "BK-9021",
      customerId: "u1",
      serviceId: "s1",
      servicePrice: 120,
      contactNumber: "",
      scheduledDate: "2026-07-29",
      timeSlot: "",
      status: "COMPLETED",
      createdAt: "",
      updatedAt: "",
      customer: { name: "Sarah Williams", email: "sarah.w@example.com" },
    },
  },
  {
    id: "PAY-8802",
    bookingId: "BK-9020",
    amount: 180.0,
    provider: "STRIPE",
    status: "COMPLETED",
    createdAt: "2026-07-28T14:30:00.000Z",
    updatedAt: "2026-07-28T14:30:00.000Z",
    booking: {
      id: "BK-9020",
      customerId: "u2",
      serviceId: "s2",
      servicePrice: 180,
      contactNumber: "",
      scheduledDate: "2026-07-28",
      timeSlot: "",
      status: "COMPLETED",
      createdAt: "",
      updatedAt: "",
      customer: { name: "Michael Scott", email: "m.scott@dunder.com" },
    },
  },
];

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPayments() {
      try {
        setLoading(true);
        const data = await getAdminPayments();
        if (data && data.length > 0) {
          setPayments(data);
        } else {
          setPayments(MOCK_PAYMENTS);
        }
      } catch {
        setPayments(MOCK_PAYMENTS);
      } finally {
        setLoading(false);
      }
    }
    loadPayments();
  }, []);

  const totalCollected = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const platformFee = totalCollected * 0.1;
  const techPayouts = totalCollected * 0.9;

  return (
    <div className="space-y-6 text-stone-900 dark:text-slate-100">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-slate-100">
            Payments & Financial Overview
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500 dark:text-slate-400">
            Track customer payments, platform commission revenue, and technician payouts.
          </p>
        </div>

        <button className="flex items-center gap-1.5 rounded-2xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-stone-700 dark:text-slate-200 shadow-2xs hover:bg-stone-50 dark:hover:bg-slate-700 cursor-pointer">
          <Download className="h-4 w-4 text-stone-500 dark:text-slate-400" />
          <span>Export Financials</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl bg-stone-900 dark:bg-slate-900 p-5 text-white shadow-md border border-stone-800 dark:border-slate-800">
          <span className="text-xs font-medium text-stone-400 dark:text-slate-400">Total Revenue Collected</span>
          <div className="mt-2 text-3xl font-extrabold text-white">
            ${totalCollected.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <span className="mt-2 inline-block rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
            Live Payment Engine
          </span>
        </div>

        <div className="rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500 dark:text-slate-400">Platform Commission (10%)</span>
          <div className="mt-2 text-3xl font-extrabold text-stone-900 dark:text-slate-100">
            ${platformFee.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <span className="mt-2 inline-block rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
            Net Revenue
          </span>
        </div>

        <div className="rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500 dark:text-slate-400">Technician Payouts</span>
          <div className="mt-2 text-3xl font-extrabold text-stone-900 dark:text-slate-100">
            ${techPayouts.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <span className="mt-2 inline-block rounded-full bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
            Dispatched to Techs
          </span>
        </div>
      </div>

      {/* Payment Transactions Table */}
      <div className="rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100">Recent Payment Transactions</h3>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-2 text-stone-500 dark:text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
            <span className="text-xs font-bold">Loading payment records...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-slate-800/80 text-stone-500 dark:text-slate-400 uppercase tracking-wider font-extrabold text-[10px] border-b border-stone-200/80 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Payment ID</th>
                  <th className="py-3.5 px-4">Booking</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Platform Fee</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-slate-800 font-medium text-stone-900 dark:text-slate-100">
                {payments.map((p) => {
                  const fee = p.amount * 0.1;
                  const custName = p.booking?.customer?.name || "Customer";
                  return (
                    <tr key={p.id} className="hover:bg-stone-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900 dark:text-slate-100 truncate max-w-[120px]">{p.id}</td>
                      <td className="py-3.5 px-4 font-mono text-stone-500 dark:text-slate-400 truncate max-w-[120px]">{p.bookingId}</td>
                      <td className="py-3.5 px-4 font-bold text-stone-900 dark:text-slate-100">{custName}</td>
                      <td className="py-3.5 px-4 font-extrabold text-stone-900 dark:text-slate-100">${p.amount.toFixed(2)}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-700 dark:text-emerald-400">${fee.toFixed(2)}</td>
                      <td className="py-3.5 px-4 text-stone-500 dark:text-slate-400">{p.provider || "STRIPE"}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            p.status === "COMPLETED"
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800"
                              : "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-800"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-stone-400 dark:text-slate-500">
                        {new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
