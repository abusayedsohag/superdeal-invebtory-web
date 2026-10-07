"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingBag, Trash2, Star, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([
    {
      id: "1",
      name: "Wireless Noise-Canceling Premium Headphones",
      price: 199.99,
      originalPrice: 249.99,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
      inStock: true
    },
    {
      id: "2",
      name: "Ergonomic Mechanical Gaming Keyboard",
      price: 89.99,
      originalPrice: 119.99,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80",
      inStock: true
    },
    {
      id: "3",
      name: "Minimalist Wireless Optical Mouse",
      price: 29.99,
      originalPrice: 39.99,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80",
      inStock: true
    }
  ]);

  const removeItem = (id: string) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-base-200 pb-4">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-2">
            <Heart className="w-7 h-7 text-secondary fill-secondary" /> My Wishlist
          </h1>
          <p className="text-xs text-base-content/60">Saved items to buy later</p>
        </div>
        <span className="badge badge-primary font-bold">{wishlist.length} Items</span>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-16 space-y-4 bg-base-100 rounded-3xl border border-base-200">
          <Heart className="w-16 h-16 text-base-content/20 mx-auto" />
          <h2 className="text-2xl font-bold">Your Wishlist is Empty</h2>
          <p className="text-sm text-base-content/60">Browse our store and click the heart icon to save products.</p>
          <Link href="/products" className="btn btn-primary rounded-xl">Explore Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="card bg-base-100 border border-base-200 shadow-xs hover:shadow-md transition-all rounded-2xl overflow-hidden group">
              <figure className="relative h-48 bg-base-200">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <button
                  onClick={() => removeItem(item.id)}
                  className="btn btn-circle btn-sm bg-base-100/90 border-none absolute top-3 right-3 text-error hover:bg-error hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </figure>
              <div className="card-body p-4 space-y-2">
                <Link href={`/products/${item.id}`} className="font-bold text-sm line-clamp-1 hover:text-primary">
                  {item.name}
                </Link>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{item.rating}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-lg font-black">\${item.price}</span>
                    <span className="text-xs text-base-content/40 line-through ml-1.5">\${item.originalPrice}</span>
                  </div>
                  <Link href="/cart" className="btn btn-primary btn-sm rounded-xl gap-1">
                    <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
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
