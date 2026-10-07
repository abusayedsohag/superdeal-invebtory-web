"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  ShieldCheck, 
  Package, 
  Grid, 
  Home,
  ShoppingCart
} from "lucide-react";

function NavLinks() {
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Products", href: "/products", icon: ShoppingBag },
    { label: "Categories", href: "/categories", icon: Grid },
    { label: "Wishlist", href: "/wishlist", icon: Heart, badge: 3 },
    { label: "My Orders", href: "/my-orders", icon: Package },
  ];

  return (
    <nav className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto py-1 no-scrollbar">
      {navLinks.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`btn btn-xs sm:btn-sm btn-ghost gap-1 sm:gap-2 shrink-0 ${isActive ? "btn-active font-bold text-primary" : "text-base-content/80"}`}
          >
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-[11px] sm:text-sm">{link.label}</span>
            {link.badge && <span className="badge badge-xs badge-secondary text-[9px]">{link.badge}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export default function CustomerNavbar() {
  return (
    <header className="sticky top-0 z-50 bg-base-100 shadow-sm border-b border-base-200">
      {/* Top Notification Bar */}
      <div className="bg-primary text-primary-content text-[10px] sm:text-xs py-1 px-2 sm:px-4 text-center font-medium flex flex-wrap justify-between items-center gap-1">
        <span className="truncate max-w-[200px] sm:max-w-none">🎉 Mega Sale! Up to 50% Off!</span>
        <Link href="/admin/dashboard" className="btn btn-[10px] btn-xs btn-outline border-white text-white hover:bg-white hover:text-primary gap-1 py-0.5 h-auto min-h-0">
          <ShieldCheck className="w-3 h-3" />
          Admin Panel
        </Link>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-1.5 text-lg sm:text-2xl font-black text-primary tracking-tight shrink-0">
          <span className="bg-primary text-primary-content p-1 sm:p-2 rounded-lg sm:rounded-xl shadow-md text-sm sm:text-base">🛍️</span>
          <span>Super<span className="text-secondary">Deal</span></span>
        </Link>

        {/* Desktop Search Bar */}
        <div className="flex-1 max-w-xl hidden md:flex items-center gap-0">
          <div className="join w-full">
            <select className="select select-bordered join-item bg-base-200 text-sm focus:outline-none">
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Home & Living</option>
              <option>Beauty & Health</option>
              <option>Sports & Fitness</option>
            </select>
            <input 
              type="text" 
              placeholder="Search products, brands..." 
              className="input input-bordered join-item w-full focus:outline-none" 
            />
            <button className="btn btn-primary join-item px-6">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1 sm:gap-3">
          <Link href="/wishlist" className="btn btn-ghost btn-circle btn-sm sm:btn-md relative">
            <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-base-content" />
            <span className="badge badge-xs sm:badge-sm badge-secondary absolute -top-1 -right-1">3</span>
          </Link>

          <Link href="/cart" className="btn btn-ghost btn-circle btn-sm sm:btn-md relative">
            <ShoppingCart className="w-4 h-4 sm:w-6 sm:h-6 text-base-content" />
            <span className="badge badge-xs sm:badge-sm badge-primary absolute -top-1 -right-1">2</span>
          </Link>

          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar btn-sm sm:btn-md">
              <div className="w-7 sm:w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1 sm:ring-offset-2">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Avatar" />
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-box w-48 sm:w-52 border border-base-200">
              <li className="menu-title px-4 py-2 text-xs font-semibold uppercase text-base-content/60">Account</li>
              <li><Link href="/account"><User className="w-4 h-4" /> Profile & Settings</Link></li>
              <li><Link href="/my-orders"><Package className="w-4 h-4" /> My Orders</Link></li>
              <li><Link href="/wishlist"><Heart className="w-4 h-4" /> Wishlist</Link></li>
              <div className="divider my-1"></div>
              <li><Link href="/admin/dashboard" className="text-primary font-semibold"><ShieldCheck className="w-4 h-4" /> Admin Dashboard</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Search Input */}
      <div className="px-2 pb-2 md:hidden">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            placeholder="Search products..."
            className="input input-xs sm:input-sm input-bordered pl-8 w-full focus:outline-none"
          />
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-base-200/60 border-t border-base-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center justify-between overflow-x-auto py-1">
          <Suspense fallback={<div className="h-6"></div>}>
            <NavLinks />
          </Suspense>

          <div className="hidden lg:flex items-center gap-4 text-xs font-semibold text-primary">
            <span>🔥 Daily Flash Deals</span>
            <span>⚡ Up to 70% Off</span>
            <span>🚚 Free Delivery over \$50</span>
          </div>
        </div>
      </div>
    </header>
  );
}
