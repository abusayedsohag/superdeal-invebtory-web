"use client";

import { useState } from "react";
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  Search, 
  Filter, 
  Eye, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingCart, 
  Award, 
  Heart, 
  Star, 
  RotateCcw, 
  DollarSign, 
  Calendar, 
  X, 
  CheckCircle2, 
  PackageCheck, 
  Gift, 
  ShieldCheck,
  Tag,
  ArrowUpRight
} from "lucide-react";

interface CustomerOrder {
  orderId: string;
  date: string;
  total: number;
  status: string;
  itemsCount: number;
}

interface WishlistItem {
  name: string;
  price: number;
  image: string;
  inStock: boolean;
}

interface CustomerReview {
  productName: string;
  rating: number;
  date: string;
  comment: string;
}

interface RefundRecord {
  refundId: string;
  orderId: string;
  date: string;
  amount: number;
  reason: string;
  status: "Completed" | "Processing";
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  upazila: string;
  avatar: string;
  status: "Active" | "Inactive";
  totalOrders: number;
  totalSpending: number;
  lastOrder: string;
  loyaltyPoints: number;
  loyaltyTier: "Platinum" | "Gold" | "Silver" | "Bronze";
  ordersHistory: CustomerOrder[];
  wishlist: WishlistItem[];
  reviews: CustomerReview[];
  refundHistory: RefundRecord[];
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "CUST-1001",
      name: "Abu Sayed",
      phone: "+880 1711-223344",
      email: "sayed@superdeal.com",
      address: "House 42, Road 11, Block D, Banani",
      district: "Dhaka",
      upazila: "Banani",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      status: "Active",
      totalOrders: 18,
      totalSpending: 48500,
      lastOrder: "08 Oct 2026 (#SD-10293)",
      loyaltyPoints: 1450,
      loyaltyTier: "Gold",
      ordersHistory: [
        { orderId: "SD-10293", date: "08 Oct 2026", total: 2450, status: "Processing", itemsCount: 2 },
        { orderId: "SD-10188", date: "24 Sep 2026", total: 14900, status: "Delivered", itemsCount: 3 },
        { orderId: "SD-10052", date: "10 Aug 2026", total: 31150, status: "Delivered", itemsCount: 5 }
      ],
      wishlist: [
        { name: "Wireless Gaming Headphones", price: 1950, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80", inStock: true },
        { name: "Ultra Smart Watch Series 7", price: 1490, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80", inStock: true },
        { name: "Ergonomic Optical Mouse", price: 890, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&auto=format&fit=crop&q=80", inStock: true }
      ],
      reviews: [
        { productName: "Wireless Gaming Headphones", rating: 5, date: "26 Sep 2026", comment: "Excellent noise cancellation and sound quality! Delivery was super quick in Banani." },
        { productName: "Fast USB-C Charging Cable", rating: 4, date: "12 Aug 2026", comment: "Durable braided cable. Fast charging works perfectly with my phone." }
      ],
      refundHistory: [
        { refundId: "RF-9901", orderId: "SD-10102", date: "14 Sep 2026", amount: 1200, reason: "Damaged Portable Speaker on Arrival", status: "Completed" }
      ]
    },
    {
      id: "CUST-1002",
      name: "Tanvir Hossain",
      phone: "+880 1819-223344",
      email: "tanvir@example.com",
      address: "House 15, Road 4, Agrabad Commercial Area",
      district: "Chittagong",
      upazila: "Agrabad",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
      status: "Active",
      totalOrders: 9,
      totalSpending: 22400,
      lastOrder: "08 Oct 2026 (#SD-10294)",
      loyaltyPoints: 680,
      loyaltyTier: "Silver",
      ordersHistory: [
        { orderId: "SD-10294", date: "08 Oct 2026", total: 1490, status: "Confirmed", itemsCount: 1 },
        { orderId: "SD-10120", date: "15 Sep 2026", total: 20910, status: "Delivered", itemsCount: 4 }
      ],
      wishlist: [
        { name: "4K Streaming Camera", price: 4500, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&auto=format&fit=crop&q=80", inStock: true }
      ],
      reviews: [
        { productName: "Ultra Smart Watch Series 7", rating: 5, date: "20 Sep 2026", comment: "Best smartwatch at this price range. Battery lasts 4 days easily!" }
      ],
      refundHistory: []
    },
    {
      id: "CUST-1003",
      name: "Sharmin Sultana",
      phone: "+880 1733-445566",
      email: "sharmin@example.com",
      address: "Lane 3, Zindabazar",
      district: "Sylhet",
      upazila: "Zindabazar",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
      status: "Active",
      totalOrders: 14,
      totalSpending: 36800,
      lastOrder: "07 Oct 2026 (#SD-10295)",
      loyaltyPoints: 1120,
      loyaltyTier: "Gold",
      ordersHistory: [
        { orderId: "SD-10295", date: "07 Oct 2026", total: 3200, status: "Packed", itemsCount: 2 }
      ],
      wishlist: [
        { name: "Mechanical Gaming Keyboard", price: 1600, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100&auto=format&fit=crop&q=80", inStock: true }
      ],
      reviews: [],
      refundHistory: []
    },
    {
      id: "CUST-1004",
      name: "Mahmud Hasan",
      phone: "+880 1911-887766",
      email: "mahmud@example.com",
      address: "Station Road, Near Town Hall",
      district: "Rangpur",
      upazila: "Station Road",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
      status: "Active",
      totalOrders: 4,
      totalSpending: 8900,
      lastOrder: "06 Oct 2026 (#SD-10296)",
      loyaltyPoints: 260,
      loyaltyTier: "Bronze",
      ordersHistory: [
        { orderId: "SD-10296", date: "06 Oct 2026", total: 890, status: "Out for Delivery", itemsCount: 1 }
      ],
      wishlist: [],
      reviews: [],
      refundHistory: []
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterTier, setFilterTier] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "wishlist" | "reviews" | "refunds">("overview");

  // Filter Customer List
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.district.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterTier !== "all") {
      return matchesSearch && c.loyaltyTier.toLowerCase() === filterTier.toLowerCase();
    }
    return matchesSearch;
  });

  const getTierBadgeClass = (tier: string) => {
    switch (tier) {
      case "Platinum": return "badge-accent text-slate-900 font-extrabold";
      case "Gold": return "badge-warning text-slate-950 font-extrabold";
      case "Silver": return "badge-neutral text-slate-200 font-extrabold";
      case "Bronze": return "badge-outline font-bold text-amber-700";
      default: return "badge-neutral";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" /> Customer Management
          </h1>
          <p className="text-xs text-slate-500">
            View registered user profiles, lifetime order spending, wishlist, product reviews, refund histories, and loyalty points
          </p>
        </div>
      </div>

      {/* SUMMARY KPI CARDS (Matching User Specifications) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Customers: 12,540 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Customers</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">12,540</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Registered User Base</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Active Customers: 8,430 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Active Customers</p>
            <h3 className="text-3xl font-black text-emerald-600 mt-1">8,430</h3>
            <p className="text-[11px] text-emerald-700 font-bold mt-0.5">67.2% Active Shopping Rate</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* New This Month: 540 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">New This Month</p>
            <h3 className="text-3xl font-black text-purple-600 mt-1">540</h3>
            <p className="text-[11px] text-purple-700 font-bold mt-0.5">+14.2% Growth vs Last Month</p>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <UserPlus className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, email, phone, or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-sm input-bordered w-full pl-9 text-xs focus:outline-none rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="select select-sm select-bordered text-xs focus:outline-none rounded-xl font-bold"
          >
            <option value="all">All Loyalty Tiers</option>
            <option value="platinum">Platinum Tier</option>
            <option value="gold">Gold Tier</option>
            <option value="silver">Silver Tier</option>
            <option value="bronze">Bronze Tier</option>
          </select>
        </div>
      </div>

      {/* CUSTOMERS DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <th>Customer</th>
              <th>Contact Details</th>
              <th>Location</th>
              <th className="text-center">Total Orders</th>
              <th className="text-right">Total Spending</th>
              <th>Last Order</th>
              <th>Loyalty Points</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCustomers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/50">
                <td>
                  <div className="flex items-center gap-3">
                    <img 
                      src={c.avatar} 
                      alt={c.name} 
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20" 
                    />
                    <div>
                      <p className="font-extrabold text-slate-900 text-sm">{c.name}</p>
                      <span className={`badge badge-xs ${getTierBadgeClass(c.loyaltyTier)}`}>
                        {c.loyaltyTier} Member
                      </span>
                    </div>
                  </div>
                </td>

                <td className="text-xs">
                  <p className="font-semibold text-slate-800 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" /> {c.email}
                  </p>
                  <p className="text-slate-500 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-400" /> {c.phone}
                  </p>
                </td>

                <td className="text-xs font-medium text-slate-700">
                  <p className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-primary" /> {c.district}
                  </p>
                  <p className="text-[11px] text-slate-400">{c.upazila}</p>
                </td>

                <td className="text-center font-extrabold text-slate-900 font-mono text-sm">
                  {c.totalOrders}
                </td>

                <td className="text-right font-mono font-black text-emerald-600 text-base">
                  ৳{c.totalSpending.toLocaleString()}
                </td>

                <td className="text-xs font-semibold text-slate-600">
                  {c.lastOrder}
                </td>

                <td>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                    <Gift className="w-3.5 h-3.5" />
                    <span>{c.loyaltyPoints} pts</span>
                  </div>
                </td>

                <td className="text-center">
                  <button
                    onClick={() => {
                      setSelectedCustomer(c);
                      setActiveTab("overview");
                    }}
                    className="btn btn-xs btn-primary gap-1 font-bold rounded-lg"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FULL CUSTOMER PROFILE MODAL (All 11 Requested Attributes) */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            {/* Header Banner */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-4">
                <img 
                  src={selectedCustomer.avatar} 
                  alt={selectedCustomer.name} 
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-primary/20 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-2xl text-slate-900">{selectedCustomer.name}</h3>
                    <span className={`badge ${getTierBadgeClass(selectedCustomer.loyaltyTier)}`}>
                      {selectedCustomer.loyaltyTier} Member
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customer ID: {selectedCustomer.id} • Registered Active User
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)} 
                className="btn btn-ghost btn-circle btn-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TAB SELECTOR FOR PROFILE SECTIONS */}
            <div className="flex flex-wrap border-b border-slate-200 text-xs font-bold gap-1">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-2 px-3 border-b-2 transition-colors ${
                  activeTab === "overview" 
                    ? "border-primary text-primary font-black" 
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Profile & Overview
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`py-2 px-3 border-b-2 transition-colors flex items-center gap-1 ${
                  activeTab === "orders" 
                    ? "border-primary text-primary font-black" 
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5" /> Orders ({selectedCustomer.ordersHistory.length})
              </button>
              <button
                onClick={() => setActiveTab("wishlist")}
                className={`py-2 px-3 border-b-2 transition-colors flex items-center gap-1 ${
                  activeTab === "wishlist" 
                    ? "border-primary text-primary font-black" 
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-red-500" /> Wishlist ({selectedCustomer.wishlist.length})
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-2 px-3 border-b-2 transition-colors flex items-center gap-1 ${
                  activeTab === "reviews" 
                    ? "border-primary text-primary font-black" 
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Star className="w-3.5 h-3.5 text-amber-500" /> Reviews ({selectedCustomer.reviews.length})
              </button>
              <button
                onClick={() => setActiveTab("refunds")}
                className={`py-2 px-3 border-b-2 transition-colors flex items-center gap-1 ${
                  activeTab === "refunds" 
                    ? "border-primary text-primary font-black" 
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5 text-purple-500" /> Refund History ({selectedCustomer.refundHistory.length})
              </button>
            </div>

            {/* TAB 1: OVERVIEW & SPENDING SUMMARY */}
            {activeTab === "overview" && (
              <div className="space-y-4 text-xs">
                {/* 4 KPI Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Total Orders</span>
                    <p className="font-mono font-black text-slate-900 text-lg mt-0.5">{selectedCustomer.totalOrders}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Total Spending</span>
                    <p className="font-mono font-black text-emerald-600 text-lg mt-0.5">৳{selectedCustomer.totalSpending.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] font-bold text-amber-600 uppercase">Loyalty Points</span>
                    <p className="font-mono font-black text-amber-600 text-lg mt-0.5">{selectedCustomer.loyaltyPoints} pts</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] font-bold text-purple-600 uppercase">Last Order</span>
                    <p className="font-bold text-slate-800 text-xs mt-0.5">{selectedCustomer.lastOrder}</p>
                  </div>
                </div>

                {/* Contact & Delivery Address Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-primary" /> Contact Details
                    </h4>
                    <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                    <p><strong>Email:</strong> {selectedCustomer.email}</p>
                    <p><strong>Status:</strong> <span className="badge badge-success badge-sm text-white font-bold">{selectedCustomer.status}</span></p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary" /> Primary Shipping Address
                    </h4>
                    <p className="font-semibold text-slate-900">{selectedCustomer.address}</p>
                    <p className="text-slate-500">{selectedCustomer.upazila}, {selectedCustomer.district}, Bangladesh</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ORDERS HISTORY */}
            {activeTab === "orders" && (
              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 text-sm">Order History ({selectedCustomer.ordersHistory.length} Orders)</h4>
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 text-[11px] font-bold">
                        <th className="py-2.5 px-3">Order ID</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Items</th>
                        <th className="py-2.5 px-3 text-right">Total Amount</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedCustomer.ordersHistory.map((o, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-extrabold text-primary">#{o.orderId}</td>
                          <td className="py-2.5 px-3 text-slate-600">{o.date}</td>
                          <td className="py-2.5 px-3 font-bold">{o.itemsCount} items</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">৳{o.total.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="badge badge-sm badge-success text-white font-bold">{o.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: WISHLIST */}
            {activeTab === "wishlist" && (
              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 text-sm">Customer Saved Wishlist ({selectedCustomer.wishlist.length} Items)</h4>
                {selectedCustomer.wishlist.length === 0 ? (
                  <p className="text-slate-400 py-6 text-center">No items saved in wishlist.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedCustomer.wishlist.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 text-xs">{item.name}</p>
                          <p className="font-mono font-extrabold text-primary">৳{item.price.toLocaleString()}</p>
                        </div>
                        <span className="badge badge-xs badge-success text-white">In Stock</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: REVIEWS */}
            {activeTab === "reviews" && (
              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 text-sm">Product Reviews & Ratings ({selectedCustomer.reviews.length})</h4>
                {selectedCustomer.reviews.length === 0 ? (
                  <p className="text-slate-400 py-6 text-center">No product reviews submitted yet.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedCustomer.reviews.map((rev, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-slate-900">{rev.productName}</h5>
                          <div className="flex items-center text-amber-500 font-bold">
                            {"★".repeat(rev.rating)}
                            <span className="text-slate-400 text-[10px] ml-1">({rev.rating}/5)</span>
                          </div>
                        </div>
                        <p className="text-slate-600 text-xs">{rev.comment}</p>
                        <p className="text-[10px] text-slate-400 pt-1">Reviewed on: {rev.date}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: REFUND HISTORY */}
            {activeTab === "refunds" && (
              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 text-sm">Refund & Return History ({selectedCustomer.refundHistory.length})</h4>
                {selectedCustomer.refundHistory.length === 0 ? (
                  <p className="text-slate-400 py-6 text-center">No refunds or return claims filed.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedCustomer.refundHistory.map((ref, idx) => (
                      <div key={idx} className="p-4 bg-red-50 rounded-2xl border border-red-200 flex items-center justify-between">
                        <div>
                          <span className="badge badge-error text-white font-bold text-[10px]">#{ref.refundId}</span>
                          <h5 className="font-black text-red-950 text-sm mt-1">Refund for Order #{ref.orderId}</h5>
                          <p className="text-xs text-red-800">Reason: {ref.reason}</p>
                          <p className="text-[10px] text-red-600 mt-0.5">Date: {ref.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-black text-red-700 text-lg">৳{ref.amount.toLocaleString()}</p>
                          <span className="badge badge-success text-white font-bold text-xs">{ref.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="btn btn-sm btn-ghost font-bold text-slate-600"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
