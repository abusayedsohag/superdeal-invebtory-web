"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Share2, 
  Minus, 
  Plus, 
  Check, 
  ThumbsUp 
} from "lucide-react";

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    const msg = !isWishlisted ? `❤️ Added "${product.name}" to your Wishlist!` : `Removed "${product.name}" from your Wishlist.`;
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const product = {
    id: "1",
    name: "Wireless Noise-Canceling Premium Headphones",
    sku: "SD-HEAD-9081",
    brand: "SoundMaster",
    category: "Electronics",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.8,
    reviewCount: 124,
    stock: 18,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80"
    ],
    colors: ["Space Gray", "Matte Black", "Silver"],
    features: [
      "Active Noise Cancellation (ANC) with Dual Microphones",
      "Up to 40 Hours Continuous Battery Playtime",
      "Bluetooth 5.3 Ultra Low Latency Wireless Connection",
      "Plush Memory Foam Ear Cushions for All-Day Comfort"
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10 relative">
      {/* Toast Alert Banner */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce text-xs font-bold">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          <span>{toastMsg}</span>
        </div>
      )}
      {/* Breadcrumbs */}
      <div className="text-xs breadcrumbs text-base-content/60">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/products">Products</Link></li>
          <li><Link href="/products">Electronics</Link></li>
          <li>{product.name}</li>
        </ul>
      </div>

      {/* Main Product Info Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-base-100 p-6 rounded-3xl border border-base-200 shadow-xs">
        {/* Left: Product Images Gallery */}
        <div className="space-y-4">
          <div className="relative h-96 w-full bg-base-200 rounded-2xl overflow-hidden border border-base-200">
            <img 
              src={product.images[selectedImage]} 
              alt={product.name} 
              className="w-full h-full object-cover" 
            />
            <span className="badge badge-secondary font-bold absolute top-4 left-4">20% OFF</span>
          </div>
          <div className="flex items-center gap-3">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx ? "border-primary ring-2 ring-primary/30" : "border-base-200 opacity-70 hover:opacity-100"}`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-base-content/60 mb-2">
              <span>Brand: <strong className="text-primary">{product.brand}</strong></span>
              <span>SKU: {product.sku}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-base-content leading-tight">
              {product.name}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center text-amber-500 text-sm font-bold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="ml-1 text-base-content font-bold">{product.rating}</span>
              </div>
              <span className="text-xs text-base-content/60">({product.reviewCount} customer reviews)</span>
              <span className="badge badge-success badge-sm font-semibold gap-1 text-white">
                <Check className="w-3 h-3" /> In Stock ({product.stock} units left)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-base-200/60 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-3xl font-black text-primary">\${product.price}</span>
              <span className="text-sm text-base-content/40 line-through ml-3">\${product.originalPrice}</span>
            </div>
            <span className="text-xs font-bold text-success bg-success/10 px-3 py-1 rounded-full">
              You Save \${(product.originalPrice - product.price).toFixed(2)}
            </span>
          </div>

          {/* Key Features Bullet List */}
          <ul className="space-y-2 text-xs text-base-content/80">
            {product.features.map((feat, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>

          {/* Color Variant Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-base-content/60">Select Color</label>
            <div className="flex items-center gap-3">
              {product.colors.map((color, idx) => (
                <button 
                  key={idx} 
                  className={`btn btn-sm ${idx === 0 ? "btn-primary" : "btn-outline border-base-300"}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="join border border-base-300 rounded-xl">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="btn btn-sm btn-ghost join-item"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="join-item px-4 flex items-center font-bold text-sm bg-base-100">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)} 
                  className="btn btn-sm btn-ghost join-item"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button 
                onClick={toggleWishlist}
                className={`btn btn-circle btn-sm ${isWishlisted ? "btn-secondary" : "btn-outline"}`}
                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-white text-white" : "text-rose-500"}`} />
              </button>
              <button className="btn btn-outline btn-circle btn-sm">
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/cart" className="btn btn-primary btn-md rounded-xl gap-2 font-bold">
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </Link>
              <Link href="/checkout" className="btn btn-secondary btn-md rounded-xl font-bold">
                Buy Now
              </Link>
            </div>
          </div>

          {/* Assurance Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-base-200 text-center text-xs text-base-content/70">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-5 h-5 text-primary" />
              <span>Fast Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-5 h-5 text-primary" />
              <span>30 Days Return</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span>2 Year Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description, Specifications, Reviews */}
      <div className="bg-base-100 rounded-3xl border border-base-200 p-6 space-y-6">
        <div className="tabs tabs-boxed bg-base-200/60 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab("description")} 
            className={`tab ${activeTab === "description" ? "tab-active font-bold bg-primary text-primary-content" : ""}`}
          >
            Product Description
          </button>
          <button 
            onClick={() => setActiveTab("specs")} 
            className={`tab ${activeTab === "specs" ? "tab-active font-bold bg-primary text-primary-content" : ""}`}
          >
            Specifications
          </button>
          <button 
            onClick={() => setActiveTab("reviews")} 
            className={`tab ${activeTab === "reviews" ? "tab-active font-bold bg-primary text-primary-content" : ""}`}
          >
            Reviews ({product.reviewCount})
          </button>
        </div>

        {activeTab === "description" && (
          <div className="space-y-4 text-sm text-base-content/80 leading-relaxed">
            <h3 className="text-lg font-bold text-base-content">Immersive Sound Experience Anywhere You Go</h3>
            <p>
              Designed with audiophiles in mind, the Wireless Noise-Canceling Premium Headphones deliver crystal clear high frequencies, rich mid-tones, and deep impactful bass. With custom 40mm drivers and advanced digital signal processing, every song sounds like a live performance.
            </p>
            <p>
              The ergonomic lightweight frame ensures comfortable wear during long work hours or long-haul flights. Built-in fast charging gives you 5 hours of playback from a quick 10-minute charge.
            </p>
          </div>
        )}

        {activeTab === "specs" && (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-sm">
              <tbody>
                <tr><td className="font-bold w-48">Driver Size</td><td>40mm Dynamic Neodymium</td></tr>
                <tr><td className="font-bold">Battery Life</td><td>Up to 40 Hours (ANC On)</td></tr>
                <tr><td className="font-bold">Charging Port</td><td>USB-C Fast Charging</td></tr>
                <tr><td className="font-bold">Bluetooth Version</td><td>v5.3 (Range: 15m)</td></tr>
                <tr><td className="font-bold">Weight</td><td>250g</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            {/* Review Item */}
            <div className="space-y-3 p-4 bg-base-200/40 rounded-2xl border border-base-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-8">
                      <span className="text-xs">AH</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Alex Harrison</h4>
                    <div className="flex items-center text-amber-500 text-xs">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-base-content/50">2 days ago</span>
              </div>
              <p className="text-xs text-base-content/80">
                Absolute game changer for remote work! The noise cancellation blocks out background noise completely. Battery lasts almost all week.
              </p>
              <button className="btn btn-ghost btn-xs gap-1 text-base-content/60">
                <ThumbsUp className="w-3 h-3" /> Helpful (14)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
