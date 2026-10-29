"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredCart, saveStoredCart, CartItem } from "@/lib/cart-store";
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
  ArrowRight,
  Tag,
  Zap,
  ShoppingBag
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();

  // Customer Form State
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("Dhaka");
  const [upazila, setUpazila] = useState("Banani");
  const [deliveryInstruction, setDeliveryInstruction] = useState("Call before delivery / Leave at security desk");

  // Fetch logged in customer session and auto-fill form
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setCustomerName(data.user.name || "");
          setEmail(data.user.email || "");
          if (data.user.phone) setPhone(data.user.phone);
          if (data.user.address) setAddress(data.user.address);
          if (data.user.district) setDistrict(data.user.district);
          if (data.user.upazila) setUpazila(data.user.upazila);
        }
      } catch (err) {
        console.error("Failed to fetch customer profile in checkout:", err);
      }
    };
    fetchSession();
  }, []);

  // Gateway Tab & Selected Method
  const [activeGatewayTab, setActiveGatewayTab] = useState<"mobile" | "cards" | "netbanking" | "cod">("mobile");
  const [selectedMobileMfs, setSelectedMobileMfs] = useState<"bkash" | "nagad" | "rocket">("bkash");

  // Cart & Coupon State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Modal & Success State
  const [isGatewayModalOpen, setIsGatewayModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string>("ORD-10298");

  // Dynamic Coupon State from localStorage
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    type: "fixed" | "percent";
    calculatedDiscount?: number;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = getStoredCart();
      setCartItems(stored);
      setIsCartLoaded(true);

      const savedCoupon = localStorage.getItem("appliedCoupon");
      if (savedCoupon) {
        try {
          setAppliedCoupon(JSON.parse(savedCoupon));
        } catch (e) {
          console.error("Failed to parse appliedCoupon:", e);
        }
      }
    }
  }, []);

  // Calculate financials based on ACTUAL cart items
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal >= 100 || district === "Dhaka" ? 0 : 50;
  const estimatedTax = subtotal * 0.05;

  let couponDiscountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "fixed") {
      couponDiscountAmount = Math.min(subtotal, appliedCoupon.discount);
    } else {
      couponDiscountAmount = (subtotal * appliedCoupon.discount) / 100;
    }
  }

  // Final Order Total
  const totalAmount = Math.max(0, subtotal + shippingCost + estimatedTax - couponDiscountAmount);

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

  // Submit Order to MongoDB Database
  const submitOrderToDb = async (methodName: string, paymentStatus: "Pending" | "Paid" = "Pending") => {
    if (cartItems.length === 0) {
      alert("Your cart is empty! Please add products before checking out.");
      return;
    }

    setIsPlacingOrder(true);
    try {
      const orderPayload = {
        customer: customerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        district,
        upazila,
        address: address.trim(),
        deliveryInstruction: deliveryInstruction.trim(),
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.quantity,
          image: item.image,
          sku: item.sku,
          isFlashDeal: Boolean(item.isFlashDeal)
        })),
        subtotal,
        shipping: shippingCost,
        tax: estimatedTax,
        couponCode: appliedCoupon?.code,
        couponDiscount: couponDiscountAmount,
        total: totalAmount,
        paymentMethod: methodName,
        paymentStatus
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (data.success && data.order) {
        setPlacedOrderId(data.order.id);
        setOrderSuccess(true);
        // Clear cart and coupon in localStorage
        saveStoredCart([]);
        if (typeof window !== "undefined") {
          localStorage.removeItem("appliedCoupon");
          // Store latest placed order id and customer email/phone for easy tracking
          localStorage.setItem("last_order_id", data.order.id);
          localStorage.setItem("last_order_phone", phone.trim());
          localStorage.setItem("last_order_email", email.trim());
        }
      } else {
        alert(data.message || "Failed to place order");
      }
    } catch (err) {
      console.error("Order submission error:", err);
      alert("Network error while submitting order. Please check your connection.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleInitiatePayment = () => {
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      alert("Please complete the required shipping information (Name, Phone, Address).");
      return;
    }

    if (activeGatewayTab === "mobile") {
      setIsGatewayModalOpen(true);
    } else if (activeGatewayTab === "cod") {
      submitOrderToDb("Cash on Delivery (COD)", "Pending");
    } else if (activeGatewayTab === "cards") {
      submitOrderToDb("Credit / Debit Card", "Paid");
    } else {
      submitOrderToDb("Net Banking", "Paid");
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
          submitOrderToDb(`${selectedMobileMfs.toUpperCase()} MFS Gateway`, "Paid");
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
            <p className="text-xs text-base-content/60">
              Thank you for your order. Your invoice receipt has been saved and sent to {email}.
            </p>
          </div>
          <div className="p-4 bg-base-200/50 rounded-2xl text-xs font-mono space-y-2 text-left">
            <p className="flex justify-between">
              <span>Order ID:</span> <strong className="text-primary font-bold">{placedOrderId}</strong>
            </p>
            <p className="flex justify-between">
              <span>Customer:</span> <strong className="text-base-content font-bold">{customerName}</strong>
            </p>
            <p className="flex justify-between">
              <span>Payment Method:</span> <strong className="text-base-content uppercase font-bold">{selectedMobileMfs} Gateway</strong>
            </p>
            <p className="flex justify-between">
              <span>Destination:</span> <strong className="text-base-content font-bold">{district}, {upazila}</strong>
            </p>
            <p className="flex justify-between border-t border-base-300 pt-1.5">
              <span>Total Paid / Payable:</span> <strong className="text-primary font-bold text-sm">৳{totalAmount.toFixed(2)}</strong>
            </p>
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
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="input input-sm input-bordered w-full focus:outline-none font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-base-content/60">Phone Number (BD) *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input input-sm input-bordered pl-9 w-full focus:outline-none font-bold font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold uppercase text-base-content/60">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input input-sm input-bordered pl-9 w-full focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold uppercase text-base-content/60">Full Street Address *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House, Road, Area details..."
                    className="input input-sm input-bordered w-full focus:outline-none"
                  />
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
                  <CreditCard className="w-4 h-4" /> Cards
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveGatewayTab("cod")}
                  className={`tab text-xs font-extrabold gap-1.5 ${activeGatewayTab === "cod" ? "tab-active bg-primary text-white rounded-xl" : ""}`}
                >
                  <Truck className="w-4 h-4" /> Cash on Delivery (COD)
                </button>
              </div>

              {/* TAB 1: MOBILE BANKING */}
              {activeGatewayTab === "mobile" && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* bKash */}
                    <div 
                      onClick={() => setSelectedMobileMfs("bkash")}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                        selectedMobileMfs === "bkash" 
                          ? "border-[#D12053] bg-[#D12053]/5 shadow-sm" 
                          : "border-base-200 hover:border-base-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-[#D12053] text-sm">bKash</span>
                        <input type="radio" checked={selectedMobileMfs === "bkash"} readOnly className="radio radio-xs radio-primary" />
                      </div>
                      <p className="text-[11px] text-base-content/70">Instant OTP payment</p>
                    </div>

                    {/* Nagad */}
                    <div 
                      onClick={() => setSelectedMobileMfs("nagad")}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                        selectedMobileMfs === "nagad" 
                          ? "border-[#E83C25] bg-[#E83C25]/5 shadow-sm" 
                          : "border-base-200 hover:border-base-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-[#E83C25] text-sm">Nagad</span>
                        <input type="radio" checked={selectedMobileMfs === "nagad"} readOnly className="radio radio-xs radio-primary" />
                      </div>
                      <p className="text-[11px] text-base-content/70">Post Office Digital MFS</p>
                    </div>

                    {/* Rocket */}
                    <div 
                      onClick={() => setSelectedMobileMfs("rocket")}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                        selectedMobileMfs === "rocket" 
                          ? "border-[#8C3494] bg-[#8C3494]/5 shadow-sm" 
                          : "border-base-200 hover:border-base-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-[#8C3494] text-sm">Rocket</span>
                        <input type="radio" checked={selectedMobileMfs === "rocket"} readOnly className="radio radio-xs radio-primary" />
                      </div>
                      <p className="text-[11px] text-base-content/70">DBBL Mobile Banking</p>
                    </div>
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
                    Pay exact cash amount in Bangladeshi Taka (৳) upon package arrival at your doorstep.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Order Summary Breakdown (Connected to ACTUAL Cart) */}
          <div className="bg-base-100 p-6 rounded-3xl border border-base-200 shadow-sm space-y-6 h-fit">
            <div className="flex items-center justify-between border-b border-base-200 pb-3">
              <h3 className="font-black text-xl">Order Summary</h3>
              <span className="badge badge-primary font-bold text-xs">{cartItems.length} Items</span>
            </div>
            
            <div className="space-y-3 text-xs">
              {cartItems.length === 0 ? (
                <div className="text-center py-6 text-base-content/60 space-y-2">
                  <ShoppingBag className="w-8 h-8 mx-auto opacity-30" />
                  <p>Your cart is empty.</p>
                  <Link href="/products" className="btn btn-xs btn-primary font-bold">
                    Add Items
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-1 border-b border-base-100">
                      <div className="flex items-center gap-2 max-w-[70%]">
                        <img src={item.image} alt={item.name} className="w-9 h-9 rounded-lg object-cover border border-base-200 shrink-0" />
                        <div>
                          <p className="font-bold text-base-content line-clamp-1">{item.name}</p>
                          <p className="text-base-content/60 text-[10px]">
                            Qty: {item.quantity} × ৳{item.price.toFixed(2)}
                            {item.isFlashDeal && <span className="text-error font-bold ml-1">⚡ Flash</span>}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-sm">৳{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="divider my-1"></div>

              <div className="flex justify-between text-xs text-base-content/70">
                <span>Subtotal</span>
                <span className="font-mono font-bold text-base-content">৳{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-xs text-base-content/70">
                <span>Shipping ({district})</span>
                <span className="font-bold text-success uppercase">
                  {shippingCost === 0 ? "FREE" : `৳${shippingCost.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-xs text-base-content/70">
                <span>Estimated Tax (5% VAT)</span>
                <span className="font-mono font-bold text-base-content">৳{estimatedTax.toFixed(2)}</span>
              </div>

              {appliedCoupon ? (
                <div className="flex justify-between text-xs text-success font-bold">
                  <span>Coupon ({appliedCoupon.code})</span>
                  <span className="font-mono">-৳{couponDiscountAmount.toFixed(2)}</span>
                </div>
              ) : null}

              <div className="divider my-1"></div>

              <div className="flex justify-between text-xl font-black text-base-content">
                <span>Total Pay</span>
                <span className="text-primary font-mono text-2xl">৳{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleInitiatePayment}
              disabled={isPlacingOrder || cartItems.length === 0}
              className="btn btn-primary btn-block btn-lg rounded-2xl font-black gap-2 shadow-lg shadow-primary/30 disabled:opacity-50"
            >
              {isPlacingOrder ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
              {activeGatewayTab === "mobile" 
                ? `Pay with ${selectedMobileMfs.toUpperCase()} Gateway`
                : activeGatewayTab === "cod"
                ? "Confirm Cash on Delivery Order"
                : "Proceed with Card Payment"}
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
