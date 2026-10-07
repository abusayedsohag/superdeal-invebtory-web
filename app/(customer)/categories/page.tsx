import Link from "next/link";
import { ArrowRight, Grid, Sparkles } from "lucide-react";

const mainCategories = [
  {
    title: "Electronics & Computers",
    icon: "💻",
    itemCount: "1,450 Items",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format&fit=crop&q=80",
    subcategories: ["Laptops & PC", "Headphones & Audio", "Smartphones & Tablets", "Monitors", "Gaming Accessories"]
  },
  {
    title: "Fashion & Apparel",
    icon: "👗",
    itemCount: "920 Items",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&auto=format&fit=crop&q=80",
    subcategories: ["Men's Wear", "Women's Wear", "Shoes & Sneakers", "Watches & Jewelry", "Bags & Luggage"]
  },
  {
    title: "Home & Appliances",
    icon: "🏠",
    itemCount: "780 Items",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=80",
    subcategories: ["Kitchen Appliances", "Furniture", "Home Decor", "Lighting", "Bedding & Bath"]
  },
  {
    title: "Beauty & Health",
    icon: "💄",
    itemCount: "530 Items",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80",
    subcategories: ["Skincare", "Makeup", "Haircare", "Perfumes & Fragrances", "Personal Hygiene"]
  },
  {
    title: "Sports & Outdoors",
    icon: "⚽",
    itemCount: "410 Items",
    image: "https://images.unsplash.com/photo-1517649763962-0c623266010b?w=500&auto=format&fit=crop&q=80",
    subcategories: ["Gym & Fitness", "Cycling & Bikes", "Camping & Hiking", "Sportswear", "Yoga & Outdoor"]
  },
  {
    title: "Books & Stationeries",
    icon: "📚",
    itemCount: "620 Items",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=80",
    subcategories: ["Fiction & Novels", "Educational Books", "Office Supplies", "Art & Craft", "Notebooks"]
  }
];

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="badge badge-primary badge-outline font-bold">DISCOVER PRODUCTS</span>
        <h1 className="text-4xl font-black tracking-tight">Explore All Categories</h1>
        <p className="text-base-content/70 text-sm">
          Browse through our curated collection of product categories and discover top-rated items with discount offers.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mainCategories.map((cat, idx) => (
          <div key={idx} className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-lg transition-all rounded-3xl overflow-hidden group">
            <figure className="relative h-48 bg-base-200">
              <img src={cat.image} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex items-end p-4">
                <div className="flex items-center justify-between w-full text-white">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl p-2 bg-white/20 backdrop-blur-md rounded-xl">{cat.icon}</span>
                    <h3 className="font-extrabold text-lg">{cat.title}</h3>
                  </div>
                  <span className="badge badge-accent font-bold">{cat.itemCount}</span>
                </div>
              </div>
            </figure>
            <div className="card-body p-5 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {cat.subcategories.map((sub, sIdx) => (
                  <Link key={sIdx} href="/products" className="badge badge-outline hover:badge-primary text-xs cursor-pointer py-2">
                    {sub}
                  </Link>
                ))}
              </div>
              <div className="pt-2 border-t border-base-200 flex justify-end">
                <Link href="/products" className="btn btn-sm btn-primary rounded-xl gap-2 w-full">
                  Browse {cat.title.split("&")[0]} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
