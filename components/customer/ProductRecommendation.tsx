"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, ShoppingBag, Star, Heart, CheckCircle2, ArrowRight } from "lucide-react";

interface RecommendedProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  matchReason: string;
}

interface ProductRecommendationProps {
  currentProductTitle?: string; // e.g. "Gaming Mouse"
}

export default function ProductRecommendation({
  currentProductTitle = "Gaming Mouse"
}: ProductRecommendationProps) {
  const recommendedItems: RecommendedProduct[] = [
    {
      id: "rec-1",
      name: "Gaming Keyboard",
      category: "Accessories",
      price: 1499,
      originalPrice: 1899,
      rating: 4.9,
      reviews: 218,
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80",
      matchReason: "Frequently Bought Together with Mouse"
    },
    {
      id: "rec-2",
      name: "Mouse Pad (RGB XL Desk Mat)",
      category: "Accessories",
      price: 490,
      originalPrice: 750,
      rating: 4.8,
      reviews: 142,
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80",
      matchReason: "Perfect Companion Accessory"
    },
    {
      id: "rec-3",
      name: "Gaming Headset (Surround Sound)",
      category: "Electronics",
      price: 2999,
      originalPrice: 3499,
      rating: 4.9,
      reviews: 350,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
      matchReason: "Complete Your Setup"
    }
  ];

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (name: string) => {
    setToastMsg(`Added "${name}" to your shopping cart!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 border border-slate-800 relative overflow-hidden">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Section Matching Specification */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            <span className="text-amber-400 underline decoration-amber-400/50">{currentProductTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Rule-based complementary setup matching • Frequently paired items
          </p>
        </div>

        <div className="text-xs font-bold text-indigo-300 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 shrink-0">
          🎯 You May Also Like
        </div>
      </div>

      {/* Recommended Items Grid (Keyboard, Mouse Pad, Headset) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {recommendedItems.map((item) => (
          <div
            key={item.id}
            className="bg-slate-800/90 border border-slate-700/80 rounded-2xl overflow-hidden hover:border-amber-400/60 transition-all group flex flex-col justify-between"
          >
            {/* Image & Match Reason */}
            <div className="relative h-44 bg-slate-950 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="badge badge-neutral bg-black/60 text-amber-300 border-none font-extrabold text-[10px] absolute top-3 left-3 backdrop-blur-md">
                {item.matchReason}
              </span>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                  {item.name}
                </h3>

                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mt-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{item.rating}</span>
                  <span className="text-slate-400 font-normal">({item.reviews} reviews)</span>
                </div>
              </div>

              {/* Price & Add Button */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                <div>
                  <span className="text-lg font-black font-mono text-white">
                    ৳{item.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 line-through font-mono ml-1.5">
                    ৳{item.originalPrice.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => triggerToast(item.name)}
                  className="btn btn-sm btn-primary rounded-xl font-bold gap-1 shadow-md"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
