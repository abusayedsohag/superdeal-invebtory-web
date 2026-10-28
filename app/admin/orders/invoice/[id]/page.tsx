"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Printer, ArrowLeft, ShieldCheck, ShoppingBag, CheckCircle2, Clock } from "lucide-react";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface InvoiceOrder {
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
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  dateFormatted?: string;
}

function InvoiceContent() {
  const params = useParams();
  const rawId = (params?.id as string) || "ORD-10293";
  const orderId = decodeURIComponent(rawId);

  const [order, setOrder] = useState<InvoiceOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders?id=${encodeURIComponent(orderId)}`, { cache: "no-store" });
        const data = await res.json();
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          setErrorMsg(data.message || "Order not found");
        }
      } catch (err) {
        console.error("Failed to load invoice order:", err);
        setErrorMsg("Failed to load invoice from database");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-slate-500 space-y-3">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-sm font-bold">Loading live invoice from database...</p>
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-200 max-w-md">
          <p className="font-bold text-sm">{errorMsg || "Order invoice could not be located."}</p>
        </div>
        <Link href="/admin/orders" className="btn btn-sm btn-primary rounded-xl font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
      </div>
    );
  }

  // Invoice calculations
  const items = Array.isArray(order.items) ? order.items : [];
  const subtotal = order.subtotal || items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const discount = order.couponDiscount || 0;
  const shipping = order.shipping || 0;
  const tax = order.tax || 0;
  const total = order.total || subtotal + shipping + tax - discount;

  const invoiceNo = `INV-${order.id.replace(/[^0-9]/g, "").padStart(6, "0") || "000123"}`;
  const displayDate = order.dateFormatted || new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 text-slate-900">
      {/* Top Action Bar (Hidden during printing) */}
      <div className="max-w-3xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link 
          href="/admin/orders" 
          className="btn btn-sm btn-ghost gap-2 text-slate-600 hover:text-slate-900 font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrint}
            className="btn btn-sm btn-primary gap-2 font-bold shadow-md rounded-xl"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* INVOICE CARD (Print-Optimized Document) */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-10 print:shadow-none print:border-none print:p-0 print:m-0 font-sans">
        
        {/* Brand Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="bg-primary text-white p-2 rounded-xl print:bg-slate-900">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-black tracking-wider text-slate-900">
                SUPER DEAL
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Professional Inventory & E-Commerce Invoice System
            </p>
          </div>

          <div className="text-right">
            <div className="inline-block bg-slate-100 text-slate-800 text-xs font-mono font-bold px-3 py-1 rounded-full uppercase mb-2 border border-slate-200 print:border-slate-400">
              Official Tax Invoice
            </div>
            <p className="text-sm font-extrabold text-slate-900">
              Invoice: <span className="font-mono text-primary print:text-slate-900">{invoiceNo}</span>
            </p>
            <p className="text-sm font-bold text-slate-600">
              Order: <span className="font-mono text-slate-900">#{order.id}</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Date: {displayDate}</p>
          </div>
        </div>

        {/* Customer & Order Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 p-4 bg-slate-50 rounded-xl border border-slate-200 print:bg-transparent print:p-0 print:border-none">
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
              Customer Details
            </span>
            <h3 className="font-black text-slate-900 text-base">{order.customer}</h3>
            <p className="text-xs text-slate-600 mt-0.5">{order.address || "Street address"}</p>
            <p className="text-xs font-bold text-slate-800">{order.upazila}, {order.district}, Bangladesh</p>
            <p className="text-xs text-slate-500 mt-1 font-mono">{order.phone}</p>
            {order.email && <p className="text-xs text-slate-500 font-mono">{order.email}</p>}
          </div>

          <div className="sm:text-right space-y-1">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
              Payment & Status
            </span>
            <p className="text-xs text-slate-600">
              Payment Method: <strong className="text-slate-900">{order.paymentMethod}</strong>
            </p>
            <p className="text-xs text-slate-600">
              Payment Status: <span className={`badge ${order.paymentStatus === "Paid" ? "badge-success text-white" : "badge-warning"} badge-sm font-extrabold ml-1`}>{order.paymentStatus}</span>
            </p>
            <p className="text-xs text-slate-600">
              Order Lifecycle: <strong className="text-primary print:text-slate-900">{order.orderStatus}</strong>
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="my-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 text-slate-900 uppercase text-xs font-black">
                  <th className="py-3 px-2">Product</th>
                  <th className="py-3 px-2 text-center">Qty</th>
                  <th className="py-3 px-2 text-right">Price</th>
                  <th className="py-3 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 print:hover:bg-transparent">
                    <td className="py-3.5 px-2 font-bold text-slate-900">{item.name}</td>
                    <td className="py-3.5 px-2 text-center font-mono font-bold">{item.qty}</td>
                    <td className="py-3.5 px-2 text-right font-mono">৳{item.price.toLocaleString()}</td>
                    <td className="py-3.5 px-2 text-right font-mono font-extrabold text-slate-900">
                      ৳{(item.qty * item.price).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calculations / Summary matching specifications */}
        <div className="border-t-2 border-slate-900 pt-4 mt-6">
          <div className="w-full sm:w-72 ml-auto space-y-2 text-sm font-bold text-slate-700">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-mono text-slate-900">৳{subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Coupon Discount ({order.couponCode || "PROMO"}):</span>
                <span className="font-mono">- ৳{discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping ({order.district}):</span>
              <span className="font-mono text-slate-900">
                {shipping === 0 ? "FREE" : `৳${shipping.toLocaleString()}`}
              </span>
            </div>
            {tax > 0 && (
              <div className="flex justify-between">
                <span>VAT / Tax:</span>
                <span className="font-mono text-slate-900">৳{tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between border-t-2 border-slate-900 pt-3 text-lg font-black text-slate-900">
              <span>Total Payable:</span>
              <span className="font-mono text-primary print:text-slate-900">৳{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Thank you for shopping with SUPER DEAL!</span>
          </div>
          <div>
            <span>Need help? Contact support@superdeal.com</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function OrderInvoicePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-6 text-slate-500">
        <span className="loading loading-spinner loading-md"></span> Loading Invoice...
      </div>
    }>
      <InvoiceContent />
    </Suspense>
  );
}
