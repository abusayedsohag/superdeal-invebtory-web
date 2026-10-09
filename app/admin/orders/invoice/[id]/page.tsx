"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Printer, Download, ArrowLeft, ShieldCheck, ShoppingBag, CheckCircle2 } from "lucide-react";

function InvoiceContent() {
  const params = useParams();
  const rawId = (params?.id as string) || "SD-10293";
  const orderId = decodeURIComponent(rawId);

  // Invoice Data Matching Specifications
  const invoiceData = {
    brandName: "SUPER DEAL",
    invoiceNo: "INV-000123",
    orderNo: orderId.startsWith("#") ? orderId : `#${orderId}`,
    date: "09 Oct 2026",
    customer: {
      name: "Abu Sayed",
      phone: "+880 1711223344",
      address: "House 42, Road 11, Block D, Banani",
      location: "Dhaka, Bangladesh"
    },
    items: [
      { name: "Mouse", qty: 2, price: 1000 },
      { name: "Keyboard", qty: 1, price: 1500 }
    ],
    subtotal: 3500,
    discount: 300,
    shipping: 100,
    total: 3300,
    paymentMethod: "COD",
    paymentStatus: "Pending"
  };

  const handlePrint = () => {
    window.print();
  };

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
              Invoice: <span className="font-mono text-primary print:text-slate-900">{invoiceData.invoiceNo}</span>
            </p>
            <p className="text-sm font-bold text-slate-600">
              Order: <span className="font-mono text-slate-900">{invoiceData.orderNo}</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Date: {invoiceData.date}</p>
          </div>
        </div>

        {/* Customer & Order Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 p-4 bg-slate-50 rounded-xl border border-slate-200 print:bg-transparent print:p-0 print:border-none">
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
              Customer Details
            </span>
            <h3 className="font-black text-slate-900 text-base">{invoiceData.customer.name}</h3>
            <p className="text-xs text-slate-600 mt-0.5">{invoiceData.customer.address}</p>
            <p className="text-xs font-bold text-slate-800">{invoiceData.customer.location}</p>
            <p className="text-xs text-slate-500 mt-1">{invoiceData.customer.phone}</p>
          </div>

          <div className="sm:text-right">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
              Payment Details
            </span>
            <p className="text-xs text-slate-600">
              Payment Method: <strong className="text-slate-900">{invoiceData.paymentMethod}</strong>
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              Payment Status: <span className="badge badge-warning badge-sm font-extrabold ml-1">{invoiceData.paymentStatus}</span>
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
                {invoiceData.items.map((item, idx) => (
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
              <span className="font-mono text-slate-900">৳{invoiceData.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-emerald-600">
              <span>Discount:</span>
              <span className="font-mono">- ৳{invoiceData.discount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span className="font-mono text-slate-900">৳{invoiceData.shipping.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t-2 border-slate-900 pt-3 text-lg font-black text-slate-900">
              <span>Total:</span>
              <span className="font-mono text-primary print:text-slate-900">৳{invoiceData.total.toLocaleString()}</span>
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
