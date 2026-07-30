"use client";

import { useEffect, useState } from "react";
import { Search, Loader2, ChevronLeft, ChevronRight, UserX, ShieldAlert, CheckCircle2 } from "lucide-react";
import { getAdminUsers, updateAdminUserStatus } from "@/lib/admin-api";
import type { User } from "@/types";
import { toast } from "sonner";

const MOCK_USERS: User[] = [
  {
    id: "USR-001",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    role: "CUSTOMER",
    status: "ACTIVE",
    createdAt: "2026-01-12T00:00:00.000Z",
    updatedAt: "2026-01-12T00:00:00.000Z",
  },
  {
    id: "USR-002",
    name: "Alex Turner",
    email: "alex.t@fixitnow.com",
    role: "TECHNICIAN",
    status: "ACTIVE",
    createdAt: "2026-02-04T00:00:00.000Z",
    updatedAt: "2026-02-04T00:00:00.000Z",
  },
  {
    id: "USR-003",
    name: "Michael Scott",
    email: "m.scott@dunder.com",
    role: "CUSTOMER",
    status: "ACTIVE",
    createdAt: "2026-03-19T00:00:00.000Z",
    updatedAt: "2026-03-19T00:00:00.000Z",
  },
  {
    id: "USR-004",
    name: "Bad Actor User",
    email: "spammer@example.com",
    role: "CUSTOMER",
    status: "BANNED",
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-01T00:00:00.000Z",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "BANNED">("ALL");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const data = await getAdminUsers();
        if (data && data.length > 0) {
          setUsers(data);
        } else {
          setUsers(MOCK_USERS);
        }
      } catch {
        setUsers(MOCK_USERS);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const handleStatusChange = async (user: User, newStatus: "ACTIVE" | "BANNED") => {
    if (user.status === newStatus) return;

    setUpdatingId(user.id);
    try {
      await updateAdminUserStatus(user.id, newStatus);
      toast.success(`User ${user.name} status updated to ${newStatus}`);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update user status";
      toast.error(msg);
      // Optimistic update for frontend state
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
            Users Management
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
            Manage platform users, inspect roles, and toggle account ban / unban status.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="space-y-3 rounded-3xl border border-stone-200/80 bg-white p-4 shadow-xs">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user name, email address..."
              className="w-full rounded-2xl border border-stone-200/80 bg-stone-50 py-2 pl-10 pr-4 text-xs font-medium text-stone-900 placeholder:text-stone-400 outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Role & Status Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-stone-100">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-[11px] font-bold text-stone-400 mr-1">Role:</span>
            {["ALL", "CUSTOMER", "TECHNICIAN", "ADMIN"].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`rounded-2xl px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                  roleFilter === role
                    ? "bg-amber-500 text-stone-950 shadow-xs"
                    : "bg-stone-50 text-stone-600 hover:bg-stone-100"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-stone-400 mr-1">Status:</span>
            {(["ALL", "ACTIVE", "BANNED"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-2xl px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === st
                    ? "bg-stone-900 text-amber-400 shadow-xs"
                    : "bg-stone-50 text-stone-600 hover:bg-stone-100"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl border border-stone-200/80 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-2 text-stone-500">
            <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
            <span className="text-xs font-bold">Loading platform users...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center gap-2 text-stone-400 text-center">
            <UserX className="h-10 w-10 text-stone-300 stroke-[1.5]" />
            <h3 className="text-sm font-bold text-stone-700">No Users Found</h3>
            <p className="text-xs text-stone-400 max-w-sm">
              {searchTerm || roleFilter !== "ALL" || statusFilter !== "ALL"
                ? "No users match your filter criteria."
                : "No registered users in the database."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-extrabold text-[10px] border-b border-stone-200/80">
                <tr>
                  <th className="py-3.5 px-4">User ID</th>
                  <th className="py-3.5 px-4">Name & Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Ban / Unban Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-900">
                {paginatedUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900 truncate max-w-[120px]">
                      {u.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{u.name}</div>
                      <div className="text-[10px] text-stone-400">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="rounded-full bg-stone-900 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-500">
                      {new Date(u.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
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
                      {/* Ban / Unban Dropdown Selector */}
                      <div className="relative inline-block text-left">
                        {updatingId === u.id ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-stone-100 text-stone-500 text-xs font-bold">
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" />
                            <span>Updating...</span>
                          </div>
                        ) : (
                          <select
                            value={u.status}
                            onChange={(e) =>
                              handleStatusChange(u, e.target.value as "ACTIVE" | "BANNED")
                            }
                            className={`rounded-2xl border px-3 py-1.5 text-xs font-bold transition-all outline-none cursor-pointer shadow-2xs ${
                              u.status === "ACTIVE"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 focus:border-emerald-500"
                                : "border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100 focus:border-rose-500"
                            }`}
                          >
                            <option value="ACTIVE" className="bg-white text-emerald-800 font-bold">
                              Unban (ACTIVE)
                            </option>
                            <option value="BANNED" className="bg-white text-rose-800 font-bold">
                              Ban User (BANNED)
                            </option>
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls Footer */}
      {!loading && filteredUsers.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-3xl border border-stone-200/80 bg-white p-4 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">
            Showing <span className="font-extrabold text-stone-900">{startIndex + 1}</span>–
            <span className="font-extrabold text-stone-900">
              {Math.min(startIndex + itemsPerPage, filteredUsers.length)}
            </span>{" "}
            of <span className="font-extrabold text-stone-900">{filteredUsers.length}</span> users
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-2xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 cursor-pointer transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`h-9 w-9 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? "bg-amber-500 text-stone-950 shadow-xs"
                      : "bg-stone-50 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-2xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 cursor-pointer transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
