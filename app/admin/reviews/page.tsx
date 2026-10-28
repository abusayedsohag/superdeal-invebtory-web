"use client";

import { useState, useEffect } from "react";
import { 
  Star, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  MessageSquare, 
  Search, 
  Filter, 
  User, 
  ShoppingBag, 
  ThumbsUp, 
  ShieldCheck, 
  X, 
  CornerDownRight, 
  AlertCircle,
  Check,
  RefreshCw
} from "lucide-react";

interface Review {
  _id?: string;
  id: string;
  productId?: string;
  customerName: string;
  customerAvatar: string;
  productName: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  dateFormatted?: string;
  createdAt: string;
  status: "Pending" | "Approved" | "Rejected";
  adminReply?: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [replyingReview, setReplyingReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isSavingReply, setIsSavingReply] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Fetch reviews from MongoDB
  const fetchReviews = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await fetch("/api/reviews", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      }
    } catch (e) {
      console.error("Failed to load reviews:", e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Update Status in MongoDB
  const handleUpdateStatus = async (id: string, newStatus: "Approved" | "Rejected" | "Pending") => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );

    try {
      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Review status set to ${newStatus}`);
      } else {
        showToast(data.message || "Failed to update review status");
        fetchReviews(false);
      }
    } catch (err) {
      console.error("Update review status error:", err);
      fetchReviews(false);
    }
  };

  // Delete Review
  const handleDeleteReview = async (review: Review) => {
    if (!confirm(`Delete review from "${review.customerName}"?`)) return;

    setReviews((prev) => prev.filter((r) => r.id !== review.id));

    try {
      const param = review._id ? `_id=${review._id}` : `id=${review.id}`;
      const res = await fetch(`/api/reviews?${param}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Review deleted successfully");
      } else {
        showToast(data.message || "Failed to delete review");
        fetchReviews(false);
      }
    } catch (err) {
      console.error("Delete review error:", err);
      fetchReviews(false);
    }
  };

  // Submit Official Admin Reply
  const handleSaveReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingReview || !replyText.trim()) return;

    setIsSavingReply(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: replyingReview.id,
          adminReply: replyText.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === replyingReview.id ? { ...r, adminReply: replyText.trim() } : r
          )
        );
        showToast("💬 Admin reply published to store!");
        setReplyingReview(null);
        setReplyText("");
      } else {
        alert(data.message || "Failed to save reply");
      }
    } catch (err) {
      console.error("Save reply error:", err);
      alert("Network error saving reply");
    } finally {
      setIsSavingReply(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      r.customerName.toLowerCase().includes(q) ||
      r.productName.toLowerCase().includes(q) ||
      r.comment.toLowerCase().includes(q);

    const matchesStatus = filterStatus === "all" || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = reviews.filter((r) => r.status === "Pending").length;
  const approvedCount = reviews.filter((r) => r.status === "Approved").length;
  const rejectedCount = reviews.filter((r) => r.status === "Rejected").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-success shadow-lg text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Star className="w-8 h-8 text-amber-500 fill-amber-500" /> Customer Reviews & Ratings
          </h1>
          <p className="text-xs text-slate-500">
            Moderate customer feedback from product pages, approve genuine reviews, and publish official store replies
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchReviews(false)}
            disabled={isRefreshing}
            className="btn btn-outline btn-sm gap-2 font-bold rounded-xl"
            title="Refresh reviews"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-500" /> Total Reviews
          </span>
          <p className="text-2xl font-black text-slate-900">{reviews.length}</p>
          <span className="text-[11px] text-slate-500">All customer ratings</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-warning" /> Pending Approval
          </span>
          <p className="text-2xl font-black text-warning">{pendingCount}</p>
          <span className="text-[11px] text-slate-500">Awaiting admin review</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Approved & Live
          </span>
          <p className="text-2xl font-black text-emerald-600">{approvedCount}</p>
          <span className="text-[11px] text-slate-500">Visible on product pages</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-red-500" /> Rejected / Spam
          </span>
          <p className="text-2xl font-black text-red-600">{rejectedCount}</p>
          <span className="text-[11px] text-slate-500">Hidden from store</span>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search review, customer, product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-sm input-bordered w-full pl-9 text-xs focus:outline-none rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="select select-sm select-bordered text-xs focus:outline-none rounded-xl font-bold"
          >
            <option value="all">All Statuses ({reviews.length})</option>
            <option value="Pending">Pending Approval ({pendingCount})</option>
            <option value="Approved">Approved Only ({approvedCount})</option>
            <option value="Rejected">Rejected Only ({rejectedCount})</option>
          </select>
        </div>
      </div>

      {/* REVIEWS LIST */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" /> Customer Feedbacks Directory
          </h3>
          <span className="badge badge-primary font-bold text-xs">{filteredReviews.length} Reviews</span>
        </div>

        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-xs font-bold text-slate-500">Loading reviews from database...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Star className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-lg">No Reviews Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery || filterStatus !== "all"
                ? "No reviews match your search or filter condition."
                : "No customer reviews have been submitted yet."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredReviews.map((r) => (
              <div key={r.id} className="py-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={r.customerAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                      alt={r.customerName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">{r.customerName}</span>
                        {r.isVerifiedPurchase && (
                          <span className="badge badge-success text-white font-bold text-[9px] gap-1 px-1.5">
                            <ShieldCheck className="w-3 h-3" /> Verified Buyer
                          </span>
                        )}
                        <span className={`badge ${r.status === "Approved" ? "badge-success text-white" : r.status === "Rejected" ? "badge-error text-white" : "badge-warning text-slate-950"} text-[10px] font-bold`}>
                          {r.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Product: <strong className="text-primary">{r.productName}</strong> • {r.dateFormatted || new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500 text-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                      />
                    ))}
                    <span className="font-bold text-slate-700 ml-1">{r.rating}.0</span>
                  </div>
                </div>

                {/* Comment text */}
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed">
                  "{r.comment}"
                </p>

                {/* Admin Reply if exists */}
                {r.adminReply && (
                  <div className="pl-6 border-l-2 border-primary/40 space-y-1 text-xs">
                    <span className="font-extrabold text-primary flex items-center gap-1 text-[11px]">
                      <CornerDownRight className="w-3.5 h-3.5" /> Official Store Response:
                    </span>
                    <p className="text-slate-600 bg-primary/5 p-2.5 rounded-xl border border-primary/10">
                      {r.adminReply}
                    </p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-2">
                    {r.status !== "Approved" && (
                      <button
                        onClick={() => handleUpdateStatus(r.id, "Approved")}
                        className="btn btn-xs btn-success text-white font-bold rounded-lg gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                    )}
                    {r.status !== "Rejected" && (
                      <button
                        onClick={() => handleUpdateStatus(r.id, "Rejected")}
                        className="btn btn-xs btn-error text-white font-bold rounded-lg gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setReplyingReview(r);
                        setReplyText(r.adminReply || "");
                      }}
                      className="btn btn-xs btn-outline font-bold rounded-lg gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-primary" /> Reply
                    </button>
                  </div>

                  <button
                    onClick={() => handleDeleteReview(r)}
                    className="btn btn-xs btn-ghost text-red-500 font-bold rounded-lg"
                    title="Delete review"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* REPLY MODAL */}
      {replyingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-xl text-slate-900">Reply to Review</h3>
                <p className="text-xs text-slate-500">
                  Publish an official store response to {replyingReview.customerName}'s review
                </p>
              </div>
              <button
                onClick={() => setReplyingReview(null)}
                className="btn btn-ghost btn-circle btn-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700">
              <p className="font-bold">{replyingReview.productName}</p>
              <p className="text-slate-500 mt-1 italic">"{replyingReview.comment}"</p>
            </div>

            <form onSubmit={handleSaveReply} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Store Response Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Thank you for your feedback! We appreciate your support..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="textarea textarea-bordered w-full text-xs focus:outline-none rounded-xl"
                  autoFocus
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReplyingReview(null)}
                  className="btn btn-sm btn-ghost font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingReply}
                  className="btn btn-sm btn-primary font-bold rounded-xl"
                >
                  {isSavingReply ? "Publishing..." : "Publish Reply"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
