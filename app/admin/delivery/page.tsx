"use client";

import { useState } from "react";
import { 
  Truck, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Plus, 
  ExternalLink, 
  MapPin, 
  Building2, 
  Key, 
  ShieldCheck, 
  X, 
  Printer, 
  QrCode,
  Layers,
  ArrowRight,
  Send,
  RefreshCcw,
  Sliders,
  Settings
} from "lucide-react";

type CourierProvider = "Steadfast" | "Pathao" | "RedX" | "Custom";

interface CourierConfig {
  name: CourierProvider;
  logoText: string;
  status: "Connected" | "Disconnected";
  apiKey: string;
  webhookUrl: string;
  totalShipments: number;
}

interface DeliveryOrder {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  district: string;
  address: string;
  courier: CourierProvider;
  trackingCode: string; // e.g. SD-9283928
  cashToCollect: number;
  status: "Pending Dispatch" | "Consignment Created" | "In Transit" | "Out for Delivery" | "Delivered" | "Failed";
  dispatchDate: string;
  estimatedDelivery: string;
}

export default function AdminDeliveryPage() {
  const [couriers, setCouriers] = useState<CourierConfig[]>([
    {
      name: "Steadfast",
      logoText: "⚡ Steadfast Courier",
      status: "Connected",
      apiKey: "st_live_99812039102",
      webhookUrl: "https://superdeal.com/api/webhooks/steadfast",
      totalShipments: 1420
    },
    {
      name: "Pathao",
      logoText: "🚴 Pathao Courier",
      status: "Connected",
      apiKey: "pth_live_77192038102",
      webhookUrl: "https://superdeal.com/api/webhooks/pathao",
      totalShipments: 980
    },
    {
      name: "RedX",
      logoText: "🔴 RedX Logistics",
      status: "Connected",
      apiKey: "redx_token_88912301",
      webhookUrl: "https://superdeal.com/api/webhooks/redx",
      totalShipments: 450
    },
    {
      name: "Custom",
      logoText: "🛵 In-House Delivery Team",
      status: "Connected",
      apiKey: "INTERNAL_RIDER_TEAM",
      webhookUrl: "N/A - Direct Dispatch",
      totalShipments: 210
    }
  ]);

  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>([
    {
      id: "DEL-1001",
      orderId: "SD-10293",
      customerName: "Rahim Ahmed",
      customerPhone: "+880 1711-223344",
      district: "Dhaka",
      address: "House 42, Road 11, Block D, Banani",
      courier: "Steadfast",
      trackingCode: "SD-9283928",
      cashToCollect: 2450,
      status: "In Transit",
      dispatchDate: "09 Oct 2026",
      estimatedDelivery: "11 Oct 2026"
    },
    {
      id: "DEL-1002",
      orderId: "SD-10294",
      customerName: "Tanvir Hossain",
      customerPhone: "+880 1819-223344",
      district: "Chittagong",
      address: "Agrabad Commercial Area",
      courier: "Pathao",
      trackingCode: "PTH-889120",
      cashToCollect: 0,
      status: "Consignment Created",
      dispatchDate: "09 Oct 2026",
      estimatedDelivery: "12 Oct 2026"
    },
    {
      id: "DEL-1003",
      orderId: "SD-10295",
      customerName: "Sharmin Sultana",
      customerPhone: "+880 1733-445566",
      district: "Sylhet",
      address: "Lane 3, Zindabazar",
      courier: "RedX",
      trackingCode: "REDX-77491",
      cashToCollect: 3200,
      status: "Out for Delivery",
      dispatchDate: "08 Oct 2026",
      estimatedDelivery: "10 Oct 2026"
    },
    {
      id: "DEL-1004",
      orderId: "SD-10296",
      customerName: "Mahmud Hasan",
      customerPhone: "+880 1911-887766",
      district: "Rangpur",
      address: "Station Road, Near Town Hall",
      courier: "Custom",
      trackingCode: "RIDER-04",
      cashToCollect: 890,
      status: "Delivered",
      dispatchDate: "06 Oct 2026",
      estimatedDelivery: "08 Oct 2026"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourier, setFilterCourier] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedCourierConfig, setSelectedCourierConfig] = useState<CourierConfig | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const updateDeliveryStatus = (trackingCode: string, newStatus: DeliveryOrder["status"]) => {
    setDeliveryOrders(prev => prev.map(o => o.trackingCode === trackingCode ? { ...o, status: newStatus } : o));
    if (selectedOrder && selectedOrder.trackingCode === trackingCode) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showToast(`🚚 Delivery status for Tracking #${trackingCode} updated to '${newStatus}'`);
  };

  const filteredOrders = deliveryOrders.filter(o => {
    const matchesSearch = 
      o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.district.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterCourier !== "all") {
      return matchesSearch && o.courier === filterCourier;
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce text-xs font-bold">
          <Truck className="w-5 h-5 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Truck className="w-8 h-8 text-primary" /> Delivery & Courier Management
          </h1>
          <p className="text-xs text-slate-500">
            Automated courier integration architecture: Steadfast, Pathao, RedX, and Custom riders with live tracking & status synchronization
          </p>
        </div>

        <button 
          onClick={() => setIsConfigModalOpen(true)}
          className="btn btn-outline btn-sm font-bold rounded-xl gap-2"
        >
          <Settings className="w-4 h-4 text-primary" /> Courier API Integrations
        </button>
      </div>

      {/* COURIERS ARCHITECTURE PROVIDERS GRID (Steadfast, Pathao, RedX, Custom) */}
      <div className="space-y-3">
        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
          Integrated Courier Service Providers (Architecture Stack)
        </span>

        {/* Visual Tree & Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {couriers.map((c) => (
            <div 
              key={c.name}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative overflow-hidden group hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-black text-base text-slate-900">{c.logoText}</h3>
                  <span className="badge badge-success text-white font-bold text-[10px] gap-1 mt-1">
                    <ShieldCheck className="w-3 h-3" /> {c.status}
                  </span>
                </div>
                <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-primary">
                  🚚
                </div>
              </div>

              <div className="text-xs space-y-1 text-slate-500 pt-2 border-t border-slate-100">
                <p className="flex justify-between">
                  <span>Shipments Dispatched:</span> 
                  <strong className="text-slate-900 font-mono">{c.totalShipments.toLocaleString()}</strong>
                </p>
                <p className="flex justify-between">
                  <span>API Integration:</span> 
                  <span className="font-mono text-emerald-600 font-bold">Active Webhook</span>
                </p>
              </div>

              <button 
                onClick={() => setSelectedCourierConfig(c)}
                className="btn btn-xs btn-outline btn-block rounded-lg font-bold gap-1 mt-1"
              >
                <Key className="w-3 h-3" /> Configure API Key
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SAMPLE DEMONSTRATION CARD (Order #SD-10293 | Steadfast | SD-9283928 | In Transit) */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl shadow-xl space-y-3 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="badge badge-warning text-slate-950 font-black text-[10px] uppercase">
              Featured Courier Order Specification
            </span>
            <div className="flex items-center gap-3 mt-1">
              <h2 className="text-2xl font-black font-mono">Order #SD-10293</h2>
              <span className="badge badge-accent text-slate-950 font-black text-xs">Courier: Steadfast</span>
              <span className="badge bg-indigo-600 text-white font-extrabold text-xs">Status: In Transit</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Consignment Tracking Code: <strong className="font-mono text-amber-300 text-sm">SD-9283928</strong> • Customer: <strong>Rahim Ahmed (Banani, Dhaka)</strong>
            </p>
          </div>

          <button
            onClick={() => {
              const ord = deliveryOrders.find(o => o.orderId === "SD-10293");
              if (ord) setSelectedOrder(ord);
            }}
            className="btn btn-sm bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl gap-1 shrink-0 shadow-md"
          >
            <Eye className="w-4 h-4 text-primary" /> View Live Tracking #SD-9283928
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Order ID, Tracking Code (SD-9283928), Customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-sm input-bordered w-full pl-9 text-xs focus:outline-none rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            value={filterCourier}
            onChange={(e) => setFilterCourier(e.target.value)}
            className="select select-sm select-bordered text-xs focus:outline-none rounded-xl font-bold"
          >
            <option value="all">All Courier Providers</option>
            <option value="Steadfast">Steadfast Courier Only</option>
            <option value="Pathao">Pathao Courier Only</option>
            <option value="RedX">RedX Logistics Only</option>
            <option value="Custom">Custom In-House Rider</option>
          </select>
        </div>
      </div>

      {/* DISPATCHED ORDERS & COURIER TRACKING TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <th>Order ID</th>
              <th>Customer & Destination</th>
              <th>Assigned Courier</th>
              <th>Consignment Tracking #</th>
              <th className="text-right">Cash Collection</th>
              <th>Shipping Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50/50">
                <td className="font-mono font-extrabold text-primary text-base">
                  #{o.orderId}
                </td>

                <td>
                  <p className="font-bold text-slate-900 text-xs">{o.customerName}</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-primary" /> {o.address}, {o.district}
                  </p>
                </td>

                <td>
                  <span className="badge badge-sm badge-neutral font-extrabold text-slate-200">
                    {o.courier}
                  </span>
                </td>

                <td>
                  <span className="font-mono font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs">
                    {o.trackingCode}
                  </span>
                </td>

                <td className="text-right font-mono font-extrabold text-slate-900 text-base">
                  ৳{o.cashToCollect.toLocaleString()}
                </td>

                <td>
                  <select
                    value={o.status}
                    onChange={(e) => updateDeliveryStatus(o.trackingCode, e.target.value as any)}
                    className={`select select-xs font-extrabold focus:outline-none ${
                      o.status === "Delivered" ? "badge-success text-white" :
                      o.status === "In Transit" ? "bg-indigo-600 text-white" :
                      o.status === "Out for Delivery" ? "badge-accent text-slate-950" : "badge-warning text-slate-950"
                    }`}
                  >
                    <option value="Pending Dispatch">Pending Dispatch</option>
                    <option value="Consignment Created">Consignment Created</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Failed">Delivery Failed</option>
                  </select>
                </td>

                <td className="text-center">
                  <button
                    onClick={() => setSelectedOrder(o)}
                    className="btn btn-xs btn-primary gap-1 font-bold rounded-lg"
                    title="View Live Shipment Timeline"
                  >
                    <Eye className="w-3.5 h-3.5" /> Track Package
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* LIVE COURIER SHIPMENT TRACKING MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="badge badge-primary font-bold text-xs">COURIER TRACKING PORTAL</span>
                <h3 className="font-black text-2xl text-slate-900 mt-1">Order #{selectedOrder.orderId}</h3>
                <p className="text-xs text-slate-500">
                  Assigned Courier: <strong className="text-slate-900">{selectedOrder.courier}</strong>
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="btn btn-ghost btn-circle btn-xs">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tracking Code Highlight Banner */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider block">
                  Consignment Tracking Number
                </span>
                <p className="text-2xl font-black font-mono text-amber-300">{selectedOrder.trackingCode}</p>
              </div>

              <a 
                href={`https://${selectedOrder.courier.toLowerCase()}.com.bd/t/${selectedOrder.trackingCode}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl gap-1 shrink-0"
              >
                Open Courier Web API <ExternalLink className="w-3.5 h-3.5 text-primary" />
              </a>
            </div>

            {/* LIVE TRACKING STEPPER TIMELINE */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                Live Courier Shipment Stepper Progress
              </span>

              <div className="overflow-x-auto pb-2">
                <ul className="steps steps-horizontal w-full min-w-[450px] text-xs font-bold">
                  <li className="step step-primary text-[11px]">Consignment Created</li>
                  <li className="step step-primary text-[11px]">Picked Up</li>
                  <li className={`step ${selectedOrder.status === "In Transit" || selectedOrder.status === "Out for Delivery" || selectedOrder.status === "Delivered" ? "step-primary" : ""} text-[11px]`}>
                    In Transit
                  </li>
                  <li className={`step ${selectedOrder.status === "Out for Delivery" || selectedOrder.status === "Delivered" ? "step-primary" : ""} text-[11px]`}>
                    Out for Delivery
                  </li>
                  <li className={`step ${selectedOrder.status === "Delivered" ? "step-primary" : ""} text-[11px]`}>
                    Delivered
                  </li>
                </ul>
              </div>
            </div>

            {/* Shipping & Delivery Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Customer Shipping Address</span>
                <p className="font-bold text-slate-900">{selectedOrder.customerName}</p>
                <p className="text-slate-600">{selectedOrder.address}</p>
                <p className="text-slate-700 font-semibold">{selectedOrder.district}, Bangladesh</p>
                <p className="text-slate-500">{selectedOrder.customerPhone}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Fulfillment & Payment</span>
                <p className="text-slate-600">Cash on Delivery Collection: <strong className="font-mono text-slate-900 text-sm">৳{selectedOrder.cashToCollect.toLocaleString()}</strong></p>
                <p className="text-slate-600">Dispatched Date: <strong>{selectedOrder.dispatchDate}</strong></p>
                <p className="text-slate-600">Est. Delivery Date: <strong>{selectedOrder.estimatedDelivery}</strong></p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button 
                onClick={() => alert(`Printing Waybill Label for Tracking #${selectedOrder.trackingCode}`)}
                className="btn btn-sm btn-outline gap-1 font-bold rounded-xl"
              >
                <Printer className="w-4 h-4 text-primary" /> Print Waybill Shipping Label
              </button>

              <button 
                onClick={() => setSelectedOrder(null)}
                className="btn btn-sm btn-ghost font-bold text-slate-600"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COURIER API CONFIGURATION MODAL */}
      {selectedCourierConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-xl text-slate-900">{selectedCourierConfig.logoText}</h3>
                <p className="text-xs text-slate-500">Manage API Credentials & Webhooks</p>
              </div>
              <button onClick={() => setSelectedCourierConfig(null)} className="btn btn-ghost btn-circle btn-xs">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">API Key / Token</label>
                <input 
                  type="text"
                  value={selectedCourierConfig.apiKey}
                  onChange={(e) => setSelectedCourierConfig({ ...selectedCourierConfig, apiKey: e.target.value })}
                  className="input input-sm input-bordered w-full font-mono text-slate-900 focus:outline-none rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Webhook Status URL</label>
                <input 
                  type="text"
                  value={selectedCourierConfig.webhookUrl}
                  onChange={(e) => setSelectedCourierConfig({ ...selectedCourierConfig, webhookUrl: e.target.value })}
                  className="input input-sm input-bordered w-full font-mono text-slate-900 focus:outline-none rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button 
                onClick={() => setSelectedCourierConfig(null)}
                className="btn btn-sm btn-ghost font-bold text-slate-500"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  showToast(`Saved API keys for ${selectedCourierConfig.name}`);
                  setSelectedCourierConfig(null);
                }}
                className="btn btn-sm btn-primary font-bold rounded-xl"
              >
                Save Integration Keys
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
