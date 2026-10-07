"use client";

import { useState } from "react";
import { 
  Boxes, 
  AlertTriangle, 
  RefreshCw, 
  Plus, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  History, 
  Sliders, 
  ArrowUpRight, 
  ArrowDownRight, 
  XCircle, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  MapPin, 
  DollarSign, 
  Layers,
  Save,
  Package
} from "lucide-react";

export default function AdminInventoryPage() {
  const [activeTab, setActiveTab] = useState<"levels" | "movement" | "adjustment">("levels");
  const [selectedProductMovement, setSelectedProductMovement] = useState("Wireless Mouse");

  // Stock Adjustment Modal State
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<"Damage" | "Lost" | "Expired" | "Correction" | "Return" | "Other">("Damage");
  const [adjustQty, setAdjustQty] = useState<number>(5);
  const [adjustReason, setAdjustReason] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("Wireless Mouse (SD-MOU-2201)");

  // KPI Dashboard Data
  const stockDashboardStats = {
    totalProducts: "1,248",
    totalStock: "18,540",
    lowStock: 84,
    outOfStock: 23,
    stockValue: "৳18.5M"
  };

  // Stock Items List
  const [inventoryItems, setInventoryItems] = useState([
    { id: "1", sku: "SD-MOU-2201", name: "Wireless Mouse", category: "Electronics", warehouse: "Main Warehouse (Dhaka)", availableStock: 103, minStock: 20, maxStock: 300, unitCost: 15.00, totalValue: "৳154.5k", status: "Healthy" },
    { id: "2", sku: "SD-HEAD-9081", name: "Wireless Noise-Canceling Headphones", category: "Electronics", warehouse: "Main Warehouse (Dhaka)", availableStock: 18, minStock: 25, maxStock: 200, unitCost: 120.00, totalValue: "৳216.0k", status: "Low Stock" },
    { id: "3", sku: "SD-WTC-7721", name: "Ultra Smart Watch Series 7 Pro", category: "Gadgets", warehouse: "Sub Warehouse (Chittagong)", availableStock: 25, minStock: 15, maxStock: 150, unitCost: 90.00, totalValue: "৳225.0k", status: "Healthy" },
    { id: "4", sku: "SD-KEY-1022", name: "Ergonomic Mechanical Gaming Keyboard", category: "Accessories", warehouse: "Sub Warehouse (Chittagong)", availableStock: 4, minStock: 20, maxStock: 100, unitCost: 50.00, totalValue: "৳20.0k", status: "Low Stock" },
    { id: "5", sku: "SD-CBL-4421", name: "USB-C Fast Charger Cable", category: "Electronics", warehouse: "Main Warehouse (Dhaka)", availableStock: 0, minStock: 50, maxStock: 500, unitCost: 4.00, totalValue: "৳0.00", status: "Out of Stock" }
  ]);

  // Product Stock Movement History Data
  const movementHistory = [
    { date: "10 Oct 2026, 04:30 PM", type: "Return", change: "+10", reference: "Order #ORD-7712", operator: "Customer Service", resultStock: 103, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { date: "10 Oct 2026, 02:15 PM", type: "Damage", change: "-2", reference: "Adj #ADJ-102", operator: "Inventory Mgr (David)", resultStock: 93, color: "text-red-600 bg-red-50 border-red-200" },
    { date: "10 Oct 2026, 11:00 AM", type: "Sale", change: "-5", reference: "Order #ORD-8921", operator: "Online Checkout", resultStock: 95, color: "text-amber-600 bg-amber-50 border-amber-200" },
    { date: "10 Oct 2026, 09:00 AM", type: "Purchase", change: "+100", reference: "PO #PO-2026-089", operator: "Procurement (Sarah)", resultStock: 100, color: "text-blue-600 bg-blue-50 border-blue-200" }
  ];

  const handleApplyAdjustment = (e: React.FormEvent) => {
    e.preventDefault();

    // Deduct or add stock based on type
    const isNegative = ["Damage", "Lost", "Expired"].includes(adjustmentType);
    const delta = isNegative ? -Math.abs(adjustQty) : Math.abs(adjustQty);

    setInventoryItems(prev =>
      prev.map(item => {
        if (item.name.includes("Wireless Mouse")) {
          const newStock = Math.max(0, item.availableStock + delta);
          return {
            ...item,
            availableStock: newStock,
            status: newStock === 0 ? "Out of Stock" : newStock < item.minStock ? "Low Stock" : "Healthy"
          };
        }
        return item;
      })
    );

    setIsAdjustmentModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Inventory & Stock Controls</h1>
          <p className="text-xs text-slate-500">Real-time stock monitoring, audit movement history, and manual stock adjustments</p>
        </div>
        <button 
          onClick={() => setIsAdjustmentModalOpen(true)}
          className="btn btn-primary btn-sm gap-2 font-bold shadow-md shadow-primary/20"
        >
          <Sliders className="w-4 h-4" /> Stock Adjustment
        </button>
      </div>

      {/* 1. STOCK DASHBOARD KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Products</span>
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">{stockDashboardStats.totalProducts}</h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Package className="w-5 h-5" /></div>
          </div>
          <p className="text-[10px] text-slate-500 font-semibold">Active Catalog SKUs</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Stock</span>
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">{stockDashboardStats.totalStock}</h3>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Boxes className="w-5 h-5" /></div>
          </div>
          <p className="text-[10px] text-slate-500 font-semibold">Physical Inventory Units</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Low Stock</span>
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-black text-amber-500">{stockDashboardStats.lowStock}</h3>
            <div className="p-2 bg-amber-50 text-amber-500 rounded-xl"><AlertTriangle className="w-5 h-5" /></div>
          </div>
          <p className="text-[10px] text-amber-600 font-bold">Below Reorder Threshold</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Out of Stock</span>
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-black text-error">{stockDashboardStats.outOfStock}</h3>
            <div className="p-2 bg-red-50 text-error rounded-xl"><XCircle className="w-5 h-5" /></div>
          </div>
          <p className="text-[10px] text-error font-bold">Needs Urgent Restock</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Stock Valuation</span>
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-black text-emerald-600">{stockDashboardStats.stockValue}</h3>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><DollarSign className="w-5 h-5" /></div>
          </div>
          <p className="text-[10px] text-emerald-600 font-bold">Asset Cost Total</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs tabs-boxed bg-white p-1 rounded-2xl border border-slate-200 shadow-xs flex overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("levels")}
          className={`tab text-xs sm:text-sm font-bold gap-2 ${activeTab === "levels" ? "tab-active bg-primary text-white rounded-xl" : "text-slate-600"}`}
        >
          <Boxes className="w-4 h-4" /> Current Stock Levels
        </button>

        <button
          onClick={() => setActiveTab("movement")}
          className={`tab text-xs sm:text-sm font-bold gap-2 ${activeTab === "movement" ? "tab-active bg-primary text-white rounded-xl" : "text-slate-600"}`}
        >
          <History className="w-4 h-4" /> Product Stock Movement History
        </button>
      </div>

      {/* 2. TAB: CURRENT STOCK LEVELS TABLE */}
      {activeTab === "levels" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search stock by SKU or Name..."
                className="input input-sm input-bordered pl-9 w-full focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <select className="select select-sm select-bordered focus:outline-none text-xs">
                <option>All Stock Statuses</option>
                <option>Healthy</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
              </select>
            </div>
          </div>

          <table className="table w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <th>SKU</th>
                <th>Product Name</th>
                <th>Warehouse</th>
                <th>Available Stock</th>
                <th>Reorder Level</th>
                <th>Valuation</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventoryItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="font-mono text-xs text-slate-500">{item.sku}</td>
                  <td className="font-bold text-slate-900">{item.name}</td>
                  <td className="text-xs text-slate-600">{item.warehouse}</td>
                  <td>
                    <span className={`text-base font-black ${item.availableStock === 0 ? "text-error" : item.availableStock <= item.minStock ? "text-amber-500" : "text-slate-900"}`}>
                      {item.availableStock} Units
                    </span>
                  </td>
                  <td className="text-xs text-slate-500 font-semibold">{item.minStock} Units</td>
                  <td className="font-mono text-slate-900 font-bold">{item.totalValue}</td>
                  <td>
                    <span className={`badge badge-sm font-bold ${
                      item.status === "Healthy" ? "badge-success text-white" :
                      item.status === "Low Stock" ? "badge-warning" : "badge-error text-white"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <button 
                      onClick={() => {
                        setSelectedProduct(`${item.name} (${item.sku})`);
                        setIsAdjustmentModalOpen(true);
                      }}
                      className="btn btn-xs btn-outline btn-primary font-bold"
                    >
                      Adjust
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. TAB: STOCK MOVEMENT AUDIT LOG */}
      {activeTab === "movement" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-primary" /> Product Stock History Audit Trail
              </h2>
              <p className="text-xs text-slate-500">Track all incoming purchases, sales, damage logs, and returns per product</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Selected Product:</span>
              <select 
                value={selectedProductMovement}
                onChange={(e) => setSelectedProductMovement(e.target.value)}
                className="select select-sm select-bordered font-bold text-primary focus:outline-none"
              >
                <option>Wireless Mouse</option>
                <option>Wireless Headphones</option>
                <option>Ultra Smart Watch</option>
              </select>
            </div>
          </div>

          {/* Product History Breakdown Banner */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-wrap items-center justify-between gap-6 shadow-md">
            <div>
              <span className="badge badge-primary font-bold text-xs">PRODUCT AUDIT LOG</span>
              <h3 className="text-2xl font-black mt-1">{selectedProductMovement}</h3>
              <p className="text-xs text-slate-400 font-mono">SKU: SD-MOU-2201 • Main Warehouse (Dhaka)</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <span className="text-xs text-slate-400 block font-semibold">Total Purchased</span>
                <span className="text-xl font-extrabold text-blue-400">+100</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-slate-400 block font-semibold">Sales</span>
                <span className="text-xl font-extrabold text-amber-400">-5</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-slate-400 block font-semibold">Damaged</span>
                <span className="text-xl font-extrabold text-red-400">-2</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-slate-400 block font-semibold">Returns</span>
                <span className="text-xl font-extrabold text-emerald-400">+10</span>
              </div>
              <div className="border-l border-slate-800 pl-6 text-center">
                <span className="text-xs text-slate-400 block font-semibold">Current Available</span>
                <span className="text-3xl font-black text-emerald-400">103 Units</span>
              </div>
            </div>
          </div>

          {/* Audit Trail Timeline List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Transaction History Log</h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {movementHistory.map((log, idx) => (
                <div key={idx} className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50">
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1.5 rounded-xl font-mono font-black text-sm border ${log.color}`}>
                      {log.change}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">{log.type} Transaction</span>
                        <span className="badge badge-outline text-[10px] font-mono">{log.reference}</span>
                      </div>
                      <p className="text-xs text-slate-500">Operator: <strong>{log.operator}</strong> • {log.date}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-500">Resulting Stock:</span>
                    <p className="text-sm font-black text-slate-900">{log.resultStock} Units Available</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. MANUAL STOCK ADJUSTMENT MODAL */}
      {isAdjustmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-primary" /> Manual Stock Adjustment
                </h3>
                <p className="text-xs text-slate-500">Admin stock corrections, damage logging, and returns</p>
              </div>
              <button onClick={() => setIsAdjustmentModalOpen(false)} className="btn btn-ghost btn-circle btn-xs">✕</button>
            </div>

            <form onSubmit={handleApplyAdjustment} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Select Product *</label>
                <select 
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="select select-sm select-bordered w-full font-bold focus:outline-none"
                >
                  <option>Wireless Mouse (SD-MOU-2201)</option>
                  <option>Wireless Headphones (SD-HEAD-9081)</option>
                  <option>Ultra Smart Watch (SD-WTC-7721)</option>
                </select>
              </div>

              {/* Adjustment Type Selector (Damage, Lost, Expired, Correction, Return, Other) */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">Adjustment Type *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { type: "Damage", badge: "🔴 Damage", isDeduct: true },
                    { type: "Lost", badge: "🔴 Lost", isDeduct: true },
                    { type: "Expired", badge: "🔴 Expired", isDeduct: true },
                    { type: "Correction", badge: "🔵 Correction", isDeduct: false },
                    { type: "Return", badge: "🟢 Return", isDeduct: false },
                    { type: "Other", badge: "🟡 Other", isDeduct: false }
                  ].map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setAdjustmentType(item.type as any)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        adjustmentType === item.type
                          ? "border-primary bg-primary/10 text-primary shadow-xs"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      {item.badge}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500">Quantity *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(Number(e.target.value))}
                    className="input input-sm input-bordered w-full font-black text-base focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500">Warehouse</label>
                  <select defaultValue="MainDhaka" className="select select-sm select-bordered w-full focus:outline-none text-xs">
                    <option value="MainDhaka">Main Warehouse (Dhaka)</option>
                    <option value="SubCtg">Sub Warehouse (Chittagong)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Adjustment Note / Reason</label>
                <textarea
                  rows={3}
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Explain why stock is being adjusted (e.g., damaged during transit)..."
                  className="textarea textarea-bordered w-full text-xs focus:outline-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsAdjustmentModalOpen(false)} className="btn btn-sm btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-sm btn-primary gap-1 font-bold">
                  <Save className="w-4 h-4" /> Save Stock Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
