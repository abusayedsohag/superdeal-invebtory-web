"use client";

import { useEffect, useState } from "react";
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Truck, 
  PackagePlus, 
  Trash2, 
  X, 
  DollarSign,
  RefreshCw,
  Building2,
  Boxes
} from "lucide-react";

interface PurchaseItem {
  id?: string;
  name: string;
  qty: number;
  cost: number;
}

interface PurchaseOrder {
  poNumber: string;
  supplier: string;
  warehouse: string;
  date: string;
  items: PurchaseItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: "Ordered" | "Processing" | "Received" | "Cancelled";
  receivedAt?: string;
}

export default function AdminPurchasesPage() {
  const [purchases, setPurchases] = useState<PurchaseOrder[]>([]);
  const [suppliersList, setSuppliersList] = useState<string[]>([
    "ABC Electronics",
    "Apex Wholesale Electronics Ltd",
    "Global Tech Supplies Ltd",
    "Trend Apparel & Textile Mills",
  ]);
  const [warehousesList, setWarehousesList] = useState<string[]>([
    "Dhaka Central Warehouse",
    "Chittagong Hub",
    "Sylhet Warehouse",
  ]);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);

  const [stats, setStats] = useState({
    total: 0,
    aggregateSpent: 0,
    receivedCount: 0,
    pendingCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New PO Form State
  const [newSupplier, setNewSupplier] = useState("ABC Electronics");
  const [newWarehouse, setNewWarehouse] = useState("Dhaka Central Warehouse");
  const [newShipping, setNewShipping] = useState<number>(2000);
  const [newItems, setNewItems] = useState<PurchaseItem[]>([
    { name: "Wireless Noise-Canceling Premium Headphones", qty: 50, cost: 400 },
    { name: "Ergonomic Mechanical Keyboard RGB", qty: 30, cost: 700 }
  ]);
  const [isSubmittingPO, setIsSubmittingPO] = useState(false);

  // Toast Notifier
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Fetch Purchases from MongoDB
  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/purchases?status=${filterStatus}&search=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success) {
        setPurchases(data.purchases || []);
        if (data.suppliers && data.suppliers.length > 0) {
          setSuppliersList(data.suppliers);
          if (!newSupplier) setNewSupplier(data.suppliers[0]);
        }
        if (data.warehouses && data.warehouses.length > 0) {
          setWarehousesList(data.warehouses);
          if (!newWarehouse) setNewWarehouse(data.warehouses[0]);
        }
        if (data.products) {
          setAvailableProducts(data.products);
        }
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error("Failed to fetch purchases:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [filterStatus]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPurchases();
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Add Item Row to New PO
  const handleAddItemRow = () => {
    const defaultProd = availableProducts[0];
    setNewItems(prev => [
      ...prev, 
      { 
        name: defaultProd ? defaultProd.name : "", 
        qty: 10, 
        cost: defaultProd ? defaultProd.costPrice : 100 
      }
    ]);
  };

  // Remove Item Row
  const handleRemoveItemRow = (index: number) => {
    if (newItems.length <= 1) return;
    setNewItems(prev => prev.filter((_, idx) => idx !== index));
  };

  // Calculate Subtotal & Total for New PO Form
  const calcFormSubtotal = newItems.reduce((acc, item) => acc + (item.qty * item.cost), 0);
  const calcFormTotal = calcFormSubtotal + (Number(newShipping) || 0);

  // Create PO Handler (POST /api/purchases)
  const handleCreatePO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newItems.some(i => !i.name.trim() || i.qty <= 0 || i.cost <= 0)) {
      alert("Please ensure all product lines have valid names, quantities, and costs.");
      return;
    }

    setIsSubmittingPO(true);
    try {
      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplier: newSupplier,
          warehouse: newWarehouse,
          items: newItems,
          shipping: Number(newShipping) || 0,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`✅ Purchase Order #${data.purchase?.poNumber} created successfully! Marked as 'Ordered'.`);
        setIsCreateModalOpen(false);
        fetchPurchases();
      } else {
        alert(data.message || "Failed to create purchase order");
      }
    } catch (err) {
      console.error("Error creating PO:", err);
      alert("Something went wrong creating purchase order");
    } finally {
      setIsSubmittingPO(false);
    }
  };

  // Receive Purchase Handler (PATCH /api/purchases -> Increments MongoDB inventory)
  const handleReceivePurchase = async (poNumber: string) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/purchases", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          poNumber,
          status: "Received",
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`📦 Purchase #${poNumber} Received! ${data.message}`);
        await fetchPurchases();
        if (selectedPO && selectedPO.poNumber === poNumber) {
          setSelectedPO(prev => prev ? { 
            ...prev, 
            status: "Received", 
            receivedAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) 
          } : null);
        }
      } else {
        alert(data.message || "Failed to receive purchase order");
      }
    } catch (err) {
      console.error("Error receiving purchase:", err);
      alert("Failed to receive purchase order");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce">
          <PackagePlus className="w-6 h-6 text-emerald-400" />
          <div>
            <p className="text-xs font-black text-emerald-400 uppercase tracking-wider">Automated Inventory Update</p>
            <p className="text-xs font-bold">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-8 h-8 text-primary" /> Purchase Management
          </h1>
          <p className="text-xs text-slate-500">
            Procure inventory from suppliers. Receiving a purchase automatically increments stock in MongoDB.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchPurchases}
            disabled={loading}
            className="btn btn-outline btn-sm gap-2 font-bold rounded-xl"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary btn-sm gap-2 font-bold shadow-md shadow-primary/20 rounded-xl"
          >
            <Plus className="w-4 h-4" /> Create Purchase Order
          </button>
        </div>
      </div>

      {/* KPI STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total POs</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.total} Orders</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Procurement Records</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Spend</p>
            <h3 className="text-2xl font-black text-slate-900 font-mono mt-1">
              ৳{stats.aggregateSpent.toLocaleString()}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Procured Inventory Value</p>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Received & Stocked</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{stats.receivedCount} POs</h3>
            <p className="text-[11px] text-emerald-700 font-bold mt-0.5">Inventory Auto-Increased</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Pending Delivery</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">{stats.pendingCount} Orders</h3>
            <p className="text-[11px] text-amber-700 font-bold mt-0.5">Awaiting Warehouse Receiving</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search PO#, supplier, or warehouse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-sm input-bordered w-full pl-9 text-xs focus:outline-none rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="select select-sm select-bordered text-xs focus:outline-none rounded-xl font-bold"
          >
            <option value="all">All Purchase Statuses ({stats.total})</option>
            <option value="ordered">Ordered / Pending ({stats.pendingCount})</option>
            <option value="received">Received / Stocked ({stats.receivedCount})</option>
          </select>
        </div>
      </div>

      {/* PURCHASES TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <th>PO Number</th>
              <th>Supplier</th>
              <th>Destination Warehouse</th>
              <th>Order Date</th>
              <th>Items Breakdown</th>
              <th className="text-right">Total Amount</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-slate-400">
                  <span className="loading loading-spinner loading-md text-primary"></span>
                  <p className="text-xs mt-2 font-medium">Loading purchases from MongoDB...</p>
                </td>
              </tr>
            ) : purchases.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-slate-400">
                  <Boxes className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-bold text-slate-600">No purchase orders found</p>
                  <p className="text-xs text-slate-400">Click "Create Purchase Order" to replenish stock.</p>
                </td>
              </tr>
            ) : (
              purchases.map((po) => {
                const totalUnits = po.items.reduce((sum, item) => sum + item.qty, 0);

                return (
                  <tr key={po.poNumber} className="hover:bg-slate-50/50">
                    <td className="font-extrabold text-primary font-mono text-base">
                      #{po.poNumber}
                    </td>
                    <td>
                      <p className="font-bold text-slate-900 text-sm">{po.supplier}</p>
                    </td>
                    <td>
                      <p className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-primary" /> {po.warehouse}
                      </p>
                    </td>
                    <td className="text-xs text-slate-500 font-medium">{po.date}</td>
                    <td>
                      <div className="text-xs space-y-0.5">
                        <span className="font-bold text-slate-900">{totalUnits} units total</span>
                        <p className="text-[11px] text-slate-400">
                          {po.items.map(i => `${i.name} (${i.qty})`).join(", ")}
                        </p>
                      </div>
                    </td>
                    <td className="text-right font-mono font-black text-slate-900 text-base">
                      ৳{po.total.toLocaleString()}
                    </td>
                    <td>
                      {po.status === "Received" ? (
                        <span className="badge badge-success text-white font-extrabold text-xs px-2.5 py-1 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> Received
                        </span>
                      ) : (
                        <span className="badge badge-warning text-slate-900 font-extrabold text-xs px-2.5 py-1 flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3" /> Ordered
                        </span>
                      )}
                    </td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedPO(po)}
                          className="btn btn-xs btn-outline gap-1 font-bold rounded-lg"
                          title="View PO Details"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>

                        {po.status === "Ordered" && (
                          <button
                            disabled={actionLoading}
                            onClick={() => handleReceivePurchase(po.poNumber)}
                            className="btn btn-xs btn-success text-white gap-1 font-extrabold rounded-lg shadow-sm"
                            title="Clicking will automatically increase product inventory"
                          >
                            <PackagePlus className="w-3.5 h-3.5" /> Receive Purchase
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW PO DETAILS MODAL */}
      {selectedPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="badge badge-primary font-bold text-xs">PURCHASE ORDER</span>
                <h3 className="font-black text-2xl text-slate-900 mt-1">Purchase #{selectedPO.poNumber}</h3>
                <p className="text-xs text-slate-500">Order Date: {selectedPO.date}</p>
              </div>
              <button 
                onClick={() => setSelectedPO(null)} 
                className="btn btn-ghost btn-circle btn-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status & Automated Flow Notice */}
            {selectedPO.status === "Received" ? (
              <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Status: Received & Inventory Updated
                  </h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Stock automatically added to {selectedPO.warehouse} on {selectedPO.receivedAt || selectedPO.date}
                  </p>
                </div>
                <span className="badge badge-success text-white font-extrabold">INVENTORY +{selectedPO.items.reduce((s,i)=>s+i.qty,0)}</span>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 text-amber-900 rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-sm flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600" /> Status: Ordered (Awaiting Delivery)
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Click "Receive Purchase" to automatically update inventory stock.
                  </p>
                </div>
                <button 
                  disabled={actionLoading}
                  onClick={() => handleReceivePurchase(selectedPO.poNumber)}
                  className="btn btn-sm btn-success text-white font-bold rounded-xl gap-1"
                >
                  <PackagePlus className="w-4 h-4" /> Receive Purchase Now
                </button>
              </div>
            )}

            {/* Supplier & Warehouse Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Vendor Supplier</span>
                <p className="font-black text-slate-900 text-sm">{selectedPO.supplier}</p>
                <p className="text-slate-500">Official Registered Vendor</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Destination Warehouse</span>
                <p className="font-black text-slate-900 text-sm flex items-center gap-1">
                  <Truck className="w-4 h-4 text-primary" /> {selectedPO.warehouse}
                </p>
                <p className="text-slate-500">Rack / Shelf receiving location</p>
              </div>
            </div>

            {/* Purchase Item Table */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Purchased Product Line Items</h4>
              <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 text-[11px] font-bold">
                      <th className="py-2.5 px-3">Product</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Cost</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {selectedPO.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{item.name}</td>
                        <td className="py-2.5 px-3 text-center font-bold font-mono">{item.qty}</td>
                        <td className="py-2.5 px-3 text-right font-mono">৳{item.cost.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          ৳{(item.qty * item.cost).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Calculations Summary */}
            <div className="border-t-2 border-slate-900 pt-4">
              <div className="w-full sm:w-64 ml-auto space-y-2 text-xs font-bold text-slate-700">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono text-slate-900">৳{selectedPO.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-mono text-slate-900">৳{selectedPO.shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t-2 border-slate-900 pt-2 text-base font-black text-slate-900">
                  <span>Total:</span>
                  <span className="font-mono text-primary">৳{selectedPO.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button 
                onClick={() => setSelectedPO(null)}
                className="btn btn-sm btn-ghost font-bold text-slate-600"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PURCHASE ORDER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-2xl text-slate-900">Create Purchase Order</h3>
                <p className="text-xs text-slate-500">Order inventory stock directly from registered suppliers</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="btn btn-ghost btn-circle btn-xs">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Select Supplier *</label>
                  <select 
                    value={newSupplier}
                    onChange={(e) => setNewSupplier(e.target.value)}
                    className="select select-sm select-bordered w-full font-bold focus:outline-none rounded-xl"
                  >
                    {suppliersList.map((sup) => (
                      <option key={sup} value={sup}>{sup}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Destination Warehouse *</label>
                  <select 
                    value={newWarehouse}
                    onChange={(e) => setNewWarehouse(e.target.value)}
                    className="select select-sm select-bordered w-full font-bold focus:outline-none rounded-xl"
                  >
                    {warehousesList.map((wh) => (
                      <option key={wh} value={wh}>{wh}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Line Items Builder */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 text-sm">Product Line Items</label>
                  <button 
                    type="button" 
                    onClick={handleAddItemRow}
                    className="btn btn-xs btn-outline btn-primary gap-1 font-bold rounded-lg"
                  >
                    <Plus className="w-3 h-3" /> Add Product Line
                  </button>
                </div>

                <div className="space-y-2 border border-slate-200 rounded-2xl p-3 bg-slate-50">
                  {newItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input 
                        type="text"
                        required
                        placeholder="Product Name (e.g. Headphones)"
                        value={item.name}
                        onChange={(e) => {
                          const updated = [...newItems];
                          updated[idx].name = e.target.value;
                          setNewItems(updated);
                        }}
                        className="input input-sm input-bordered flex-1 text-xs focus:outline-none rounded-xl font-bold"
                      />
                      <input 
                        type="number"
                        min={1}
                        required
                        placeholder="Qty"
                        value={item.qty}
                        onChange={(e) => {
                          const updated = [...newItems];
                          updated[idx].qty = Number(e.target.value);
                          setNewItems(updated);
                        }}
                        className="input input-sm input-bordered w-20 text-xs font-mono focus:outline-none rounded-xl font-bold text-center"
                      />
                      <input 
                        type="number"
                        min={0}
                        required
                        placeholder="Cost Price (৳)"
                        value={item.cost}
                        onChange={(e) => {
                          const updated = [...newItems];
                          updated[idx].cost = Number(e.target.value);
                          setNewItems(updated);
                        }}
                        className="input input-sm input-bordered w-28 text-xs font-mono focus:outline-none rounded-xl font-bold text-right"
                      />
                      <span className="font-mono font-bold text-slate-900 w-24 text-right text-xs">
                        ৳{(item.qty * item.cost).toLocaleString()}
                      </span>
                      {newItems.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => handleRemoveItemRow(idx)}
                          className="btn btn-xs btn-ghost text-red-500 btn-circle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping & Calculations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Shipping / Freight Cost (৳)</label>
                  <input 
                    type="number"
                    min={0}
                    value={newShipping}
                    onChange={(e) => setNewShipping(Number(e.target.value))}
                    className="input input-sm input-bordered w-full font-mono focus:outline-none rounded-xl font-bold"
                  />
                </div>

                <div className="p-3 bg-slate-100 rounded-2xl space-y-1 text-right font-bold text-xs">
                  <p className="text-slate-600">Subtotal: <span className="font-mono text-slate-900">৳{calcFormSubtotal.toLocaleString()}</span></p>
                  <p className="text-slate-600">Shipping: <span className="font-mono text-slate-900">৳{Number(newShipping).toLocaleString()}</span></p>
                  <p className="text-slate-900 text-sm font-black border-t border-slate-300 pt-1">
                    Total: <span className="font-mono text-primary">৳{calcFormTotal.toLocaleString()}</span>
                  </p>
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
                  disabled={isSubmittingPO}
                  className="btn btn-sm btn-primary font-bold rounded-xl gap-1 shadow-md shadow-primary/20"
                >
                  {isSubmittingPO ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Create Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
