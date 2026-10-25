"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  ArrowRight, 
  Plus, 
  Search, 
  MapPin, 
  Boxes, 
  Package, 
  Truck, 
  ShoppingBag, 
  ShoppingCart, 
  ArrowLeftRight, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Save, 
  FileText,
  Trash2,
  Edit,
  RefreshCw,
  Phone,
  UserCheck
} from "lucide-react";

interface Warehouse {
  id: string;
  _id?: string;
  name: string;
  code: string;
  location: string;
  manager: string;
  phone: string;
  racksCount?: string;
  badge?: string;
  color?: string;
  totalStock?: string;
  productsCount?: string;
  purchasesCount?: string;
  salesCount?: string;
  transfersCount?: string;
  status?: string;
}

interface WarehouseTransfer {
  id: string;
  _id?: string;
  date: string;
  from: string;
  to: string;
  productId?: string;
  product: string;
  qty: number;
  transport: string;
  operator: string;
  note?: string;
  status: "In Transit" | "Completed" | "Cancelled";
  badgeColor?: string;
}

interface ProductItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  warehouse?: string;
  warehouseStocks?: Record<string, number>;
}

export default function AdminWarehousesPage() {
  const [activeTab, setActiveTab] = useState<"hubs" | "transfers">("hubs");
  
  // Data states
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [transfersHistory, setTransfersHistory] = useState<WarehouseTransfer[]>([]);
  const [productsList, setProductsList] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search filter
  const [searchHub, setSearchHub] = useState("");

  // Modal State for New Stock Transfer
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [submittingTransfer, setSubmittingTransfer] = useState(false);
  const [transferForm, setTransferForm] = useState({
    from: "",
    to: "",
    productId: "",
    product: "",
    qty: 10,
    transport: "SA Paribahan Express",
    note: "Restocking regional demand for upcoming mega sale"
  });

  // Modal State for Add / Edit Warehouse
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [submittingWarehouse, setSubmittingWarehouse] = useState(false);
  const [warehouseForm, setWarehouseForm] = useState({
    name: "",
    code: "",
    location: "",
    manager: "",
    phone: "",
    racksCount: "20 Racks / 80 Shelves",
    badge: "Regional Hub",
    color: "border-primary/30 bg-primary/5 text-primary",
  });

  // Fetch all live data from DB
  const loadData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const [whRes, trfRes, prodRes] = await Promise.all([
        fetch("/api/warehouses", { cache: "no-store" }),
        fetch("/api/warehouses/transfers", { cache: "no-store" }),
        fetch("/api/products", { cache: "no-store" })
      ]);

      const whData = await whRes.json();
      const trfData = await trfRes.json();
      const prodData = await prodRes.json();

      if (whData.success) {
        setWarehouses(whData.warehouses || []);
        if (whData.warehouses?.length > 0 && !transferForm.from) {
          setTransferForm(prev => ({
            ...prev,
            from: whData.warehouses[0].name,
            to: whData.warehouses[1]?.name || whData.warehouses[0].name
          }));
        }
      }

      if (trfData.success) {
        setTransfersHistory(trfData.transfers || []);
      }

      if (prodData.success && Array.isArray(prodData.products)) {
        setProductsList(prodData.products);
        if (prodData.products.length > 0 && !transferForm.product) {
          const firstP = prodData.products[0];
          setTransferForm(prev => ({
            ...prev,
            productId: firstP.id,
            product: `${firstP.name} (${firstP.sku})`
          }));
        }
      }
    } catch (err) {
      console.error("Failed to load warehouse data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered warehouses
  const filteredWarehouses = warehouses.filter(wh =>
    wh.name.toLowerCase().includes(searchHub.toLowerCase()) ||
    wh.code.toLowerCase().includes(searchHub.toLowerCase()) ||
    wh.location.toLowerCase().includes(searchHub.toLowerCase()) ||
    wh.manager.toLowerCase().includes(searchHub.toLowerCase())
  );

  // Helper to compute available stock of a product in the chosen Source Warehouse
  const getProductStockInWarehouse = (prod: ProductItem, whName: string) => {
    if (!prod || !whName) return 0;
    const whKey = whName.trim().toLowerCase();
    const stocks = prod.warehouseStocks || {};

    if (Object.keys(stocks).length > 0) {
      for (const [key, qty] of Object.entries(stocks)) {
        const kLower = key.toLowerCase();
        if (
          kLower === whKey ||
          kLower.includes(whKey.split(" ")[0]) ||
          (whKey.includes("dhaka") && (kLower.includes("dhaka") || kLower === "maindhaka")) ||
          (whKey.includes("chittagong") && (kLower.includes("chittagong") || kLower === "subctg")) ||
          (whKey.includes("rangpur") && kLower.includes("rangpur")) ||
          (whKey.includes("sylhet") && kLower.includes("sylhet"))
        ) {
          return Number(qty || 0);
        }
      }
      return 0;
    }

    // Default: Check if product.warehouse matches source warehouse
    const pWh = (prod.warehouse || "").trim().toLowerCase();
    const isAssigned = (
      pWh === whKey ||
      (whKey.includes("dhaka") && (pWh.includes("dhaka") || pWh === "maindhaka")) ||
      (whKey.includes("chittagong") && (pWh.includes("chittagong") || pWh.includes("subctg"))) ||
      (whKey.includes("rangpur") && pWh.includes("rangpur")) ||
      (whKey.includes("sylhet") && pWh.includes("sylhet"))
    );

    return isAssigned ? Number(prod.stock || 0) : 0;
  };

  // Products available specifically in the selected Source Warehouse (only products with stock > 0)
  const availableSourceProducts = productsList
    .map(p => {
      const stockInSource = getProductStockInWarehouse(p, transferForm.from);
      return {
        ...p,
        stockInSource,
      };
    })
    .filter(p => p.stockInSource > 0);

  // Selected product object
  const currentSelectedProduct = availableSourceProducts.find(
    p => p.id === transferForm.productId
  ) || availableSourceProducts[0] || null;

  // Handle source warehouse change: update destination and re-sync product selection
  const handleSourceWarehouseChange = (newSource: string) => {
    let newDestination = transferForm.to;
    if (newDestination === newSource) {
      const otherWh = warehouses.find(w => w.name !== newSource);
      newDestination = otherWh ? otherWh.name : newSource;
    }

    // Recalculate available products for the new source hub
    const newAvailable = productsList
      .map(p => ({
        ...p,
        stockInSource: getProductStockInWarehouse(p, newSource),
      }))
      .filter(p => p.stockInSource > 0);

    const nextProd = newAvailable[0];

    setTransferForm(prev => ({
      ...prev,
      from: newSource,
      to: newDestination,
      productId: nextProd ? nextProd.id : "",
      product: nextProd ? `${nextProd.name} (${nextProd.sku})` : "",
      qty: nextProd ? Math.min(prev.qty || 10, nextProd.stockInSource) : 1,
    }));
  };

  // Open Create Warehouse Modal
  const handleOpenAddWarehouse = () => {
    setEditingWarehouse(null);
    setWarehouseForm({
      name: "",
      code: "",
      location: "",
      manager: "",
      phone: "",
      racksCount: "20 Racks / 80 Shelves",
      badge: "Regional Hub",
      color: "border-primary/30 bg-primary/5 text-primary",
    });
    setIsWarehouseModalOpen(true);
  };

  // Open Edit Warehouse Modal
  const handleOpenEditWarehouse = (wh: Warehouse) => {
    setEditingWarehouse(wh);
    setWarehouseForm({
      name: wh.name,
      code: wh.code,
      location: wh.location,
      manager: wh.manager,
      phone: wh.phone,
      racksCount: wh.racksCount || "20 Racks / 80 Shelves",
      badge: wh.badge || "Regional Hub",
      color: wh.color || "border-primary/30 bg-primary/5 text-primary",
    });
    setIsWarehouseModalOpen(true);
  };

  // Save (Create or Update) Warehouse in DB
  const handleSaveWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!warehouseForm.name.trim()) {
      alert("Warehouse name is required");
      return;
    }

    setSubmittingWarehouse(true);
    try {
      const isEdit = Boolean(editingWarehouse);
      const url = "/api/warehouses";
      const method = isEdit ? "PATCH" : "POST";
      const body = isEdit
        ? { id: editingWarehouse?.id, ...warehouseForm }
        : warehouseForm;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        setIsWarehouseModalOpen(false);
        await loadData(true);
      } else {
        alert(data.message || "Failed to save warehouse");
      }
    } catch (err) {
      console.error("Save warehouse error:", err);
      alert("Error saving warehouse to database");
    } finally {
      setSubmittingWarehouse(false);
    }
  };

  // Delete Warehouse from DB
  const handleDeleteWarehouse = async (whId: string, whName: string) => {
    if (!confirm(`Are you sure you want to delete '${whName}'?`)) return;

    try {
      const res = await fetch(`/api/warehouses?id=${whId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setWarehouses(prev => prev.filter(w => w.id !== whId));
      } else {
        alert(data.message || "Failed to delete warehouse");
      }
    } catch (err) {
      console.error("Delete warehouse error:", err);
      alert("Failed to delete warehouse");
    }
  };

  // Create Stock Transfer in DB
  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (transferForm.from === transferForm.to) {
      alert("Source and Destination warehouses cannot be the same!");
      return;
    }

    setSubmittingTransfer(true);
    try {
      const res = await fetch("/api/warehouses/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transferForm),
      });

      const data = await res.json();
      if (data.success) {
        setIsTransferModalOpen(false);
        setActiveTab("transfers");
        await loadData(true);
      } else {
        alert(data.message || "Failed to initiate stock transfer");
      }
    } catch (err) {
      console.error("Transfer error:", err);
      alert("Failed to dispatch transfer");
    } finally {
      setSubmittingTransfer(false);
    }
  };

  // Update Transfer Status (e.g. Complete or Cancel)
  const handleUpdateTransferStatus = async (trfId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/warehouses/transfers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: trfId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setTransfersHistory(prev =>
          prev.map(t => (t.id === trfId ? { ...t, status: newStatus as any, badgeColor: newStatus === "Completed" ? "badge-success text-white" : "badge-error text-white" } : t))
        );
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Multi-Warehouse Hubs System</h1>
          <p className="text-xs text-slate-500">
            Real-time regional warehouse hubs from MongoDB, live stock distribution, racks, and inter-hub transfer logs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadData(true)}
            disabled={refreshing || loading}
            className="btn btn-outline btn-sm gap-1.5"
            title="Reload live warehouse data from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button 
            onClick={handleOpenAddWarehouse}
            className="btn btn-outline btn-sm gap-1.5 font-bold"
          >
            <Plus className="w-4 h-4" /> Add Warehouse Hub
          </button>
          <button 
            onClick={() => setIsTransferModalOpen(true)}
            className="btn btn-primary btn-sm gap-2 font-bold shadow-md shadow-primary/20"
          >
            <ArrowLeftRight className="w-4 h-4" /> Transfer Stock
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs tabs-boxed bg-white p-1 rounded-2xl border border-slate-200 shadow-xs flex overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("hubs")}
          className={`tab text-xs sm:text-sm font-bold gap-2 ${activeTab === "hubs" ? "tab-active bg-primary text-white rounded-xl" : "text-slate-600"}`}
        >
          <Building2 className="w-4 h-4" /> Warehouse Hubs Directory ({warehouses.length})
        </button>

        <button
          onClick={() => setActiveTab("transfers")}
          className={`tab text-xs sm:text-sm font-bold gap-2 ${activeTab === "transfers" ? "tab-active bg-primary text-white rounded-xl" : "text-slate-600"}`}
        >
          <ArrowLeftRight className="w-4 h-4" /> Inter-Warehouse Transfer Logs ({transfersHistory.length})
        </button>
      </div>

      {/* 1. TAB: WAREHOUSE HUBS DIRECTORY */}
      {activeTab === "hubs" && (
        <div className="space-y-6">
          {/* Search bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchHub}
                onChange={(e) => setSearchHub(e.target.value)}
                placeholder="Search warehouse hub by name, code or city..."
                className="input input-sm input-bordered pl-9 w-full focus:outline-none text-xs"
              />
            </div>
            <div className="text-xs text-slate-500 font-semibold">
              Showing {filteredWarehouses.length} active regional hubs connected to database
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <span className="loading loading-spinner loading-md text-primary"></span>
              <p className="mt-2 text-xs text-slate-500">Loading warehouse hubs from MongoDB...</p>
            </div>
          ) : filteredWarehouses.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-600">No warehouse hubs match your search</p>
              <button onClick={handleOpenAddWarehouse} className="btn btn-xs btn-primary gap-1 font-bold">
                <Plus className="w-3.5 h-3.5" /> Add New Warehouse Hub
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWarehouses.map((wh) => (
                <div 
                  key={wh.id} 
                  className={`bg-white rounded-3xl border ${wh.color ? wh.color.split(" ")[0] : "border-slate-200"} p-6 shadow-xs space-y-5 relative overflow-hidden flex flex-col justify-between`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className={`badge ${wh.color || "badge-primary"} text-[10px] font-extrabold uppercase`}>
                          {wh.badge || "Regional Hub"}
                        </span>
                        <h3 className="font-extrabold text-xl text-slate-900 line-clamp-1">{wh.name}</h3>
                        <p className="text-xs text-slate-400 font-mono">Code: {wh.code}</p>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400">
                        <Building2 className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600 border-t border-b border-slate-100 py-3">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" /> 
                        <span className="truncate">{wh.location}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span><strong>Manager:</strong> {wh.manager}</span>
                      </p>
                      <p className="flex items-center gap-2 font-mono">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{wh.phone}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span><strong>Rack Layout:</strong> {wh.racksCount}</span>
                      </p>
                    </div>

                    {/* Warehouse Live Metrics Breakdown */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-semibold">Live Stock</span>
                        <strong className="text-slate-900 font-black text-xs sm:text-sm">{wh.totalStock || "0 Units"}</strong>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-semibold">Products</span>
                        <strong className="text-slate-900 font-black text-xs sm:text-sm">{wh.productsCount || "0 SKUs"}</strong>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-semibold">Transfers</span>
                        <strong className="text-primary font-black text-xs sm:text-sm">{wh.transfersCount || "0"}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <div className="text-[11px] text-slate-400 font-medium">
                      Status: <span className="font-bold text-success">Active Hub</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleOpenEditWarehouse(wh)}
                        className="btn btn-ghost btn-xs text-slate-600 hover:text-primary"
                        title="Edit warehouse info"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteWarehouse(wh.id, wh.name)}
                        className="btn btn-ghost btn-xs text-slate-400 hover:text-error"
                        title="Delete warehouse"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. TAB: INTER-WAREHOUSE STOCK TRANSFERS & VISUAL FLOW */}
      {activeTab === "transfers" && (
        <div className="space-y-6">
          {/* Visual Stock Transfer Diagram Highlight */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="badge badge-primary font-bold text-xs">LIVE STOCK TRANSFER FLOW</span>
                <h3 className="text-xl font-black mt-1">Inter-Warehouse Movement Route</h3>
              </div>
              <button 
                onClick={() => setIsTransferModalOpen(true)} 
                className="btn btn-primary btn-xs font-bold gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> New Stock Transfer
              </button>
            </div>

            {/* Diagram */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center">
              {/* Source Hub */}
              <div className="space-y-1 bg-slate-900 p-4 rounded-xl border border-slate-800 w-full md:w-60">
                <Building2 className="w-6 h-6 text-primary mx-auto" />
                <h4 className="font-extrabold text-sm text-white truncate">
                  {transfersHistory[0]?.from || "Dhaka Central Warehouse"}
                </h4>
                <p className="text-[10px] text-slate-400">Source Depot (Stock Out)</p>
              </div>

              {/* Arrow Transfer Badge */}
              <div className="flex flex-col items-center gap-1 text-primary">
                <span className="badge badge-accent font-black text-xs px-3 py-2">
                  {transfersHistory[0] ? `Transfer ${transfersHistory[0].qty} Units` : "Inter-Hub Logistics"}
                </span>
                <div className="flex items-center gap-1 font-mono text-xs text-slate-400">
                  <Truck className="w-4 h-4 text-amber-400 animate-bounce" /> 
                  {transfersHistory[0]?.transport || "Express Courier / Fleet"}
                </div>
                <ArrowRight className="w-8 h-8 text-primary hidden md:block" />
              </div>

              {/* Destination Hub */}
              <div className="space-y-1 bg-slate-900 p-4 rounded-xl border border-slate-800 w-full md:w-60">
                <Building2 className="w-6 h-6 text-accent mx-auto" />
                <h4 className="font-extrabold text-sm text-white truncate">
                  {transfersHistory[0]?.to || "Regional Destination Hub"}
                </h4>
                <p className="text-[10px] text-slate-400">Destination Depot (Stock In)</p>
              </div>
            </div>
          </div>

          {/* Transfers Audit Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900">Transfer History Audit Logs</h3>
              <span className="badge badge-primary font-bold text-xs">{transfersHistory.length} Recorded in DB</span>
            </div>

            <table className="table w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 font-extrabold">
                  <th>Transfer ID</th>
                  <th>Date & Operator</th>
                  <th>Source ──▶ Destination</th>
                  <th>Product & Qty</th>
                  <th>Transport / Logistics</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transfersHistory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                      No stock transfers found in database. Click "Transfer Stock" to create one.
                    </td>
                  </tr>
                ) : (
                  transfersHistory.map((trf) => (
                    <tr key={trf.id || trf._id} className="hover:bg-slate-50/50">
                      <td className="font-extrabold text-primary font-mono">{trf.id}</td>
                      <td className="text-xs">
                        <p className="font-bold text-slate-900">{trf.date}</p>
                        <p className="text-slate-400">By: {trf.operator}</p>
                      </td>
                      <td className="text-xs font-semibold">
                        <div className="flex items-center gap-1.5 text-slate-900">
                          <span className="truncate max-w-[120px]">{trf.from.split(" ")[0]}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="text-primary font-bold truncate max-w-[120px]">{trf.to.split(" ")[0]}</span>
                        </div>
                      </td>
                      <td>
                        <p className="font-bold text-slate-900 line-clamp-1">{trf.product}</p>
                        <span className="badge badge-sm badge-outline font-black text-slate-800">{trf.qty} Units</span>
                      </td>
                      <td className="text-xs text-slate-600 font-mono">{trf.transport}</td>
                      <td>
                        <span className={`badge ${trf.badgeColor || "badge-primary"} font-bold text-xs`}>
                          {trf.status}
                        </span>
                      </td>
                      <td className="text-right">
                        {trf.status === "In Transit" && (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleUpdateTransferStatus(trf.id, "Completed")}
                              className="btn btn-xs btn-outline btn-success font-bold gap-1"
                              title="Confirm receipt and add stock to destination hub"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Mark Received
                            </button>
                            <button
                              onClick={() => handleUpdateTransferStatus(trf.id, "Cancelled")}
                              className="btn btn-xs btn-ghost text-slate-400 hover:text-error"
                              title="Cancel transfer and return stock to source depot"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                        {trf.status === "Completed" && (
                          <span className="text-xs text-success font-bold flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Received
                          </span>
                        )}
                        {trf.status === "Cancelled" && (
                          <span className="text-xs text-error font-bold flex items-center justify-end gap-1">
                            Cancelled
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD / EDIT WAREHOUSE HUB */}
      {isWarehouseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" /> 
                  {editingWarehouse ? "Edit Warehouse Hub" : "Add New Warehouse Hub"}
                </h3>
                <p className="text-xs text-slate-500">Persist warehouse depot details in MongoDB</p>
              </div>
              <button 
                onClick={() => setIsWarehouseModalOpen(false)} 
                className="btn btn-ghost btn-circle btn-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveWarehouse} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Warehouse Name *</label>
                <input
                  type="text"
                  required
                  value={warehouseForm.name}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
                  placeholder="e.g. Sylhet Regional Depot"
                  className="input input-sm input-bordered w-full font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500">Code (Optional)</label>
                  <input
                    type="text"
                    value={warehouseForm.code}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, code: e.target.value })}
                    placeholder="e.g. WH-SYL-04"
                    className="input input-sm input-bordered w-full font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500">Hub Badge Label</label>
                  <input
                    type="text"
                    value={warehouseForm.badge}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, badge: e.target.value })}
                    placeholder="e.g. Eastern Hub"
                    className="input input-sm input-bordered w-full focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Physical Location / Address *</label>
                <input
                  type="text"
                  required
                  value={warehouseForm.location}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, location: e.target.value })}
                  placeholder="e.g. Upashahar Commercial Area, Sylhet"
                  className="input input-sm input-bordered w-full focus:outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500">Manager In-Charge *</label>
                  <input
                    type="text"
                    required
                    value={warehouseForm.manager}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, manager: e.target.value })}
                    placeholder="e.g. Farhan Ahmed"
                    className="input input-sm input-bordered w-full focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500">Contact Phone</label>
                  <input
                    type="text"
                    value={warehouseForm.phone}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, phone: e.target.value })}
                    placeholder="e.g. +880 1712-345678"
                    className="input input-sm input-bordered w-full focus:outline-none text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Racks & Shelves Capacity</label>
                <input
                  type="text"
                  value={warehouseForm.racksCount}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, racksCount: e.target.value })}
                  placeholder="e.g. 24 Racks / 96 Shelves"
                  className="input input-sm input-bordered w-full focus:outline-none text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsWarehouseModalOpen(false)} 
                  className="btn btn-sm btn-ghost"
                  disabled={submittingWarehouse}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submittingWarehouse}
                  className="btn btn-sm btn-primary gap-1 font-bold"
                >
                  {submittingWarehouse ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {editingWarehouse ? "Save Changes" : "Create Warehouse Hub"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: NEW STOCK TRANSFER */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <ArrowLeftRight className="w-5 h-5 text-primary" /> Inter-Warehouse Stock Transfer
                </h3>
                <p className="text-xs text-slate-500">Dispatch live stock movement between regional hubs</p>
              </div>
              <button 
                onClick={() => setIsTransferModalOpen(false)} 
                className="btn btn-ghost btn-circle btn-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTransfer} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500">Source Warehouse (From) *</label>
                  <select 
                    value={transferForm.from}
                    onChange={(e) => handleSourceWarehouseChange(e.target.value)}
                    className="select select-sm select-bordered w-full font-bold focus:outline-none text-xs"
                    required
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.name}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500">Destination Hub (To) *</label>
                  <select 
                    value={transferForm.to}
                    onChange={(e) => setTransferForm({ ...transferForm, to: e.target.value })}
                    className="select select-sm select-bordered w-full font-bold focus:outline-none text-xs"
                    required
                  >
                    {warehouses
                      .filter((w) => w.name !== transferForm.from)
                      .map((w) => (
                        <option key={w.id} value={w.name}>
                          {w.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-slate-500">Product & SKU to Transfer *</label>
                  {currentSelectedProduct && (
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      In Stock at {transferForm.from.split(" ")[0]}: {currentSelectedProduct.stockInSource} Units
                    </span>
                  )}
                </div>

                {availableSourceProducts.length > 0 ? (
                  <select 
                    value={transferForm.productId}
                    onChange={(e) => {
                      const selId = e.target.value;
                      const p = availableSourceProducts.find((item) => item.id === selId);
                      setTransferForm({
                        ...transferForm,
                        productId: selId,
                        product: p ? `${p.name} (${p.sku})` : selId,
                        qty: p ? Math.min(transferForm.qty, p.stockInSource) : 1,
                      });
                    }}
                    className="select select-sm select-bordered w-full font-bold focus:outline-none text-xs"
                    required
                  >
                    {availableSourceProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.sku}) — Available: {p.stockInSource} Units
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      ⚠️ No products currently available at {transferForm.from}
                    </p>
                    <p className="text-[11px] text-amber-700">
                      This warehouse has 0 in-stock items to transfer. Please pick another Source Warehouse above.
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase text-slate-500">Transfer Quantity *</label>
                    {currentSelectedProduct && currentSelectedProduct.stockInSource > 0 && (
                      <button
                        type="button"
                        onClick={() => setTransferForm(prev => ({ ...prev, qty: currentSelectedProduct.stockInSource }))}
                        className="text-[10px] text-primary hover:underline font-bold"
                      >
                        Max ({currentSelectedProduct.stockInSource})
                      </button>
                    )}
                  </div>
                  <input
                    type="number"
                    required
                    min={1}
                    max={currentSelectedProduct ? currentSelectedProduct.stockInSource : 1}
                    value={transferForm.qty}
                    disabled={!currentSelectedProduct || currentSelectedProduct.stockInSource <= 0}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const maxAllowed = currentSelectedProduct ? currentSelectedProduct.stockInSource : 1;
                      setTransferForm({
                        ...transferForm,
                        qty: val,
                      });
                    }}
                    className={`input input-sm input-bordered w-full font-black text-base focus:outline-none ${
                      currentSelectedProduct && transferForm.qty > currentSelectedProduct.stockInSource
                        ? "border-error text-error"
                        : ""
                    }`}
                  />
                  {currentSelectedProduct && transferForm.qty > currentSelectedProduct.stockInSource && (
                    <p className="text-[10px] text-error font-bold flex items-center gap-1">
                      ⚠️ Quantity exceeds available stock ({currentSelectedProduct.stockInSource} max)
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500">Logistics / Courier</label>
                  <input
                    type="text"
                    value={transferForm.transport}
                    onChange={(e) => setTransferForm({ ...transferForm, transport: e.target.value })}
                    className="input input-sm input-bordered w-full focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Transfer Purpose / Notes</label>
                <textarea
                  rows={2}
                  value={transferForm.note}
                  onChange={(e) => setTransferForm({ ...transferForm, note: e.target.value })}
                  className="textarea textarea-bordered w-full text-xs focus:outline-none"
                  placeholder="Reason for transfer..."
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsTransferModalOpen(false)} 
                  className="btn btn-sm btn-ghost"
                  disabled={submittingTransfer}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={
                    submittingTransfer ||
                    !currentSelectedProduct ||
                    currentSelectedProduct.stockInSource <= 0 ||
                    transferForm.qty <= 0 ||
                    transferForm.qty > currentSelectedProduct.stockInSource
                  }
                  className="btn btn-sm btn-primary gap-1 font-bold"
                >
                  {submittingTransfer ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Confirm & Dispatch Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
