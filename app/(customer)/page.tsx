import Link from "next/link";
import { 
  ShoppingBag, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Headphones, 
  Heart, 
  Star, 
  Eye, 
  Sparkles,
  Percent
} from "lucide-react";

const featuredProducts = [
  {
    id: "1",
    name: "Wireless Noise-Canceling Headphones",
    category: "Electronics",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    badge: "20% OFF",
    badgeColor: "badge-secondary"
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
    badge: "BESTSELLER",
    badgeColor: "badge-primary"
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
    badge: "HOT",
    badgeColor: "badge-error"
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
    badge: "NEW",
    badgeColor: "badge-accent"
  }
];

const categories = [
  { name: "Electronics", count: "1,200+ Items", icon: "💻", color: "bg-blue-50 text-blue-600 border-blue-200" },
  { name: "Fashion & Clothing", count: "850+ Items", icon: "👗", color: "bg-pink-50 text-pink-600 border-pink-200" },
  { name: "Home & Kitchen", count: "640+ Items", icon: "🏠", color: "bg-amber-50 text-amber-600 border-amber-200" },
  { name: "Beauty & Personal Care", count: "420+ Items", icon: "💄", color: "bg-purple-50 text-purple-600 border-purple-200" },
  { name: "Sports & Fitness", count: "310+ Items", icon: "⚽", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  { name: "Books & Toys", count: "550+ Items", icon: "📚", color: "bg-rose-50 text-rose-600 border-rose-200" }
];

export default function CustomerHomePage() {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Super Sale Event Live Now
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Unbeatable Deals On Everything You <span className="text-primary">Love</span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg">
              Explore thousands of top-tier electronics, fashion, and lifestyle products with instant discounts and lightning-fast delivery.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/products" className="btn btn-primary btn-lg shadow-lg shadow-primary/30 gap-2">
                <ShoppingBag className="w-5 h-5" /> Shop Products Now
              </Link>
              <Link href="/categories" className="btn btn-outline btn-lg text-white border-white/40 hover:bg-white hover:text-slate-900 gap-2">
                Browse Categories <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-lg aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80" 
                alt="Super Sale"
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                <div className="bg-base-100/90 backdrop-blur-md p-4 rounded-2xl text-slate-900 flex items-center justify-between w-full shadow-lg">
                  <div>
                    <p className="text-xs font-bold text-primary uppercase">Limited Time Offer</p>
                    <p className="text-lg font-black">Mega Electronics Sale</p>
                  </div>
                  <span className="badge badge-error badge-lg font-extrabold text-white">UP TO 60% OFF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Bar */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-base-100 rounded-2xl border border-base-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><Truck className="w-6 h-6" /></div>
            <div>
              <h4 className="font-bold text-sm">Free Express Delivery</h4>
              <p className="text-xs text-base-content/60">On orders over \$50</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary/10 text-secondary rounded-xl"><RotateCcw className="w-6 h-6" /></div>
            <div>
              <h4 className="font-bold text-sm">30-Day Easy Return</h4>
              <p className="text-xs text-base-content/60">Money-back guarantee</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 text-accent rounded-xl"><ShieldCheck className="w-6 h-6" /></div>
            <div>
              <h4 className="font-bold text-sm">100% Secure Payment</h4>
              <p className="text-xs text-base-content/60">Encrypted checkout</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-info/10 text-info rounded-xl"><Headphones className="w-6 h-6" /></div>
            <div>
              <h4 className="font-bold text-sm">24/7 Customer Support</h4>
              <p className="text-xs text-base-content/60">Dedicated assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Shop by Category</h2>
            <p className="text-sm text-base-content/60">Find what you need in seconds</p>
          </div>
          <Link href="/categories" className="btn btn-sm btn-ghost gap-1 text-primary">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href="/products"
              className={`p-4 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-md text-center flex flex-col items-center justify-center gap-2 ${cat.color}`}
            >
              <span className="text-3xl">{cat.icon}</span>
              <h3 className="font-bold text-sm text-base-content">{cat.name}</h3>
              <span className="text-xs text-base-content/60 font-medium">{cat.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-error text-white rounded-xl"><Zap className="w-5 h-5 fill-current" /></div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Featured Hot Deals</h2>
              <p className="text-sm text-base-content/60">Handpicked top rated items with big discounts</p>
            </div>
          </div>
          <Link href="/products" className="btn btn-sm btn-outline btn-primary">
            Explore All Products
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-lg transition-all group rounded-2xl overflow-hidden">
              <figure className="relative h-56 bg-base-200 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <span className={`badge ${product.badgeColor} font-extrabold absolute top-3 left-3`}>
                  {product.badge}
                </span>
                <button className="btn btn-circle btn-sm bg-base-100/80 hover:bg-base-100 border-none absolute top-3 right-3 text-base-content/70 hover:text-secondary">
                  <Heart className="w-4 h-4" />
                </button>
              </figure>
              <div className="card-body p-4 space-y-2">
                <span className="text-xs font-semibold text-primary uppercase">{product.category}</span>
                <Link href={`/products/${product.id}`} className="font-bold text-base line-clamp-1 hover:text-primary transition-colors">
                  {product.name}
                </Link>

                <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{product.rating}</span>
                  <span className="text-base-content/40 font-normal">({product.reviews} reviews)</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-xl font-black text-base-content">\${product.price}</span>
                    <span className="text-xs text-base-content/40 line-through ml-2">\${product.originalPrice}</span>
                  </div>
                  <Link href={`/products/${product.id}`} className="btn btn-primary btn-sm rounded-xl gap-1">
                    <ShoppingBag className="w-4 h-4" /> View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Promo Banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-primary via-indigo-600 to-secondary text-primary-content rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="badge badge-accent badge-lg font-bold">LIMITED OFFER</span>
            <h2 className="text-3xl md:text-4xl font-black">Get \$20 Coupon On Your First Purchase</h2>
            <p className="text-white/80 text-sm">Subscribe to the SuperDeal newsletter and receive special promo codes, weekly mega deals, and new arrival alerts.</p>
          </div>
          <div className="w-full md:w-auto">
            <div className="join w-full max-w-md">
              <input className="input input-bordered join-item text-slate-900 w-full focus:outline-none" placeholder="Enter your email address..." />
              <button className="btn btn-neutral join-item font-bold px-6">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
