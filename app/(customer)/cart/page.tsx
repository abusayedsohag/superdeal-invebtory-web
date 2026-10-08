"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Minus, 
  Plus, 
  Tag, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  X,
  Percent
} from "lucide-react";

export default function CartPage() {
  // Cart Items State with Stock Validation
  const [items, setItems] = useState([
    {
      id: "1",
      name: "Wireless Noise-Canceling Premium Headphones",
      price: 199.99,
      quantity: 1,
      maxStock: 18,
      sku: "SD-HEAD-9081",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
      color: "Space Gray"
    },
    {
      id: "2",
      name: "Ultra Smart Watch Series 7 Pro",
      price: 149.00,
      quantity: 2,
      maxStock: 25,
      sku: "SD-WTC-7721",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
      color: "Matte Black"
    },
    {
      id: "3",
      name: "Ergonomic Mechanical Gaming Keyboard",
      price: 89.99,
      quantity: 1,
      maxStock: 4,
      sku: "SD-KEY-1022",
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80",
      color: "RGB Black"
    }
  ]);

  // Shipping Method State
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express" | "pickup">("standard");

  // Coupon State
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; type: "fixed" | "percent" } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [stockWarning, setStockWarning] = useState<string | null>(null);

  // Update Quantity with Stock Validation
  const updateQuantity = (id: string, delta: number) => {
    setStockWarning(null);
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          if (newQty > item.maxStock) {
            setStockWarning(`Only ${item.maxStock} units available in stock for ${item.name}!`);
            return item;
          }
          return { ...item, quantity: Math.max(1, newQty) };
        }
        return item;
      })
    );
  };

  // Remove Item
  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Subtotal Calculation
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Shipping Calculation
  let shippingCost = 0;
  if (shippingMethod === "standard") {
    shippingCost = subtotal >= 100 ? 0 : 15;
  } else if (shippingMethod === "express") {
    shippingCost = 25;
  } else if (shippingMethod === "pickup") {
    shippingCost = 0;
  }

  // Tax Calculation (5% VAT)
  const taxRate = 0.05;
  const estimatedTax = subtotal * taxRate;

  // Coupon Discount Calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "fixed") {
      discountAmount = appliedCoupon.discount;
    } else {
      discountAmount = (subtotal * appliedCoupon.discount) / 100;
    }
  }

  // Total Final Amount
  const total = Math.max(0, subtotal + shippingCost + estimatedTax - discountAmount);

  // Apply Coupon Handler
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");

    const code = couponInput.trim().toUpperCase();

    if (code === "SUPER20") {
      if (subtotal < 50) {
        setCouponError("SUPER20 requires a minimum subtotal of \$50.00!");
        return;
      }
      setAppliedCoupon({ code: "SUPER20", discount: 20, type: "fixed" });
      setCouponInput("");
    } else if (code === "MEGA50") {
      if (subtotal < 100) {
        setCouponError("MEGA50 requires a minimum subtotal of \$100.00!");
        return;
      }
      setAppliedCoupon({ code: "MEGA50", discount: 50, type: "percent" });
      setCouponInput("");
    } else if (code === "WELCOME10") {
      setAppliedCoupon({ code: "WELCOME10", discount: 10, type: "fixed" });
      setCouponInput("");
    } else {
      setCouponError("Invalid promo code! Try SUPER20, MEGA50 or WELCOME10.");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Free shipping progress calculation
  const freeShippingThreshold = 100;
  const freeShippingNeeded = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-primary" /> Shopping Cart
          </h1>
          <p className="text-xs text-base-content/60">Review items, validate stock, apply coupons, and calculate shipping</p>
        </div>
        <Link href="/products" className="btn btn-ghost btn-sm gap-2 text-primary font-bold">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>

      {/* Stock Warning Alert Notification */}
      {stockWarning && (
        <div className="alert alert-warning shadow-md rounded-2xl flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{stockWarning}</span>
          </div>
          <button onClick={() => setStockWarning(null)} className="btn btn-ghost btn-circle btn-xs">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-16 space-y-4 bg-base-100 rounded-3xl border border-base-200">
          <ShoppingBag className="w-16 h-16 text-base-content/30 mx-auto" />
          <h2 className="text-2xl font-bold">Your Cart is Empty</h2>
          <p className="text-sm text-base-content/60">Looks like you haven't added any products yet.</p>
          <Link href="/products" className="btn btn-primary rounded-xl font-bold">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Table List & Shipping Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Free Shipping Progress Indicator */}
            <div className="bg-base-100 p-4 rounded-2xl border border-base-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-primary">
                  <Truck className="w-4 h-4" /> 
                  {freeShippingNeeded === 0 ? "🎉 You've Unlocked FREE Express Shipping!" : `Add \$${freeShippingNeeded.toFixed(2)} more for FREE Standard Shipping!`}
                </span>
                <span>{freeShippingProgress.toFixed(0)}%</span>
              </div>
              <progress className="progress progress-primary w-full h-2.5" value={freeShippingProgress} max={100}></progress>
            </div>

            {/* Cart Items Table */}
            <div className="bg-base-100 rounded-3xl border border-base-200 p-4 overflow-x-auto shadow-xs">
              <table className="table w-full text-sm">
                <thead>
                  <tr className="text-xs text-base-content/60 border-b border-base-200">
                    <th>Product</th>
                    <th>Price</th>
                    <th>Stock Status</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200">
                  {items.map((item) => {
                    const isMaxStock = item.quantity >= item.maxStock;

                    return (
                      <tr key={item.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover border border-base-200 shrink-0" />
                            <div>
                              <Link href={`/products/1`} className="font-bold line-clamp-1 hover:text-primary transition-colors">
                                {item.name}
                              </Link>
                              <p className="text-xs text-base-content/60">Color: {item.color} • SKU: {item.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="font-bold">\${item.price.toFixed(2)}</td>
                        <td>
                          <span className={`badge badge-xs font-bold ${isMaxStock ? "badge-warning" : "badge-success text-white"}`}>
                            {isMaxStock ? `Max (${item.maxStock})` : `In Stock (${item.maxStock})`}
                          </span>
                        </td>
                        <td>
                          <div className="join border border-base-300 rounded-lg">
                            <button onClick={() => updateQuantity(item.id, -1)} className="btn btn-xs btn-ghost join-item">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="join-item px-3 flex items-center font-bold text-xs">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)} 
                              disabled={isMaxStock}
                              className="btn btn-xs btn-ghost join-item disabled:bg-base-200"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="font-extrabold text-primary">\${(item.price * item.quantity).toFixed(2)}</td>
                        <td>
                          <button onClick={() => removeItem(item.id)} className="btn btn-ghost btn-xs btn-circle text-error hover:bg-error/10">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Shipping Method Selector */}
            <div className="bg-base-100 p-6 rounded-3xl border border-base-200 shadow-xs space-y-4">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" /> Select Shipping Method
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "standard", name: "Standard Shipping", cost: subtotal >= 100 ? "FREE" : "\$15.00", desc: "3-5 Business Days" },
                  { id: "express", name: "Express Air Delivery", cost: "\$25.00", desc: "1-2 Business Days" },
                  { id: "pickup", name: "Store Pickup", cost: "FREE", desc: "Pick up at nearest hub" }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setShippingMethod(s.id as any)}
                    className={`p-4 rounded-2xl border-2 text-left space-y-1 transition-all ${
                      shippingMethod === s.id ? "border-primary bg-primary/5 font-bold" : "border-base-200 hover:border-base-300"
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span>{s.name}</span>
                      <span className="text-primary font-black">{s.cost}</span>
                    </div>
                    <p className="text-[11px] text-base-content/60">{s.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Coupon Code Validator Form */}
            <div className="bg-base-100 p-5 rounded-3xl border border-base-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold">Apply Promo Coupon Code</span>
                </div>
                <span className="text-xs text-base-content/60 font-semibold">Try: <strong>SUPER20</strong>, <strong>MEGA50</strong>, <strong>WELCOME10</strong></span>
              </div>

              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="join w-full">
                  <input
                    type="text"
                    placeholder="Enter coupon code..."
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="input input-sm input-bordered join-item uppercase text-xs w-full focus:outline-none"
                  />
                  <button type="submit" className="btn btn-sm btn-primary join-item px-6 font-bold">
                    Apply Coupon
                  </button>
                </form>
              ) : (
                <div className="p-3 bg-success/10 border border-success/30 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-success font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> Applied! ({appliedCoupon.type === "fixed" ? `\$${appliedCoupon.discount} Off` : `${appliedCoupon.discount}% Off`})</span>
                  </div>
                  <button onClick={removeCoupon} className="btn btn-ghost btn-xs text-error font-bold">Remove</button>
                </div>
              )}

              {couponError && (
                <p className="text-xs text-error font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> {couponError}
                </p>
              )}
            </div>
          </div>

          {/* Order Financial Breakdown Summary */}
          <div className="bg-base-100 p-6 rounded-3xl border border-base-200 shadow-sm space-y-6 h-fit">
            <h3 className="font-black text-xl border-b border-base-200 pb-3">Order Summary</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-base-content/70">
                <span>Items Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} units)</span>
                <span className="font-bold text-base-content font-mono">\${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-base-content/70">
                <span>Shipping ({shippingMethod})</span>
                <span className="font-bold text-base-content font-mono">
                  {shippingCost === 0 ? <span className="text-success font-bold">FREE</span> : `\$${shippingCost.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-base-content/70">
                <span>Estimated Tax (5% VAT)</span>
                <span className="font-bold text-base-content font-mono">\${estimatedTax.toFixed(2)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-success font-bold">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span className="font-mono">-\${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="divider my-1"></div>

              <div className="flex justify-between text-xl font-black text-base-content">
                <span>Total Amount</span>
                <span className="text-primary text-2xl font-mono">\${total.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/checkout" className="btn btn-primary btn-block btn-lg rounded-2xl font-black shadow-lg shadow-primary/30 gap-2">
              Proceed to Checkout <ArrowRight className="w-5 h-5" />
            </Link>

            <div className="bg-base-200/60 p-3 rounded-2xl text-center text-xs text-base-content/70 space-y-1">
              <p className="font-bold flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-primary" /> Guaranteed 256-Bit Encrypted Checkout
              </p>
              <p className="text-[10px]">30-Day Money-Back Guarantee & Easy Returns</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
