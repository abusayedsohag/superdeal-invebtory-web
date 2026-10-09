"use client";

import { useState } from "react";
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
  UserCheck
} from "lucide-react";

interface Coupon {
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
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: "CPN-001",
      code: "SAVE500",
      type: "Fixed Amount",
      discountValue: 500,
      minOrder: 3000,
      maxDiscount: 500,
      usageLimit: 500,
      usedCount: 184,
      expiry: "30 Oct 2026",
      status: "Active",
      isFirstOrderOnly: false,
      categoryScope: "All Categories",
      productScope: "All Products",
      customerAudience: "All Customers",
      usagePerUser: 1
    },
    {
      id: "CPN-002",
      code: "SUPER20",
      type: "Percentage",
      discountValue: 20,
      minOrder: 1500,
      maxDiscount: 1000,
      usageLimit: 1000,
      usedCount: 412,
      expiry: "31 Dec 2026",
      status: "Active",
      isFirstOrderOnly: false,
      categoryScope: "Electronics",
      productScope: "All Products",
      customerAudience: "All Customers",
      usagePerUser: 2
    },
    {
      id: "CPN-003",
      code: "WELCOME100",
      type: "Fixed Amount",
      discountValue: 100,
      minOrder: 500,
      maxDiscount: 100,
      usageLimit: 2000,
      usedCount: 1240,
      expiry: "15 Nov 2026",
      status: "Active",
      isFirstOrderOnly: true,
      categoryScope: "All Categories",
      productScope: "All Products",
      customerAudience: "First-Time Buyers",
      usagePerUser: 1
    },
    {
      id: "CPN-004",
      code: "VIPGOLD50",
      type: "Percentage",
      discountValue: 50,
      minOrder: 5000,
      maxDiscount: 2500,
      usageLimit: 100,
      usedCount: 35,
      expiry: "25 Oct 2026",
      status: "Active",
      isFirstOrderOnly: false,
      categoryScope: "Fashion",
      productScope: "All Products",
      customerAudience: "VIP Gold Members",
      usagePerUser: 3
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New Coupon Form State
  const [newCoupon, setNewCoupon] = useState({
    code: "SAVE500",
    type: "Fixed Amount" as "Fixed Amount" | "Percentage",
    discountValue: 500,
    minOrder: 3000,
    maxDiscount: 1000,
    usageLimit: 500,
    expiry: "2026-10-30",
    isFirstOrderOnly: false,
    categoryScope: "All Categories",
    productScope: "All Products",
    customerAudience: "All Customers",
    usagePerUser: 1
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code) return;

    const formattedExpiry = new Date(newCoupon.expiry).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    const created: Coupon = {
      id: `CPN-00${coupons.length + 1}`,
      code: newCoupon.code.toUpperCase().trim(),
      type: newCoupon.type,
      discountValue: Number(newCoupon.discountValue) || 0,
      minOrder: Number(newCoupon.minOrder) || 0,
      maxDiscount: Number(newCoupon.maxDiscount) || undefined,
      usageLimit: Number(newCoupon.usageLimit) || 100,
      usedCount: 0,
      expiry: formattedExpiry,
      status: "Active",
      isFirstOrderOnly: newCoupon.isFirstOrderOnly,
      categoryScope: newCoupon.categoryScope,
      productScope: newCoupon.productScope,
      customerAudience: newCoupon.customerAudience,
      usagePerUser: Number(newCoupon.usagePerUser) || 1
    };

    setCoupons(prev => [created, ...prev]);
    setIsCreateModalOpen(false);
  };

  const filteredCoupons = coupons.filter(c => {
    const matchesQuery = c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.categoryScope.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerAudience.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterType === "percentage") return matchesQuery && c.type === "Percentage";
    if (filterType === "fixed") return matchesQuery && c.type === "Fixed Amount";
    return matchesQuery;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Ticket className="w-8 h-8 text-primary" /> Coupon System & Discounts
          </h1>
          <p className="text-xs text-slate-500">
            Create promotional discount codes, manage usage limits, and enforce advanced customer targeting rules
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-primary btn-sm gap-2 font-bold shadow-md rounded-xl"
        >
          <Plus className="w-4 h-4" /> Create New Coupon
        </button>
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
          </select>
        </div>
      </div>

      {/* COUPON CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredCoupons.map((c) => (
          <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 relative overflow-hidden flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="font-mono font-black text-xl text-primary bg-primary/10 px-2.5 py-1 rounded-xl border border-primary/20 inline-block">
                    {c.code}
                  </span>
                  <p className="text-[11px] font-bold text-slate-500 mt-1">{c.type}</p>
                </div>
                <span className={`badge ${c.status === "Active" ? "badge-success text-white" : "badge-neutral"} text-[10px] font-bold`}>
                  {c.status}
                </span>
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
                  <strong className="text-slate-900 font-mono">৳{c.minOrder.toLocaleString()}</strong>
                </div>

                {c.maxDiscount && (
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Max Discount Cap:</span>
                    <strong className="text-slate-900 font-mono">৳{c.maxDiscount.toLocaleString()}</strong>
                  </div>
                )}

                <div className="flex justify-between items-center text-slate-600">
                  <span>Usage Limit:</span>
                  <strong className="text-slate-900 font-mono">{c.usedCount} / {c.usageLimit}</strong>
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
                  <Layers className="w-3 h-3 text-primary" /> Category: <strong>{c.categoryScope}</strong>
                </div>

                <div className="flex items-center gap-1 text-slate-700 font-medium">
                  <ShoppingBag className="w-3 h-3 text-primary" /> Product: <strong>{c.productScope}</strong>
                </div>

                <div className="flex items-center gap-1 text-slate-700 font-medium">
                  <UserCheck className="w-3 h-3 text-primary" /> Audience: <strong>{c.customerAudience}</strong>
                </div>

                <div className="text-slate-500 text-[10px] pt-0.5">
                  Limit per user: <strong>{c.usagePerUser} time(s)</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleCopyCode(c.code)}
                className="btn btn-xs btn-outline gap-1 font-bold rounded-lg w-full"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedCode === c.code ? "Copied!" : "Copy Code"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE NEW COUPON MODAL (All Basic & Advanced Options) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-2xl text-slate-900">Create New Coupon</h3>
                <p className="text-xs text-slate-500">Configure discount code, purchase limits, and advanced targeting rules</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="btn btn-ghost btn-circle btn-xs">
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
                      placeholder="e.g. SAVE500"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
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
                      placeholder="500"
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
                      placeholder="3000"
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
                  className="btn btn-sm btn-primary font-bold rounded-xl"
                >
                  Create & Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
