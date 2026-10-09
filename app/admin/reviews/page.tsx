"use client";

import { useState } from "react";
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
  Check
} from "lucide-react";

interface Review {
  id: string;
  customerName: string;
  customerAvatar: string;
  productName: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
  adminReply?: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "REV-1001",
      customerName: "Abu Sayed",
      customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      productName: "Wireless Gaming Headphones",
      rating: 5,
      comment: "Very good product.",
      isVerifiedPurchase: true,
      date: "09 Oct 2026",
      status: "Pending"
    },
    {
      id: "REV-1002",
      customerName: "Tanvir Hossain",
      customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      productName: "Ergonomic Optical Mouse",
      rating: 5,
      comment: "Super smooth sensor tracking and excellent battery performance! Highly recommended.",
      isVerifiedPurchase: true,
      date: "08 Oct 2026",
      status: "Approved",
      adminReply: "Thank you Tanvir! Glad you loved the mouse performance."
    },
    {
      id: "REV-1003",
      customerName: "Sharmin Sultana",
      customerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      productName: "Mechanical Gaming Keyboard",
      rating: 4,
      comment: "Keys feel tactile and responsive. RGB lighting patterns look amazing at night.",
      isVerifiedPurchase: true,
      date: "06 Oct 2026",
      status: "Approved"
    },
    {
      id: "REV-1004",
      customerName: "Anonymous User",
      customerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
      productName: "Ultra Smart Watch Series 7",
      rating: 1,
      comment: "Spam promo message link http://unverified-link.com",
      isVerifiedPurchase: false,
      date: "04 Oct 2026",
      status: "Rejected"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [replyingReview, setReplyingReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // 1. APPROVE ACTION
  const handleApprove = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: "Approved" } : r));
    showToast("✅ Review status changed to Approved! Published to store.");
  };

  // 2. REJECT ACTION
  const handleReject = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: "Rejected" } : r));
    showToast("⚠️ Review status changed to Rejected.");
  };

  // 3. DELETE ACTION
  const handleDelete = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    showToast("🗑️ Review deleted permanently.");
  };

  // 4. REPLY ACTION
  const handleSaveReply = () => {
    if (!replyingReview || !replyText.trim()) return;

    setReviews(prev => prev.map(r => {
      if (r.id === replyingReview.id) {
        return { ...r, adminReply: replyText.trim() };
      }
      return r;
    }));

    showToast(`💬 Reply posted to ${replyingReview.customerName}'s review.`);
    setReplyingReview(null);
    setReplyText("");
  };

  // Aggregates
  const pendingCount = reviews.filter(r => r.status === "Pending").length;
  const approvedCount = reviews.filter(r => r.status === "Approved").length;
  const rejectedCount = reviews.filter(r => r.status === "Rejected").length;

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = 
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStatus === "pending") return matchesSearch && r.status === "Pending";
    if (filterStatus === "approved") return matchesSearch && r.status === "Approved";
    if (filterStatus === "rejected") return matchesSearch && r.status === "Rejected";
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Star className="w-8 h-8 text-amber-500 fill-amber-500" /> Reviews & Ratings Moderation
          </h1>
          <p className="text-xs text-slate-500">
            Moderate customer product feedback, verify order badges, approve/reject reviews, and post admin replies
          </p>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Reviews</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{reviews.length} Total</h3>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
            <Star className="w-5 h-5 fill-current" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Pending Approval</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">{pendingCount} Reviews</h3>
          </div>
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Approved</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{approvedCount} Published</h3>
          </div>
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Rejected</p>
            <h3 className="text-2xl font-black text-red-600 mt-1">{rejectedCount} Rejected</h3>
          </div>
          <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-bold">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer, product, or comment..."
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
            <option value="all">All Statuses</option>
            <option value="pending">Pending Approval Only</option>
            <option value="approved">Approved Only</option>
            <option value="rejected">Rejected Only</option>
          </select>
        </div>
      </div>

      {/* REVIEWS MANAGEMENT CARDS LIST */}
      <div className="space-y-4">
        {filteredReviews.map((rev) => (
          <div 
            key={rev.id} 
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 hover:shadow-md transition-all"
          >
            {/* Top Bar: Customer Info & Status Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <img 
                  src={rev.customerAvatar} 
                  alt={rev.customerName} 
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-sm">{rev.customerName}</h4>
                    {rev.isVerifiedPurchase && (
                      <span className="badge badge-success text-white font-bold text-[10px] gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verified Purchase
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    Product: <strong className="text-slate-800">{rev.productName}</strong> • Reviewed on: {rev.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`badge ${
                  rev.status === "Approved" ? "badge-success text-white" :
                  rev.status === "Pending" ? "badge-warning text-slate-900" : "badge-error text-white"
                } font-extrabold text-xs px-2.5 py-1`}>
                  {rev.status}
                </span>
              </div>
            </div>

            {/* RATING STARS & REVIEW COMMENT (User Format) */}
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < rev.rating ? "fill-amber-500 text-amber-500" : "text-slate-200"}`} 
                  />
                ))}
                <span className="text-xs font-bold text-slate-700 ml-1">({rev.rating}/5)</span>
              </div>

              {/* Exact User Specification Text */}
              <p className="text-slate-900 text-sm font-semibold bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                "{rev.comment}"
              </p>
            </div>

            {/* ADMIN REPLY DISPLAY (If Replied) */}
            {rev.adminReply && (
              <div className="ml-4 sm:ml-8 p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-2xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-indigo-950">
                  <CornerDownRight className="w-4 h-4 text-primary" /> Admin Seller Official Reply:
                </div>
                <p className="text-indigo-900 pl-5 font-medium">{rev.adminReply}</p>
              </div>
            )}

            {/* ADMIN ACTIONS: APPROVE, REJECT, DELETE, REPLY */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {/* 1. Approve Button */}
                <button
                  onClick={() => handleApprove(rev.id)}
                  disabled={rev.status === "Approved"}
                  className="btn btn-xs btn-success text-white font-bold gap-1 rounded-xl disabled:bg-slate-200"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                </button>

                {/* 2. Reject Button */}
                <button
                  onClick={() => handleReject(rev.id)}
                  disabled={rev.status === "Rejected"}
                  className="btn btn-xs btn-warning text-slate-900 font-bold gap-1 rounded-xl disabled:bg-slate-200"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>

                {/* 3. Delete Button */}
                <button
                  onClick={() => handleDelete(rev.id)}
                  className="btn btn-xs btn-error text-white font-bold gap-1 rounded-xl"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>

              {/* 4. Reply Button */}
              <button
                onClick={() => {
                  setReplyingReview(rev);
                  setReplyText(rev.adminReply || "");
                }}
                className="btn btn-xs btn-outline btn-primary font-bold gap-1 rounded-xl"
              >
                <MessageSquare className="w-3.5 h-3.5" /> 
                {rev.adminReply ? "Edit Reply" : "Reply"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADMIN REPLY MODAL */}
      {replyingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-xl text-slate-900">Reply to Review</h3>
                <p className="text-xs text-slate-500">Customer: {replyingReview.customerName}</p>
              </div>
              <button onClick={() => setReplyingReview(null)} className="btn btn-ghost btn-circle btn-xs">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700">
              <p className="font-bold text-slate-900">"{replyingReview.comment}"</p>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700">Official Seller Response Message *</label>
              <textarea
                rows={4}
                required
                placeholder="e.g. Thank you for your feedback! We are glad you loved our product."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="textarea textarea-bordered w-full font-sans focus:outline-none rounded-2xl text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button 
                onClick={() => setReplyingReview(null)}
                className="btn btn-sm btn-ghost font-bold text-slate-500"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveReply}
                className="btn btn-sm btn-primary font-bold rounded-xl gap-1"
              >
                <MessageSquare className="w-4 h-4" /> Post Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
