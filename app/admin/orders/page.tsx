"use client";

import { useState } from "react";
import { ShoppingCart, Search, Filter, Eye, FileText, CheckCircle2, Truck, DollarSign } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([
    { id: "ORD-9982", customer: "Abu Sayed", phone: "+880 1711223344", district: "Dhaka", date: "Oct 08, 2026", method: "bKash (MFS)", paymentStatus: "Paid", fulfillmentStatus: "Delivered", total: 502.89 },
    { id: "ORD-9981", customer: "Jane Cooper", phone: "+880 1819223344", district: "Chittagong", date: "Oct 08, 2026", method: "Nagad (MFS)", paymentStatus: "Pending", fulfillmentStatus: "Processing", total: 149.00 },
    { id: "ORD-9980", customer: "Robert Fox", phone: "+880 1733445566", district: "Sylhet", date: "Oct 07, 2026", method: "Cash on Delivery", paymentStatus: "Pending", fulfillmentStatus: "Pending", total: 89.99 },
    { id: "ORD-9979", customer: "Cody Fisher", phone: "+880 1911887766", district: "Rangpur", date: "Oct 06, 2026", method: "Visa Card", paymentStatus: "Paid", fulfillmentStatus: "Shipped", total: 310.50 },
    { id: "ORD-9978", customer: "Mahmud Hasan", phone: "+880 1755443322", district: "Rajshahi", date: "Oct 05, 2026", method: "Rocket MFS", paymentStatus: "Failed", fulfillmentStatus: "Cancelled", total: 65.00 },
    { id: "ORD-9977", customer: "Sharmin Sultana", phone: "+880 1622334455", district: "Khulna", date: "Oct 04, 2026", method: "Online Gateway", paymentStatus: "Refunded", fulfillmentStatus: "Cancelled", total: 199.99 },
    { id: "ORD-9976", customer: "Tariqul Islam", phone: "+880 1511223344", district: "Dhaka", date: "Oct 03, 2026", method: "bKash (MFS)", paymentStatus: "Partially Refunded", fulfillmentStatus: "Processing", total: 120.00 }
  ]);

  const updatePaymentStatus = (id: string, newStatus: any) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, paymentStatus: newStatus } : o));
  };

  const getPaymentBadgeColor = (status: string) => {
    switch (status) {
      case "Paid": return "badge-success text-white";
      case "Pending": return "badge-warning";
      case "Failed": return "badge-error text-white";
      case "Refunded": return "badge-secondary text-white";
      case "Partially Refunded": return "badge-accent text-slate-900";
      default: return "badge-neutral";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Customer Orders</h1>
          <p className="text-xs text-slate-500">Track order fulfillment, payment status updates (bKash/Nagad/COD), and invoices</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="select select-sm select-bordered focus:outline-none text-xs">
            <option>All Payment Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
            <option value="Partially Refunded">Partially Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
              <th>Order ID</th>
              <th>Customer & District</th>
              <th>Date</th>
              <th>Payment Method</th>
              <th>Total Pay</th>
              <th>Payment Status</th>
              <th>Fulfillment</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50/50">
                <td className="font-extrabold text-primary font-mono">{o.id}</td>
                <td>
                  <p className="font-bold text-slate-900">{o.customer}</p>
                  <p className="text-xs text-slate-500">{o.phone} • <strong className="text-primary">{o.district}</strong></p>
                </td>
                <td className="text-xs text-slate-500">{o.date}</td>
                <td className="text-xs font-semibold text-slate-700">{o.method}</td>
                <td className="font-mono font-bold text-slate-900">\${o.total.toFixed(2)}</td>
                <td>
                  <select 
                    value={o.paymentStatus}
                    onChange={(e) => updatePaymentStatus(o.id, e.target.value)}
                    className={`select select-xs font-bold focus:outline-none ${getPaymentBadgeColor(o.paymentStatus)}`}
                  >
                    <option value="Pending">🟡 Pending</option>
                    <option value="Paid">🟢 Paid</option>
                    <option value="Failed">🔴 Failed</option>
                    <option value="Refunded">🟣 Refunded</option>
                    <option value="Partially Refunded">🟠 Partially Refunded</option>
                  </select>
                </td>
                <td>
                  <span className={`badge badge-sm font-bold ${
                    o.fulfillmentStatus === "Delivered" ? "badge-success text-white" :
                    o.fulfillmentStatus === "Shipped" ? "badge-info text-white" :
                    o.fulfillmentStatus === "Processing" ? "badge-primary" : "badge-neutral"
                  }`}>
                    {o.fulfillmentStatus}
                  </span>
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="btn btn-ghost btn-xs text-slate-600 gap-1"><Eye className="w-3.5 h-3.5" /> View</button>
                    <button className="btn btn-ghost btn-xs text-slate-600 gap-1"><FileText className="w-3.5 h-3.5" /> Invoice</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
