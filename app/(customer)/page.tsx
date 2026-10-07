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
  Percent,
  Clock,
  Flame,
  TrendingUp,
  Award,
  CheckCircle2,
  Tag,
  Quote
} from "lucide-react";

// Fake Data Definitions
const heroBanners = [
  {
    title: "Mega Electronics & Tech Sale",
    subtitle: "Up to 60% OFF on Premium Gadgets",
    desc: "Upgrade your workstation with top-tier wireless headphones, smartwatches, and mechanical keyboards.",
    tag: "SPECIAL LAUNCH",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80",
    buttonText: "Shop Electronics",
    link: "/products"
  }
];

const flashSaleProducts = [
  {
    id: "fs1",
    name: "Ultra Wireless Gaming Headset ANC",
    price: 129.99,
    originalPrice: 229.99,
    discount: "43% OFF",
    rating: 4.9,
    reviews: 340,
    sold: 45,
    totalStock: 50,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "fs2",
    name: "Smart Watch Ultra Titanium 49mm",
    price: 189.00,
    originalPrice: 299.00,
    discount: "37% OFF",
    rating: 4.8,
    reviews: 512,
    sold: 88,
    totalStock: 100,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "fs3",
    name: "Compact Mechanical RGB Keyboard",
    price: 69.99,
    originalPrice: 119.99,
    discount: "41% OFF",
    rating: 4.7,
    reviews: 189,
    sold: 28,
    totalStock: 30,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "fs4",
    name: "Ergonomic Vertical Wireless Mouse",
    price: 34.50,
    originalPrice: 59.99,
    discount: "42% OFF",
    rating: 4.6,
    reviews: 94,
    sold: 19,
    totalStock: 25,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80"
  }
];

const todaysDeals = [
  {
    id: "td1",
    name: "High-Fidelity Portable Speaker 30W",
    price: 79.99,
    originalPrice: 119.99,
    rating: 4.8,
    reviews: 142,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80",
    badge: "24h Deal"
  },
  {
    id: "td2",
    name: "4K Ultra HD Streaming Camera Cam",
    price: 112.00,
    originalPrice: 160.00,
    rating: 4.7,
    reviews: 88,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80",
    badge: "Today Only"
  },
  {
    id: "td3",
    name: "Leather Executive Office Chair",
    price: 210.00,
    originalPrice: 320.00,
    rating: 4.9,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=500&auto=format&fit=crop&q=80",
    badge: "Save \$110"
  }
];

const featuredProducts = [
  {
    id: "1",
    name: "Wireless Noise-Canceling Premium Headphones",
    category: "Electronics",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    badge: "FEATURED",
    badgeColor: "badge-primary"
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
    badge: "HOT",
    badgeColor: "badge-secondary"
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
    badge: "TOP PICK",
    badgeColor: "badge-accent"
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
    badge: "POPULAR",
    badgeColor: "badge-info"
  }
];

const bestSellingProducts = [
  {
    id: "bs1",
    name: "Minimalist Wireless Optical Mouse",
    sales: "3.4k Sold",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "bs2",
    name: "Aluminum Laptop Stand Riser",
    sales: "2.8k Sold",
    price: 45.00,
    originalPrice: 65.00,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "bs3",
    name: "Noise Isolating Earbuds",
    sales: "2.1k Sold",
    price: 49.99,
    originalPrice: 79.99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "bs4",
    name: "Waterproof Sport Smartband",
    sales: "1.9k Sold",
    price: 39.00,
    originalPrice: 59.00,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&auto=format&fit=crop&q=80"
  }
];

const newArrivals = [
  {
    id: "na1",
    name: "Studio Monitor Headphones Gen 2",
    price: 249.99,
    tag: "JUST ARRIVED",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "na2",
    name: "Dual Wireless Charging Pad 15W",
    price: 39.99,
    tag: "NEW RELEASE",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1622445268465-843857458631?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "na3",
    name: "Ultra Thin Mechanical Keyboard",
    price: 119.00,
    tag: "LIMITED EDITION",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "na4",
    name: "Smart Hydration Water Bottle",
    price: 49.50,
    tag: "NEW",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80"
  }
];

