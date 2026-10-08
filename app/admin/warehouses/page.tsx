"use client";

import { useState } from "react";
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
  FileText
} from "lucide-react";

export default function AdminWarehousesPage() {
  const [activeTab, setActiveTab] = useState<"hubs" | "transfers">("hubs");

  // Multi-Warehouse Hubs Data
  const warehouses = [
    {
      id: "wh-1",
      name: "Dhaka Central Warehouse",
      code: "WH-DHK-01",
      location: "Tejgaon Industrial Area, Dhaka",
      manager: "Rashidul Islam",
      phone: "+880 1711-000111",
      totalStock: "12,450 Units",
      productsCount: "850 SKUs",
      racksCount: "48 Racks / 192 Shelves",
      purchasesCount: "42 POs",
      salesCount: "1,120 Orders",
      transfersCount: "28 Transfers",
      badge: "Central Hub",
      color: "border-primary/30 bg-primary/5 text-primary"
    },
    {
      id: "wh-2",
      name: "Chittagong Port Warehouse",
      code: "WH-CTG-02",
      location: "Agrabad Commercial Area, Chittagong",
      manager: "Kazi Tanvir",
      phone: "+880 1819-222333",
      totalStock: "4,200 Units",
      productsCount: "320 SKUs",
      racksCount: "24 Racks / 96 Shelves",
      purchasesCount: "18 POs",
      salesCount: "240 Orders",
      transfersCount: "14 Transfers",
      badge: "Port Hub",
      color: "border-secondary/30 bg-secondary/5 text-secondary"
    },
    {
      id: "wh-3",
      name: "Rangpur Regional Warehouse",
      code: "WH-RNG-03",
      location: "Station Road, Rangpur",
      manager: "Mahmudul Hasan",
      phone: "+880 1733-444555",
      totalStock: "1,890 Units",
      productsCount: "180 SKUs",
      racksCount: "12 Racks / 48 Shelves",
      purchasesCount: "8 POs",
      salesCount: "110 Orders",
      transfersCount: "9 Transfers",
      badge: "North Hub",
      color: "border-accent/30 bg-accent/5 text-accent"
    }
  ];

  // Inter-Warehouse Transfer History Data
  const [transfersHistory, setTransfersHistory] = useState([
    {
      id: "TRF-2026-042",
      date: "08 Oct 2026, 11:30 AM",
      from: "Dhaka Central Warehouse",
      to: "Rangpur Regional Warehouse",
      product: "Wireless Mouse (SD-MOU-2201)",
      qty: 100,
      transport: "SA Paribahan Express (Track #SA-9901)",
      operator: "David Miller",
      status: "In Transit",
      badgeColor: "badge-primary"
    },
    {
      id: "TRF-2026-041",
      date: "05 Oct 2026, 03:15 PM",
      from: "Chittagong Port Warehouse",
      to: "Dhaka Central Warehouse",
      product: "Wireless Headphones (SD-HEAD-9081)",
      qty: 50,
      transport: "Paperfly Logistics Hub",
      operator: "Kazi Tanvir",
      status: "Completed",
      badgeColor: "badge-success text-white"
    },
    {
      id: "TRF-2026-040",
      date: "02 Oct 2026, 10:00 AM",
      from: "Dhaka Central Warehouse",
      to: "Chittagong Port Warehouse",
      product: "Ultra Smart Watch Series 7 Pro",
      qty: 30,
      transport: "Sundarban Courier Service",
      operator: "Rashidul Islam",
      status: "Completed",
      badgeColor: "badge-success text-white"
    }
  ]);

  // Modal State for New Stock Transfer
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferForm, setTransferForm] = useState({
    from: "Dhaka Central Warehouse",
    to: "Rangpur Regional Warehouse",
    product: "Wireless Mouse (SD-MOU-2201)",
    qty: 100,
    transport: "SA Paribahan Express",
    note: "Restocking northern regional demand for upcoming mega sale"
  });

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();

    const newTransfer = {
      id: `TRF-2026-0${transfersHistory.length + 43}`,
      date: "Today, Just Now",
      from: transferForm.from,
      to: transferForm.to,
      product: transferForm.product,
      qty: Number(transferForm.qty),
      transport: transferForm.transport,
      operator: "Super Admin",
      status: "In Transit",
      badgeColor: "badge-primary"
    };

    setTransfersHistory([newTransfer, ...transfersHistory]);
    setIsTransferModalOpen(false);
    setActiveTab("transfers");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Multi-Warehouse System</h1>
          <p className="text-xs text-slate-500">Manage regional warehouse hubs, racks, shelves, and inter-warehouse stock transfers</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsTransferModalOpen(true)}
            className="btn btn-primary btn-sm gap-2 font-bold shadow-md shadow-primary/20"
          >
            <ArrowLeftRight className="w-4 h-4" /> Transfer Stock Between Hubs
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs tabs-boxed bg-white p-1 rounded-2xl border border-slate-200 shadow-xs flex overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("hubs")}
          className={`tab text-xs sm:text-sm font-bold gap-2 ${activeTab === "hubs" ? "tab-active bg-primary text-white rounded-xl" : "text-slate-600"}`}
        >
          <Building2 className="w-4 h-4" /> Warehouse Directory & Hubs ({warehouses.length})
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {warehouses.map((wh) => (
              <div key={wh.id} className={`bg-white rounded-3xl border ${wh.color.split(" ")[0]} p-6 shadow-xs space-y-5 relative overflow-hidden`}>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className={`badge ${wh.color} text-[10px] font-extrabold uppercase`}>{wh.badge}</span>
                    <h3 className="font-extrabold text-xl text-slate-900">{wh.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">Code: {wh.code}</p>
                  </div>
                  <Building2 className="w-8 h-8 text-slate-300 shrink-0" />
                </div>

                <div className="space-y-2 text-xs text-slate-600 border-t border-b border-slate-100 py-3">
                  <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary shrink-0" /> {wh.location}</p>
                  <p className="flex items-center gap-2"><strong>Manager:</strong> {wh.manager} ({wh.phone})</p>
                  <p className="flex items-center gap-2"><strong>Rack & Shelf Layout:</strong> <span className="font-semibold text-slate-900">{wh.racksCount}</span></p>
                </div>

                {/* Warehouse Metrics Breakdown */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">Total Stock</span>
                    <strong className="text-slate-900 font-black text-sm">{wh.totalStock}</strong>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">Products</span>
                    <strong className="text-slate-900 font-black text-sm">{wh.productsCount}</strong>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">Transfers</span>
                    <strong className="text-primary font-black text-sm">{wh.transfersCount}</strong>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
                  <span>Sales: <strong>{wh.salesCount}</strong></span>
                  <span>Purchases: <strong>{wh.purchasesCount}</strong></span>
                </div>
              </div>
            ))}
          </div>
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
                <h3 className="text-xl font-black mt-1">Inter-Warehouse Movement Demonstration</h3>
              </div>
              <button onClick={() => setIsTransferModalOpen(true)} className="btn btn-primary btn-xs font-bold gap-1">
                <Plus className="w-3.5 h-3.5" /> New Transfer
              </button>
            </div>

            {/* Diagram */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center">
              {/* Source Hub */}
              <div className="space-y-1 bg-slate-900 p-4 rounded-xl border border-slate-800 w-full md:w-56">
                <Building2 className="w-6 h-6 text-primary mx-auto" />
                <h4 className="font-extrabold text-sm text-white">Dhaka Central Warehouse</h4>
                <p className="text-[10px] text-slate-400">Source Depot (Stock Out)</p>
              </div>

              {/* Arrow Transfer Badge */}
              <div className="flex flex-col items-center gap-1 text-primary">
                <span className="badge badge-accent font-black text-xs px-3 py-2">Transfer 100 Units</span>
                <div className="flex items-center gap-1 font-mono text-xs text-slate-400">
                  <Truck className="w-4 h-4 text-amber-400 animate-bounce" /> SA Paribahan Express
                </div>
                <ArrowRight className="w-8 h-8 text-primary hidden md:block" />
              </div>

              {/* Destination Hub */}
              <div className="space-y-1 bg-slate-900 p-4 rounded-xl border border-slate-800 w-full md:w-56">
                <Building2 className="w-6 h-6 text-accent mx-auto" />
                <h4 className="font-extrabold text-sm text-white">Rangpur Regional Warehouse</h4>
                <p className="text-[10px] text-slate-400">Destination Depot (Stock In)</p>
              </div>
            </div>
          </div>

          {/* Transfers Audit Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900">Transfer History Audit Logs</h3>
              <span className="badge badge-primary font-bold text-xs">{transfersHistory.length} Recorded</span>
            </div>

            <table className="table w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
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
                {transfersHistory.map((trf) => (
                  <tr key={trf.id} className="hover:bg-slate-50/50">
                    <td className="font-extrabold text-primary font-mono">{trf.id}</td>
                    <td className="text-xs">
                      <p className="font-bold text-slate-900">{trf.date}</p>
                      <p className="text-slate-400">By: {trf.operator}</p>
                    </td>
                    <td className="text-xs font-semibold">
                      <div className="flex items-center gap-1.5 text-slate-900">
                        <span>{trf.from.split(" ")[0]}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="text-primary font-bold">{trf.to.split(" ")[0]}</span>
                      </div>
                    </td>
                    <td>
                      <p className="font-bold text-slate-900 line-clamp-1">{trf.product}</p>
                      <span className="badge badge-sm badge-outline font-black text-slate-800">{trf.qty} Units</span>
                    </td>
                    <td className="text-xs text-slate-600 font-mono">{trf.transport}</td>
                    <td>
                      <span className={`badge ${trf.badgeColor} font-bold text-xs`}>
                        {trf.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <button className="btn btn-ghost btn-xs text-slate-600 gap-1">
                        <FileText className="w-3.5 h-3.5" /> Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NEW STOCK TRANSFER MODAL */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <ArrowLeftRight className="w-5 h-5 text-primary" /> Inter-Warehouse Stock Transfer
                </h3>
                <p className="text-xs text-slate-500">Initiate inventory movement between regional hubs</p>
              </div>
              <button onClick={() => setIsTransferModalOpen(false)} className="btn btn-ghost btn-circle btn-xs">✕</button>
            </div>

            <form onSubmit={handleCreateTransfer} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500">Source Warehouse (From) *</label>
                  <select 
                    value={transferForm.from}
                    onChange={(e) => setTransferForm({ ...transferForm, from: e.target.value })}
                    className="select select-sm select-bordered w-full font-bold focus:outline-none text-xs"
                  >
                    <option value="Dhaka Central Warehouse">Dhaka Central Warehouse</option>
                    <option value="Chittagong Port Warehouse">Chittagong Port Warehouse</option>
                    <option value="Rangpur Regional Warehouse">Rangpur Regional Warehouse</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500">Destination Hub (To) *</label>
                  <select 
                    value={transferForm.to}
                    onChange={(e) => setTransferForm({ ...transferForm, to: e.target.value })}
                    className="select select-sm select-bordered w-full font-bold focus:outline-none text-xs"
                  >
                    <option value="Rangpur Regional Warehouse">Rangpur Regional Warehouse</option>
                    <option value="Dhaka Central Warehouse">Dhaka Central Warehouse</option>
                    <option value="Chittagong Port Warehouse">Chittagong Port Warehouse</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Product & SKU to Transfer *</label>
                <select 
                  value={transferForm.product}
                  onChange={(e) => setTransferForm({ ...transferForm, product: e.target.value })}
                  className="select select-sm select-bordered w-full font-bold focus:outline-none text-xs"
                >
                  <option value="Wireless Mouse (SD-MOU-2201)">Wireless Mouse (SD-MOU-2201)</option>
                  <option value="Wireless Headphones (SD-HEAD-9081)">Wireless Headphones (SD-HEAD-9081)</option>
                  <option value="Ultra Smart Watch (SD-WTC-7721)">Ultra Smart Watch (SD-WTC-7721)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500">Transfer Quantity *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={transferForm.qty}
                    onChange={(e) => setTransferForm({ ...transferForm, qty: Number(e.target.value) })}
                    className="input input-sm input-bordered w-full font-black text-base focus:outline-none"
                  />
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
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsTransferModalOpen(false)} className="btn btn-sm btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-sm btn-primary gap-1 font-bold">
                  <Save className="w-4 h-4" /> Confirm & Dispatch Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
