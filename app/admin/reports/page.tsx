"use client";

import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
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
  Boxes,
  Receipt,
  Printer,
  FileSpreadsheet,
  XCircle,
  Building2,
  Sparkles,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

export default function AdminReportsPage() {
  const [activeCategory, setActiveCategory] = useState<"sales" | "inventory" | "purchases" | "financial" | "customers">("sales");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Dynamic CSV Exporter Function
  const exportCSVReport = (reportTitle: string, rows: string[][]) => {
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${reportTitle.toLowerCase().replace(/\s+/g, "_")}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`📊 Exported "${reportTitle}" as CSV Spreadsheet!`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce text-xs font-bold">
          <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Title Bar & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-8 h-8 text-primary" /> Reports & Audit Center
          </h1>
          <p className="text-xs text-slate-500">
            Dedicated report modules: Sales, Inventory, Purchase, Financial & Customer reports with instant PDF/CSV Export
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.print()}
            className="btn btn-outline btn-sm font-bold rounded-xl gap-2"
          >
            <Printer className="w-4 h-4 text-primary" /> Print / PDF Export
          </button>
          
          <button 
            onClick={() => exportCSVReport("SuperDeal_Full_Master", [
              ["Category", "Metric Name", "Value"],
              ["Sales", "Daily Sales", "৳125,430"],
              ["Sales", "Monthly Sales", "৳1,980,000"],
              ["Inventory", "Total Stock", "18,540 units"],
              ["Financial", "Net Profit", "৳42,500"],
              ["Financial", "Supplier Due", "৳40,000"]
            ])}
            className="btn btn-primary btn-sm font-bold rounded-xl gap-2 shadow-md"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export CSV Data
          </button>
        </div>
      </div>

      {/* 5 MAJOR REPORT CATEGORY NAVIGATION TABS */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveCategory("sales")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeCategory === "sales" ? "bg-primary text-white font-black shadow-md" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <TrendingUp className="w-4 h-4" /> 1. Sales Reports
          </button>

          <button
            onClick={() => setActiveCategory("inventory")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeCategory === "inventory" ? "bg-primary text-white font-black shadow-md" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Boxes className="w-4 h-4" /> 2. Inventory Reports
          </button>

          <button
            onClick={() => setActiveCategory("purchases")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeCategory === "purchases" ? "bg-primary text-white font-black shadow-md" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> 3. Purchase Reports
          </button>

          <button
            onClick={() => setActiveCategory("financial")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeCategory === "financial" ? "bg-primary text-white font-black shadow-md" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <DollarSign className="w-4 h-4" /> 4. Financial Reports
          </button>

          <button
            onClick={() => setActiveCategory("customers")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeCategory === "customers" ? "bg-primary text-white font-black shadow-md" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Users className="w-4 h-4" /> 5. Customer Reports
          </button>
        </div>
      </div>

      {/* SECTION 1: SALES REPORTS */}
      {activeCategory === "sales" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" /> Sales Reports & Performance
            </h2>
            <button 
              onClick={() => exportCSVReport("Sales_Summary", [
                ["Time Horizon", "Sales Volume (৳)", "Orders Processed"],
                ["Daily Sales", "125430", "348"],
                ["Monthly Sales", "1980000", "5400"],
                ["Yearly Sales", "21500000", "62000"]
              ])}
              className="btn btn-xs btn-outline font-bold gap-1 rounded-lg"
            >
              <Download className="w-3.5 h-3.5 text-primary" /> Export Sales CSV
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <span className="badge badge-primary font-bold text-[10px] uppercase">1. Daily Sales</span>
              <h3 className="text-3xl font-black font-mono text-slate-900">৳125,430</h3>
              <p className="text-xs text-slate-500">348 Orders processed today</p>
              <div className="pt-2 border-t border-slate-100 flex justify-between text-xs font-bold text-emerald-600">
                <span>+18.4% vs yesterday</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <span className="badge badge-info text-white font-bold text-[10px] uppercase">2. Monthly Sales</span>
              <h3 className="text-3xl font-black font-mono text-slate-900">৳1,980,000</h3>
              <p className="text-xs text-slate-500">5,400 Orders processed this month</p>
              <div className="pt-2 border-t border-slate-100 flex justify-between text-xs font-bold text-emerald-600">
                <span>+14.2% vs last month</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <span className="badge badge-purple bg-purple-600 text-white font-bold text-[10px] uppercase">3. Yearly Sales</span>
              <h3 className="text-3xl font-black font-mono text-slate-900">৳21,500,000</h3>
              <p className="text-xs text-slate-500">62,000 Orders in year 2026</p>
              <div className="pt-2 border-t border-slate-100 flex justify-between text-xs font-bold text-emerald-600">
                <span>+28.0% YoY Growth</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: INVENTORY REPORTS */}
      {activeCategory === "inventory" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Boxes className="w-6 h-6 text-primary" /> Inventory & Stock Audit Reports
            </h2>
            <button 
              onClick={() => exportCSVReport("Inventory_Audit", [
                ["Stock Status", "Item Count / Metric"],
                ["Current Stock", "18540"],
                ["Low Stock Items", "84"],
                ["Out of Stock Items", "23"],
                ["Stock Movement History", "+100 Purchase / -5 Sale / -2 Damage"]
              ])}
              className="btn btn-xs btn-outline font-bold gap-1 rounded-lg"
            >
              <Download className="w-3.5 h-3.5 text-primary" /> Export Inventory CSV
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Current Stock</span>
              <h3 className="text-2xl font-black text-slate-900">18,540 Units</h3>
              <p className="text-[11px] text-slate-500">Valuation: ৳18.5M</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-[10px] font-bold text-amber-600 uppercase">Low Stock Alerts</span>
              <h3 className="text-2xl font-black text-amber-600">84 Items</h3>
              <p className="text-[11px] text-amber-700 font-bold">Below Reorder Level</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-[10px] font-bold text-red-600 uppercase">Out of Stock</span>
              <h3 className="text-2xl font-black text-red-600">23 Items</h3>
              <p className="text-[11px] text-red-700 font-bold">Restock Required</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-[10px] font-bold text-indigo-600 uppercase">Stock Movement Audit</span>
              <h3 className="text-sm font-black text-slate-900">+100 Purchase</h3>
              <p className="text-[11px] text-slate-500">-5 Sale • -2 Damage • +10 Return</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: PURCHASE REPORTS */}
      {activeCategory === "purchases" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-primary" /> Supplier Purchase Reports
            </h2>
            <button 
              onClick={() => exportCSVReport("Purchase_Report", [
                ["Supplier Name", "Total Purchases (৳)", "Paid (৳)", "Due (৳)"],
                ["ABC Electronics", "2450000", "1950000", "500000"],
                ["Global Tech Supplies", "1800000", "1800000", "0"],
                ["Trend Apparel Mills", "950000", "700000", "250000"]
              ])}
              className="btn btn-xs btn-outline font-bold gap-1 rounded-lg"
            >
              <Download className="w-3.5 h-3.5 text-primary" /> Export Purchase CSV
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <span className="badge badge-primary font-bold text-[10px] uppercase">Supplier Purchases</span>
              <h3 className="text-3xl font-black font-mono text-slate-900">৳2,450,000</h3>
              <p className="text-xs text-slate-500">Procured from ABC Electronics & Vendor Partners</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <span className="badge badge-accent text-slate-950 font-bold text-[10px] uppercase">Purchase Cost Total</span>
              <h3 className="text-3xl font-black font-mono text-emerald-600">৳1,950,000</h3>
              <p className="text-xs text-slate-500">Paid out to suppliers in year 2026</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: FINANCIAL REPORTS */}
      {activeCategory === "financial" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-emerald-600" /> Financial Reports & P&L
            </h2>
            <button 
              onClick={() => exportCSVReport("Financial_Statement", [
                ["Financial Metric", "Amount (৳)"],
                ["Revenue", "128450"],
                ["Expenses", "211200"],
                ["Net Profit", "42500"],
                ["Supplier Dues", "40000"]
              ])}
              className="btn btn-xs btn-outline font-bold gap-1 rounded-lg"
            >
              <Download className="w-3.5 h-3.5 text-primary" /> Export Financial CSV
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Gross Revenue</span>
              <h3 className="text-2xl font-black text-slate-900 font-mono">৳128,450</h3>
              <p className="text-[11px] text-slate-500">Sales Income</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-[10px] font-bold text-red-600 uppercase">Total Expenses</span>
              <h3 className="text-2xl font-black text-red-600 font-mono">৳211,200</h3>
              <p className="text-[11px] text-slate-500">Overhead, Rent & Salaries</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-[10px] font-bold text-emerald-600 uppercase">Net Profit</span>
              <h3 className="text-2xl font-black text-emerald-600 font-mono">৳42,500</h3>
              <p className="text-[11px] text-emerald-700 font-bold">33.8% Margin</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-[10px] font-bold text-amber-600 uppercase">Supplier Dues</span>
              <h3 className="text-2xl font-black text-amber-600 font-mono">৳40,000</h3>
              <p className="text-[11px] text-amber-800 font-bold">Outstanding Liability</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: CUSTOMER REPORTS */}
      {activeCategory === "customers" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" /> Customer Acquisition & Loyalty Reports
            </h2>
            <button 
              onClick={() => exportCSVReport("Customer_Report", [
                ["Customer Metric", "Value"],
                ["New Customers", "540"],
                ["Top Customer Spending", "Abu Sayed - ৳48,500"],
                ["Repeat Purchase Rate", "67.2%"]
              ])}
              className="btn btn-xs btn-outline font-bold gap-1 rounded-lg"
            >
              <Download className="w-3.5 h-3.5 text-primary" /> Export Customer CSV
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <span className="badge badge-purple bg-purple-600 text-white font-bold text-[10px] uppercase">New Customers</span>
              <h3 className="text-3xl font-black text-slate-900">540 Users</h3>
              <p className="text-xs text-slate-500">Registered this month</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <span className="badge badge-warning text-slate-950 font-black text-[10px] uppercase">Top Spender</span>
              <h3 className="text-2xl font-black text-slate-900">Abu Sayed</h3>
              <p className="text-xs text-emerald-600 font-mono font-bold">৳48,500 Total Lifetime Spend</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <span className="badge badge-success text-white font-bold text-[10px] uppercase">Repeat Customers</span>
              <h3 className="text-3xl font-black text-emerald-600">67.2%</h3>
              <p className="text-xs text-slate-500">High Customer Retention Rate</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
