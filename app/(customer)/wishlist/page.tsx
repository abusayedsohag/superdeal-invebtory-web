"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingBag, Trash2, Star, ArrowRight, CheckCircle2, Sparkles, ShoppingCart } from "lucide-react";

export default function WishlistPage() {
  // Matching exact user request products & prices (in BDT ৳)
  const [wishlist, setWishlist] = useState([
    {
      id: "w1",
      name: "Wireless Mouse",
      price: 999,
      originalPrice: 1299,
      rating: 4.8,
      reviews: 142,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80",
      inStock: true
    },
    {
      id: "w2",
      name: "Keyboard",
      price: 1499,
      originalPrice: 1899,
      rating: 4.9,
      reviews: 218,
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80",
      inStock: true
    },
    {
      id: "w3",
      name: "Headphone",
      price: 2999,
      originalPrice: 3499,
      rating: 4.9,
      reviews: 350,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
      inStock: true
    }
  ]);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const removeItem = (id: string, name: string) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
    triggerToast(`Removed "${name}" from your wishlist.`);
  };

  const addAllToCart = () => {
    triggerToast(`Success! All ${wishlist.length} wishlist items moved to your shopping cart.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 pb-20">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" /> My Wishlist
          </h1>
          <p className="text-xs text-slate-500">Your favorite saved items ready to add to cart</p>
        </div>

        {wishlist.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="badge badge-primary font-bold text-xs">{wishlist.length} Saved Items</span>
            <button 
              onClick={addAllToCart}
              className="btn btn-sm btn-primary font-bold rounded-xl gap-2 shadow-md"
            >
              <ShoppingCart className="w-4 h-4" /> Move All to Cart
            </button>
          </div>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 space-y-4 bg-white rounded-3xl border border-slate-200 shadow-xs">
          <Heart className="w-16 h-16 text-slate-300 mx-auto" />
          <h2 className="text-2xl font-black text-slate-900">Your Wishlist is Empty</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse our catalog and click the heart icon on any product to save it to your wishlist.
          </p>
          <Link href="/products" className="btn btn-primary rounded-xl font-bold gap-2">
            Explore Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div 
              key={item.id} 
              className="bg-white border border-slate-200 shadow-xs hover:shadow-lg transition-all rounded-3xl overflow-hidden group flex flex-col justify-between"
            >
              <div className="relative h-56 bg-slate-50">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                
                {/* Heart Remove Button */}
                <button
                  onClick={() => removeItem(item.id, item.name)}
                  className="btn btn-circle btn-sm bg-white/90 border-none absolute top-3 right-3 text-rose-500 hover:bg-rose-500 hover:text-white shadow-md transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <span className="badge badge-success text-white font-bold text-[10px] absolute bottom-3 left-3">
                  In Stock
                </span>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 line-clamp-1">
                    {item.name}
                  </h3>
                  
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mt-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{item.rating}</span>
                    <span className="text-slate-400 font-normal">({item.reviews} reviews)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-2xl font-black font-mono text-slate-900">
                      ৳{item.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 line-through font-mono ml-2">
                      ৳{item.originalPrice.toLocaleString()}
                    </span>
                  </div>

                  <Link 
                    href="/cart"
                    onClick={() => triggerToast(`Added "${item.name}" to your cart!`)}
                    className="btn btn-primary btn-sm rounded-xl gap-1.5 font-bold shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
