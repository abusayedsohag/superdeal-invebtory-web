"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  FileText, 
  ArrowRight,
  Search,
  Filter,
  ShoppingBag,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  MapPin,
  Phone,
  ShieldCheck,
  RotateCcw,
  Send,
  AlertTriangle,
  X
} from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  image?: string;
  sku?: string;
  isFlashDeal?: boolean;
}

interface CustomerOrder {
  _id?: string;
  id: string;
  customer: string;
  phone: string;
  email?: string;
  district: string;
  upazila: string;
  address?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  couponCode?: string;
  couponDiscount?: number;
  total: number;
  paymentMethod: string;
  paymentStatus: "Pending" | "Paid" | "Failed";
  orderStatus: string;
  trackingCode?: string;
  createdAt: string;
  dateFormatted?: string;
}

const statusProgressSteps = [
  "Pending",
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered"
];

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [trackingModalOrder, setTrackingModalOrder] = useState<CustomerOrder | null>(null);

  // Return request state
  const [returnModalOrder, setReturnModalOrder] = useState<CustomerOrder | null>(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnType, setReturnType] = useState<"Return" | "Refund" | "Replacement">("Return");
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);
  const [returnSuccessMsg, setReturnSuccessMsg] = useState<string | null>(null);

  // Fetch orders from MongoDB
  const fetchCustomerOrders = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await fetch("/api/orders?limit=50", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to load customer orders:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCustomerOrders();
  }, []);

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnModalOrder || !returnReason.trim()) return;

    setIsSubmittingReturn(true);
    try {
      const firstItem = returnModalOrder.items[0];
      const res = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: returnModalOrder.id,
          customerName: returnModalOrder.customer,
          customerPhone: returnModalOrder.phone,
          customerAddress: `${returnModalOrder.address || ""}, ${returnModalOrder.district}`,
          productId: firstItem?.id || "",
          productName: returnModalOrder.items.map((i) => i.name).join(", "),
          itemQty: returnModalOrder.items.reduce((acc, i) => acc + (i.qty || 1), 0),
          orderTotal: returnModalOrder.total,
          reason: returnReason.trim(),
          requestType: returnType,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReturnSuccessMsg(`Return claim #${data.returnRequest?.id || ""} submitted successfully!`);
        setTimeout(() => {
          setReturnSuccessMsg(null);
          setReturnModalOrder(null);
          setReturnReason("");
        }, 3000);
        fetchCustomerOrders(false);
      } else {
        alert(data.message || "Failed to submit return request");
      }
    } catch (err) {
      console.error("Error submitting return:", err);
      alert("Something went wrong while submitting your request.");
    } finally {
      setIsSubmittingReturn(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return "badge-warning text-slate-900";
      case "Confirmed":
        return "badge-info text-white";
      case "Processing":
        return "badge-accent text-slate-900";
      case "Packed":
        return "badge-primary text-white";
      case "Shipped":
        return "badge-secondary text-white";
      case "Out for Delivery":
        return "bg-orange-500 text-white";
      case "Delivered":
        return "badge-success text-white";
      case "Cancelled":
        return "badge-error text-white";
      default:
        return "badge-ghost";
    }
  };

  const getStepIndex = (status: string) => {
    return statusProgressSteps.indexOf(status);
  };

  const filteredOrders = orders.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      o.id.toLowerCase().includes(q) ||
      o.phone.includes(q) ||
      o.items.some((item) => item.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-base-content flex items-center gap-2">
            <Package className="w-8 h-8 text-primary" /> My Order History & Tracking
          </h1>
          <p className="text-xs text-base-content/60">
            Real-time tracking of your purchases, live shipment statuses, and official invoices
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchCustomerOrders(false)}
            disabled={isRefreshing}
            className="btn btn-outline btn-sm gap-2 font-bold rounded-xl"
            title="Refresh order history"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link href="/products" className="btn btn-primary btn-sm rounded-xl font-bold gap-2">
            <ShoppingBag className="w-4 h-4" /> Start Shopping
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-base-100 p-4 rounded-2xl border border-base-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-base-content/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID or Product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-sm input-bordered w-full pl-9 text-xs focus:outline-none rounded-xl"
          />
        </div>

        <div className="text-xs text-base-content/60 font-semibold">
          Showing <strong>{filteredOrders.length}</strong> orders
        </div>
      </div>

      {/* Orders Cards List */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-xs font-bold text-base-content/60">Loading your orders from database...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 space-y-4 bg-base-100 rounded-3xl border border-base-200">
          <Package className="w-16 h-16 text-base-content/25 mx-auto" />
          <h2 className="text-2xl font-bold">No Orders Found</h2>
          <p className="text-xs text-base-content/60 max-w-sm mx-auto">
            {searchQuery
              ? `No orders match "${searchQuery}". Please check your search keyword.`
              : "You haven't placed any orders yet. Explore our store to place your first order!"}
          </p>
          <Link href="/products" className="btn btn-primary rounded-xl font-bold btn-sm">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const currentStep = getStepIndex(order.orderStatus);

            return (
              <div
                key={order.id}
                className="bg-base-100 rounded-3xl border border-base-200 p-6 shadow-xs space-y-5 hover:border-primary/40 transition-colors"
              >
                {/* Top Info Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-base-200 pb-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-base text-primary font-mono">{order.id}</span>
                      <span className={`badge ${getStatusBadge(order.orderStatus)} font-bold px-2.5 py-0.5 text-[10px]`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-base-content/60 text-[11px]">
                      Placed on: <strong>{order.dateFormatted || new Date(order.createdAt).toLocaleDateString()}</strong>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-base-content/50 uppercase block font-bold">Total Bill</span>
                    <span className="font-extrabold text-xl text-base-content font-mono">
                      ৳{order.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Live Order Timeline Progress (Stepper) */}
                {currentStep >= 0 && order.orderStatus !== "Cancelled" && (
                  <div className="bg-base-200/50 p-4 rounded-2xl border border-base-200 space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-base-content/50 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-primary" /> Delivery Progress
                    </span>
                    <div className="overflow-x-auto pb-1">
                      <ul className="steps steps-horizontal w-full min-w-[500px] text-[10px] font-bold">
                        {statusProgressSteps.map((stepName, idx) => (
                          <li
                            key={stepName}
                            className={`step ${idx <= currentStep ? "step-primary" : ""}`}
                          >
                            {stepName}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Order Items Preview */}
                <div className="divide-y divide-base-200">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&auto=format&fit=crop&q=80"}
                          alt={item.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-base-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-base-content line-clamp-1">{item.name}</h4>
                            {item.isFlashDeal && (
                              <span className="badge badge-error text-white font-extrabold text-[9px] px-1.5">
                                ⚡ Flash
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-base-content/60 font-mono mt-0.5">
                            Qty: {item.qty} × ৳{item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <span className="font-mono font-bold text-sm text-base-content shrink-0">
                        ৳{(item.qty * item.price).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom Actions Bar */}
                <div className="pt-4 border-t border-base-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-base-content/70">
                      Payment: <strong>{order.paymentMethod}</strong> (
                      <span className={`font-bold ${order.paymentStatus === "Paid" ? "text-success" : "text-warning"}`}>
                        {order.paymentStatus}
                      </span>
                      )
                    </span>
                    <p className="text-[11px] text-base-content/50">
                      Destination: {order.district}, {order.upazila}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setReturnModalOrder(order);
                        setReturnReason("");
                        setReturnSuccessMsg(null);
                      }}
                      className="btn btn-xs btn-ghost gap-1 rounded-lg font-bold text-rose-500 hover:bg-rose-50"
                      title="Request return or refund"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Return / Refund
                    </button>
                    <a
                      href={`/admin/orders/invoice/${order.id}`}
                      target="_blank"
                      className="btn btn-xs btn-outline gap-1 rounded-lg font-bold"
                    >
                      <FileText className="w-3.5 h-3.5 text-primary" /> Invoice
                    </a>
                    <button
                      onClick={() => setTrackingModalOrder(order)}
                      className="btn btn-xs btn-primary gap-1 rounded-lg font-bold shadow-sm"
                    >
                      <Truck className="w-3.5 h-3.5" /> Track Shipment
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TRACKING MODAL */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-base-100 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-base-200">
            <div className="flex items-center justify-between border-b border-base-200 pb-3">
              <div>
                <h3 className="font-black text-xl flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" /> Package Tracking
                </h3>
                <p className="text-xs text-base-content/60">
                  Live tracking status for Order #{trackingModalOrder.id}
                </p>
              </div>
              <button
                onClick={() => setTrackingModalOrder(null)}
                className="btn btn-ghost btn-circle btn-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-primary tracking-wider">
                  Current Status
                </span>
                <p className="text-lg font-black text-primary flex items-center gap-2">
                  <Clock className="w-5 h-5" /> {trackingModalOrder.orderStatus}
                </p>
                <p className="text-base-content/70">
                  Recipient: <strong>{trackingModalOrder.customer}</strong> ({trackingModalOrder.phone})
                </p>
                <p className="text-base-content/70">
                  Address: {trackingModalOrder.address || "Main address"}, {trackingModalOrder.district}
                </p>
              </div>

              <div className="space-y-3 pl-2 border-l-2 border-primary/40">
                <div className="space-y-1">
                  <p className="font-bold text-sm text-base-content flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-success" /> Order Verified & Received
                  </p>
                  <p className="text-[11px] text-base-content/60">
                    Order was successfully created and assigned to fulfillment hub.
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-sm text-base-content flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-primary" /> Logistics Dispatched
                  </p>
                  <p className="text-[11px] text-base-content/60">
                    Assigned Courier Partner: Steadfast / Express Hub.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-base-200 flex justify-end">
              <button
                onClick={() => setTrackingModalOrder(null)}
                className="btn btn-sm btn-primary rounded-xl font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMER RETURN / REFUND REQUEST MODAL */}
      {returnModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-base-100 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-base-200">
            <div className="flex items-center justify-between border-b border-base-200 pb-3">
              <div>
                <h3 className="font-black text-xl flex items-center gap-2 text-base-content">
                  <RotateCcw className="w-5 h-5 text-rose-500" /> Request Return or Refund
                </h3>
                <p className="text-xs text-base-content/60">
                  Submit a claim for Order #{returnModalOrder.id}
                </p>
              </div>
              <button
                onClick={() => setReturnModalOrder(null)}
                className="btn btn-ghost btn-circle btn-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {returnSuccessMsg ? (
              <div className="p-4 bg-success/10 border border-success/20 rounded-2xl text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-success mx-auto" />
                <h4 className="font-bold text-sm text-success">{returnSuccessMsg}</h4>
                <p className="text-xs text-base-content/70">
                  Our customer support team is reviewing your claim. You will be updated shortly!
                </p>
              </div>
            ) : (
              <form onSubmit={handleReturnSubmit} className="space-y-4 text-xs">
                <div className="p-3 bg-base-200/50 rounded-2xl border border-base-200 space-y-1">
                  <p className="text-base-content/70">
                    Order Value: <strong className="font-mono text-sm text-base-content">৳{returnModalOrder.total.toLocaleString()}</strong>
                  </p>
                  <p className="text-base-content/70 truncate">
                    Items: <strong>{returnModalOrder.items.map((i) => i.name).join(", ")}</strong>
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-base-content">Claim Type *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Return", "Refund", "Replacement"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setReturnType(type)}
                        className={`btn btn-sm rounded-xl font-bold ${
                          returnType === type 
                            ? "btn-primary text-primary-content" 
                            : "btn-outline text-base-content"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-base-content">Reason for Return / Refund *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Received damaged product, missing items, or wrong size/color..."
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="textarea textarea-bordered w-full rounded-xl text-xs"
                  ></textarea>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2 text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-tight">
                    Please ensure the item is in its original packaging with tags intact. Upon admin approval, our courier will contact you for pickup.
                  </p>
                </div>

                <div className="pt-2 border-t border-base-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReturnModalOrder(null)}
                    className="btn btn-sm btn-ghost font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReturn}
                    className="btn btn-sm btn-primary rounded-xl font-bold gap-1 shadow-md shadow-primary/20"
                  >
                    {isSubmittingReturn ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    Submit Claim
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
