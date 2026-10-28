"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Flame, Star, ShoppingBag, Clock, ChevronLeft, ChevronRight } from "lucide-react";

interface FlashSaleCampaign {
  title: string;
  subtitle: string;
  badge: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface FlashSaleProduct {
  id: string;
  name: string;
  category: string;
  originalPrice: number;
  flashPrice: number;
  discount: string;
  allocatedStock: number;
  soldStock: number;
  image: string;
  rating?: number;
  reviews?: number;
  isActive?: boolean;
}

export default function DynamicFlashSaleSection() {
  const [items, setItems] = useState<FlashSaleProduct[]>([]);
  const [campaign, setCampaign] = useState<FlashSaleCampaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Live countdown state
  const [timeLeft, setTimeLeft] = useState<{ hours: string; minutes: string; seconds: string }>({
    hours: "04",
    minutes: "28",
    seconds: "15"
  });

  useEffect(() => {
    const fetchFlashData = async () => {
      try {
        const res = await fetch("/api/flash-deals?active=true", { cache: "no-store" });
        const data = await res.json();
        if (data.success) {
          if (Array.isArray(data.items)) {
            setItems(data.items);
          }
          if (data.campaign) {
            setCampaign(data.campaign);
          }
        }
      } catch (err) {
        console.error("Failed to load flash deals:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlashData();
  }, []);

  // Countdown timer calculation
  useEffect(() => {
    if (!campaign?.endTime) return;

    const calculate = () => {
      const target = new Date(campaign.endTime).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const totalSec = Math.floor(difference / 1000);
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;

      setTimeLeft({
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0")
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [campaign?.endTime]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 320;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  // If campaign is set to inactive, or no items, don't show or hide
  if (!isLoading && campaign && !campaign.isActive) {
    return null;
  }

  const isScrollable = items.length > 4;

  return (
    <section className="max-w-7xl mx-auto px-4" id="flash-sale">
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white text-red-600 rounded-2xl animate-pulse">
              <Flame className="w-7 h-7 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl md:text-3xl font-black">
                  {campaign?.title || "Flash Sale Hot Deals"}
                </h2>
                {campaign?.badge && (
                  <span className="badge badge-warning text-slate-950 font-black text-[10px] uppercase">
                    {campaign.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-white/80">
                {campaign?.subtitle || "Massive discount prices ending very soon!"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Countdown timer UI */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-4 h-4" /> Ends In:
              </span>
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                <span className="bg-white/20 backdrop-blur-md px-2.5 py-1.5 rounded-lg">
                  {timeLeft.hours}h
                </span>
                :
                <span className="bg-white/20 backdrop-blur-md px-2.5 py-1.5 rounded-lg">
                  {timeLeft.minutes}m
                </span>
                :
                <span className="bg-white/20 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-amber-200">
                  {timeLeft.seconds}s
                </span>
              </div>
            </div>

            {/* Left / Right Scroll Buttons (shown when more than 4 items) */}
            {isScrollable && (
              <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md p-1 rounded-2xl border border-white/20">
                <button
                  onClick={() => handleScroll("left")}
                  className="btn btn-circle btn-xs sm:btn-sm bg-white/20 hover:bg-white text-white hover:text-red-600 border-none transition-colors"
                  aria-label="Scroll left"
                  title="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleScroll("right")}
                  className="btn btn-circle btn-xs sm:btn-sm bg-white/20 hover:bg-white text-white hover:text-red-600 border-none transition-colors"
                  aria-label="Scroll right"
                  title="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Loading skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-base-100 rounded-2xl p-4 space-y-3 animate-pulse">
                <div className="h-44 bg-base-300 rounded-xl"></div>
                <div className="h-4 bg-base-300 rounded w-3/4"></div>
                <div className="h-6 bg-base-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-8 text-center text-white/90">
            <p className="font-bold">No active flash sale products at this moment.</p>
          </div>
        ) : isScrollable ? (
          /* Scrollable Carousel Row when > 4 products */
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255, 255, 255, 0.4) transparent"
            }}
          >
            {items.map((p) => {
              const rating = p.rating || 4.8;
              const sold = p.soldStock || 0;
              const total = p.allocatedStock || 50;

              return (
                <div
                  key={p.id}
                  className="min-w-[270px] sm:min-w-[290px] max-w-[310px] shrink-0 snap-start bg-base-100 text-base-content rounded-2xl p-4 space-y-3 shadow-md hover:scale-[1.02] transition-transform flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative h-44 bg-base-200 rounded-xl overflow-hidden">
                      <img
                        src={p.image || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80"}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="badge badge-error text-white font-extrabold absolute top-2 left-2 shadow-sm">
                        {p.discount}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm line-clamp-1" title={p.name}>
                      {p.name}
                    </h3>

                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-lg font-black text-error font-mono">
                          ৳{p.flashPrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-base-content/40 line-through ml-1.5 font-mono">
                          ৳{p.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-amber-500 font-bold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-current" /> {rating}
                      </span>
                    </div>

                    {/* Stock progress bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-base-content/60">
                        <span>Sold: {sold}</span>
                        <span>Stock: {total}</span>
                      </div>
                      <progress
                        className="progress progress-error w-full h-2"
                        value={sold}
                        max={total}
                      ></progress>
                    </div>
                  </div>

                  <Link
                    href={`/products`}
                    className="btn btn-error text-white btn-sm btn-block rounded-xl font-bold gap-1 mt-2 shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" /> Claim Deal
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          /* Standard 1-row Grid when <= 4 products */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((p) => {
              const rating = p.rating || 4.8;
              const sold = p.soldStock || 0;
              const total = p.allocatedStock || 50;

              return (
                <div
                  key={p.id}
                  className="bg-base-100 text-base-content rounded-2xl p-4 space-y-3 shadow-md hover:scale-[1.02] transition-transform flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative h-44 bg-base-200 rounded-xl overflow-hidden">
                      <img
                        src={p.image || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80"}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="badge badge-error text-white font-extrabold absolute top-2 left-2 shadow-sm">
                        {p.discount}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm line-clamp-1" title={p.name}>
                      {p.name}
                    </h3>

                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-lg font-black text-error font-mono">
                          ৳{p.flashPrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-base-content/40 line-through ml-1.5 font-mono">
                          ৳{p.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-amber-500 font-bold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-current" /> {rating}
                      </span>
                    </div>

                    {/* Stock progress bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-base-content/60">
                        <span>Sold: {sold}</span>
                        <span>Stock: {total}</span>
                      </div>
                      <progress
                        className="progress progress-error w-full h-2"
                        value={sold}
                        max={total}
                      ></progress>
                    </div>
                  </div>

                  <Link
                    href={`/products`}
                    className="btn btn-error text-white btn-sm btn-block rounded-xl font-bold gap-1 mt-2 shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" /> Claim Deal
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
