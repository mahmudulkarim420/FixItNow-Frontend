"use client";

import { useState } from "react";
import { CreditCard, DollarSign, Download, ArrowUpRight, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const MOCK_PAYMENTS = [
  {
    id: "PAY-8801",
    bookingId: "BK-9021",
    customer: "Sarah Williams",
    amount: "$120.00",
    fee: "$12.00",
    net: "$108.00",
    method: "Stripe / Card",
    status: "COMPLETED",
    date: "Jul 29, 2026",
  },
  {
    id: "PAY-8802",
    bookingId: "BK-9020",
    customer: "Michael Scott",
    amount: "$180.00",
    fee: "$18.00",
    net: "$162.00",
    method: "Stripe / Card",
    status: "COMPLETED",
    date: "Jul 28, 2026",
  },
  {
    id: "PAY-8803",
    bookingId: "BK-9019",
    customer: "Emily Watson",
    amount: "$150.00",
    fee: "$15.00",
    net: "$135.00",
    method: "Stripe / Card",
    status: "COMPLETED",
    date: "Jul 26, 2026",
  },
  {
    id: "PAY-8804",
    bookingId: "BK-9017",
    customer: "Jennifer Lopez",
    amount: "$140.00",
    fee: "$0.00",
    net: "$0.00",
    method: "Stripe / Refund",
    status: "REFUNDED",
    date: "Jul 22, 2026",
  },
];

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
            Payments & Financial Overview
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
            Track customer payments, platform commission revenue, and technician payouts.
          </p>
        </div>

        <button className="flex items-center gap-1.5 rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-bold text-stone-700 shadow-xs hover:bg-stone-50">
          <Download className="h-4 w-4 text-stone-500" />
          <span>Export Financials</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl bg-stone-900 p-5 text-white shadow-md">
          <span className="text-xs font-medium text-stone-400">Total Revenue Collected</span>
          <div className="mt-2 text-3xl font-extrabold text-white">$14,850.00</div>
          <span className="mt-2 inline-block rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
            +14% from last month
          </span>
        </div>

        <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Platform Commission (10%)</span>
          <div className="mt-2 text-3xl font-extrabold text-stone-900">$1,485.00</div>
          <span className="mt-2 inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
            Net Revenue
          </span>
        </div>

        <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Technician Payouts</span>
          <div className="mt-2 text-3xl font-extrabold text-stone-900">$13,365.00</div>
          <span className="mt-2 inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
            Dispatched to Techs
          </span>
        </div>
      </div>

      {/* Payment Transactions Table */}
      <div className="rounded-3xl border border-stone-200/80 bg-white shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900">Recent Payment Transactions</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-extrabold text-[10px] border-b border-stone-200/80">
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
            <tbody className="divide-y divide-stone-100 font-medium text-stone-900">
              {MOCK_PAYMENTS.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{p.id}</td>
                  <td className="py-3.5 px-4 font-mono text-stone-500">{p.bookingId}</td>
                  <td className="py-3.5 px-4 font-bold text-stone-900">{p.customer}</td>
                  <td className="py-3.5 px-4 font-extrabold text-stone-900">{p.amount}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">{p.fee}</td>
                  <td className="py-3.5 px-4 text-stone-500">{p.method}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        p.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-rose-50 text-rose-700 border border-rose-100"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-stone-400">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
