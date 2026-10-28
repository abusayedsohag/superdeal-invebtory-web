"use client";

import { useState, useEffect } from "react";
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
  Printer,
  RefreshCw,
  Trash2
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

interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  image?: string;
  sku?: string;
  isFlashDeal?: boolean;
}

interface Order {
  _id?: string;
  id: string;
  customer: string;
  phone: string;
  email?: string;
  district: string;
  upazila: string;
  address?: string;
  deliveryInstruction?: string;
  dateFormatted?: string;
  createdAt: string;
  paymentMethod: string;
  paymentStatus: "Pending" | "Paid" | "Failed";
  orderStatus: string;
  subtotal: number;
  shipping: number;
  tax: number;
  couponCode?: string;
  couponDiscount?: number;
  total: number;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchOrders = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "Pending": return "badge-warning text-slate-900";
      case "Confirmed": return "badge-info text-white";
      case "Processing": return "badge-accent text-slate-900";
      case "Packed": return "badge-primary text-white";
      case "Shipped": return "badge-secondary text-white";
      case "Out for Delivery": return "bg-orange-500 text-white";
      case "Delivered": return "badge-success text-white";
      case "Cancelled": return "badge-error text-white";
      case "Returned": return "badge-neutral text-slate-300";
      case "Refunded": return "bg-purple-600 text-white";
      default: return "badge-ghost";
    }
  };

  const getCurrentStepIndex = (status: string) => {
    return lifecycleSteps.indexOf(status);
  };

  // Update Status in MongoDB
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    // Optimistic UI update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: newStatus } : null));
    }

    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, orderStatus: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Order #${orderId} status updated to ${newStatus}`);
      } else {
        showToast(data.message || "Failed to update status");
        fetchOrders(false);
      }
    } catch (err) {
      console.error("Status update error:", err);
      fetchOrders(false);
    }
  };

  // Delete Order
  const handleDeleteOrder = async (order: Order) => {
    if (!confirm(`Are you sure you want to delete order #${order.id}?`)) return;

    setOrders((prev) => prev.filter((o) => o.id !== order.id));
    if (selectedOrder?.id === order.id) setSelectedOrder(null);

    try {
      const param = order._id ? `_id=${order._id}` : `id=${order.id}`;
      const res = await fetch(`/api/orders?${param}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast(`Order #${order.id} deleted`);
      } else {
        showToast(data.message || "Failed to delete order");
        fetchOrders(false);
      }
    } catch (err) {
      console.error("Delete order error:", err);
      fetchOrders(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery) ||
      o.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" || o.orderStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-success shadow-lg text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <ShoppingCart className="w-8 h-8 text-primary" /> Customer Orders Management
          </h1>
          <p className="text-xs text-slate-500">
            Real-time MongoDB orders pipeline synced directly with customer checkout, delivery updates, and invoice printing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchOrders(false)}
            disabled={isRefreshing}
            className="btn btn-outline btn-sm gap-2 font-bold rounded-xl"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* SEARCH AND STATUS FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search Order ID, Customer, Phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-sm input-bordered w-full pl-9 text-xs focus:outline-none rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="select select-sm select-bordered text-xs focus:outline-none rounded-xl font-bold"
          >
            <option value="all">All Order Statuses ({orders.length})</option>
            <optgroup label="Lifecycle Flow">
              {lifecycleSteps.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </optgroup>
            <optgroup label="Exceptions">
              {alternativeStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* ORDERS DATA TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-x-auto">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-xs font-bold text-slate-500">Loading orders from database...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-lg">No Orders Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery || filterStatus !== "all"
                ? "No orders match your filter criteria."
                : "No customer orders have been placed yet."}
            </p>
          </div>
        ) : (
          <table className="table w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200">
                <th>Order ID</th>
                <th>Customer & Location</th>
                <th>Order Date</th>
                <th>Payment Info</th>
                <th>Total Bill</th>
                <th>Order Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/50">
                  <td className="font-mono font-bold text-primary text-xs">
                    {o.id}
                  </td>
                  <td>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{o.customer}</p>
                      <p className="text-slate-500 text-[11px]">{o.phone} • {o.district}</p>
                    </div>
                  </td>
                  <td className="text-slate-600 font-mono text-[11px]">
                    {o.dateFormatted || new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-800 block">{o.paymentMethod}</span>
                      <span className={`badge badge-xs font-bold ${o.paymentStatus === "Paid" ? "badge-success text-white" : "badge-warning"}`}>
                        {o.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="font-mono font-extrabold text-slate-900 text-sm">
                    ৳{o.total.toLocaleString()}
                  </td>
                  <td>
                    {/* Status Dropdown selector */}
                    <select 
                      value={o.orderStatus}
                      onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                      className={`select select-xs font-black focus:outline-none rounded-lg ${getOrderStatusBadge(o.orderStatus)}`}
                    >
                      <optgroup label="Lifecycle Flow">
                        {lifecycleSteps.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Alternative / Exception">
                        {alternativeStatuses.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
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
                      <button
                        onClick={() => handleDeleteOrder(o)}
                        className="btn btn-xs btn-ghost text-red-500 rounded-lg"
                        title="Delete order"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
                <p className="text-xs text-slate-500">
                  Placed on: {selectedOrder.dateFormatted || new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
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
                {selectedOrder.email && <p><strong>Email:</strong> {selectedOrder.email}</p>}
                <p><strong>Destination:</strong> {selectedOrder.district}, {selectedOrder.upazila}</p>
                {selectedOrder.address && <p><strong>Address:</strong> {selectedOrder.address}</p>}
                {selectedOrder.deliveryInstruction && (
                  <p className="text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                    <strong>Note:</strong> {selectedOrder.deliveryInstruction}
                  </p>
                )}
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-primary" /> Payment Summary
                </h4>
                <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                <p><strong>Payment Status:</strong> <span className={`font-bold ${selectedOrder.paymentStatus === "Paid" ? "text-emerald-600" : "text-amber-600"}`}>{selectedOrder.paymentStatus}</span></p>
                <p><strong>Subtotal:</strong> ৳{(selectedOrder.subtotal || selectedOrder.total).toLocaleString()}</p>
                {selectedOrder.couponCode && (
                  <p className="text-emerald-600 font-bold">
                    <strong>Coupon ({selectedOrder.couponCode}):</strong> -৳{selectedOrder.couponDiscount?.toLocaleString() || 0}
                  </p>
                )}
                <p><strong>Total Bill:</strong> <strong className="text-base text-slate-900 font-mono">৳{selectedOrder.total.toLocaleString()}</strong></p>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Ordered Items Breakdown ({selectedOrder.items?.length || 0} items)</h4>
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
                    {(selectedOrder.items || []).map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="font-bold text-slate-900">
                          {item.name}
                          {item.isFlashDeal && <span className="badge badge-error text-white font-extrabold text-[9px] ml-1.5">⚡ Flash</span>}
                        </td>
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
                  className={`select select-sm font-bold focus:outline-none rounded-xl ${getOrderStatusBadge(selectedOrder.orderStatus)}`}
                >
                  <optgroup label="Lifecycle Flow">
                    {lifecycleSteps.map((s) => <option key={s} value={s}>{s}</option>)}
                  </optgroup>
                  <optgroup label="Alternative / Exception">
                    {alternativeStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
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
