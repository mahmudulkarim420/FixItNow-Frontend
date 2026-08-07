"use client";

import { useEffect, useState } from "react";
import {
  Star,
  Search,
  Trash2,
  CheckCircle2,
  Loader2,
  MessageSquareOff,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { getAdminReviews, deleteAdminReview, type AdminReview } from "@/lib/admin-api";
import { DeleteConfirmModal } from "@/components/dashboard/admin/modals/delete-confirm-modal";
import { toast } from "sonner";

interface ReviewItem {
  id: string;
  customer: string;
  technician: string;
  service: string;
  rating: number;
  comment: string;
  date: string;
  status: "APPROVED" | "FLAGGED";
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingReview, setDeletingReview] = useState<ReviewItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Search & Filtering states
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "APPROVED" | "FLAGGED">("ALL");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data: AdminReview[] = await getAdminReviews();

      const formatted: ReviewItem[] = data.map((r, idx) => ({
        id: r.id || `REV-${idx + 1}`,
        customer: r.customer?.name || "Verified Customer",
        technician: r.technicianProfile?.user?.name || "Assigned Technician",
        service: r.booking?.service?.title || r.service?.title || "Home Repair Service",
        rating: r.rating || 5,
        comment: r.comment || "Service completed.",
        date: r.createdAt
          ? new Date(r.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Recently",
        status: r.status || "APPROVED",
      }));

      setReviews(formatted);
    } catch {
      toast.error("Could not load reviews from database.");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const confirmDeleteReview = async () => {
    if (!deletingReview) return;

    try {
      setIsDeleting(true);
      await deleteAdminReview(deletingReview.id);
      toast.success(`Review from ${deletingReview.customer} deleted permanently`);
      setReviews((prev) => prev.filter((r) => r.id !== deletingReview.id));
      setDeletingReview(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete review";
      toast.error(msg);
      // Optimistic remove
      setReviews((prev) => prev.filter((r) => r.id !== deletingReview.id));
      setDeletingReview(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleApprove = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "APPROVED" } : r))
    );
    toast.success(`Review approved`);
  };

  // Filter calculation logic
  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === "ALL" || r.rating === ratingFilter;
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;

    return matchesSearch && matchesRating && matchesStatus;
  });

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, ratingFilter, statusFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6 text-stone-900 dark:text-slate-100">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-slate-100">
            Reviews & Ratings Moderation
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500 dark:text-slate-400">
            Review customer ratings, inspect feedback comments, and delete/moderate reviews via backend API.
          </p>
        </div>
      </div>

      {/* Filter & Controls Bar */}
      <div className="space-y-3 rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xs">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reviews, customer name, technician..."
              className="w-full rounded-2xl border border-stone-200/80 dark:border-slate-800 bg-stone-50 dark:bg-slate-800 py-2 pl-10 pr-4 text-xs font-medium text-stone-900 dark:text-slate-100 placeholder:text-stone-400 dark:placeholder:text-slate-500 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
            />
          </div>
        </div>

        {/* Rating & Status Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-stone-100 dark:border-slate-800">
          {/* Star Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-[11px] font-bold text-stone-400 dark:text-slate-500 flex items-center gap-1 mr-1">
              <Filter className="h-3 w-3 text-amber-500" /> Rating:
            </span>
            {["ALL", 5, 4, 3, 2, 1].map((val) => (
              <button
                key={String(val)}
                onClick={() => setRatingFilter(val as number | "ALL")}
                className={`rounded-2xl px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                  ratingFilter === val
                    ? "bg-amber-500 text-stone-950 shadow-2xs"
                    : "bg-stone-50 dark:bg-slate-800 text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-700"
                }`}
              >
                {val === "ALL" ? "All Stars" : `★ ${val}`}
              </button>
            ))}
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-stone-400 dark:text-slate-500 mr-1">Status:</span>
            {(["ALL", "APPROVED", "FLAGGED"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-2xl px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === st
                    ? "bg-stone-900 dark:bg-amber-500 text-amber-400 dark:text-slate-950 shadow-2xs"
                    : "bg-stone-50 dark:bg-slate-800 text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-700"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center gap-2 text-stone-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-stone-200/80 dark:border-slate-800">
          <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
          <span className="text-xs font-bold">Loading platform reviews from database...</span>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center gap-2 text-stone-400 dark:text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-stone-200/80 dark:border-slate-800 text-center">
          <MessageSquareOff className="h-10 w-10 text-stone-300 dark:text-slate-600 stroke-[1.5]" />
          <h3 className="text-sm font-bold text-stone-700 dark:text-slate-300">No Reviews Found</h3>
          <p className="text-xs text-stone-400 dark:text-slate-500 max-w-sm">
            {searchTerm || ratingFilter !== "ALL" || statusFilter !== "ALL"
              ? "No reviews match your filter criteria."
              : "No reviews exist in the database."}
          </p>
        </div>
      ) : (
        <>
          {/* Reviews Roster */}
          <div className="space-y-4">
            {paginatedReviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs transition-all hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-slate-800 pb-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs text-stone-400 dark:text-slate-500 truncate max-w-[120px]">{rev.id}</span>
                    <span className="text-xs font-bold text-stone-900 dark:text-slate-100">{rev.customer}</span>
                    <span className="text-xs text-stone-400 dark:text-slate-500">reviewed</span>
                    <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400">{rev.technician}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-100 dark:border-amber-800">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      <span>{rev.rating}.0 Rating</span>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        rev.status === "APPROVED"
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800"
                          : "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-800 animate-pulse"
                      }`}
                    >
                      {rev.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-700 dark:text-slate-300 font-medium italic mb-3">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                <div className="flex items-center justify-between text-[11px] font-semibold text-stone-400 dark:text-slate-500 pt-2 border-t border-stone-50 dark:border-slate-800/80">
                  <span>Service: {rev.service} • {rev.date}</span>

                  <div className="flex items-center gap-2">
                    {rev.status === "FLAGGED" && (
                      <button
                        onClick={() => handleApprove(rev.id)}
                        className="flex items-center gap-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer border border-emerald-100 dark:border-emerald-800"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Approve</span>
                      </button>
                    )}
                    <button
                      onClick={() => setDeletingReview(rev)}
                      className="flex items-center gap-1 rounded-xl bg-rose-50 dark:bg-rose-950/60 px-3 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer border border-rose-100 dark:border-rose-900/60"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xs text-stone-900 dark:text-slate-100">
            <span className="text-xs font-semibold text-stone-500 dark:text-slate-400">
              Showing <span className="font-extrabold text-stone-900 dark:text-slate-100">{startIndex + 1}</span>–
              <span className="font-extrabold text-stone-900 dark:text-slate-100">
                {Math.min(startIndex + itemsPerPage, filteredReviews.length)}
              </span>{" "}
              of <span className="font-extrabold text-stone-900 dark:text-slate-100">{filteredReviews.length}</span> reviews
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="flex h-9 w-9 items-center justify-center rounded-2xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-600 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer transition-colors"
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
                        ? "bg-amber-500 text-stone-950 shadow-2xs"
                        : "bg-stone-50 dark:bg-slate-800 text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-2xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-600 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Premium Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingReview)}
        onClose={() => setDeletingReview(null)}
        onConfirm={confirmDeleteReview}
        loading={isDeleting}
        title="Delete Customer Review?"
        description="This action will permanently erase this customer feedback and rating from your PostgreSQL database. Technician performance metrics will automatically be updated."
        itemName={deletingReview ? `${deletingReview.customer}'s review: "${deletingReview.comment}"` : undefined}
      />
    </div>
  );
}
