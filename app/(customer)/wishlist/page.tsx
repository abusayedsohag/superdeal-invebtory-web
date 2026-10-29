"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, Trash2, Star, ArrowRight, CheckCircle2, ShoppingCart, ShoppingBag } from "lucide-react";
import { getStoredWishlist, removeFromWishlist, clearWishlist, WishlistItem } from "@/lib/wishlist-store";
import { getStoredCart, saveStoredCart, CartItem } from "@/lib/cart-store";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const syncWishlist = () => {
    setWishlist(getStoredWishlist());
    setIsLoaded(true);
  };

  useEffect(() => {
    syncWishlist();
    window.addEventListener("wishlistUpdated", syncWishlist);
    return () => window.removeEventListener("wishlistUpdated", syncWishlist);
  }, []);

  const handleRemoveItem = (id: string, name: string) => {
    removeFromWishlist(id);
    triggerToast(`Removed "${name}" from your wishlist.`);
  };

  const handleAddToCart = (item: WishlistItem) => {
    const cart = getStoredCart();
    const existingIndex = cart.findIndex((c) => c.id === item.id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        quantity: 1,
        maxStock: 50,
        image: item.image,
      });
    }
    saveStoredCart(cart);
    triggerToast(`Added "${item.name}" to your shopping cart! 🛒`);
  };

  const handleAddAllToCart = () => {
    if (wishlist.length === 0) return;
    const cart = getStoredCart();
    wishlist.forEach((item) => {
      const idx = cart.findIndex((c) => c.id === item.id);
      if (idx > -1) {
        cart[idx].quantity += 1;
      } else {
        cart.push({
          id: item.id,
          name: item.name,
          price: item.price,
          originalPrice: item.originalPrice,
          quantity: 1,
          maxStock: 50,
          image: item.image,
        });
      }
    });
    saveStoredCart(cart);
    triggerToast(`Success! All ${wishlist.length} wishlist items moved to your shopping cart.`);
  };

  if (!isLoaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="loading loading-spinner text-primary loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 pb-20">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-200 pb-4">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-2">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" /> My Wishlist
          </h1>
          <p className="text-xs text-base-content/60">Your favorite saved items ready to add to cart</p>
        </div>

        {wishlist.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="badge badge-primary font-bold text-xs">{wishlist.length} Saved Items</span>
            <button 
              onClick={handleAddAllToCart}
              className="btn btn-sm btn-primary rounded-xl font-bold gap-2 shadow-sm"
            >
              <ShoppingCart className="w-4 h-4" /> Move All to Cart
            </button>
            <button
              onClick={clearWishlist}
              className="btn btn-sm btn-ghost text-error hover:bg-error/10 font-bold"
              title="Clear all"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Wishlist Content */}
      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-base-100 rounded-3xl border border-base-200 space-y-4 shadow-xs">
          <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black">Your Wishlist is Empty</h2>
            <p className="text-xs text-base-content/60 max-w-sm mx-auto">
              Explore our best products, save the items you love by clicking the heart icon, and come back anytime!
            </p>
          </div>
          <Link href="/products" className="btn btn-primary btn-sm rounded-xl font-bold gap-2">
            <ShoppingBag className="w-4 h-4" /> Discover Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div 
              key={item.id} 
              className="card bg-base-100 border border-base-200 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all group"
            >
              <div className="relative">
                <img 
                  src={item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80"} 
                  alt={item.name} 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <button 
                  onClick={() => handleRemoveItem(item.id, item.name)}
                  className="btn btn-circle btn-xs btn-error text-white absolute top-2 right-2 shadow-md hover:scale-110"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {item.inStock !== false ? (
                  <span className="badge badge-success badge-xs font-bold text-white absolute bottom-2 left-2 shadow-xs">
                    In Stock
                  </span>
                ) : (
                  <span className="badge badge-error badge-xs font-bold text-white absolute bottom-2 left-2 shadow-xs">
                    Out of Stock
                  </span>
                )}
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-base-content line-clamp-2 hover:text-primary transition-colors">
                    <Link href={`/products`}>{item.name}</Link>
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{item.rating || 4.8}</span>
                    <span className="text-base-content/40 font-normal">({item.reviews || 84})</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-base-200 space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-primary">৳{item.price.toLocaleString()}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-xs text-base-content/40 line-through">
                        ৳{item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="btn btn-primary btn-sm flex-1 rounded-xl font-bold gap-1 text-xs"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                    </button>
                    <button 
                      onClick={() => handleRemoveItem(item.id, item.name)}
                      className="btn btn-ghost btn-square btn-sm text-base-content/40 hover:text-error"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
