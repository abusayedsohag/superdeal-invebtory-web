"use client";

import { useState } from "react";
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Eye, 
  FileText, 
  CheckCircle2, 
  Truck, 
  Clock, 
  PackageCheck, 
  PackageSearch, 
  RotateCcw, 
  XCircle, 
  DollarSign, 
  User, 
  Phone, 
  MapPin, 
  Calendar,
  X,
  Printer
} from "lucide-react";

// Order Status Lifecycle Flow Steps
const lifecycleSteps = [
  "Pending",
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered"
];

const alternativeStatuses = ["Cancelled", "Returned", "Refunded"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([
    { 
      id: "SD-10293", 
      customer: "Rahim Ahmed", 
      phone: "+880 1711223344", 
      district: "Dhaka", 
      upazila: "Banani", 
      date: "08 Oct 2026, 02:45 PM", 
      paymentMethod: "COD", 
      paymentStatus: "Pending", 
      orderStatus: "Processing", 
      total: 2450,
      items: [
        { name: "Wireless Gaming Headphones", qty: 1, price: 1950 },
        { name: "USB-C Fast Cable", qty: 1, price: 500 }
      ]
    },
    { 
      id: "SD-10294", 
      customer: "Tanvir Hossain", 
      phone: "+880 1819223344", 
      district: "Chittagong", 
      upazila: "Agrabad", 
      date: "08 Oct 2026, 01:15 PM", 
      paymentMethod: "bKash MFS", 
      paymentStatus: "Paid", 
      orderStatus: "Confirmed", 
      total: 1490,
      items: [{ name: "Ultra Smart Watch Series 7", qty: 1, price: 1490 }]
    },
    { 
      id: "SD-10295", 
      customer: "Sharmin Sultana", 
      phone: "+880 1733445566", 
      district: "Sylhet", 
      upazila: "Zindabazar", 
      date: "07 Oct 2026, 11:30 AM", 
      paymentMethod: "Nagad MFS", 
      paymentStatus: "Paid", 
      orderStatus: "Packed", 
      total: 3200,
      items: [{ name: "Mechanical Gaming Keyboard", qty: 2, price: 1600 }]
    },
    { 
      id: "SD-10296", 
      customer: "Mahmud Hasan", 
      phone: "+880 1911887766", 
      district: "Rangpur", 
      upazila: "Station Road", 
      date: "06 Oct 2026, 04:20 PM", 
      paymentMethod: "COD", 
      paymentStatus: "Pending", 
      orderStatus: "Out for Delivery", 
      total: 890,
      items: [{ name: "Ergonomic Optical Mouse", qty: 1, price: 890 }]
    },
    { 
      id: "SD-10297", 
      customer: "Kazi Tanvir", 
      phone: "+880 1755443322", 
      district: "Rajshahi", 
      upazila: "Boalia", 
      date: "05 Oct 2026, 09:10 AM", 
      paymentMethod: "Visa Card", 
      paymentStatus: "Paid", 
      orderStatus: "Delivered", 
      total: 4500,
      items: [{ name: "4K Streaming Camera", qty: 1, price: 4500 }]
    },
    { 
      id: "SD-10298", 
      customer: "Ayesha Siddiqua", 
      phone: "+880 1622334455", 
      district: "Khulna", 
      upazila: "Khalishpur", 
      date: "04 Oct 2026, 03:00 PM", 
      paymentMethod: "bKash MFS", 
      paymentStatus: "Refunded", 
      orderStatus: "Returned", 
      total: 1200,
      items: [{ name: "Portable Bluetooth Speaker", qty: 1, price: 1200 }]
    }
  ]);

  // Selected Order for View Details Modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev: any) => ({ ...prev, orderStatus: newStatus }));
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "Pending": return "badge-warning";
      case "Confirmed": return "badge-info text-white";
      case "Processing": return "badge-primary";
      case "Packed": return "badge-secondary text-white";
      case "Shipped": return "badge-accent text-slate-900";
      case "Out for Delivery": return "badge-indigo bg-indigo-600 text-white border-none";
      case "Delivered": return "badge-success text-white";
      case "Cancelled": return "badge-error text-white";
      case "Returned": return "badge-neutral text-amber-400";
      case "Refunded": return "badge-neutral text-purple-300";
      default: return "badge-neutral";
    }
  };

  const getCurrentStepIndex = (status: string) => {
    return lifecycleSteps.indexOf(status);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Order Management</h1>
          <p className="text-xs text-slate-500">Track order lifecycle stages, customer shipping details, and invoice receipts</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="select select-sm select-bordered focus:outline-none text-xs">
            <option>All Lifecycle Statuses</option>
            {lifecycleSteps.map(s => <option key={s} value={s}>{s}</option>)}
            {alternativeStatuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Orders Grid / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total Amount</th>
              <th>Payment</th>
              <th>Current Order Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50/50">
                <td className="font-extrabold text-primary font-mono text-base">#{o.id}</td>
                <td>
                  <p className="font-bold text-slate-900">{o.customer}</p>
                  <p className="text-xs text-slate-400">{o.phone} • {o.district}</p>
                </td>
                <td className="font-mono font-black text-slate-900 text-base">৳{o.total.toLocaleString()}</td>
                <td>
                  <div className="space-y-0.5">
                    <span className="badge badge-sm badge-outline font-bold">{o.paymentMethod}</span>
                    <p className={`text-[10px] font-bold ${o.paymentStatus === "Paid" ? "text-emerald-600" : "text-amber-600"}`}>
                      {o.paymentStatus}
                    </p>
                  </div>
                </td>
                <td>
                  {/* Status Dropdown selector */}
                  <select 
                    value={o.orderStatus}
                    onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                    className={`select select-xs font-black focus:outline-none ${getOrderStatusBadge(o.orderStatus)}`}
                  >
                    <optgroup label="Lifecycle Flow">
                      {lifecycleSteps.map(s => <option key={s} value={s}>{s}</option>)}
                    </optgroup>
                    <optgroup label="Alternative / Exception">
                      {alternativeStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </optgroup>
                  </select>
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button 
                      onClick={() => setSelectedOrder(o)}
                      className="btn btn-xs sm:btn-sm btn-primary gap-1 font-bold rounded-xl"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                    <a 
                      href={`/admin/orders/invoice/${o.id}`}
                      target="_blank"
                      className="btn btn-xs sm:btn-sm btn-outline gap-1 font-bold rounded-xl"
                    >
                      <FileText className="w-3.5 h-3.5 text-primary" /> Invoice
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW ORDER DETAILS & LIFECYCLE STEPPER MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="badge badge-primary font-bold text-xs">ORDER DETAILS</span>
                <h3 className="font-black text-2xl text-slate-900">Order #{selectedOrder.id}</h3>
                <p className="text-xs text-slate-500">Placed on: {selectedOrder.date}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="btn btn-ghost btn-circle btn-xs">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ORDER LIFECYCLE STEPPER PROGRESS VISUALIZATION */}
            {!alternativeStatuses.includes(selectedOrder.orderStatus) ? (
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Live Order Progress Timeline</span>
                
                {/* Horizontal Stepper */}
                <div className="overflow-x-auto pb-2">
                  <ul className="steps steps-horizontal w-full min-w-[500px] text-xs font-bold">
                    {lifecycleSteps.map((stepName, idx) => {
                      const currentIdx = getCurrentStepIndex(selectedOrder.orderStatus);
                      const isCompleted = idx <= currentIdx;

                      return (
                        <li 
                          key={stepName}
                          className={`step ${isCompleted ? "step-primary" : ""} text-[11px]`}
                        >
                          {stepName}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ) : (
              /* Alternative / Exception Status Banner */
              <div className="p-4 bg-red-50 text-red-900 rounded-2xl border border-red-200 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-base">Order Status: {selectedOrder.orderStatus}</h4>
                  <p className="text-xs text-red-700">This order is marked as an exception ({selectedOrder.orderStatus})</p>
                </div>
                <span className="badge badge-error text-white font-extrabold">{selectedOrder.orderStatus}</span>
              </div>
            )}

            {/* Customer & Shipping Details Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <User className="w-4 h-4 text-primary" /> Customer Info
                </h4>
                <p><strong>Name:</strong> {selectedOrder.customer}</p>
                <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                <p><strong>District / Upazila:</strong> {selectedOrder.district}, {selectedOrder.upazila}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-primary" /> Payment Summary
                </h4>
                <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                <p><strong>Payment Status:</strong> <span className="font-bold text-emerald-600">{selectedOrder.paymentStatus}</span></p>
                <p><strong>Total Paid Amount:</strong> <strong className="text-base text-slate-900 font-mono">৳{selectedOrder.total.toLocaleString()}</strong></p>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Ordered Items Breakdown</h4>
              <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                <table className="table w-full">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 uppercase">
                      <th>Item Description</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th className="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="font-bold text-slate-900">{item.name}</td>
                        <td className="font-bold">{item.qty}</td>
                        <td>৳{item.price.toLocaleString()}</td>
                        <td className="text-right font-bold text-slate-900 font-mono">৳{(item.qty * item.price).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Update Status:</span>
                <select 
                  value={selectedOrder.orderStatus}
                  onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                  className={`select select-sm font-bold focus:outline-none ${getOrderStatusBadge(selectedOrder.orderStatus)}`}
                >
                  <optgroup label="Lifecycle Flow">
                    {lifecycleSteps.map(s => <option key={s} value={s}>{s}</option>)}
                  </optgroup>
                  <optgroup label="Alternative / Exception">
                    {alternativeStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </optgroup>
                </select>
              </div>

              <a 
                href={`/admin/orders/invoice/${selectedOrder.id}`}
                target="_blank"
                className="btn btn-sm btn-outline gap-1 font-bold rounded-xl"
              >
                <Printer className="w-4 h-4" /> Print Invoice
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
