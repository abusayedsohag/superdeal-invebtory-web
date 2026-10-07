"use client";

import Link from "next/link";
import { useState } from "react";
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

const allProducts = [
  {
    id: "1",
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
    id: "2",
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
    id: "3",
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
    id: "4",
    name: "Premium Leather Everyday Backpack",
    category: "Fashion",
    price: 75.50,
    originalPrice: 95.00,
    rating: 4.6,
    reviews: 64,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
    inStock: true
  },
  {
    id: "5",
    name: "Minimalist Wireless Optical Mouse",
    category: "Electronics",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.5,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80",
    inStock: true
  },
  {
    id: "6",
    name: "High Fidelity Portable Bluetooth Speaker",
    category: "Electronics",
    price: 119.00,
    originalPrice: 159.00,
    rating: 4.8,
    reviews: 155,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80",
    inStock: false
  }
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState(250);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
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
          Showing <span className="text-primary font-bold">{allProducts.length}</span> items
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
              <span className="text-primary font-bold">\${priceRange}</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
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
            {allProducts.map((product) => (
              <div key={product.id} className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-all group rounded-2xl overflow-hidden">
                <figure className="relative h-48 bg-base-200">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <button className="btn btn-circle btn-sm bg-base-100/80 hover:bg-base-100 border-none absolute top-3 right-3 text-base-content/70 hover:text-secondary">
                    <Heart className="w-4 h-4" />
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
                      <span className="text-lg font-black">\${product.price}</span>
                      <span className="text-xs text-base-content/40 line-through ml-1.5">\${product.originalPrice}</span>
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
