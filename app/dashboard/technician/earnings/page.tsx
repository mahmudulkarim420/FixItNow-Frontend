"use client";

import { DollarSign, Download, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";

const MOCK_EARNINGS = [
  {
    id: "PAYOUT-701",
    period: "Jul 16 - Jul 31, 2026",
    jobsCount: 18,
    gross: "$1,850.00",
    fee: "$185.00",
    net: "$1,665.00",
    status: "PAID",
    date: "Jul 31, 2026",
  },
  {
    id: "PAYOUT-700",
    period: "Jul 01 - Jul 15, 2026",
    jobsCount: 20,
    gross: "$1,950.00",
    fee: "$195.00",
    net: "$1,755.00",
    status: "PAID",
    date: "Jul 15, 2026",
  },
];

export default function TechnicianEarningsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
            Earnings & Payout History
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
            Track your net earnings, completed job revenues, and automatic direct deposit payouts.
          </p>
        </div>

        <button className="flex items-center gap-1.5 rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-bold text-stone-700 shadow-xs hover:bg-stone-50">
          <Download className="h-4 w-4 text-stone-500" />
          <span>Download Statement</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl bg-stone-900 p-5 text-white shadow-md">
          <span className="text-xs font-medium text-stone-400">Total Net Earnings</span>
          <div className="mt-2 text-3xl font-extrabold text-white">$3,420.00</div>
          <span className="mt-2 inline-block rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
            +18% from last month
          </span>
        </div>

        <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Pending Next Payout</span>
          <div className="mt-2 text-3xl font-extrabold text-stone-900">$480.00</div>
          <span className="mt-2 inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
            Scheduled for Aug 15
          </span>
        </div>

        <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Completed Jobs Revenue</span>
          <div className="mt-2 text-3xl font-extrabold text-stone-900">$3,800.00</div>
          <span className="mt-2 inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
            Across 38 jobs
          </span>
        </div>
      </div>

      {/* Payout History Table */}
      <div className="rounded-3xl border border-stone-200/80 bg-white shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100">
          <h3 className="text-sm font-bold text-stone-900">Payout Statements</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-extrabold text-[10px] border-b border-stone-200/80">
              <tr>
                <th className="py-3.5 px-4">Payout ID</th>
                <th className="py-3.5 px-4">Period</th>
                <th className="py-3.5 px-4">Jobs</th>
                <th className="py-3.5 px-4">Gross Income</th>
                <th className="py-3.5 px-4">Platform Fee (10%)</th>
                <th className="py-3.5 px-4">Net Payout</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-stone-900">
              {MOCK_EARNINGS.map((e) => (
                <tr key={e.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{e.id}</td>
                  <td className="py-3.5 px-4 text-stone-600">{e.period}</td>
                  <td className="py-3.5 px-4 font-bold text-stone-900">{e.jobsCount} Jobs</td>
                  <td className="py-3.5 px-4 font-semibold text-stone-900">{e.gross}</td>
                  <td className="py-3.5 px-4 text-stone-400">-{e.fee}</td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-700">{e.net}</td>
                  <td className="py-3.5 px-4">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                      {e.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-stone-400">{e.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
