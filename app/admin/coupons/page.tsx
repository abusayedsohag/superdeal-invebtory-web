"use client";

import { useState, useEffect } from "react";
import {
  Ticket,
  Plus,
  Copy,
  Filter,
  Search,
  ShoppingBag,
  X,
  Sparkles,
  Layers,
  UserCheck,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Percent
} from "lucide-react";

interface Coupon {
  _id?: string;
  id: string;
  code: string;
  type: "Fixed Amount" | "Percentage";
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  expiry: string;
  status: "Active" | "Expired" | "Scheduled";
  isFirstOrderOnly: boolean;
  categoryScope: string;
  productScope: string;
  customerAudience: string;
  usagePerUser: number;
  createdAt?: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Coupon Form State with SSR-safe initial date
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    type: "Fixed Amount" as "Fixed Amount" | "Percentage",
    discountValue: 100,
    minOrder: 500,
    maxDiscount: 500,
    usageLimit: 500,
    expiry: "",
    isFirstOrderOnly: false,
    categoryScope: "All Categories",
    productScope: "All Products",
    customerAudience: "All Customers",
    usagePerUser: 1
  });

  // Fetch Coupons from API
  const fetchCoupons = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await fetch("/api/coupons", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.coupons)) {
        setCoupons(data.coupons);
      }
    } catch (err) {
      console.error("Failed to load coupons:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
    // SSR-safe default expiry (30 days from now)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    setNewCoupon((prev) => ({
      ...prev,
      expiry: futureDate.toISOString().split("T")[0]
    }));
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  // Toggle Coupon Status (Active <-> Expired)
  const handleToggleStatus = async (coupon: Coupon) => {
    const newStatus = coupon.status === "Active" ? "Expired" : "Active";
    // Optimistic update
    setCoupons((prev) =>
      prev.map((c) => (c.id === coupon.id ? { ...c, status: newStatus } : c))
    );

    try {
      const res = await fetch("/api/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: coupon.id,
          _id: coupon._id,
          status: newStatus
        })
      });
      const data = await res.json();
      if (!data.success) {
        showToast("Failed to update status");
        fetchCoupons(false);
      } else {
        showToast(`Coupon status set to ${newStatus}`);
      }
    } catch (err) {
      console.error("Status toggle error:", err);
      fetchCoupons(false);
    }
  };

  // Delete Coupon
  const handleDeleteCoupon = async (coupon: Coupon) => {
    if (!confirm(`Are you sure you want to delete coupon ${coupon.code}?`)) return;

    // Optimistic remove
    setCoupons((prev) => prev.filter((c) => c.id !== coupon.id));

    try {
      const param = coupon._id ? `_id=${coupon._id}` : `id=${coupon.id}`;
      const res = await fetch(`/api/coupons?${param}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast(`Coupon ${coupon.code} deleted successfully`);
      } else {
        showToast(data.message || "Failed to delete coupon");
        fetchCoupons(false);
      }
    } catch (err) {
      console.error("Delete coupon error:", err);
      fetchCoupons(false);
    }
  };

  // Create Coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newCoupon.code.trim().toUpperCase(),
          type: newCoupon.type,
          discountValue: Number(newCoupon.discountValue) || 0,
          minOrder: Number(newCoupon.minOrder) || 0,
          maxDiscount: Number(newCoupon.maxDiscount) || undefined,
          usageLimit: Number(newCoupon.usageLimit) || 100,
          expiry: newCoupon.expiry,
          status: "Active",
          isFirstOrderOnly: newCoupon.isFirstOrderOnly,
          categoryScope: newCoupon.categoryScope,
          productScope: newCoupon.productScope,
          customerAudience: newCoupon.customerAudience,
          usagePerUser: Number(newCoupon.usagePerUser) || 1
        })
      });

      const data = await res.json();
      if (data.success && data.coupon) {
        setCoupons((prev) => [data.coupon, ...prev]);
        setIsCreateModalOpen(false);
        showToast(`Coupon ${data.coupon.code} created successfully!`);
        // Reset form code
        setNewCoupon((prev) => ({
          ...prev,
          code: "",
          discountValue: 100,
          minOrder: 500
        }));
      } else {
        alert(data.message || "Failed to create coupon");
      }
    } catch (err) {
      console.error("Create coupon error:", err);
      alert("Network error creating coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter coupons
  const filteredCoupons = coupons.filter((c) => {
    const matchesQuery =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.categoryScope.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerAudience.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterType === "percentage") return matchesQuery && c.type === "Percentage";
    if (filterType === "fixed") return matchesQuery && c.type === "Fixed Amount";
    if (filterType === "active") return matchesQuery && c.status === "Active";
    if (filterType === "expired") return matchesQuery && c.status === "Expired";
    return matchesQuery;
  });

  // Calculate live stats
  const activeCouponsCount = coupons.filter((c) => c.status === "Active").length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);
  const percentageCouponsCount = coupons.filter((c) => c.type === "Percentage").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-success shadow-lg text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Ticket className="w-8 h-8 text-primary" /> Coupon System & Discounts
          </h1>
          <p className="text-xs text-slate-500">
            Create promotional discount codes, manage usage limits, and enforce advanced customer targeting rules with real-time MongoDB sync
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchCoupons(false)}
            disabled={isRefreshing}
            className="btn btn-outline btn-sm gap-2 font-bold rounded-xl"
            title="Refresh coupons"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary btn-sm gap-2 font-bold shadow-md rounded-xl"
          >
            <Plus className="w-4 h-4" /> Create New Coupon
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Ticket className="w-3.5 h-3.5 text-primary" /> Total Coupons
          </span>
          <p className="text-2xl font-black text-slate-900">{coupons.length}</p>
          <span className="text-[11px] text-slate-500">{activeCouponsCount} Active In Store</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Active Promo Codes
          </span>
          <p className="text-2xl font-black text-emerald-600">{activeCouponsCount}</p>
          <span className="text-[11px] text-emerald-600/80 font-bold">Ready to apply at checkout</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-500" /> Total Redemptions
          </span>
          <p className="text-2xl font-black text-indigo-600">{totalRedemptions.toLocaleString()}</p>
          <span className="text-[11px] text-slate-500">Times redeemed by shoppers</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-amber-500" /> Percentage Discounts
          </span>
          <p className="text-2xl font-black text-amber-600">{percentageCouponsCount}</p>
          <span className="text-[11px] text-slate-500">{coupons.length - percentageCouponsCount} Fixed ৳ Coupons</span>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search coupon code or target rule..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-sm input-bordered w-full pl-9 text-xs focus:outline-none rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="select select-sm select-bordered text-xs focus:outline-none rounded-xl font-bold"
          >
            <option value="all">All Discount Types</option>
            <option value="fixed">Fixed Amount (৳)</option>
            <option value="percentage">Percentage (%)</option>
            <option value="active">Active Status Only</option>
            <option value="expired">Expired Status Only</option>
          </select>
        </div>
      </div>

      {/* LOADING STATE */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-xs font-bold text-slate-500">Loading coupons from database...</p>
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-lg">No Coupons Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchQuery
              ? `No coupons matched '${searchQuery}'. Try clearing your filter or search query.`
              : "No coupons exist in your database yet. Click below to add your first coupon code!"}
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary btn-sm rounded-xl font-bold gap-2 mt-2"
          >
            <Plus className="w-4 h-4" /> Create Coupon
          </button>
        </div>
      ) : (
        /* COUPON CARDS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCoupons.map((c) => (
            <div
              key={c.id || c._id}
              className={`bg-white p-5 rounded-2xl border ${
                c.status === "Active" ? "border-slate-200 hover:border-primary/40" : "border-slate-200 opacity-75 bg-slate-50/50"
              } shadow-xs space-y-4 relative overflow-hidden flex flex-col justify-between transition-all`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-mono font-black text-xl text-primary bg-primary/10 px-2.5 py-1 rounded-xl border border-primary/20 inline-block">
                      {c.code}
                    </span>
                    <p className="text-[11px] font-bold text-slate-500 mt-1">{c.type}</p>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(c)}
                    title={`Click to ${c.status === "Active" ? "deactivate" : "activate"}`}
                    className={`badge ${
                      c.status === "Active" ? "badge-success text-white" : "badge-neutral"
                    } text-[10px] font-bold cursor-pointer hover:opacity-80 transition-opacity`}
                  >
                    {c.status}
                  </button>
                </div>

                {/* Discount & Min Order Details */}
                <div className="space-y-2 text-xs py-3 border-b border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Discount:</span>
                    <strong className="text-slate-900 text-base font-black font-mono">
                      {c.type === "Fixed Amount" ? `৳${c.discountValue}` : `${c.discountValue}% OFF`}
                    </strong>
                  </div>

                  <div className="flex justify-between items-center text-slate-600">
                    <span>Min Purchase Order:</span>
                    <strong className="text-slate-900 font-mono">৳{(c.minOrder || 0).toLocaleString()}</strong>
                  </div>

                  {c.maxDiscount ? (
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Max Discount Cap:</span>
                      <strong className="text-slate-900 font-mono">৳{c.maxDiscount.toLocaleString()}</strong>
                    </div>
                  ) : null}

                  <div className="flex justify-between items-center text-slate-600">
                    <span>Usage Limit:</span>
                    <strong className="text-slate-900 font-mono">
                      {c.usedCount || 0} / {c.usageLimit}
                    </strong>
                  </div>

                  <div className="flex justify-between items-center text-slate-600">
                    <span>Valid Expiry:</span>
                    <strong className="text-slate-800">{c.expiry}</strong>
                  </div>
                </div>

                {/* Advanced Targeting Rules Breakdown */}
                <div className="pt-3 space-y-1.5 text-[11px]">
                  <span className="font-extrabold text-slate-400 uppercase text-[10px] tracking-wider block">
                    Advanced Targeting Rules
                  </span>

                  {c.isFirstOrderOnly && (
                    <div className="badge badge-warning badge-xs font-bold gap-1 text-[10px]">
                      ⚡ First Order Only
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-slate-700 font-medium">
                    <Layers className="w-3 h-3 text-primary shrink-0" /> Category: <strong>{c.categoryScope || "All"}</strong>
                  </div>

                  <div className="flex items-center gap-1 text-slate-700 font-medium">
                    <ShoppingBag className="w-3 h-3 text-primary shrink-0" /> Product: <strong>{c.productScope || "All"}</strong>
                  </div>

                  <div className="flex items-center gap-1 text-slate-700 font-medium">
                    <UserCheck className="w-3 h-3 text-primary shrink-0" /> Audience: <strong>{c.customerAudience || "All"}</strong>
                  </div>

                  <div className="text-slate-500 text-[10px] pt-0.5">
                    Limit per user: <strong>{c.usagePerUser || 1} time(s)</strong>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => handleCopyCode(c.code)}
                  className="btn btn-xs btn-outline gap-1 font-bold rounded-lg flex-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedCode === c.code ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={() => handleDeleteCoupon(c)}
                  className="btn btn-xs btn-ghost text-error hover:bg-error/10 font-bold rounded-lg px-2"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE NEW COUPON MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-2xl text-slate-900">Create New Coupon</h3>
                <p className="text-xs text-slate-500">Configure discount code, purchase limits, and advanced targeting rules</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="btn btn-ghost btn-circle btn-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              {/* BASIC CONFIGURATION SECTION */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="font-extrabold text-slate-900 text-sm block">1. Basic Coupon Parameters</span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Coupon Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MEGA100, SUMMER20"
                      value={newCoupon.code}
                      onChange={(e) =>
                        setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase().replace(/\s+/g, "") })
                      }
                      className="input input-sm input-bordered w-full font-mono font-black text-slate-900 focus:outline-none rounded-xl uppercase"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Discount Type *</label>
                    <select
                      value={newCoupon.type}
                      onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value as any })}
                      className="select select-sm select-bordered w-full font-bold focus:outline-none rounded-xl"
                    >
                      <option value="Fixed Amount">Fixed Amount (৳)</option>
                      <option value="Percentage">Percentage (%)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Discount Value *</label>
                    <input
                      type="number"
                      min={1}
                      required
                      placeholder="100"
                      value={newCoupon.discountValue}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                      className="input input-sm input-bordered w-full font-mono font-bold focus:outline-none rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Min Order Purchase (৳)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="500"
                      value={newCoupon.minOrder}
                      onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: Number(e.target.value) })}
                      className="input input-sm input-bordered w-full font-mono font-bold focus:outline-none rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Max Discount Cap (৳)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="1000"
                      value={newCoupon.maxDiscount}
                      onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: Number(e.target.value) })}
                      className="input input-sm input-bordered w-full font-mono font-bold focus:outline-none rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Total Usage Limit</label>
                    <input
                      type="number"
                      min={1}
                      placeholder="500"
                      value={newCoupon.usageLimit}
                      onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: Number(e.target.value) })}
                      className="input input-sm input-bordered w-full font-mono font-bold focus:outline-none rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Expiry Date</label>
                    <input
                      type="date"
                      required
                      value={newCoupon.expiry}
                      onChange={(e) => setNewCoupon({ ...newCoupon, expiry: e.target.value })}
                      className="input input-sm input-bordered w-full font-bold focus:outline-none rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* ADVANCED TARGETING & RULE CONDITIONS SECTION */}
              <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200 space-y-3">
                <span className="font-extrabold text-indigo-950 text-sm block">2. Advanced Targeting & Rule Controls</span>

                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="firstOrderOnly"
                    checked={newCoupon.isFirstOrderOnly}
                    onChange={(e) => setNewCoupon({ ...newCoupon, isFirstOrderOnly: e.target.checked })}
                    className="checkbox checkbox-sm checkbox-primary"
                  />
                  <label htmlFor="firstOrderOnly" className="font-bold text-slate-900 cursor-pointer">
                    First Order Only Coupon (Restricted to new customers' 1st purchase)
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Category Scope</label>
                    <select
                      value={newCoupon.categoryScope}
                      onChange={(e) => setNewCoupon({ ...newCoupon, categoryScope: e.target.value })}
                      className="select select-sm select-bordered w-full font-bold focus:outline-none rounded-xl"
                    >
                      <option value="All Categories">All Categories</option>
                      <option value="Electronics">Electronics Only</option>
                      <option value="Fashion">Fashion & Apparel Only</option>
                      <option value="Home & Kitchen">Home & Kitchen Only</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Product Scope</label>
                    <select
                      value={newCoupon.productScope}
                      onChange={(e) => setNewCoupon({ ...newCoupon, productScope: e.target.value })}
                      className="select select-sm select-bordered w-full font-bold focus:outline-none rounded-xl"
                    >
                      <option value="All Products">All Products</option>
                      <option value="Wireless Headphones">Wireless Headphones Only</option>
                      <option value="Mechanical Keyboards">Mechanical Keyboards Only</option>
                      <option value="Smart Watches">Smart Watches Only</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Customer Audience Target</label>
                    <select
                      value={newCoupon.customerAudience}
                      onChange={(e) => setNewCoupon({ ...newCoupon, customerAudience: e.target.value })}
                      className="select select-sm select-bordered w-full font-bold focus:outline-none rounded-xl"
                    >
                      <option value="All Customers">All Customers</option>
                      <option value="First-Time Buyers">First-Time Buyers Only</option>
                      <option value="VIP Gold Members">VIP Gold & Platinum Members Only</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Usage Limit Per User</label>
                    <input
                      type="number"
                      min={1}
                      value={newCoupon.usagePerUser}
                      onChange={(e) => setNewCoupon({ ...newCoupon, usagePerUser: Number(e.target.value) })}
                      className="input input-sm input-bordered w-full font-mono font-bold focus:outline-none rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="btn btn-sm btn-ghost font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-sm btn-primary font-bold rounded-xl"
                >
                  {isSubmitting ? "Creating..." : "Create & Save Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
