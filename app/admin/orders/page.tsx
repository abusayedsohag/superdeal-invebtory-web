"use client";

import { useState } from "react";
import { ShoppingCart, Search, Filter, Eye, FileText, CheckCircle2, Truck } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([
    { id: "ORD-9982", customer: "Abu Sayed", phone: "+880 17000000", date: "Oct 06, 2026", payment: "Paid (Card)", status: "Delivered", total: 497.99 },
    { id: "ORD-9981", customer: "Jane Cooper", phone: "+1 555-0192", date: "Oct 06, 2026", payment: "Paid (bKash)", status: "Processing", total: 149.00 },
    { id: "ORD-9980", customer: "Robert Fox", phone: "+1 555-0143", date: "Oct 05, 2026", payment: "Pending (COD)", status: "Pending", total: 89.99 },
    { id: "ORD-9979", customer: "Cody Fisher", phone: "+1 555-0188", date: "Oct 05, 2026", payment: "Paid (Card)", status: "Shipped", total: 310.50 }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Customer Orders</h1>
          <p className="text-xs text-slate-500">Manage storefront order fulfillment and order status updates</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="select select-sm select-bordered focus:outline-none">
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Payment</th>
              <th>Total Pay</th>
              <th>Status Dropdown</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="font-extrabold text-primary">{o.id}</td>
                <td>
                  <p className="font-bold text-slate-900">{o.customer}</p>
                  <p className="text-xs text-slate-400">{o.phone}</p>
                </td>
                <td className="text-xs text-slate-500">{o.date}</td>
                <td className="text-xs font-semibold text-slate-700">{o.payment}</td>
                <td className="font-mono font-bold text-slate-900">\${o.total.toFixed(2)}</td>
                <td>
                  <select defaultValue={o.status} className="select select-xs select-bordered font-bold focus:outline-none">
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
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
