"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Grid,
  Sparkles,
  Search,
  FolderTree,
  PackageOpen,
  Layers,
} from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  image?: string;
  icon?: string;
  itemCount?: number;
  status?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  icon?: string;
  itemCount?: number;
  status?: string;
  subcategories?: Subcategory[];
}

// Fallback curated categories if DB is empty or initially setting up
const fallbackCategories: Category[] = [
  {
    id: "cat-1",
    name: "Electronics & Computers",
    slug: "electronics",
    icon: "laptop",
    itemCount: 1450,
    status: "Active",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format&fit=crop&q=80",
    subcategories: [
      { id: "sub-101", name: "Laptops & PC", slug: "laptops-pc", itemCount: 420, status: "Active" },
      { id: "sub-102", name: "Headphones & Audio", slug: "audio", itemCount: 310, status: "Active" },
      { id: "sub-103", name: "Smartphones & Tablets", slug: "smartphones", itemCount: 510, status: "Active" },
      { id: "sub-104", name: "Monitors", slug: "monitors", itemCount: 110, status: "Active" },
      { id: "sub-105", name: "Gaming Accessories", slug: "gaming", itemCount: 100, status: "Active" },
    ],
  },
  {
    id: "cat-2",
    name: "Fashion & Apparel",
    slug: "fashion",
    icon: "shirt",
    itemCount: 920,
    status: "Active",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&auto=format&fit=crop&q=80",
    subcategories: [
      { id: "sub-201", name: "Men's Wear", slug: "mens-wear", itemCount: 320, status: "Active" },
      { id: "sub-202", name: "Women's Wear", slug: "womens-wear", itemCount: 390, status: "Active" },
      { id: "sub-203", name: "Shoes & Sneakers", slug: "shoes", itemCount: 110, status: "Active" },
      { id: "sub-204", name: "Watches & Jewelry", slug: "watches", itemCount: 100, status: "Active" },
    ],
  },
  {
    id: "cat-3",
    name: "Home & Appliances",
    slug: "home",
    icon: "home",
    itemCount: 780,
    status: "Active",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=80",
    subcategories: [
      { id: "sub-301", name: "Kitchen Appliances", slug: "kitchen", itemCount: 280, status: "Active" },
      { id: "sub-302", name: "Furniture", slug: "furniture", itemCount: 190, status: "Active" },
      { id: "sub-303", name: "Home Decor", slug: "decor", itemCount: 160, status: "Active" },
      { id: "sub-304", name: "Lighting", slug: "lighting", itemCount: 150, status: "Active" },
    ],
  },
  {
    id: "cat-4",
    name: "Beauty & Health",
    slug: "beauty",
    icon: "sparkles",
    itemCount: 530,
    status: "Active",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80",
    subcategories: [
      { id: "sub-401", name: "Skincare", slug: "skincare", itemCount: 210, status: "Active" },
      { id: "sub-402", name: "Makeup", slug: "makeup", itemCount: 140, status: "Active" },
      { id: "sub-403", name: "Haircare", slug: "haircare", itemCount: 180, status: "Active" },
    ],
  },
  {
    id: "cat-5",
    name: "Sports & Outdoors",
    slug: "sports",
    icon: "dumbbell",
    itemCount: 410,
    status: "Active",
    image: "https://images.unsplash.com/photo-1517649763962-0c623266010b?w=500&auto=format&fit=crop&q=80",
    subcategories: [
      { id: "sub-501", name: "Gym & Fitness", slug: "fitness", itemCount: 180, status: "Active" },
      { id: "sub-502", name: "Cycling & Bikes", slug: "cycling", itemCount: 110, status: "Active" },
      { id: "sub-503", name: "Camping & Hiking", slug: "camping", itemCount: 120, status: "Active" },
    ],
  },
  {
    id: "cat-6",
    name: "Books & Stationeries",
    slug: "books",
    icon: "book-open",
    itemCount: 620,
    status: "Active",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=80",
    subcategories: [
      { id: "sub-601", name: "Fiction & Novels", slug: "novels", itemCount: 250, status: "Active" },
      { id: "sub-602", name: "Educational Books", slug: "education", itemCount: 210, status: "Active" },
      { id: "sub-603", name: "Office Supplies", slug: "office", itemCount: 160, status: "Active" },
    ],
  },
];

