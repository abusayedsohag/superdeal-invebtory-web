"use client";

import Link from "next/link";
import { useState } from "react";
import PaymentGatewayModal from "@/components/customer/PaymentGatewayModal";
import { 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  Wallet, 
  Phone, 
  Mail, 
  User, 
  Lock,
  Smartphone,
  Building,
  ArrowRight
} from "lucide-react";

export default function CheckoutPage() {
  // Customer Info State
  const [district, setDistrict] = useState("Dhaka");
  const [upazila, setUpazila] = useState("Banani");
  const [deliveryInstruction, setDeliveryInstruction] = useState("Call before delivery / Leave at security desk");

  // Gateway Tab & Selected Method
  const [activeGatewayTab, setActiveGatewayTab] = useState<"mobile" | "cards" | "netbanking" | "cod">("mobile");
  const [selectedMobileMfs, setSelectedMobileMfs] = useState<"bkash" | "nagad" | "rocket">("bkash");

  // Official Gateway Modal Popup State
  const [isGatewayModalOpen, setIsGatewayModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Order Total
  const totalAmount = 502.89;

  // Districts & Upazila Options
  const districtOptions: Record<string, string[]> = {
    Dhaka: ["Banani", "Dhanmondi", "Gulshan", "Mirpur", "Uttara", "Mohakhali", "Tejgaon"],
    Chittagong: ["Agrabad", "GEC Circle", "Halishahar", "Nasirabad", "Panchlaish"],
    Sylhet: ["Zindabazar", "Ambarkhana", "Koydirpur", "Subidbazar"],
    Rajshahi: ["Boalia", "Rajpara", "Motihar", "Shah Makhdum"],
    Khulna: ["Khalishpur", "Sonadanga", "Daulatpur"],
    Barisal: ["Sadarganj", "Nathullabad", "Kawnia"],
    Rangpur: ["Station Road", "Jahaj Company", "Dhap"],
    Mymensingh: ["Ganginarpar", "Akua", "Charpara"]
  };

  const currentUpazilas = districtOptions[district] || ["Sadar"];

  const handleInitiatePayment = () => {
    if (activeGatewayTab === "mobile") {
      setIsGatewayModalOpen(true);
    } else {
      setOrderSuccess(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8 space-y-8">
      {/* Official Payment Gateway Modal (bKash / Nagad / Rocket) */}
      <PaymentGatewayModal
        isOpen={isGatewayModalOpen}
        gateway={selectedMobileMfs}
        amount={totalAmount}
        onClose={() => setIsGatewayModalOpen(false)}
        onSuccess={() => {
          setIsGatewayModalOpen(false);
          setOrderSuccess(true);
        }}
      />

      {/* Step Progress Bar */}
      <div className="flex justify-center">
        <ul className="steps steps-horizontal w-full max-w-xl text-xs md:text-sm font-bold">
          <li className="step step-primary">Cart</li>
          <li className="step step-primary">Shipping & Gateway</li>
          <li className={`step ${orderSuccess ? "step-primary" : ""}`}>Confirmation</li>
        </ul>
      </div>

      {orderSuccess ? (
        <div className="max-w-2xl mx-auto bg-base-100 p-8 rounded-3xl border border-base-200 text-center space-y-6 shadow-xl">
          <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-base-content">Order Confirmed!</h2>
            <p className="text-xs text-base-content/60">Thank you for your order. Your invoice receipt has been sent to sayed@example.com</p>
          </div>
          <div className="p-4 bg-base-200/50 rounded-2xl text-xs font-mono space-y-1 text-left">
            <p className="flex justify-between"><span>Order Number:</span> <strong className="text-primary font-bold">ORD-9982</strong></p>
            <p className="flex justify-between"><span>Payment Method:</span> <strong className="text-base-content uppercase font-bold">{selectedMobileMfs} Gateway</strong></p>
            <p className="flex justify-between"><span>Transaction ID:</span> <strong className="text-base-content font-bold">TRX99882211</strong></p>
            <p className="flex justify-between"><span>Shipping Destination:</span> <strong className="text-base-content font-bold">{district}, {upazila}</strong></p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Link href="/my-orders" className="btn btn-primary rounded-xl font-bold gap-2">
              Track My Order
            </Link>
            <Link href="/products" className="btn btn-outline rounded-xl font-bold">
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Shipping & BD Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information Form */}
            <div className="bg-base-100 p-6 rounded-3xl border border-base-200 shadow-xs space-y-4">
              <h2 className="text-xl font-black flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Customer & Shipping Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-base-content/60">Full Name *</label>
                  <input type="text" defaultValue="Abu Sayed" className="input input-sm input-bordered w-full focus:outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-base-content/60">Phone Number (BD) *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                    <input type="tel" defaultValue="+880 1711 223344" className="input input-sm input-bordered pl-9 w-full focus:outline-none" />
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold uppercase text-base-content/60">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                    <input type="email" defaultValue="sayed@example.com" className="input input-sm input-bordered pl-9 w-full focus:outline-none" />
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold uppercase text-base-content/60">Full Street Address *</label>
                  <input type="text" defaultValue="House 42, Road 11, Block D" className="input input-sm input-bordered w-full focus:outline-none" />
                </div>

                {/* District Dropdown */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-base-content/60">District *</label>
                  <select 
                    value={district} 
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      setUpazila(districtOptions[e.target.value]?.[0] || "Sadar");
                    }}
                    className="select select-sm select-bordered w-full focus:outline-none font-bold"
                  >
                    {Object.keys(districtOptions).map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Upazila / Thana Dropdown */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-base-content/60">Upazila / Thana *</label>
                  <select 
                    value={upazila} 
                    onChange={(e) => setUpazila(e.target.value)}
                    className="select select-sm select-bordered w-full focus:outline-none font-bold"
                  >
                    {currentUpazilas.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                {/* Special Delivery Instruction */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold uppercase text-base-content/60">Delivery Instructions (Optional)</label>
                  <textarea 
                    rows={2}
                    value={deliveryInstruction} 
                    onChange={(e) => setDeliveryInstruction(e.target.value)}
                    placeholder="e.g. Please call before arrival, leave with security guard..."
                    className="textarea textarea-bordered w-full text-xs focus:outline-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* BANGLADESH OFFICIAL PAYMENT GATEWAYS */}
            <div className="bg-base-100 p-6 rounded-3xl border border-base-200 shadow-sm space-y-5">
              {/* Gateway Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-base-200 pb-3">
                <div>
                  <h2 className="text-xl font-black flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" /> Payment Gateway System
                  </h2>
                  <p className="text-xs text-base-content/60">Select payment gateway channel</p>
                </div>
                <span className="badge badge-success text-white font-mono text-[10px] font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> SSL 256-Bit Secured
                </span>
              </div>

              {/* Gateway Category Tabs */}
              <div className="tabs tabs-boxed bg-base-200 p-1 rounded-2xl flex overflow-x-auto no-scrollbar">
                <button 
                  type="button"
                  onClick={() => setActiveGatewayTab("mobile")}
                  className={`tab text-xs font-extrabold gap-1.5 ${activeGatewayTab === "mobile" ? "tab-active bg-primary text-white rounded-xl" : ""}`}
                >
                  <Smartphone className="w-4 h-4" /> Mobile Banking (MFS)
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveGatewayTab("cards")}
                  className={`tab text-xs font-extrabold gap-1.5 ${activeGatewayTab === "cards" ? "tab-active bg-primary text-white rounded-xl" : ""}`}
                >
                  <CreditCard className="w-4 h-4" /> Credit / Debit Cards
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveGatewayTab("netbanking")}
                  className={`tab text-xs font-extrabold gap-1.5 ${activeGatewayTab === "netbanking" ? "tab-active bg-primary text-white rounded-xl" : ""}`}
                >
                  <Building className="w-4 h-4" /> Net Banking
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveGatewayTab("cod")}
                  className={`tab text-xs font-extrabold gap-1.5 ${activeGatewayTab === "cod" ? "tab-active bg-primary text-white rounded-xl" : ""}`}
                >
                  <Truck className="w-4 h-4" /> Cash on Delivery
                </button>
              </div>

              {/* TAB 1: MOBILE BANKING (bKash, Nagad, Rocket) */}
              {activeGatewayTab === "mobile" && (
                <div className="space-y-4 pt-1">
                  <span className="text-xs font-bold text-base-content/60 uppercase">Click provider to open official gateway popup:</span>
                  
                  {/* Brand Cards Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    {/* bKash */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMobileMfs("bkash");
                        setIsGatewayModalOpen(true);
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all text-center flex flex-col items-center justify-center gap-1.5 ${
                        selectedMobileMfs === "bkash"
                          ? "border-[#E2136E] bg-pink-50 text-[#E2136E] shadow-md ring-2 ring-pink-500/20 font-black"
                          : "border-base-200 hover:border-pink-300"
                      }`}
                    >
                      <span className="text-3xl">💖</span>
                      <span className="text-xs font-black">bKash</span>
                      <span className="badge badge-xs badge-secondary font-bold">POPUP CHECKOUT</span>
                    </button>

                    {/* Nagad */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMobileMfs("nagad");
                        setIsGatewayModalOpen(true);
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all text-center flex flex-col items-center justify-center gap-1.5 ${
                        selectedMobileMfs === "nagad"
                          ? "border-[#ED1C24] bg-orange-50 text-[#ED1C24] shadow-md ring-2 ring-orange-500/20 font-black"
                          : "border-base-200 hover:border-orange-300"
                      }`}
                    >
                      <span className="text-3xl">🟠</span>
                      <span className="text-xs font-black">Nagad</span>
                      <span className="badge badge-xs badge-warning font-bold">POPUP CHECKOUT</span>
                    </button>

                    {/* Rocket */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMobileMfs("rocket");
                        setIsGatewayModalOpen(true);
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all text-center flex flex-col items-center justify-center gap-1.5 ${
                        selectedMobileMfs === "rocket"
                          ? "border-[#8C3494] bg-purple-50 text-[#8C3494] shadow-md ring-2 ring-purple-500/20 font-black"
                          : "border-base-200 hover:border-purple-300"
                      }`}
                    >
                      <span className="text-3xl">🚀</span>
                      <span className="text-xs font-black">Rocket DBBL</span>
                      <span className="badge badge-xs badge-accent font-bold">POPUP CHECKOUT</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: CREDIT / DEBIT CARDS */}
              {activeGatewayTab === "cards" && (
                <div className="space-y-4 pt-1">
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white space-y-4 shadow-xl border border-slate-800">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-primary" />
                        <span className="font-extrabold text-sm">Visa / Mastercard / AMEX Gateway</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <input type="text" placeholder="Card Number (4532 .... .... ....)" className="input input-sm input-bordered bg-slate-800/80 border-slate-700 font-mono text-white w-full" />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="MM / YY" className="input input-sm input-bordered bg-slate-800/80 border-slate-700 font-mono text-white w-full" />
                        <input type="password" placeholder="CVV" className="input input-sm input-bordered bg-slate-800/80 border-slate-700 font-mono text-white w-full" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CASH ON DELIVERY */}
              {activeGatewayTab === "cod" && (
                <div className="p-4 bg-amber-50 text-amber-900 rounded-2xl text-xs space-y-2 border border-amber-200">
                  <p className="font-extrabold text-sm flex items-center gap-1.5">
                    <Truck className="w-5 h-5 text-amber-700" /> Cash on Delivery Selected
                  </p>
                  <p className="text-xs text-amber-800">
                    Pay exact cash amount upon package arrival.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Order Summary Breakdown */}
          <div className="bg-base-100 p-6 rounded-3xl border border-base-200 shadow-sm space-y-6 h-fit">
            <h3 className="font-black text-xl border-b border-base-200 pb-3">Order Summary</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1">
                <div>
                  <p className="font-bold text-base-content">Wireless Headphones</p>
                  <p className="text-base-content/60">Qty: 1 × \$199.99</p>
                </div>
                <span className="font-mono font-bold text-sm">\${(199.99).toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <div>
                  <p className="font-bold text-base-content">Smart Watch Series 7</p>
                  <p className="text-base-content/60">Qty: 2 × \$149.00</p>
                </div>
                <span className="font-mono font-bold text-sm">\${(298.00).toFixed(2)}</span>
              </div>

              <div className="divider my-1"></div>

              <div className="flex justify-between text-xs text-base-content/70">
                <span>Subtotal</span>
                <span className="font-mono font-bold text-base-content">\${(497.99).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-xs text-base-content/70">
                <span>Shipping ({district})</span>
                <span className="font-bold text-success uppercase">FREE</span>
              </div>

              <div className="flex justify-between text-xs text-base-content/70">
                <span>Estimated Tax (5% VAT)</span>
                <span className="font-mono font-bold text-base-content">\${(24.90).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-xs text-success font-bold">
                <span>Coupon (SUPER20)</span>
                <span className="font-mono">-\$20.00</span>
              </div>

              <div className="divider my-1"></div>

              <div className="flex justify-between text-xl font-black text-base-content">
                <span>Total Pay</span>
                <span className="text-primary font-mono text-2xl">\${(502.89).toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleInitiatePayment} 
              className="btn btn-primary btn-block btn-lg rounded-2xl font-black gap-2 shadow-lg shadow-primary/30"
            >
              <CheckCircle2 className="w-5 h-5" /> Pay with {selectedMobileMfs.toUpperCase()} Gateway
            </button>

            <div className="bg-base-200/60 p-3 rounded-2xl text-center text-xs text-base-content/70 space-y-1">
              <p className="font-bold flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> SSLCommerz 256-Bit SSL Encrypted
              </p>
              <p className="text-[10px]">Instant Gateway Confirmation & SMS Receipt</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
