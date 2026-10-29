"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getStoredWishlist, toggleWishlistItem, WishlistItem } from "@/lib/wishlist-store";
import { 
  Filter, 
  Search, 
  SlidersHorizontal, 
  Star, 
  Heart, 
  ShoppingBag, 
  Grid, 
  List, 
  ChevronDown 
} from "lucide-react";

const initialProducts = [
  {
    id: "prod-1",
    name: "Wireless Noise-Canceling Headphones",
    category: "Electronics",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    inStock: true
  },
  {
    id: "prod-2",
    name: "Ultra Smart Watch Series 7 Pro",
    category: "Gadgets",
    price: 149.00,
    originalPrice: 189.00,
    rating: 4.9,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
    inStock: true
  },
  {
    id: "prod-3",
    name: "Ergonomic Mechanical Gaming Keyboard",
    category: "Accessories",
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.7,
    reviews: 88,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80",
    inStock: true
  },
  {
    id: "prod-4",
    name: "Premium Cotton Crewneck T-Shirt",
    category: "Fashion",
    price: 85.00,
    originalPrice: 95.00,
    rating: 4.6,
    reviews: 64,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80",
    inStock: true
  },
  {
    id: "prod-5",
    name: "Minimalist Wireless Optical Mouse",
    category: "Electronics",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.5,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80",
    inStock: false
  }
];

export default function ProductsPage() {
  const [productsList, setProductsList] = useState(initialProducts);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState(250);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Sync wishlist with central store
  useEffect(() => {
    const updateLocalWishlistIds = () => {
      const items = getStoredWishlist();
      setWishlistItems(items.map((i) => i.id));
    };
    updateLocalWishlistIds();
    window.addEventListener("wishlistUpdated", updateLocalWishlistIds);
    return () => window.removeEventListener("wishlistUpdated", updateLocalWishlistIds);
  }, []);

  useEffect(() => {
    const fetchDbProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          const mapped = data.products.map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category || "General",
            price: Number(p.salePrice || p.price || 0),
            originalPrice: Number(p.regularPrice || (p.price ? p.price * 1.2 : 0)),
            rating: p.rating || 4.8,
            reviews: p.reviewCount || 12,
            image: Array.isArray(p.images) && p.images.length > 0 
              ? p.images[0] 
              : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
            inStock: p.stock > 0 && p.status !== "Out of Stock",
          }));
          setProductsList(mapped);
        }
      } catch (err) {
        console.error("Failed to load products from API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDbProducts();
  }, []);

  const toggleWishlist = (product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    rating?: number;
    reviews?: number;
    image: string;
    inStock?: boolean;
  }) => {
    const isAdded = toggleWishlistItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      rating: product.rating,
      reviews: product.reviews,
      image: product.image,
      inStock: product.inStock,
    });
    if (isAdded) {
      showToast(`❤️ Added "${product.name}" to your wishlist!`);
    } else {
      showToast(`Removed "${product.name}" from your wishlist.`);
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 relative">
      {/* Toast Alert Banner */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce text-xs font-bold">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-200 pb-4">
        <div>
          <h1 className="text-3xl font-black">All Products</h1>
          <div className="text-xs breadcrumbs text-base-content/60">
            <ul>
              <li><Link href="/">Home</Link></li>
              <li>Products Catalog</li>
            </ul>
          </div>
        </div>
        <div className="text-sm font-semibold text-base-content/70">
          Showing <span className="text-primary font-bold">{productsList.length}</span> items
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="space-y-6 bg-base-100 p-6 rounded-2xl border border-base-200 shadow-xs h-fit">
          <div className="flex items-center justify-between border-b border-base-200 pb-3">
            <h3 className="font-bold flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary" /> Filter Products
            </h3>
            <button className="btn btn-ghost btn-xs text-error">Reset</button>
          </div>

          {/* Search filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-base-content/60">Search Keyword</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-sm input-bordered pl-9 w-full focus:outline-none"
              />
            </div>
          </div>

          {/* Category filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-base-content/60">Categories</label>
            <div className="space-y-1.5 text-sm">
              {["All Categories", "Electronics", "Gadgets", "Fashion", "Accessories"].map((cat, idx) => (
                <label key={idx} className="flex items-center gap-2 cursor-pointer text-base-content/80 hover:text-primary">
                  <input type="checkbox" defaultChecked={idx === 0} className="checkbox checkbox-xs checkbox-primary" />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold uppercase text-base-content/60">
              <span>Max Price</span>
              <span className="text-primary font-bold">৳{priceRange}</span>
            </div>
            <input
              type="range"
              min="10"
              max="5000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="range range-xs range-primary"
            />
          </div>

          {/* Rating filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-base-content/60">Rating</label>
            <div className="space-y-1 text-sm">
              {[5, 4, 3].map((stars) => (
                <label key={stars} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="rating-filter" className="radio radio-xs radio-primary" />
                  <div className="flex items-center text-amber-500 text-xs">
                    {Array.from({ length: stars }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                    <span className="ml-1 text-base-content/70">& Up</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button className="btn btn-primary btn-sm btn-block">Apply Filters</button>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3 space-y-6">
          {/* Top Bar Sort & View options */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-100 p-4 rounded-xl border border-base-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-base-content/60">Sort By:</span>
              <select className="select select-sm select-bordered focus:outline-none">
                <option>Featured Products</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Customer Rating</option>
                <option>Newest Arrivals</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-sm btn-square btn-active"><Grid className="w-4 h-4" /></button>
              <button className="btn btn-sm btn-square btn-ghost"><List className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsList.map((product) => (
              <div key={product.id} className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-all group rounded-2xl overflow-hidden">
                <figure className="relative h-48 bg-base-200">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className="btn btn-circle btn-sm bg-base-100/90 hover:bg-base-100 border-none absolute top-3 right-3 text-rose-500 shadow-sm transition-all"
                    title={wishlistItems.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className={`w-4 h-4 ${wishlistItems.includes(product.id) ? "fill-rose-500 text-rose-500" : "text-slate-600"}`} />
                  </button>
                  {!product.inStock && (
                    <span className="badge badge-error absolute top-3 left-3 font-bold text-xs">OUT OF STOCK</span>
                  )}
                </figure>
                <div className="card-body p-4 space-y-2">
                  <span className="text-xs font-semibold text-primary">{product.category}</span>
                  <Link href={`/products/${product.id}`} className="font-bold text-sm line-clamp-1 hover:text-primary">
                    {product.name}
                  </Link>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.rating}</span>
                    <span className="text-base-content/40">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-lg font-black">৳{product.price.toLocaleString()}</span>
                      <span className="text-xs text-base-content/40 line-through ml-1.5">৳{product.originalPrice.toLocaleString()}</span>
                    </div>
                    <Link href={`/products/${product.id}`} className="btn btn-primary btn-sm rounded-xl gap-1">
                      <ShoppingBag className="w-3.5 h-3.5" /> Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center pt-6">
            <div className="join">
              <button className="join-item btn btn-sm">«</button>
              <button className="join-item btn btn-sm btn-active">1</button>
              <button className="join-item btn btn-sm">2</button>
              <button className="join-item btn btn-sm">3</button>
              <button className="join-item btn btn-sm">»</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