const trendingProducts = [
  {
    id: "tp1",
    name: "Smart Ambient Desk Lamp LED",
    views: "15.4k views this week",
    price: 54.99,
    originalPrice: 74.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "tp2",
    name: "Wireless ANC Earbuds Pro",
    views: "12.8k views this week",
    price: 99.00,
    originalPrice: 139.00,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "tp3",
    name: "Multi-Port USB-C Hub 8-in-1",
    views: "9.2k views this week",
    price: 42.00,
    originalPrice: 59.99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "tp4",
    name: "Anti-Theft Travel Backpack 30L",
    views: "8.6k views this week",
    price: 85.00,
    originalPrice: 110.00,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80"
  }
];

const categories = [
  { name: "Electronics", count: "1,200+ Items", icon: "💻", color: "bg-blue-50 text-blue-600 border-blue-200" },
  { name: "Fashion & Clothing", count: "850+ Items", icon: "👗", color: "bg-pink-50 text-pink-600 border-pink-200" },
  { name: "Home & Kitchen", count: "640+ Items", icon: "🏠", color: "bg-amber-50 text-amber-600 border-amber-200" },
  { name: "Beauty & Health", count: "420+ Items", icon: "💄", color: "bg-purple-50 text-purple-600 border-purple-200" },
  { name: "Sports & Fitness", count: "310+ Items", icon: "⚽", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  { name: "Books & Toys", count: "550+ Items", icon: "📚", color: "bg-rose-50 text-rose-600 border-rose-200" }
];

const brands = [
  { name: "Apple", logo: "🍎" },
  { name: "Samsung", logo: "📱" },
  { name: "Sony", logo: "🎧" },
  { name: "Nike", logo: "👟" },
  { name: "Adidas", logo: "⚽" },
  { name: "ASUS", logo: "💻" },
  { name: "Logitech", logo: "⌨️" },
  { name: "Puma", logo: "🐆" }
];

const recommendedProducts = [
  {
    id: "rec1",
    name: "High Performance Gaming Mouse 16K DPI",
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.8,
    match: "98% Match for You",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "rec2",
    name: "Adjustable Monitor Arm Single Mount",
    price: 65.00,
    originalPrice: 89.00,
    rating: 4.9,
    match: "95% Match for You",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "rec3",
    name: "Ultra Fast Magnetic Wireless Charger",
    price: 29.99,
    originalPrice: 45.00,
    rating: 4.7,
    match: "92% Match for You",
    image: "https://images.unsplash.com/photo-1622445268465-843857458631?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "rec4",
    name: "Ergonomic Memory Foam Wrist Rest",
    price: 19.99,
    originalPrice: 29.99,
    rating: 4.6,
    match: "90% Match for You",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80"
  }
];

const recentlyViewed = [
  {
    id: "rv1",
    name: "Wireless Noise-Canceling Headphones",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "rv2",
    name: "Ultra Smart Watch Series 7 Pro",
    price: 149.00,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "rv3",
    name: "Ergonomic Mechanical Gaming Keyboard",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "rv4",
    name: "Premium Leather Everyday Backpack",
    price: 75.50,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80"
  }
];

const customerReviews = [
  {
    name: "David K.",
    role: "Verified Buyer",
    rating: 5,
    comment: "SuperDeal has the fastest delivery I've experienced! The wireless headphones arrived in perfect condition and work flawlessly.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
  },
  {
    name: "Sophia Martinez",
    role: "Tech Enthusiast",
    rating: 5,
    comment: "The Flash Sale prices are unbeatable. I saved over \$100 on my smartwatch purchase. Highly recommend SuperDeal!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
  },
  {
    name: "Michael Chen",
    role: "Frequent Shopper",
    rating: 5,
    comment: "Customer support is extremely responsive and helpful. Returns are seamless, and product quality is top notch.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
  }
];

export default function CustomerHomePage() {
  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO BANNER */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> {heroBanners[0].tag}
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Unbeatable Deals On Everything You <span className="text-primary">Love</span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              {heroBanners[0].desc}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/products" className="btn btn-primary btn-lg shadow-lg shadow-primary/30 gap-2">
                <ShoppingBag className="w-5 h-5" /> {heroBanners[0].buttonText}
              </Link>
              <Link href="/categories" className="btn btn-outline btn-lg text-white border-white/40 hover:bg-white hover:text-slate-900 gap-2">
                Browse Categories <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-lg aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
              <img 
                src={heroBanners[0].image} 
                alt="Hero Promo"
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-6">
                <div className="bg-base-100/90 backdrop-blur-md p-4 rounded-2xl text-slate-900 flex items-center justify-between w-full shadow-lg">
                  <div>
                    <p className="text-xs font-bold text-primary uppercase">Limited Time Offer</p>
                    <p className="text-lg font-black">{heroBanners[0].title}</p>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-base-100 rounded-3xl border border-base-200 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl"><Truck className="w-6 h-6" /></div>
            <div>
              <h4 className="font-bold text-sm">Free Express Delivery</h4>
              <p className="text-xs text-base-content/60">On orders over \$50</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary/10 text-secondary rounded-2xl"><RotateCcw className="w-6 h-6" /></div>
            <div>
              <h4 className="font-bold text-sm">30-Day Easy Return</h4>
              <p className="text-xs text-base-content/60">Money-back guarantee</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 text-accent rounded-2xl"><ShieldCheck className="w-6 h-6" /></div>
            <div>
              <h4 className="font-bold text-sm">100% Secure Payment</h4>
              <p className="text-xs text-base-content/60">Encrypted checkout</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-info/10 text-info rounded-2xl"><Headphones className="w-6 h-6" /></div>
            <div>
              <h4 className="font-bold text-sm">24/7 Customer Support</h4>
              <p className="text-xs text-base-content/60">Dedicated assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FLASH SALE SECTION */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white text-red-600 rounded-2xl animate-pulse"><Flame className="w-7 h-7 fill-current" /></div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black">Flash Sale Hot Deals</h2>
                <p className="text-xs text-white/80">Massive discount prices ending very soon!</p>
              </div>
            </div>
            {/* Countdown timer UI */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider">Ends In:</span>
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                <span className="bg-white/20 backdrop-blur-md px-2.5 py-1.5 rounded-lg">04h</span>:
                <span className="bg-white/20 backdrop-blur-md px-2.5 py-1.5 rounded-lg">28m</span>:
                <span className="bg-white/20 backdrop-blur-md px-2.5 py-1.5 rounded-lg">15s</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {flashSaleProducts.map((p) => (
              <div key={p.id} className="bg-base-100 text-base-content rounded-2xl p-4 space-y-3 shadow-md hover:scale-[1.02] transition-transform">
                <div className="relative h-44 bg-base-200 rounded-xl overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  <span className="badge badge-error text-white font-extrabold absolute top-2 left-2">{p.discount}</span>
                </div>
                <h3 className="font-bold text-sm line-clamp-1">{p.name}</h3>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-lg font-black text-error">\${p.price}</span>
                    <span className="text-xs text-base-content/40 line-through ml-1.5">\${p.originalPrice}</span>
                  </div>
                  <span className="text-amber-500 font-bold flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-current" /> {p.rating}</span>
                </div>
                {/* Stock progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-base-content/60">
                    <span>Sold: {p.sold}</span>
                    <span>Stock: {p.totalStock}</span>
                  </div>
                  <progress className="progress progress-error w-full h-2" value={p.sold} max={p.totalStock}></progress>
                </div>
                <Link href={`/products/${p.id}`} className="btn btn-error text-white btn-sm btn-block rounded-xl font-bold gap-1">
                  <ShoppingBag className="w-4 h-4" /> Claim Deal
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TODAY'S DEALS */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary text-secondary-content rounded-xl"><Clock className="w-5 h-5" /></div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Today's Deals</h2>
              <p className="text-sm text-base-content/60">Handpicked special discounts updated every 24 hours</p>
            </div>
          </div>
          <Link href="/products" className="btn btn-sm btn-ghost gap-1 text-primary">
            View All Deals <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {todaysDeals.map((d) => (
            <div key={d.id} className="bg-base-100 border border-base-200 rounded-3xl p-5 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
              <img src={d.image} alt={d.name} className="w-24 h-24 rounded-2xl object-cover bg-base-200 shrink-0" />
              <div className="space-y-1 flex-1">
                <span className="badge badge-secondary badge-sm font-bold">{d.badge}</span>
                <h3 className="font-bold text-sm line-clamp-1">{d.name}</h3>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-current" /> {d.rating} ({d.reviews})
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-lg font-black text-primary">\${d.price}</span>
                  <span className="text-xs text-base-content/40 line-through">\${d.originalPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary text-primary-content rounded-xl"><Sparkles className="w-5 h-5" /></div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Featured Products</h2>
              <p className="text-sm text-base-content/60">Top-tier editor recommendations for quality and performance</p>
            </div>
          </div>
          <Link href="/products" className="btn btn-sm btn-outline btn-primary">
            Explore All Products
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="card bg-base-100 border border-base-200 shadow-xs hover:shadow-lg transition-all group rounded-2xl overflow-hidden">
              <figure className="relative h-52 bg-base-200 overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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

      {/* 5. BEST SELLING */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 text-white rounded-xl"><Award className="w-5 h-5" /></div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Best Selling Products</h2>
              <p className="text-sm text-base-content/60">Most popular products chosen by thousands of shoppers</p>
            </div>
          </div>
          <Link href="/products" className="btn btn-sm btn-ghost gap-1 text-primary">
            View Ranking <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellingProducts.map((p) => (
            <div key={p.id} className="bg-base-100 border border-base-200 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all space-y-3">
              <div className="relative h-44 bg-base-200 rounded-xl overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                <span className="badge badge-warning font-black text-xs absolute top-2 left-2">{p.sales}</span>
              </div>
              <h3 className="font-bold text-sm line-clamp-1">{p.name}</h3>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-black text-base-content">\${p.price}</span>
                  <span className="text-xs text-base-content/40 line-through ml-1.5">\${p.originalPrice}</span>
                </div>
                <Link href={`/products/1`} className="btn btn-ghost btn-xs text-primary font-bold">Buy Now</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 text-white rounded-xl"><Sparkles className="w-5 h-5" /></div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">New Arrivals</h2>
              <p className="text-sm text-base-content/60">Fresh stock recently added to our store</p>
            </div>
          </div>
          <Link href="/products" className="btn btn-sm btn-outline btn-emerald">See All New</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((na) => (
            <div key={na.id} className="bg-base-100 border border-base-200 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all space-y-3">
              <div className="relative h-44 bg-base-200 rounded-xl overflow-hidden">
                <img src={na.image} alt={na.name} className="w-full h-full object-cover" />
                <span className="badge badge-accent font-extrabold text-xs absolute top-2 left-2">{na.tag}</span>
              </div>
              <h3 className="font-bold text-sm line-clamp-1">{na.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-base-content">\${na.price}</span>
                <Link href={`/products/1`} className="btn btn-primary btn-xs rounded-lg">View Item</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. TRENDING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-xl"><TrendingUp className="w-5 h-5" /></div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Trending Now</h2>
              <p className="text-sm text-base-content/60">High demand items with massive shopper interest</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((tp) => (
            <div key={tp.id} className="bg-base-100 border border-base-200 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all space-y-3">
              <div className="relative h-44 bg-base-200 rounded-xl overflow-hidden">
                <img src={tp.image} alt={tp.name} className="w-full h-full object-cover" />
                <span className="badge badge-info text-white font-bold text-[10px] absolute top-2 left-2">{tp.views}</span>
              </div>
              <h3 className="font-bold text-sm line-clamp-1">{tp.name}</h3>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-black text-base-content">\${tp.price}</span>
                  <span className="text-xs text-base-content/40 line-through ml-1.5">\${tp.originalPrice}</span>
                </div>
                <Link href="/products" className="btn btn-sm btn-ghost text-primary">Shop</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Shop by Category</h2>
            <p className="text-sm text-base-content/60">Browse products organized by department</p>
          </div>
          <Link href="/categories" className="btn btn-sm btn-ghost gap-1 text-primary">
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href="/products"
              className={`p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-md text-center flex flex-col items-center justify-center gap-2 ${cat.color}`}
            >
              <span className="text-4xl">{cat.icon}</span>
              <h3 className="font-bold text-sm text-base-content">{cat.name}</h3>
              <span className="text-xs text-base-content/60 font-medium">{cat.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 9. BRAND SECTION */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-base-200/50 p-6 rounded-3xl border border-base-200 space-y-4">
          <div className="text-center">
            <h3 className="font-black text-xl text-base-content">Top Official Brands</h3>
            <p className="text-xs text-base-content/60">100% Authentic products from world leading brands</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {brands.map((b, idx) => (
              <div key={idx} className="bg-base-100 p-4 rounded-2xl border border-base-200 text-center flex flex-col items-center justify-center gap-1 hover:border-primary transition-colors cursor-pointer">
                <span className="text-2xl">{b.logo}</span>
                <span className="font-bold text-xs">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. RECOMMENDED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Recommended For You</h2>
            <p className="text-sm text-base-content/60">Based on your recent browsing interests</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedProducts.map((rec) => (
            <div key={rec.id} className="bg-base-100 border border-base-200 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all space-y-3">
              <div className="relative h-44 bg-base-200 rounded-xl overflow-hidden">
                <img src={rec.image} alt={rec.name} className="w-full h-full object-cover" />
                <span className="badge badge-success text-white font-bold text-[10px] absolute top-2 left-2">{rec.match}</span>
              </div>
              <h3 className="font-bold text-sm line-clamp-1">{rec.name}</h3>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-black text-base-content">\${rec.price}</span>
                  <span className="text-xs text-base-content/40 line-through ml-1.5">\${rec.originalPrice}</span>
                </div>
                <Link href="/products/1" className="btn btn-xs btn-primary rounded-lg">View</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. RECENTLY VIEWED */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-base-100 p-6 rounded-3xl border border-base-200 space-y-4">
          <h3 className="font-black text-lg text-base-content flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" /> Recently Viewed Items
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recentlyViewed.map((rv) => (
              <Link key={rv.id} href={`/products/1`} className="flex items-center gap-3 p-3 bg-base-200/50 rounded-2xl hover:bg-base-200 transition-colors">
                <img src={rv.image} alt={rv.name} className="w-12 h-12 rounded-xl object-cover bg-base-300 shrink-0" />
                <div className="min-w-0">
                  <p className="font-bold text-xs truncate">{rv.name}</p>
                  <p className="text-xs font-black text-primary">\${rv.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 12. COUPON BANNER */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="badge badge-neutral font-extrabold text-xs">EXCLUSIVE PROMO</span>
            <h2 className="text-3xl md:text-4xl font-black">Use Coupon Code: <span className="bg-white text-orange-600 px-3 py-1 rounded-xl font-mono">SUPER20</span></h2>
            <p className="text-white/90 text-sm">Save instant \$20 on any order exceeding \$50 at checkout!</p>
          </div>
          <Link href="/products" className="btn btn-neutral btn-lg rounded-2xl font-bold px-8 shadow-md">
            Claim Coupon & Shop
          </Link>
        </div>
      </section>

      {/* 13. CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center space-y-2 mb-8">
          <span className="badge badge-primary badge-outline font-bold">TESTIMONIALS</span>
          <h2 className="text-3xl font-black tracking-tight">What Our Customers Say</h2>
          <p className="text-sm text-base-content/60">Over 50,000+ happy shoppers trust SuperDeal every month</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {customerReviews.map((rev, idx) => (
            <div key={idx} className="bg-base-100 p-6 rounded-3xl border border-base-200 shadow-xs space-y-4 relative">
              <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
              <div className="flex items-center gap-1 text-amber-500 text-xs">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-base-content/80 leading-relaxed italic">"{rev.comment}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-base-200">
                <img src={rev.avatar} alt={rev.name} className="w-10 h-10 rounded-full object-cover ring ring-primary/20" />
                <div>
                  <h4 className="font-bold text-sm">{rev.name}</h4>
                  <p className="text-[11px] text-success font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {rev.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 14. NEWSLETTER SECTION */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-primary via-indigo-600 to-secondary text-primary-content rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="badge badge-accent badge-lg font-bold">STAY UPDATED</span>
            <h2 className="text-3xl md:text-4xl font-black">Subscribe To SuperDeal Newsletter</h2>
            <p className="text-white/80 text-sm">Get exclusive discount codes, weekly deals digests, and new product drop notifications straight to your inbox.</p>
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
