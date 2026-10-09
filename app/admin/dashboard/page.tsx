"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  DollarSign, 
  ShoppingCart, 
  Boxes, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  AlertTriangle, 
  Plus, 
  ShoppingBag, 
  Ticket, 
  BarChart3,
  Eye,
  CheckCircle2,
  Clock,
  Building2,
  Zap,
  TrendingDown,
  Layers,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function AdminDashboardPage() {
  const [timeFilter, setTimeFilter] = useState("today");

  // EXACT SPECIFICATION 4 TOP CARDS
  const topCards = [
    { 
      title: "Today's Sale", 
      value: "৳125,430", 
      change: "+18.4% vs yesterday", 
      isUp: true,
      icon: DollarSign, 
      bgGradient: "from-emerald-500 to-teal-600",
      accentBg: "bg-emerald-500/10 text-emerald-600 border-emerald-200"
    },
    { 
      title: "Orders", 
      value: "348", 
      change: "348 Orders Processed", 
      isUp: true,
      icon: ShoppingCart, 
      bgGradient: "from-blue-500 to-indigo-600",
      accentBg: "bg-blue-500/10 text-blue-600 border-blue-200"
    },
    { 
      title: "Customers", 
      value: "12,540", 
      change: "+540 New this month", 
      isUp: true,
      icon: Users, 
      bgGradient: "from-purple-500 to-indigo-700",
      accentBg: "bg-purple-500/10 text-purple-600 border-purple-200"
    },
    { 
      title: "Profit", 
      value: "৳42,500", 
      change: "33.8% Profit Margin", 
      isUp: true,
      icon: TrendingUp, 
      bgGradient: "from-amber-500 to-orange-600",
      accentBg: "bg-amber-500/10 text-amber-600 border-amber-200"
    }
  ];

  // Recent Live Orders Stream
  const recentOrders = [
    { id: "SD-10293", customer: "Rahim Ahmed", date: "Today, 02:45 PM", amount: 2450, payment: "bKash MFS", status: "Processing", badge: "badge-primary" },
    { id: "SD-10294", customer: "Tanvir Hossain", date: "Today, 01:15 PM", amount: 1490, payment: "COD", status: "Confirmed", badge: "badge-info text-white" },
    { id: "SD-10295", customer: "Sharmin Sultana", date: "Today, 11:30 AM", amount: 3200, payment: "Nagad MFS", status: "Packed", badge: "badge-secondary text-white" },
    { id: "SD-10296", customer: "Mahmud Hasan", date: "Yesterday, 04:20 PM", amount: 890, payment: "COD", status: "Out for Delivery", badge: "bg-indigo-600 text-white" }
  ];

  // Low Stock Warehouse Alerts
  const lowStockAlerts = [
    { name: "Wireless Headphones", sku: "SD-HEAD-9081", stock: 2, minStock: 10, location: "Dhaka Hub (Rack A-12)" },
    { name: "Gaming Mechanical Keyboard", sku: "SD-KEY-1022", stock: 4, minStock: 15, location: "Chittagong Hub (Shelf B-04)" },
    { name: "USB-C Fast Charger Cable", sku: "SD-CBL-4421", stock: 1, minStock: 20, location: "Dhaka Hub (Rack C-01)" }
  ];

  // Monthly Revenue Data Mock for Bar Chart
  const salesChartData = [
    { month: "Jan", sales: 85, profit: 28 },
    { month: "Feb", sales: 92, profit: 31 },
    { month: "Mar", sales: 110, profit: 36 },
    { month: "Apr", sales: 105, profit: 34 },
    { month: "May", sales: 128, profit: 42 },
    { month: "Jun", sales: 145, profit: 48 },
    { month: "Jul", sales: 160, profit: 54 },
    { month: "Aug", sales: 152, profit: 50 },
    { month: "Sep", sales: 175, profit: 58 },
    { month: "Oct", sales: 198, profit: 65 }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* TOP EXECUTIVE BANNER & QUICK ACTIONS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-primary font-black text-[10px] uppercase tracking-wider">
              Real-time Business Intelligence
            </span>
            <span className="text-xs text-slate-400 font-mono">Live Systems Synchronized</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            Executive Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of today's sales performance, order processing stream, warehouse stock levels, and net profits
          </p>
        </div>

        {/* Quick Actions Shortcuts */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/admin/products/new" className="btn btn-sm btn-primary font-bold rounded-xl gap-1.5 shadow-md">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
          <Link href="/admin/purchases" className="btn btn-sm btn-outline font-bold rounded-xl gap-1.5">
            <ShoppingBag className="w-4 h-4 text-primary" /> Create PO
          </Link>
          <Link href="/admin/coupons" className="btn btn-sm btn-ghost font-bold rounded-xl gap-1.5 text-slate-700 hover:text-slate-900">
            <Ticket className="w-4 h-4 text-secondary" /> Coupons
          </Link>
        </div>
      </div>

      {/* 4 TOP SPECIFICATION CARDS (Cleanest & Most Beautiful UI Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {topCards.map((card, idx) => {
          const Icon = card.icon;

          return (
            <div 
              key={idx} 
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group space-y-4"
            >
              {/* Subtle top accent bar */}
              <div className={`h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r ${card.bgGradient}`}></div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-110 ${card.accentBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div>
                <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                  {card.value}
                </h3>
                <div className="flex items-center gap-1 text-xs font-extrabold text-emerald-600 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{card.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MIDDLE ROW: REVENUE TRENDS & WAREHOUSE HEALTH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Sales & Profit Growth Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-black text-xl text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" /> Sales & Profit Growth Trends
              </h3>
              <p className="text-xs text-slate-500">Monthly revenue compared with net profit margins (2026)</p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="badge badge-sm badge-primary font-bold">৳ BDT Currency</span>
              <select 
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="select select-xs select-bordered font-bold focus:outline-none rounded-xl"
              >
                <option value="today">Today (10 Oct)</option>
                <option value="this_month">This Month</option>
                <option value="year">Year 2026</option>
              </select>
            </div>
          </div>

          {/* Visual Bar Chart Graph Simulation */}
          <div className="h-64 flex items-end justify-between gap-2.5 pt-8 px-4 bg-slate-50 rounded-2xl border border-slate-100">
            {salesChartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                {/* Tooltip Hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-slate-900 text-white text-[10px] font-mono py-1 px-2 rounded-lg pointer-events-none shadow-lg z-20 whitespace-nowrap">
                  Sales: ৳{d.sales}K | Profit: ৳{d.profit}K
                </div>

                {/* Bars */}
                <div className="w-full flex items-end justify-center gap-1 h-44">
                  <div 
                    className="w-1/2 bg-gradient-to-t from-primary to-indigo-500 rounded-t-lg transition-all group-hover:brightness-110" 
                    style={{ height: `${(d.sales / 200) * 100}%` }}
                  ></div>
                  <div 
                    className="w-1/2 bg-gradient-to-t from-amber-500 to-orange-400 rounded-t-lg transition-all group-hover:brightness-110" 
                    style={{ height: `${(d.profit / 200) * 100}%` }}
                  ></div>
                </div>

                <span className="text-[11px] font-bold text-slate-500">{d.month}</span>
              </div>
            ))}
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-6 text-xs font-bold pt-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary inline-block"></span>
              <span className="text-slate-700">Gross Sales Volume (৳)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
              <span className="text-slate-700">Net Profit (৳)</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Low Stock Alerts & Multi-Warehouse Hubs */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" /> Low Stock Alerts
              </h3>
              <Link href="/admin/inventory" className="text-xs font-extrabold text-primary hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3 mt-4">
              {lowStockAlerts.map((item, idx) => (
                <div key={idx} className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900">{item.name}</span>
                    <span className="badge badge-error text-white font-mono font-bold text-[10px]">
                      {item.stock} LEFT
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">SKU: {item.sku}</p>
                  <p className="text-[10px] text-amber-800 font-semibold flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-amber-600" /> {item.location}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Warehouse Stock Hubs Widget */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                <Building2 className="w-4 h-4" /> Multi-Warehouse Hubs
              </span>
              <span className="badge badge-accent badge-sm font-bold">3 Active</span>
            </div>

            <div className="space-y-2 text-xs font-medium">
              <div className="flex justify-between">
                <span className="text-slate-300">Dhaka Central Hub:</span>
                <span className="font-mono font-bold text-emerald-400">12,400 units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Chittagong Port Hub:</span>
                <span className="font-mono font-bold text-cyan-400">4,200 units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Rangpur Distribution:</span>
                <span className="font-mono font-bold text-purple-400">1,940 units</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM ROW: RECENT ORDERS LIVE STREAM */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-xl text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Live Customer Orders Stream
            </h3>
            <p className="text-xs text-slate-500">Real-time incoming orders and fulfillment status</p>
          </div>
          <Link href="/admin/orders" className="btn btn-xs btn-outline btn-primary font-bold rounded-xl gap-1">
            Manage All Orders <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <th>Order ID</th>
                <th>Customer</th>
                <th>Order Timestamp</th>
                <th>Payment Method</th>
                <th className="text-right">Total Amount</th>
                <th>Fulfillment Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/50">
                  <td className="font-mono font-extrabold text-primary text-base">#{o.id}</td>
                  <td className="font-bold text-slate-900">{o.customer}</td>
                  <td className="text-xs text-slate-500 font-medium">{o.date}</td>
                  <td>
                    <span className="badge badge-sm badge-outline font-bold text-slate-800">
                      {o.payment}
                    </span>
                  </td>
                  <td className="text-right font-mono font-black text-slate-900 text-base">
                    ৳{o.amount.toLocaleString()}
                  </td>
                  <td>
                    <span className={`badge ${o.badge} font-extrabold text-xs px-2.5 py-1`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <Link 
                      href="/admin/orders" 
                      className="btn btn-xs btn-primary font-bold rounded-lg gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </Link>
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
