"use client";

import { CreditCard, Download, CheckCircle2, Receipt } from "lucide-react";

const MOCK_CUSTOMER_INVOICES = [
  {
    id: "INV-9901",
    bookingId: "BK-9021",
    service: "AC Repair & Coil Servicing",
    amount: "$180.00",
    method: "Stripe / Visa •••• 4242",
    date: "Jul 29, 2026",
    status: "PAID",
  },
  {
    id: "INV-9902",
    bookingId: "BK-9019",
    service: "Electrical Panel Safety Check",
    amount: "$150.00",
    method: "Stripe / Mastercard •••• 8888",
    date: "Jul 24, 2026",
    status: "PAID",
  },
  {
    id: "INV-9903",
    bookingId: "BK-9018",
    service: "Dishwasher Inspection",
    amount: "$95.00",
    method: "Stripe / Apple Pay",
    date: "Jul 18, 2026",
    status: "PAID",
  },
];

export default function CustomerPaymentsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
            Payments & Invoices
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
            View payment receipts, download invoice PDFs, and manage billing history.
          </p>
        </div>

        <button className="flex items-center gap-1.5 rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-bold text-stone-700 shadow-xs hover:bg-stone-50">
          <Download className="h-4 w-4 text-stone-500" />
          <span>Download All Receipts</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-3xl bg-stone-900 p-5 text-white shadow-md">
          <span className="text-xs font-medium text-stone-400">Total Lifetime Investment</span>
          <div className="mt-2 text-3xl font-extrabold text-white">$1,280.00</div>
          <span className="mt-2 inline-block rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
            14 Repair Orders Paid
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

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-extrabold text-[10px] border-b border-stone-200/80">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-stone-900">
              {MOCK_CUSTOMER_INVOICES.map((inv) => (
                <tr key={inv.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{inv.id}</td>
                  <td className="py-3.5 px-4 font-bold text-stone-900">{inv.service}</td>
                  <td className="py-3.5 px-4 text-stone-500">{inv.method}</td>
                  <td className="py-3.5 px-4 font-extrabold text-stone-900">{inv.amount}</td>
                  <td className="py-3.5 px-4">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-stone-400">{inv.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
