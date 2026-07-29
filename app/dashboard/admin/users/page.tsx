"use client";

import { useState } from "react";
import { Search, UserCheck, ShieldAlert, UserX, Shield, User } from "lucide-react";

const MOCK_USERS = [
  {
    id: "USR-001",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    role: "CUSTOMER",
    status: "ACTIVE",
    joinedDate: "Jan 12, 2026",
    bookingsCount: 8,
  },
  {
    id: "USR-002",
    name: "Alex Turner",
    email: "alex.t@fixitnow.com",
    role: "TECHNICIAN",
    status: "ACTIVE",
    joinedDate: "Feb 04, 2026",
    bookingsCount: 142,
  },
  {
    id: "USR-003",
    name: "Michael Scott",
    email: "m.scott@dunder.com",
    role: "CUSTOMER",
    status: "ACTIVE",
    joinedDate: "Mar 19, 2026",
    bookingsCount: 12,
  },
  {
    id: "USR-004",
    name: "Bad Actor User",
    email: "spammer@example.com",
    role: "CUSTOMER",
    status: "BANNED",
    joinedDate: "Jul 01, 2026",
    bookingsCount: 0,
  },
];

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const filteredUsers = MOCK_USERS.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
            User Account Management
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
            Manage customer and technician accounts, role permissions, and access status.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-3xl border border-stone-200/80 bg-white p-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, email address..."
            className="w-full rounded-2xl border border-stone-200/80 bg-stone-50 py-2 pl-10 pr-4 text-xs font-medium text-stone-900 placeholder:text-stone-400 outline-none focus:border-amber-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "CUSTOMER", "TECHNICIAN", "ADMIN"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`rounded-2xl px-3 py-1.5 text-xs font-bold transition-all ${
                roleFilter === role
                  ? "bg-amber-500 text-stone-950 shadow-xs"
                  : "bg-stone-50 text-stone-600 hover:bg-stone-100"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl border border-stone-200/80 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-extrabold text-[10px] border-b border-stone-200/80">
              <tr>
                <th className="py-3.5 px-4">User ID</th>
                <th className="py-3.5 px-4">Name & Email</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4">Activity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-stone-900">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{u.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-stone-900">{u.name}</div>
                    <div className="text-[10px] text-stone-400">{u.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="rounded-full bg-stone-900 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-500">{u.joinedDate}</td>
                  <td className="py-3.5 px-4 font-extrabold text-stone-900">{u.bookingsCount} Bookings</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        u.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-rose-50 text-rose-700 border border-rose-100"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      className={`rounded-xl border px-3 py-1 text-xs font-bold transition-colors ${
                        u.status === "ACTIVE"
                          ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white"
                          : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                      }`}
                    >
                      {u.status === "ACTIVE" ? "Ban User" : "Unban"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
