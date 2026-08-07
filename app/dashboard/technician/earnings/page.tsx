"use client";

import { useEffect, useState } from "react";
import { Download, Loader2, FileSpreadsheet } from "lucide-react";
import { getTechnicianBookings } from "@/lib/technician-api";
import type { Booking } from "@/types";

interface PeriodStatement {
  id: string;
  period: string;
  jobsCount: number;
  gross: number;
  fee: number;
  net: number;
  status: string;
  date: string;
}

export default function TechnicianEarningsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<"ALL" | "THIS_MONTH" | "LAST_30" | "THIS_YEAR">("ALL");

  useEffect(() => {
    async function loadEarningsData() {
      try {
        setLoading(true);
        const data = await getTechnicianBookings();
        setBookings(data);
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }
    loadEarningsData();
  }, []);

  // Filter bookings based on selected time filter
  const getFilteredByTime = (allBookings: Booking[]) => {
    const now = new Date();
    return allBookings.filter((b) => {
      const bDate = new Date(b.createdAt || b.scheduledDate);
      if (isNaN(bDate.getTime())) return true;

      if (timeFilter === "THIS_MONTH") {
        return bDate.getMonth() === now.getMonth() && bDate.getFullYear() === now.getFullYear();
      }
      if (timeFilter === "LAST_30") {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return bDate >= thirtyDaysAgo;
      }
      if (timeFilter === "THIS_YEAR") {
        return bDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const timeFilteredBookings = getFilteredByTime(bookings);

  const completedBookings = timeFilteredBookings.filter(
    (b) => b.status === "COMPLETED" || b.status === "PAID"
  );

  const pendingBookings = timeFilteredBookings.filter(
    (b) => b.status === "REQUESTED" || b.status === "ACCEPTED" || b.status === "IN_PROGRESS"
  );

  const totalGross = completedBookings.reduce(
    (sum, b) => sum + (Number(b.servicePrice) || 0),
    0
  );

  const pendingAmount = pendingBookings.reduce(
    (sum, b) => sum + (Number(b.servicePrice) || 0),
    0
  );

  const platformFee = totalGross * 0.10;
  const netEarnings = totalGross - platformFee;

  // Group completed bookings dynamically by Month/Year for Payout Statements
  const generateStatements = (): PeriodStatement[] => {
    if (completedBookings.length === 0) return [];

    const grouped: Record<string, Booking[]> = {};

    completedBookings.forEach((b) => {
      const d = new Date(b.createdAt || b.scheduledDate);
      const key = !isNaN(d.getTime())
        ? d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "Current Period";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(b);
    });

    return Object.entries(grouped).map(([periodKey, periodBookings], index) => {
      const gross = periodBookings.reduce((s, b) => s + (Number(b.servicePrice) || 0), 0);
      const fee = gross * 0.10;
      const net = gross - fee;
      const lastBookingDate = periodBookings[0]?.createdAt
        ? new Date(periodBookings[0].createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

      return {
        id: `STMT-${new Date().getFullYear()}-${(index + 1).toString().padStart(2, "0")}`,
        period: periodKey,
        jobsCount: periodBookings.length,
        gross,
        fee,
        net,
        status: "PAID",
        date: lastBookingDate,
      };
    });
  };

  const statements = generateStatements();

  // Export Earnings Statement to CSV
  const handleDownloadCSV = () => {
    if (statements.length === 0) {
      alert("No payout statements available to export.");
      return;
    }

    const headers = ["Statement ID", "Settlement Period", "Completed Jobs", "Gross Income ($)", "Platform Fee 10% ($)", "Net Payout ($)", "Status", "Settlement Date"];
    const rows = statements.map((s) => [
      s.id,
      `"${s.period}"`,
      s.jobsCount,
      s.gross.toFixed(2),
      s.fee.toFixed(2),
      s.net.toFixed(2),
      s.status,
      `"${s.date}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `technician-earnings-statement-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-stone-900 dark:text-slate-100">
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-slate-100">
            Earnings & Payout History
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500 dark:text-slate-400">
            Track your live net earnings, completed job revenues, and settlement statements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time Period Filter */}
          <select
            value={timeFilter}
            onChange={(e: any) => setTimeFilter(e.target.value)}
            className="rounded-2xl border border-stone-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-bold text-stone-700 dark:text-slate-200 outline-none focus:border-amber-500 shadow-2xs cursor-pointer"
          >
            <option value="ALL">All Time</option>
            <option value="THIS_MONTH">This Month</option>
            <option value="LAST_30">Last 30 Days</option>
            <option value="THIS_YEAR">This Year</option>
          </select>

          <button
            onClick={handleDownloadCSV}
            disabled={statements.length === 0}
            className="flex items-center gap-1.5 rounded-2xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-bold text-stone-700 dark:text-slate-200 shadow-2xs hover:bg-stone-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4 text-amber-500" />
            <span>Download CSV Statement</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center gap-2 text-stone-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-stone-200/80 dark:border-slate-800">
          <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
          <span className="text-xs font-bold">Calculating live earnings & payout statements...</span>
        </div>
      ) : (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-3xl bg-stone-900 dark:bg-slate-900 p-5 text-white shadow-md flex flex-col justify-between border border-stone-800 dark:border-slate-800">
              <div>
                <span className="text-xs font-medium text-stone-400 dark:text-slate-400">Total Net Earnings</span>
                <div className="mt-2 text-3xl font-extrabold text-white">${netEarnings.toFixed(2)}</div>
              </div>
              <span className="mt-3 inline-block rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 w-fit">
                After 10% platform fee
              </span>
            </div>

            <div className="rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-stone-500 dark:text-slate-400">Pending Dispatches</span>
                <div className="mt-2 text-3xl font-extrabold text-stone-900 dark:text-slate-100">${pendingAmount.toFixed(2)}</div>
              </div>
              <span className="mt-3 inline-block rounded-full bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-800 w-fit">
                {pendingBookings.length} active job dispatches
              </span>
            </div>

            <div className="rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-stone-500 dark:text-slate-400">Completed Revenue</span>
                <div className="mt-2 text-3xl font-extrabold text-stone-900 dark:text-slate-100">${totalGross.toFixed(2)}</div>
              </div>
              <span className="mt-3 inline-block rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800 w-fit">
                Across {completedBookings.length} completed jobs
              </span>
            </div>
          </div>

          {/* Payout History Table */}
          <div className="rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100">Settlement Payout Statements</h3>
              <span className="text-xs font-semibold text-stone-400 dark:text-slate-500">
                {statements.length} {statements.length === 1 ? "statement" : "statements"} generated
              </span>
            </div>

            {statements.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center gap-2 text-stone-400 dark:text-slate-500 text-center">
                <FileSpreadsheet className="h-10 w-10 text-stone-300 dark:text-slate-600 stroke-[1.5]" />
                <h4 className="text-sm font-bold text-stone-700 dark:text-slate-300">No Settlement Statements Yet</h4>
                <p className="text-xs text-stone-400 dark:text-slate-500 max-w-sm">
                  Complete customer service dispatches to generate automatic settlement payout statements.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 dark:bg-slate-800/80 text-stone-500 dark:text-slate-400 uppercase tracking-wider font-extrabold text-[10px] border-b border-stone-200/80 dark:border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Statement ID</th>
                      <th className="py-3.5 px-4">Settlement Period</th>
                      <th className="py-3.5 px-4">Jobs Count</th>
                      <th className="py-3.5 px-4">Gross Income</th>
                      <th className="py-3.5 px-4">Platform Fee (10%)</th>
                      <th className="py-3.5 px-4">Net Payout</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-slate-800 font-medium text-stone-900 dark:text-slate-100">
                    {statements.map((e) => (
                      <tr key={e.id} className="hover:bg-stone-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-stone-900 dark:text-slate-100">{e.id}</td>
                        <td className="py-3.5 px-4 text-stone-600 dark:text-slate-300">{e.period}</td>
                        <td className="py-3.5 px-4 font-bold text-stone-900 dark:text-slate-100">{e.jobsCount} {e.jobsCount === 1 ? "Job" : "Jobs"}</td>
                        <td className="py-3.5 px-4 font-semibold text-stone-900 dark:text-slate-100">${e.gross.toFixed(2)}</td>
                        <td className="py-3.5 px-4 text-stone-400 dark:text-slate-500">-${e.fee.toFixed(2)}</td>
                        <td className="py-3.5 px-4 font-extrabold text-emerald-700 dark:text-emerald-400">${e.net.toFixed(2)}</td>
                        <td className="py-3.5 px-4">
                          <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
                            {e.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right text-stone-400 dark:text-slate-500">{e.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
