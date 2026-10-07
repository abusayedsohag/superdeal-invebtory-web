"use client";

import Link from "next/link";
import { useState } from "react";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, Tag, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const [items, setItems] = useState([
    {
      id: "1",
      name: "Wireless Noise-Canceling Premium Headphones",
      price: 199.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
      color: "Space Gray"
    },
    {
      id: "2",
      name: "Ultra Smart Watch Series 7 Pro",
      price: 149.00,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
      color: "Matte Black"
    }
  ]);

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + shipping - discount;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "SUPER20") {
      setDiscount(20);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-base-200 pb-4">
        <div>
          <h1 className="text-3xl font-black">Shopping Cart</h1>
          <p className="text-xs text-base-content/60">Manage your selected items before checkout</p>
        </div>
        <Link href="/products" className="btn btn-ghost btn-sm gap-2 text-primary font-bold">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 space-y-4 bg-base-100 rounded-3xl border border-base-200">
          <ShoppingBag className="w-16 h-16 text-base-content/30 mx-auto" />
          <h2 className="text-2xl font-bold">Your Cart is Empty</h2>
          <p className="text-sm text-base-content/60">Looks like you haven't added any products yet.</p>
          <Link href="/products" className="btn btn-primary rounded-xl">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Table List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-base-100 rounded-3xl border border-base-200 p-4 overflow-x-auto shadow-xs">
              <table className="table w-full">
                <thead>
                  <tr className="text-xs text-base-content/60 border-b border-base-200">
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200 text-sm">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover border border-base-200" />
                          <div>
                            <p className="font-bold line-clamp-1">{item.name}</p>
                            <p className="text-xs text-base-content/60">Color: {item.color}</p>
                          </div>
                        </div>
                      </td>
                      <td className="font-bold">\${item.price.toFixed(2)}</td>
                      <td>
                        <div className="join border border-base-300 rounded-lg">
                          <button onClick={() => updateQuantity(item.id, -1)} className="btn btn-xs btn-ghost join-item"><Minus className="w-3 h-3" /></button>
                          <span className="join-item px-3 flex items-center font-bold text-xs">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="btn btn-xs btn-ghost join-item"><Plus className="w-3 h-3" /></button>
                        </div>
                      </td>
                      <td className="font-extrabold text-primary">\${(item.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <button onClick={() => removeItem(item.id)} className="btn btn-ghost btn-xs btn-circle text-error hover:bg-error/10">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Coupon Code Section */}
            <div className="bg-base-100 p-4 rounded-2xl border border-base-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold">Have a Discount Coupon?</span>
              </div>
              <div className="join w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Enter code (e.g. SUPER20)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="input input-sm input-bordered join-item uppercase text-xs focus:outline-none"
                />
                <button onClick={handleApplyCoupon} className="btn btn-sm btn-primary join-item">
                  Apply
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="bg-base-100 p-6 rounded-3xl border border-base-200 shadow-sm space-y-6 h-fit">
            <h3 className="font-black text-xl border-b border-base-200 pb-3">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-base-content/70">
                <span>Subtotal</span>
                <span className="font-bold text-base-content">\${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base-content/70">
                <span>Estimated Shipping</span>
                <span className="font-bold text-base-content">{shipping === 0 ? <span className="text-success font-bold">FREE</span> : `\$${shipping.toFixed(2)}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount Applied</span>
                  <span className="font-bold">-\${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="divider my-1"></div>
              <div className="flex justify-between text-lg font-black text-base-content">
                <span>Total</span>
                <span className="text-primary text-2xl">\${total.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/checkout" className="btn btn-primary btn-block btn-lg rounded-2xl font-bold shadow-lg shadow-primary/20 gap-2">
              Proceed to Checkout <ArrowRight className="w-5 h-5" />
            </Link>

            <div className="bg-base-200/60 p-3 rounded-xl text-center text-xs text-base-content/60">
              🔒 Safe & Secure 256-Bit SSL Encrypted Checkout
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
