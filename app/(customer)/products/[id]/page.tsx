"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addToCart } from "@/lib/cart-store";
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
  ThumbsUp,
  CheckCircle2,
  MessageSquare,
  Send,
  Sparkles
} from "lucide-react";
import ProductRecommendation from "@/components/customer/ProductRecommendation";

function ProductDetailContent() {
  const router = useRouter();
  const params = useParams();
  const routeId = params?.id as string;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("Space Gray");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Reviews dynamic state
  const [productReviews, setProductReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    customerName: "",
    customerEmail: "",
    rating: 5,
    comment: "",
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    const msg = !isWishlisted ? `❤️ Added "${product.name}" to your Wishlist!` : `Removed "${product.name}" from your Wishlist.`;
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddToCart = (redirect = false) => {
    const result = addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: quantity,
      maxStock: Math.max(1, product.stock),
      sku: product.sku,
      image: product.images[selectedImage] || product.images[0],
      color: selectedColor
    });

    setToastMsg(result.message);
    setTimeout(() => setToastMsg(null), 3000);

    if (redirect) {
      router.push("/cart");
    }
  };

  const handleBuyNow = () => {
    handleAddToCart(false);
    router.push("/checkout");
  };

  const [product, setProduct] = useState({
    id: "prod-1",
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
  });

  useEffect(() => {
    if (!routeId) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${routeId}`);
        const data = await res.json();
        if (data.success && data.product) {
          const p = data.product;
          setProduct({
            id: p.id,
            name: p.name,
            sku: p.sku || "",
            brand: p.brand || "SoundMaster",
            category: p.category || "General",
            price: Number(p.salePrice || p.price || 0),
            originalPrice: Number(p.regularPrice || (p.price ? p.price * 1.25 : 0)),
            rating: p.rating || 4.8,
            reviewCount: p.reviewCount || 124,
            stock: Number(p.stock || 0),
            images: Array.isArray(p.images) && p.images.length > 0 
              ? p.images 
              : ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"],
            colors: Array.isArray(p.variants) && p.variants.length > 0
              ? Array.from(new Set(p.variants.map((v: any) => v.color).filter(Boolean))) as string[]
              : ["Space Gray", "Matte Black", "Silver"],
            features: [
              p.shortDescription || "High performance materials with superior durability.",
              "100% Genuine and authentic product with manufacturer warranty.",
              "Fast priority courier shipping available nationwide.",
              "Easy 7-day hassle-free return and replacement policy."
            ]
          });
        }
      } catch (err) {
        console.error("Failed to fetch product by id:", err);
      }
    };
    fetchProduct();
  }, [routeId]);

  // Fetch Approved Reviews for this Product
  const fetchReviews = async () => {
    if (!routeId) return;
    setLoadingReviews(true);
    try {
      const res = await fetch(`/api/reviews?productId=${routeId}&status=Approved`);
      const data = await res.json();
      if (data.success && Array.isArray(data.reviews)) {
        setProductReviews(data.reviews);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [routeId]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.customerName.trim() || !reviewForm.comment.trim()) {
      alert("Please enter your name and a review comment.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          customerName: reviewForm.customerName.trim(),
          customerEmail: reviewForm.customerEmail.trim(),
          rating: reviewForm.rating,
          comment: reviewForm.comment.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReviewSubmitted(true);
        setReviewForm({ customerName: "", customerEmail: "", rating: 5, comment: "" });
        setToastMsg("🎉 Thank you! Your review has been submitted for moderation.");
        setTimeout(() => setToastMsg(null), 4000);
        fetchReviews();
      } else {
        alert(data.message || "Failed to submit review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Something went wrong while submitting your review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Structured Data Schemas for SEO
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": "Premium High-Fidelity Wireless Headphones with active noise cancellation, long battery life, and ergonomic ear cups.",
    "sku": product.sku,
    "mpn": product.sku,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "offers": {
      "@type": "Offer",
      "url": `https://superdeal.com/products/${product.id}`,
      "priceCurrency": "USD",
      "price": product.price,
      "priceValidUntil": "2026-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "SuperDeal"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Sarah Connor"
        },
        "reviewBody": "Outstanding audio quality and exceptional battery life! Active noise cancellation works like magic."
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://superdeal.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": "https://superdeal.com/products"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.category,
        "item": `https://superdeal.com/categories/${product.category.toLowerCase()}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": product.name,
        "item": `https://superdeal.com/products/${product.id}`
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10 relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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
              <span className="text-3xl font-black text-primary">৳{product.price.toLocaleString()}</span>
              <span className="text-sm text-base-content/40 line-through ml-3">৳{product.originalPrice.toLocaleString()}</span>
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
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`btn btn-sm ${selectedColor === color ? "btn-primary" : "btn-outline border-base-300"}`}
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
                    disabled={quantity >= product.stock}
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
                <button 
                  onClick={() => handleAddToCart(true)} 
                  className="btn btn-primary btn-md rounded-xl gap-2 font-bold shadow-md shadow-primary/20"
                >
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </button>
                <button 
                  onClick={handleBuyNow} 
                  className="btn btn-secondary btn-md rounded-xl font-bold shadow-md shadow-secondary/20"
                >
                  Buy Now
                </button>
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
            Reviews ({productReviews.length > 0 ? productReviews.length : product.reviewCount})
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
          <div className="space-y-8">
            {/* Reviews Header & Write Review CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-base-200">
              <div>
                <h3 className="text-lg font-bold text-base-content">Customer Reviews</h3>
                <p className="text-xs text-base-content/60">Real verified feedback from genuine customers</p>
              </div>
              <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                <span className="text-base font-black text-amber-600">
                  {productReviews.length > 0 
                    ? (productReviews.reduce((acc, r) => acc + (r.rating || 5), 0) / productReviews.length).toFixed(1)
                    : product.rating}
                </span>
                <span className="text-xs text-base-content/60 font-medium">
                  ({productReviews.length} approved)
                </span>
              </div>
            </div>

            {/* Write a Review Box */}
            <div className="bg-gradient-to-br from-base-200/50 to-base-100 p-5 rounded-2xl border border-base-200 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h4 className="font-bold text-sm text-base-content">Share Your Experience</h4>
              </div>

              {reviewSubmitted ? (
                <div className="p-4 bg-success/10 border border-success/20 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-success mx-auto" />
                  <h5 className="font-bold text-sm text-success">Review Submitted Successfully!</h5>
                  <p className="text-xs text-base-content/70">
                    Thank you! Your feedback will appear here as soon as our moderation team verifies it.
                  </p>
                  <button 
                    onClick={() => setReviewSubmitted(false)}
                    className="btn btn-xs btn-outline btn-success mt-2"
                  >
                    Submit Another Review
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="label py-1">
                        <span className="label-text text-xs font-semibold">Your Name *</span>
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Tanvir Ahmed" 
                        value={reviewForm.customerName}
                        onChange={(e) => setReviewForm({ ...reviewForm, customerName: e.target.value })}
                        className="input input-sm input-bordered w-full rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="label py-1">
                        <span className="label-text text-xs font-semibold">Email Address (Optional)</span>
                      </label>
                      <input 
                        type="email" 
                        placeholder="e.g. tanvir@gmail.com" 
                        value={reviewForm.customerEmail}
                        onChange={(e) => setReviewForm({ ...reviewForm, customerEmail: e.target.value })}
                        className="input input-sm input-bordered w-full rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label py-1">
                      <span className="label-text text-xs font-semibold">Rating *</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="p-1 hover:scale-125 transition-transform"
                        >
                          <Star 
                            className={`w-6 h-6 ${
                              star <= reviewForm.rating 
                                ? "fill-amber-400 text-amber-400" 
                                : "text-base-content/20 hover:text-amber-300"
                            }`} 
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-amber-500 ml-2">
                        {reviewForm.rating} / 5 Stars
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="label py-1">
                      <span className="label-text text-xs font-semibold">Your Review *</span>
                    </label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="What did you like or dislike about this product? How is the quality?"
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className="textarea textarea-bordered w-full rounded-xl text-sm"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmittingReview}
                    className="btn btn-primary btn-sm rounded-xl gap-2 font-bold shadow-md shadow-primary/20"
                  >
                    {isSubmittingReview ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Submit Review
                  </button>
                </form>
              )}
            </div>

            {/* List of Approved Reviews */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-base-content">
                Verified Reviews ({productReviews.length})
              </h4>

              {loadingReviews ? (
                <div className="py-8 text-center text-slate-400">
                  <span className="loading loading-spinner loading-sm text-primary"></span>
                  <p className="text-xs mt-2">Loading reviews...</p>
                </div>
              ) : productReviews.length === 0 ? (
                <div className="p-8 text-center bg-base-200/30 rounded-2xl border border-dashed border-base-300">
                  <MessageSquare className="w-8 h-8 text-base-content/30 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-base-content/70">No reviews yet for this product</p>
                  <p className="text-xs text-base-content/50">Be the first customer to share your thoughts!</p>
                </div>
              ) : (
                productReviews.map((rev) => (
                  <div key={rev.id || rev._id} className="space-y-3 p-4 bg-base-200/40 rounded-2xl border border-base-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-primary/20 text-primary font-black rounded-full w-9 h-9 flex items-center justify-center text-xs">
                            {rev.customerName?.slice(0, 2).toUpperCase() || "US"}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-base-content">{rev.customerName}</h4>
                            {rev.isVerifiedPurchase && (
                              <span className="badge badge-success badge-xs gap-1 text-[10px] text-white">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Verified Buyer
                              </span>
                            )}
                          </div>
                          <div className="flex items-center text-amber-500 text-xs mt-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3.5 h-3.5 ${
                                  i < (rev.rating || 5) ? "fill-amber-400 text-amber-400" : "text-base-content/20"
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-base-content/50">
                        {rev.dateFormatted || (rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : "Recent")}
                      </span>
                    </div>

                    <p className="text-xs text-base-content/80 leading-relaxed pl-12">
                      {rev.comment}
                    </p>

                    {/* Official Store Reply if any */}
                    {rev.adminReply && (
                      <div className="ml-12 p-3 bg-primary/5 rounded-xl border border-primary/20 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Official SuperDeal Store Response
                        </div>
                        <p className="text-xs text-base-content/80 italic">
                          "{rev.adminReply}"
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Smart Product Recommendation Engine */}
      <ProductRecommendation currentProductTitle="Gaming Mouse" />
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto py-20 text-center space-y-3">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-sm text-slate-500 font-medium">Loading product...</p>
        </div>
      }
    >
      <ProductDetailContent />
    </Suspense>
  );
}
