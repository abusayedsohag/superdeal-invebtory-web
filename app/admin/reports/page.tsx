"use client";

import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  PieChart, 
  Calendar, 
  Download, 
  FileText, 
  ArrowUpRight, 
  Layers, 
  CreditCard, 
  Truck, 
  AlertTriangle, 
  Package, 
  CheckCircle2, 
  SlidersHorizontal,
  Flame
} from "lucide-react";

export default function AdminReportsPage() {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");

  // Chart datasets based on selected timeframe (Daily, Weekly, Monthly, Yearly)
  const salesData = {
    daily: [
      { label: "06:00", sales: 12400, profit: 4100, orders: 34 },
      { label: "09:00", sales: 28500, profit: 9800, orders: 78 },
      { label: "12:00", sales: 45000, profit: 15200, orders: 120 },
      { label: "15:00", sales: 32000, profit: 10500, orders: 86 },
      { label: "18:00", sales: 58000, profit: 19600, orders: 154 },
      { label: "21:00", sales: 39000, profit: 13100, orders: 98 }
    ],
    weekly: [
      { label: "Mon", sales: 110000, profit: 36000, orders: 280 },
      { label: "Tue", sales: 125000, profit: 42000, orders: 310 },
      { label: "Wed", sales: 140000, profit: 46000, orders: 360 },
      { label: "Thu", sales: 135000, profit: 44000, orders: 340 },
      { label: "Fri", sales: 180000, profit: 61000, orders: 490 },
      { label: "Sat", sales: 210000, profit: 72000, orders: 580 },
      { label: "Sun", sales: 195000, profit: 67000, orders: 520 }
    ],
    monthly: [
      { label: "Jan", sales: 850000, profit: 280000, orders: 2400 },
      { label: "Feb", sales: 920000, profit: 310000, orders: 2650 },
      { label: "Mar", sales: 1100000, profit: 360000, orders: 3100 },
      { label: "Apr", sales: 1050000, profit: 340000, orders: 2950 },
      { label: "May", sales: 1280000, profit: 420000, orders: 3600 },
      { label: "Jun", sales: 1450000, profit: 480000, orders: 4100 },
      { label: "Jul", sales: 1600000, profit: 540000, orders: 4500 },
      { label: "Aug", sales: 1520000, profit: 500000, orders: 4300 },
      { label: "Sep", sales: 1750000, profit: 580000, orders: 4900 },
      { label: "Oct", sales: 1980000, profit: 650000, orders: 5400 }
    ],
    yearly: [
      { label: "2023", sales: 8900000, profit: 2900000, orders: 24000 },
      { label: "2024", sales: 12400000, profit: 4100000, orders: 35000 },
      { label: "2025", sales: 16800000, profit: 5600000, orders: 48000 },
      { label: "2026", sales: 21500000, profit: 7200000, orders: 62000 }
    ]
  };

  const currentDataset = salesData[timeframe];
  const maxSalesValue = Math.max(...currentDataset.map(d => d.sales));

  // Category Distribution Mock
  const categoriesDistribution = [
    { name: "Electronics & Gadgets", percent: 48, count: "6,019 items", color: "bg-primary" },
    { name: "Fashion & Apparel", percent: 32, count: "4,012 font-bold", color: "bg-purple-600" },
    { name: "Home & Kitchen", percent: 20, count: "2,509 items", color: "bg-amber-500" }
  ];

  // Payment Methods Breakdown Mock
  const paymentMethods = [
    { method: "Cash on Delivery (COD)", percent: 45, total: "৳8,450,000", color: "bg-emerald-500" },
    { method: "bKash MFS Gateway", percent: 35, total: "৳6,570,000", color: "bg-pink-600" },
    { method: "Nagad MFS Gateway", percent: 12, total: "৳2,250,000", color: "bg-orange-600" },
    { method: "Credit / Debit Cards", percent: 8, total: "৳1,500,000", color: "bg-blue-600" }
  ];

  // Delivery Status Breakdown Mock
  const deliveryStatusList = [
    { status: "Delivered", count: 8430, percent: 67, badge: "badge-success text-white" },
    { status: "Out for Delivery", count: 1240, percent: 10, badge: "bg-indigo-600 text-white" },
    { status: "Processing & Packed", count: 2150, percent: 17, badge: "badge-primary" },
    { status: "Returned / Cancelled", count: 720, percent: 6, badge: "badge-error text-white" }
  ];

  // Top Selling Products
  const topSellingProducts = [
    { name: "Wireless Noise-Canceling Headphones", sold: "3,420 units", revenue: 6669000, stock: 18, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80" },
    { name: "Ultra Smart Watch Series 7 Pro", sold: "2,150 units", revenue: 3203500, stock: 45, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80" },
    { name: "Ergonomic Mechanical Gaming Keyboard", sold: "1,890 units", revenue: 2833110, stock: 12, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100&auto=format&fit=crop&q=80" },
    { name: "Minimalist Wireless Optical Mouse", sold: "1,450 units", revenue: 1448550, stock: 2, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&auto=format&fit=crop&q=80" }
  ];

  // Low-Stock Products
  const lowStockProducts = [
    { name: "Wireless Mouse", sku: "SD-MSE-901", stock: 2, minStock: 10, category: "Electronics" },
    { name: "Mechanical Keyboard", sku: "SD-KEY-102", stock: 4, minStock: 15, category: "Accessories" },
    { name: "USB-C Fast Cable", sku: "SD-CBL-442", stock: 1, minStock: 20, category: "Electronics" }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Title Bar & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-primary" /> Advanced Analytics & Reports
          </h1>
          <p className="text-xs text-slate-500">
            Real-time multi-dimensional analytics: Sales, Revenue, Profit, Orders, Customers, Categories, Payment methods, Delivery statuses, Top sellers & Low stock
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.print()}
            className="btn btn-primary btn-sm font-bold rounded-xl gap-2 shadow-md"
          >
            <Download className="w-4 h-4" /> Export Analytics Summary
          </button>
        </div>
      </div>

      {/* TIMEFRAME SELECTOR TABS (Daily, Weekly, Monthly, Yearly) */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 font-bold text-xs">
          <span className="text-slate-400 uppercase text-[10px] tracking-wider px-2">Time Horizon:</span>
          {(["daily", "weekly", "monthly", "yearly"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-2 rounded-xl transition-all capitalize ${
                timeframe === t 
                  ? "bg-primary text-white font-black shadow-md" 
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {t} Analytics
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Calendar className="w-4 h-4 text-primary" /> Active Scope: <strong className="text-slate-900 capitalize">{timeframe}</strong>
        </div>
      </div>

      {/* MAIN SALES, REVENUE & PROFIT CHART */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-black text-xl text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" /> Sales, Revenue & Net Profit Growth Chart
            </h3>
            <p className="text-xs text-slate-500">
              Comparative analysis for {timeframe} performance
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-primary inline-block"></span>
              <span className="text-slate-700">Gross Sales / Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              <span className="text-slate-700">Net Profit</span>
            </div>
          </div>
        </div>

        {/* Dynamic Graphic Bar Simulation */}
        <div className="h-72 flex items-end justify-between gap-3 pt-8 px-4 bg-slate-50 rounded-2xl border border-slate-100">
          {currentDataset.map((item, idx) => {
            const salesHeight = (item.sales / maxSalesValue) * 100;
            const profitHeight = (item.profit / maxSalesValue) * 100;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                {/* Hover Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-slate-900 text-white text-[10px] font-mono py-1.5 px-3 rounded-xl pointer-events-none shadow-xl z-20 whitespace-nowrap text-center">
                  <p className="font-extrabold text-amber-300">{item.label} Breakdown</p>
                  <p>Sales: ৳{item.sales.toLocaleString()} | Profit: ৳{item.profit.toLocaleString()}</p>
                </div>

                {/* Bars */}
                <div className="w-full flex items-end justify-center gap-1 h-52">
                  <div 
                    className="w-1/2 bg-gradient-to-t from-primary to-indigo-500 rounded-t-lg transition-all group-hover:brightness-110" 
                    style={{ height: `${salesHeight}%` }}
                  ></div>
                  <div 
                    className="w-1/2 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg transition-all group-hover:brightness-110" 
                    style={{ height: `${profitHeight}%` }}
                  ></div>
                </div>

                <span className="text-xs font-extrabold text-slate-600">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* METRICS BREAKDOWN GRID: CATEGORIES, PAYMENT METHODS & DELIVERY STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. CATEGORIES BREAKDOWN */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" /> Category Distribution
            </h3>
            <span className="text-xs font-bold text-slate-400">Share %</span>
          </div>

          <div className="space-y-4">
            {categoriesDistribution.map((cat, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">{cat.name}</span>
                  <span className="font-mono text-primary">{cat.percent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className={`${cat.color} h-2.5 rounded-full`} style={{ width: `${cat.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. PAYMENT METHODS BREAKDOWN */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" /> Payment Methods
            </h3>
            <span className="text-xs font-bold text-slate-400">Share %</span>
          </div>

          <div className="space-y-3">
            {paymentMethods.map((pm, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <div className="flex justify-between text-xs font-extrabold">
                  <span className="text-slate-900">{pm.method}</span>
                  <span className="font-mono text-emerald-600">{pm.percent}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className={`${pm.color} h-2 rounded-full`} style={{ width: `${pm.percent}%` }}></div>
                </div>
                <p className="text-[10px] text-slate-400 font-mono text-right pt-0.5">Total: {pm.total}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. DELIVERY & LOGISTICS STATUS */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-purple-600" /> Delivery Status Stream
            </h3>
            <span className="text-xs font-bold text-slate-400">Orders</span>
          </div>

          <div className="space-y-3">
            {deliveryStatusList.map((ds, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <p className="font-extrabold text-slate-900">{ds.status}</p>
                  <p className="text-[10px] text-slate-400">{ds.count.toLocaleString()} orders processed</p>
                </div>
                <span className={`badge ${ds.badge} font-mono font-bold text-xs`}>
                  {ds.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* BOTTOM ROW: TOP SELLING PRODUCTS & LOW-STOCK AUDITS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* TOP SELLING PRODUCTS TABLE */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" /> Top Selling Products
            </h3>
            <span className="badge badge-warning text-slate-950 font-bold text-xs">BEST PERFORMERS</span>
          </div>

          <div className="space-y-3">
            {topSellingProducts.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                  <div>
                    <p className="font-extrabold text-slate-900 text-xs line-clamp-1">{p.name}</p>
                    <p className="text-[10px] text-emerald-600 font-bold">{p.sold}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-mono font-black text-slate-900 text-sm">৳{p.revenue.toLocaleString()}</p>
                  <span className="text-[10px] text-slate-400 font-mono">Stock: {p.stock} left</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LOW-STOCK PRODUCTS ALERT AUDIT */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" /> Low-Stock Products Audit
            </h3>
            <span className="badge badge-error text-white font-bold text-xs">REORDER NEEDED</span>
          </div>

          <div className="space-y-3">
            {lowStockProducts.map((p, idx) => (
              <div key={idx} className="p-4 bg-red-50/60 rounded-2xl border border-red-200 flex items-center justify-between">
                <div>
                  <span className="badge badge-outline text-[10px] font-bold text-red-700">{p.category}</span>
                  <p className="font-extrabold text-slate-900 text-sm mt-0.5">{p.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">SKU: {p.sku}</p>
                </div>

                <div className="text-right">
                  <span className="badge badge-error text-white font-mono font-black text-xs">
                    {p.stock} LEFT
                  </span>
                  <p className="text-[10px] text-red-700 font-bold mt-1">Min Reorder: {p.minStock}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
