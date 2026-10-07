"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Zap, Flame, Ticket, ShoppingBag, ArrowRight } from "lucide-react";

const singleBanners = [
  {
    id: 1,
    title: "⚡ MEGA FLASH SALE IS LIVE!",
    subtitle: "Up to 70% OFF on Top Tech & Accessories",
    desc: "Limited time offer! Grab premium wireless noise-canceling headphones and smartwatches before stock runs out.",
    badge: "FLASH DEAL",
    badgeColor: "bg-red-500 text-white",
    bgGradient: "from-red-950 via-rose-900 to-slate-950",
    bgImage: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&auto=format&fit=crop&q=80",
    buttonText: "Claim Flash Deals",
    buttonIcon: Zap,
    link: "/products"
  },
  {
    id: 2,
    title: "🔥 TODAY'S BEST DEALS & DISCOUNTS",
    subtitle: "Save Extra \$50 On Orders Over \$150",
    desc: "Exclusive daily offers on laptops, mechanical keyboards, gaming gear, and lifestyle products.",
    badge: "DAILY DEALS",
    badgeColor: "bg-amber-500 text-slate-950 font-black",
    bgGradient: "from-amber-950 via-slate-900 to-indigo-950",
    bgImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1400&auto=format&fit=crop&q=80",
    buttonText: "Shop Best Deals",
    buttonIcon: Flame,
    link: "/products"
  },
  {
    id: 3,
    title: "🎟️ MEGA COUPON CODE: SUPER20",
    subtitle: "Get Instant \$20 Off On Your First Order",
    desc: "Use coupon code SUPER20 at checkout for instant savings. Free express shipping included on all eligible orders.",
    badge: "PROMO COUPON",
    badgeColor: "bg-emerald-500 text-white",
    bgGradient: "from-emerald-950 via-slate-900 to-teal-950",
    bgImage: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400&auto=format&fit=crop&q=80",
    buttonText: "Use Coupon Now",
    buttonIcon: Ticket,
    link: "/products"
  },
  {
    id: 4,
    title: "✨ NEW ARRIVALS & TRENDING COLLECTION",
    subtitle: "Explore 2026 Latest Tech & Fashion Trends",
    desc: "Be the first to get hands on newly launched ultra smartwatches, studio gear, and luxury everyday backpacks.",
    badge: "NEW COLLECTION",
    badgeColor: "bg-indigo-500 text-white",
    bgGradient: "from-indigo-950 via-slate-950 to-purple-950",
    bgImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1400&auto=format&fit=crop&q=80",
    buttonText: "View New Stock",
    buttonIcon: ShoppingBag,
    link: "/products"
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto switch slide every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % singleBanners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % singleBanners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + singleBanners.length) % singleBanners.length);
  };

  const active = singleBanners[currentSlide];
  const ButtonIcon = active.buttonIcon;

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 pt-6">
      {/* Single Full-Width Banner Container */}
      <div className="relative w-full min-h-[360px] md:min-h-[440px] rounded-3xl overflow-hidden shadow-2xl border border-base-300 flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            key={active.id}
            src={active.bgImage}
            alt={active.title}
            className="w-full h-full object-cover animate-fadeIn"
          />
          {/* Gradient Dark Backdrop */}
          <div className={`absolute inset-0 bg-gradient-to-r ${active.bgGradient} opacity-90 backdrop-blur-xs`}></div>
        </div>

        {/* Content Overlay */}
        <div key={active.id} className="relative z-10 p-6 md:p-12 max-w-2xl text-white space-y-4 animate-fadeIn">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${active.badgeColor}`}>
            {active.badge}
          </span>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            {active.title}
          </h1>

          <p className="text-lg md:text-xl font-bold text-amber-300">
            {active.subtitle}
          </p>

          <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-lg hidden sm:block">
            {active.desc}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <Link href={active.link} className="btn btn-primary btn-md md:btn-lg rounded-2xl font-black gap-2 shadow-lg shadow-primary/30">
              <ButtonIcon className="w-5 h-5" /> {active.buttonText}
            </Link>
            <Link href="/categories" className="btn btn-outline btn-md md:btn-lg border-white/40 text-white hover:bg-white hover:text-slate-900 rounded-2xl gap-1 hidden sm:flex">
              Explore Store <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Left Arrow Button */}
        <button
          onClick={prevSlide}
          className="btn btn-circle btn-sm md:btn-md bg-black/40 hover:bg-primary border-none text-white absolute left-3 top-1/2 -translate-y-1/2 z-20 backdrop-blur-md"
          aria-label="Previous Banner"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={nextSlide}
          className="btn btn-circle btn-sm md:btn-md bg-black/40 hover:bg-primary border-none text-white absolute right-3 top-1/2 -translate-y-1/2 z-20 backdrop-blur-md"
          aria-label="Next Banner"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Indicator Dots at bottom */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {singleBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all ${
                currentSlide === idx ? "w-8 bg-primary" : "w-2.5 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