function CategoryIcon({ icon }: { icon?: string }) {
  if (!icon) return <Grid className="w-6 h-6 text-white" />;

  // Check if string contains emoji
  const hasEmoji = /\p{Extended_Pictographic}/u.test(icon) || (icon.length <= 4 && !/^[a-z0-9-]+$/i.test(icon));
  if (hasEmoji) {
    return <span className="text-2xl leading-none">{icon}</span>;
  }

  try {
    return <DynamicIcon name={icon as any} size={24} className="text-white" />;
  } catch {
    return <Grid className="w-6 h-6 text-white" />;
  }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFromDb, setIsFromDb] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories", { cache: "no-store" });
      const data = await res.json();

      if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
        const activeCategories = data.categories.filter(
          (c: Category) => c.status !== "Inactive"
        );
        setCategories(activeCategories.length > 0 ? activeCategories : fallbackCategories);
        setIsFromDb(true);
      } else {
        setCategories(fallbackCategories);
        setIsFromDb(false);
      }
    } catch (err) {
      console.error("Failed to fetch categories from DB:", err);
      setCategories(fallbackCategories);
      setIsFromDb(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    const term = searchTerm.toLowerCase();

    return categories.filter((cat) => {
      const matchName = cat.name.toLowerCase().includes(term);
      const matchSlug = cat.slug?.toLowerCase().includes(term);
      const matchSub = cat.subcategories?.some((s) =>
        s.name.toLowerCase().includes(term)
      );
      return matchName || matchSlug || matchSub;
    });
  }, [categories, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Header & Search Bar */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          Explore All Categories
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          Browse through our extensive collections organized from inventory. Find top-rated tech, lifestyle, and home gear with verified deals.
        </p>

        {/* Real-time Category Search Input */}
        <div className="relative max-w-md mx-auto pt-2">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories (e.g. Laptops, Fashion, Kitchen)..."
            className="input input-bordered input-sm sm:input-md w-full pl-10 pr-10 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-primary shadow-xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs animate-pulse space-y-4"
            >
              <div className="h-48 bg-slate-200 w-full"></div>
              <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-slate-200 rounded-full w-20"></div>
                  <div className="h-6 bg-slate-200 rounded-full w-24"></div>
                </div>
                <div className="h-9 bg-slate-200 rounded-xl w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        /* Empty Search Results */
        <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
          <PackageOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-extrabold text-lg text-slate-800">No Categories Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn't find any categories matching "{searchTerm}". Try another keyword or clear search filter.
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="btn btn-sm btn-primary rounded-xl"
          >
            Clear Search Filter
          </button>
        </div>
      ) : (
        /* Categories Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => {
            const activeSubs = (cat.subcategories || []).filter(
              (s) => s.status !== "Inactive"
            );

            const displayImage =
              cat.image ||
              "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format&fit=crop&q=80";

            return (
              <div
                key={cat.id}
                className="card bg-base-100 border border-base-200 shadow-xs hover:shadow-xl hover:border-primary/30 transition-all rounded-3xl overflow-hidden group flex flex-col justify-between"
              >
                {/* Image Banner with Category Header Overlay */}
                <figure className="relative h-48 bg-base-200 overflow-hidden shrink-0">
                  <img
                    src={displayImage}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/40 to-transparent flex items-end p-5">
                    <div className="flex items-center justify-between w-full text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shrink-0">
                          <CategoryIcon icon={cat.icon} />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-lg tracking-tight line-clamp-1">
                            {cat.name}
                          </h3>
                          <span className="text-[11px] text-white/80 font-mono">
                            /{cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-")}
                          </span>
                        </div>
                      </div>

                      {cat.itemCount !== undefined && (
                        <span className="badge badge-sm badge-accent font-bold shrink-0">
                          {cat.itemCount} Items
                        </span>
                      )}
                    </div>
                  </div>
                </figure>

                {/* Subcategories & Action Links */}
                <div className="card-body p-5 space-y-4 flex flex-col justify-between grow">
                  {/* Subcategories Badges */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                      <FolderTree className="w-3.5 h-3.5 text-primary" />
                      <span>Subcategories ({activeSubs.length})</span>
                    </div>

                    {activeSubs.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {activeSubs.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/products?category=${encodeURIComponent(sub.name)}`}
                            className="badge badge-outline hover:badge-primary text-[11px] font-semibold py-2.5 px-3 rounded-lg transition-colors cursor-pointer"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        Browse all items in this collection
                      </p>
                    )}
                  </div>

                  {/* Browse Products Button */}
                  <div className="pt-2 border-t border-base-200">
                    <Link
                      href={`/products?category=${encodeURIComponent(cat.name)}`}
                      className="btn btn-sm btn-primary rounded-xl gap-2 w-full font-bold shadow-sm shadow-primary/20 group-hover:btn-accent transition-colors"
                    >
                      <span>Browse {cat.name.split("&")[0].trim()}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Quick Management Banner */}
      <div className="bg-slate-100 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">Manage Store Categories</h4>
            <p className="text-xs text-slate-500">
              Admin can add, edit, reorganize subcategories, change icons, and delete categories directly in the database.
            </p>
          </div>
        </div>

        <Link
          href="/admin/categories"
          className="btn btn-xs sm:btn-sm btn-outline border-slate-300 hover:btn-primary gap-1.5 font-bold shrink-0"
        >
          <FolderTree className="w-3.5 h-3.5" /> Open Category Manager
        </Link>
      </div>
    </div>
  );
}
