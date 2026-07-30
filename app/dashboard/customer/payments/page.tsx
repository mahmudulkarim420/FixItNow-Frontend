"use client";

import { useEffect, useState } from "react";
import { Download, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { getUserPaymentHistory } from "@/lib/bookings-payments-api";
import type { Payment } from "@/types";

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPayments() {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserPaymentHistory();
        setPayments(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch payment history");
      } finally {
        setLoading(false);
      }
    }
    loadPayments();
  }, []);

  const totalSpent = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
            Payments & Invoices
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
            View payment receipts, download invoice summaries, and manage billing history.
          </p>
        </div>

        <button
          onClick={() => alert("All invoice receipts summary downloaded.")}
          className="flex items-center gap-1.5 rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-bold text-stone-700 shadow-xs hover:bg-stone-50 self-start sm:self-auto"
        >
          <Download className="h-4 w-4 text-stone-500" />
          <span>Download All Receipts</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-3xl bg-stone-900 p-5 text-white shadow-md">
          <span className="text-xs font-medium text-stone-400">Total Lifetime Investment</span>
          <div className="mt-2 text-3xl font-extrabold text-white">
            ${totalSpent.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <span className="mt-2 inline-block rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
            {payments.length} Repair Payment Transactions
          </span>
        </div>

        <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500">Payment Security</span>
            <div className="mt-1 text-sm font-bold text-stone-900">256-Bit Encrypted Payments</div>
            <p className="mt-1 text-xs text-stone-400">Processed securely via Stripe Checkout.</p>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            <span>SSL Protected</span>
          </div>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="rounded-3xl border border-stone-200/80 bg-white shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100">
          <h3 className="text-sm font-bold text-stone-900">Paid Invoices & Receipts</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12 text-stone-500">
            <Loader2 className="h-6 w-6 animate-spin text-amber-500 mr-2" />
            <span className="text-xs font-bold">Loading payment receipts...</span>
          </div>
        ) : error ? (
          <div className="p-4 m-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400 font-medium">
            No payment history found. Payments will appear here after completing dispatches via Stripe Checkout.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-extrabold text-[10px] border-b border-stone-200/80">
                <tr>
                  <th className="py-3.5 px-4">Invoice #</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Method / Trans ID</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-900">
                {payments.map((inv) => {
                  const formattedDate = inv.createdAt
                    ? new Date(inv.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A";

                  return (
                    <tr key={inv.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                        INV-{inv.id.substring(0, 6)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-stone-900">
                        {inv.booking?.service?.title || "Repair Service"}
                      </td>
                      <td className="py-3.5 px-4 text-stone-500 font-mono text-[11px]">
                        Stripe • {inv.transactionId ? inv.transactionId.substring(0, 12) + "..." : "Online Card"}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-stone-900">
                        ${Number(inv.amount || 0).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-100 uppercase">
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-stone-400">{formattedDate}</td>
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
