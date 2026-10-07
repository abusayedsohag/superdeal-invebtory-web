"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, ShieldCheck, CreditCard, Truck, Wallet } from "lucide-react";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("card");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Step Indicator */}
      <div className="flex justify-center">
        <ul className="steps steps-horizontal w-full max-w-xl text-xs md:text-sm font-semibold">
          <li className="step step-primary">Cart</li>
          <li className="step step-primary">Shipping & Payment</li>
          <li className="step">Confirmation</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="bg-base-100 p-6 rounded-3xl border border-base-200 shadow-xs space-y-4">
            <h2 className="text-xl font-black flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" /> Shipping Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-base-content/60">First Name</label>
                <input type="text" defaultValue="Abu" className="input input-sm input-bordered w-full focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-base-content/60">Last Name</label>
                <input type="text" defaultValue="Sayed" className="input input-sm input-bordered w-full focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-base-content/60">Email Address</label>
                <input type="email" defaultValue="sayed@example.com" className="input input-sm input-bordered w-full focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-base-content/60">Phone Number</label>
                <input type="tel" defaultValue="+880 1700 000000" className="input input-sm input-bordered w-full focus:outline-none" />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold uppercase text-base-content/60">Street Address</label>
                <input type="text" defaultValue="House 42, Road 11, Block D, Banani" className="input input-sm input-bordered w-full focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-base-content/60">City</label>
                <input type="text" defaultValue="Dhaka" className="input input-sm input-bordered w-full focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-base-content/60">Postal Code</label>
                <input type="text" defaultValue="1213" className="input input-sm input-bordered w-full focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div className="bg-base-100 p-6 rounded-3xl border border-base-200 shadow-xs space-y-4">
            <h2 className="text-xl font-black flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" /> Payment Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "card", name: "Credit/Debit Card", icon: CreditCard },
                { id: "mobile", name: "Mobile Banking (bKash/Nagad)", icon: Wallet },
                { id: "cod", name: "Cash on Delivery", icon: Truck }
              ].map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 rounded-2xl border-2 text-left flex flex-col items-center justify-center text-center gap-2 transition-all ${
                      isSelected ? "border-primary bg-primary/5 text-primary font-bold" : "border-base-200 text-base-content/70 hover:border-base-300"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs">{method.name}</span>
                  </button>
                );
              })}
            </div>

            {paymentMethod === "card" && (
              <div className="p-4 bg-base-200/50 rounded-2xl space-y-3">
                <input type="text" placeholder="Card Number (4532 .... .... ....)" className="input input-sm input-bordered w-full" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="MM/YY" className="input input-sm input-bordered w-full" />
                  <input type="text" placeholder="CVV" className="input input-sm input-bordered w-full" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Summary */}
        <div className="bg-base-100 p-6 rounded-3xl border border-base-200 shadow-sm space-y-6 h-fit">
          <h3 className="font-black text-xl border-b border-base-200 pb-3">Your Order</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1">
              <span>Wireless Headphones x 1</span>
              <span className="font-bold">\${(199.99).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span>Smart Watch x 2</span>
              <span className="font-bold">\${(298.00).toFixed(2)}</span>
            </div>
            <div className="divider my-1"></div>
            <div className="flex justify-between text-sm text-base-content/70">
              <span>Subtotal</span>
              <span className="font-bold text-base-content font-mono">\${(497.99).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-base-content/70">
              <span>Shipping</span>
              <span className="font-bold text-success uppercase">FREE</span>
            </div>
            <div className="divider my-1"></div>
            <div className="flex justify-between text-xl font-black text-base-content">
              <span>Total Pay</span>
              <span className="text-primary font-mono">\${(497.99).toFixed(2)}</span>
            </div>
          </div>

          <Link href="/my-orders" className="btn btn-primary btn-block btn-lg rounded-2xl font-bold gap-2">
            <CheckCircle2 className="w-5 h-5" /> Confirm & Place Order
          </Link>
        </div>
      </div>
    </div>
  );
}
