"use client";

import { useEffect, useState, useMemo } from "react";
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
  Package,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

interface InventoryItem {
  id: string;
  _id?: string;
  sku: string;
  name: string;
  category: string;
  warehouse: string;
  rackLocation?: string;
  availableStock: number;
  stock: number;
  minStock: number;
  maxStock: number;
  costPrice: number;
  price: number;
  totalValue: number;
  formattedValue: string;
  status: string;
}

interface StockMovement {
  _id?: string;
  productId: string;
  productName: string;
  sku: string;
  type: string;
  change: number;
  reference: string;
  operator: string;
  reason?: string;
  warehouse?: string;
  previousStock: number;
  resultStock: number;
  date: string;
  createdAt?: string;
}

interface StockStats {
  totalProducts: number | string;
  totalStock: string;
  lowStock: number;
  outOfStock: number;
  stockValue: string;
}

export default function AdminInventoryPage() {
  const [activeTab, setActiveTab] = useState<"levels" | "movement">("levels");
  
  // Data states from DB
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<StockStats>({
    totalProducts: 0,
    totalStock: "0",
    lowStock: 0,
    outOfStock: 0,
    stockValue: "৳0",
  });
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);

  // Filtering states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Stock Statuses");
  const [selectedProductMovement, setSelectedProductMovement] = useState<string>("all");

  // Stock Adjustment Modal State
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<"Damage" | "Lost" | "Expired" | "Correction" | "Return" | "Other">("Damage");
  const [adjustQty, setAdjustQty] = useState<number>(1);
  const [adjustReason, setAdjustReason] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("Main Warehouse (Dhaka)");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Inventory Data from DB
  const fetchInventory = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch("/api/inventory", { cache: "no-store" });
      const data = await res.json();

      if (data.success) {
        setStats(data.stats);
        setInventoryItems(data.items || []);
        setMovements(data.movements || []);
        
        // Auto-select first product for modal or movement filter if empty
        if (data.items?.length > 0 && !selectedProductId) {
          setSelectedProductId(data.items[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch inventory from DB:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Filtered inventory items for Level Table
  const filteredItems = useMemo(() => {
    return inventoryItems.filter((item) => {
      const matchSearch =
        searchTerm.trim() === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        selectedStatus === "All Stock Statuses" || item.status === selectedStatus;

      return matchSearch && matchStatus;
    });
  }, [inventoryItems, searchTerm, selectedStatus]);

  // Movements filtered by chosen product
  const filteredMovements = useMemo(() => {
    if (selectedProductMovement === "all") return movements;
    return movements.filter(
      (m) =>
        m.productId === selectedProductMovement ||
        m.sku === selectedProductMovement ||
        m.productName === selectedProductMovement
    );
  }, [movements, selectedProductMovement]);

  // Selected product summary for Movement Audit Banner
  const selectedMovementProduct = useMemo(() => {
    if (selectedProductMovement === "all") {
      return inventoryItems[0] || null;
    }
    return inventoryItems.find(
      (i) =>
        i.id === selectedProductMovement ||
        i.sku === selectedProductMovement ||
        i.name === selectedProductMovement
    ) || inventoryItems[0];
  }, [inventoryItems, selectedProductMovement]);

  // Calculated movement aggregates for the banner
  const movementSummary = useMemo(() => {
    const list = filteredMovements;
    let purchases = 0;
    let sales = 0;
    let damaged = 0;
    let returns = 0;

    for (const m of list) {
      const chg = Math.abs(m.change);
      if (m.type === "Purchase") purchases += chg;
      else if (m.type === "Sale") sales += chg;
      else if (["Damage", "Lost", "Expired"].includes(m.type)) damaged += chg;
      else if (m.type === "Return") returns += chg;
    }

    return { purchases, sales, damaged, returns };
  }, [filteredMovements]);

  // Handle Adjustment Submission
  const handleApplyAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) {
      alert("Please select a product");
      return;
    }
    if (adjustQty <= 0) {
      alert("Please enter a valid quantity greater than 0");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProductId,
          adjustmentType,
          quantity: adjustQty,
          reason: adjustReason,
          warehouse: selectedWarehouse,
          operator: "Admin User",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsAdjustmentModalOpen(false);
        setAdjustReason("");
        setAdjustQty(1);
        // Refresh live data
        await fetchInventory(true);
      } else {
        alert(data.message || "Failed to adjust stock");
      }
    } catch (error) {
      console.error("Adjustment submission error:", error);
      alert("An unexpected error occurred while saving stock adjustment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMovementColor = (type: string, change: number) => {
    if (["Damage", "Lost", "Expired"].includes(type)) {
      return "text-red-600 bg-red-50 border-red-200";
    }
    if (type === "Return" || change > 0) {
      return "text-emerald-600 bg-emerald-50 border-emerald-200";
    }
    if (type === "Sale") {
      return "text-amber-600 bg-amber-50 border-amber-200";
    }
    return "text-blue-600 bg-blue-50 border-blue-200";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Inventory & Stock Controls</h1>
          <p className="text-xs text-slate-500">
            Real-time stock monitoring directly from MongoDB database, audit movement history, and manual stock adjustments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchInventory(true)}
            disabled={refreshing || loading}
            className="btn btn-outline btn-sm gap-1.5"
            title="Reload live inventory from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button 
            onClick={() => {
              if (inventoryItems.length > 0 && !selectedProductId) {
                setSelectedProductId(inventoryItems[0].id);
              }
              setIsAdjustmentModalOpen(true);
            }}
            className="btn btn-primary btn-sm gap-2 font-bold shadow-md shadow-primary/20"
          >
            <Sliders className="w-4 h-4" /> Stock Adjustment
          </button>
        </div>
      </div>

      {/* 1. STOCK DASHBOARD KPI CARDS (LIVE DB STATS) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Products</span>
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              {loading ? <span className="loading loading-spinner loading-sm"></span> : stats.totalProducts}
            </h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Package className="w-5 h-5" /></div>
          </div>
          <p className="text-[10px] text-slate-500 font-semibold">Active Catalog SKUs</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Stock</span>
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              {loading ? <span className="loading loading-spinner loading-sm"></span> : stats.totalStock}
            </h3>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Boxes className="w-5 h-5" /></div>
          </div>
          <p className="text-[10px] text-slate-500 font-semibold">Physical Inventory Units</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Low Stock</span>
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-black text-amber-500">
              {loading ? <span className="loading loading-spinner loading-sm"></span> : stats.lowStock}
            </h3>
            <div className="p-2 bg-amber-50 text-amber-500 rounded-xl"><AlertTriangle className="w-5 h-5" /></div>
          </div>
          <p className="text-[10px] text-amber-600 font-bold">Below Reorder Threshold</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Out of Stock</span>
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-black text-error">
              {loading ? <span className="loading loading-spinner loading-sm"></span> : stats.outOfStock}
            </h3>
            <div className="p-2 bg-red-50 text-error rounded-xl"><XCircle className="w-5 h-5" /></div>
          </div>
          <p className="text-[10px] text-error font-bold">Needs Urgent Restock</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Stock Valuation</span>
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-black text-emerald-600">
              {loading ? <span className="loading loading-spinner loading-sm"></span> : stats.stockValue}
            </h3>
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
          <Boxes className="w-4 h-4" /> Current Stock Levels ({inventoryItems.length})
        </button>

        <button
          onClick={() => setActiveTab("movement")}
          className={`tab text-xs sm:text-sm font-bold gap-2 ${activeTab === "movement" ? "tab-active bg-primary text-white rounded-xl" : "text-slate-600"}`}
        >
          <History className="w-4 h-4" /> Stock Movement History ({movements.length})
        </button>
      </div>

      {/* 2. TAB: CURRENT STOCK LEVELS TABLE */}
      {activeTab === "levels" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search stock by SKU, name or category..."
                className="input input-sm input-bordered pl-9 w-full focus:outline-none text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="select select-sm select-bordered focus:outline-none text-xs font-medium"
              >
                <option value="All Stock Statuses">All Stock Statuses</option>
                <option value="Healthy">Healthy</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full text-xs">
              <thead>
                <tr className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 font-extrabold">
                  <th>SKU</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Warehouse</th>
                  <th>Available Stock</th>
                  <th>Reorder Level</th>
                  <th>Unit Cost</th>
                  <th>Valuation</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400 font-medium">
                      <span className="loading loading-spinner loading-md text-primary"></span>
                      <p className="mt-2 text-xs">Loading live inventory items from MongoDB...</p>
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400 font-medium">
                      <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      No inventory items found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="font-mono text-slate-500 font-bold">{item.sku}</td>
                      <td>
                        <div className="font-extrabold text-slate-900 text-sm max-w-xs truncate">
                          {item.name}
                        </div>
                        {item.rackLocation && (
                          <span className="text-[10px] text-slate-400 font-mono block">
                            Loc: {item.rackLocation}
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="badge badge-sm badge-ghost font-medium">
                          {item.category}
                        </span>
                      </td>
                      <td className="text-slate-600 font-medium">{item.warehouse}</td>
                      <td>
                        <span className={`text-sm font-black ${
                          item.availableStock === 0 ? "text-error" : item.availableStock <= item.minStock ? "text-amber-500" : "text-slate-900"
                        }`}>
                          {item.availableStock} Units
                        </span>
                      </td>
                      <td className="text-slate-500 font-semibold">{item.minStock} Units</td>
                      <td className="font-mono text-slate-700">৳{item.costPrice}</td>
                      <td className="font-mono text-slate-900 font-black">{item.formattedValue}</td>
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
                            setSelectedProductId(item.id);
                            setSelectedWarehouse(item.warehouse || "Main Warehouse (Dhaka)");
                            setIsAdjustmentModalOpen(true);
                          }}
                          className="btn btn-xs btn-outline btn-primary font-bold gap-1"
                        >
                          <Sliders className="w-3 h-3" /> Adjust
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. TAB: STOCK MOVEMENT AUDIT LOG */}
      {activeTab === "movement" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-primary" /> Stock Movement History Audit Trail
              </h2>
              <p className="text-xs text-slate-500">
                Track all incoming purchases, sales, damage logs, corrections, and returns per product
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Filter Product:</span>
              <select 
                value={selectedProductMovement}
                onChange={(e) => setSelectedProductMovement(e.target.value)}
                className="select select-sm select-bordered font-bold text-primary focus:outline-none max-w-xs"
              >
                <option value="all">All Products (Full Audit Log)</option>
                {inventoryItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.sku})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product History Breakdown Banner */}
          {selectedMovementProduct && (
            <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-wrap items-center justify-between gap-6 shadow-md">
              <div>
                <span className="badge badge-primary font-bold text-xs">PRODUCT AUDIT LOG</span>
                <h3 className="text-xl sm:text-2xl font-black mt-1">
                  {selectedProductMovement === "all" ? "All Catalog Products" : selectedMovementProduct.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {selectedProductMovement === "all" 
                    ? `Catalog Total: ${inventoryItems.length} SKUs` 
                    : `SKU: ${selectedMovementProduct.sku} • ${selectedMovementProduct.warehouse}`}
                </p>
              </div>
              <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                <div className="text-center">
                  <span className="text-[11px] text-slate-400 block font-semibold">Purchases</span>
                  <span className="text-lg font-extrabold text-blue-400">+{movementSummary.purchases}</span>
                </div>
                <div className="text-center">
                  <span className="text-[11px] text-slate-400 block font-semibold">Sales</span>
                  <span className="text-lg font-extrabold text-amber-400">-{movementSummary.sales}</span>
                </div>
                <div className="text-center">
                  <span className="text-[11px] text-slate-400 block font-semibold">Damaged/Lost</span>
                  <span className="text-lg font-extrabold text-red-400">-{movementSummary.damaged}</span>
                </div>
                <div className="text-center">
                  <span className="text-[11px] text-slate-400 block font-semibold">Returns</span>
                  <span className="text-lg font-extrabold text-emerald-400">+{movementSummary.returns}</span>
                </div>
                <div className="border-l border-slate-800 pl-4 sm:pl-6 text-center">
                  <span className="text-[11px] text-slate-400 block font-semibold">Current Available</span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                    {selectedProductMovement === "all" ? stats.totalStock : `${selectedMovementProduct.availableStock} Units`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Audit Trail Timeline List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Transaction History Log ({filteredMovements.length})
            </h4>
            
            {filteredMovements.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
                <History className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">
                  No stock adjustments or movement logs recorded for this selection yet.
                </p>
                <button
                  onClick={() => setIsAdjustmentModalOpen(true)}
                  className="btn btn-xs btn-primary gap-1 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" /> Create Stock Adjustment
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {filteredMovements.map((log, idx) => (
                  <div key={log._id || idx} className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50">
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1.5 rounded-xl font-mono font-black text-sm border ${getMovementColor(log.type, log.change)}`}>
                        {log.change > 0 ? `+${log.change}` : log.change}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900">{log.productName}</span>
                          <span className="badge badge-ghost text-[10px] font-bold">{log.type}</span>
                          <span className="badge badge-outline text-[10px] font-mono">{log.reference}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Operator: <strong>{log.operator}</strong> • {log.date}
                          {log.reason && <span className="text-slate-400 ml-1">({log.reason})</span>}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-400">Resulting Stock:</span>
                      <p className="text-sm font-black text-slate-900">{log.resultStock} Units Available</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                <p className="text-xs text-slate-500">Live stock update in MongoDB database with audit log</p>
              </div>
              <button 
                onClick={() => setIsAdjustmentModalOpen(false)} 
                className="btn btn-ghost btn-circle btn-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyAdjustment} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Select Product *</label>
                <select 
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="select select-sm select-bordered w-full font-bold focus:outline-none"
                  required
                >
                  {inventoryItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.sku}) - {item.availableStock} in Stock
                    </option>
                  ))}
                </select>
              </div>

              {/* Adjustment Type Selector */}
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
                  <span className="text-[10px] text-slate-400">
                    {["Damage", "Lost", "Expired"].includes(adjustmentType) 
                      ? "Will deduct from stock" 
                      : "Will add to stock"}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500">Warehouse</label>
                  <select 
                    value={selectedWarehouse}
                    onChange={(e) => setSelectedWarehouse(e.target.value)}
                    className="select select-sm select-bordered w-full focus:outline-none text-xs"
                  >
                    <option value="Main Warehouse (Dhaka)">Main Warehouse (Dhaka)</option>
                    <option value="Chittagong Port Warehouse">Chittagong Port Warehouse</option>
                    <option value="Sylhet Regional Hub">Sylhet Regional Hub</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Adjustment Note / Reason</label>
                <textarea
                  rows={3}
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Explain why stock is being adjusted (e.g., damaged during transit, shelf count audit)..."
                  className="textarea textarea-bordered w-full text-xs focus:outline-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsAdjustmentModalOpen(false)} 
                  className="btn btn-sm btn-ghost"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn btn-sm btn-primary gap-1 font-bold"
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Stock Adjustment
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
