"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getStoredCart } from "@/lib/cart-store";
import { getStoredWishlist } from "@/lib/wishlist-store";
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  ShieldCheck,
  Package,
  Grid,
  Home,
  ShoppingCart,
  LogIn,
  LogOut,
  UserPlus
} from "lucide-react";

function NavLinks() {
  const pathname = usePathname();
  const [wishlistCount, setWishlistCount] = useState<number>(0);

  useEffect(() => {
    const updateWishlistCount = () => {
      setWishlistCount(getStoredWishlist().length);
    };
    updateWishlistCount();
    window.addEventListener("wishlistUpdated", updateWishlistCount);
    return () => window.removeEventListener("wishlistUpdated", updateWishlistCount);
  }, []);

  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Products", href: "/products", icon: ShoppingBag },
    { label: "Categories", href: "/categories", icon: Grid },
    { label: "Wishlist", href: "/wishlist", icon: Heart, badge: wishlistCount > 0 ? wishlistCount : undefined },
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
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  } | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [category, setCategory] = useState<
    { id: string; name: string }[]
  >([]);
  const [cartCount, setCartCount] = useState<number>(3);
  const [wishlistCount, setWishlistCount] = useState<number>(0);

  useEffect(() => {
    const updateWishlist = () => {
      setWishlistCount(getStoredWishlist().length);
    };
    updateWishlist();
    window.addEventListener("wishlistUpdated", updateWishlist);
    return () => window.removeEventListener("wishlistUpdated", updateWishlist);
  }, []);

  // Sync current user session
  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.authenticated && data.user) {
        setCurrentUser(data.user);
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();

    // Listen to global auth changes (login/logout elsewhere)
    const handleAuthChange = () => fetchCurrentUser();
    window.addEventListener("authChanged", handleAuthChange);
    return () => window.removeEventListener("authChanged", handleAuthChange);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      window.dispatchEvent(new Event("authChanged"));
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    // Sync cart badge count
    const updateCartCount = () => {
      const items = getStoredCart();
      const totalUnits = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(totalUnits);
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories/category");
        const result = await response.json();

        console.log(result)

        if (result.success) {
          setCategory(result.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [])


  return (
    <header className="sticky top-0 z-50 bg-base-100 shadow-sm border-b border-base-200">
      {/* Top Notification Bar */}
      <div className="bg-primary text-primary-content text-[10px] sm:text-xs py-1 px-2 sm:px-4 text-center font-medium flex flex-wrap justify-between items-center gap-1">
        <span className="truncate max-w-50 sm:max-w-none">🎉 Mega Sale! Up to 50% Off!</span>
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
              {
                category.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))
              }
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

        {/* Action Icons & User Session */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/wishlist" className="btn btn-ghost btn-circle btn-sm sm:btn-md relative" title="Wishlist">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-base-content" />
            {wishlistCount > 0 && (
              <span className="badge badge-xs sm:badge-sm badge-secondary absolute -top-1 -right-1">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link href="/cart" className="btn btn-ghost btn-circle btn-sm sm:btn-md relative" title="Cart">
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-base-content" />
            <span className="badge badge-xs sm:badge-sm badge-primary absolute -top-1 -right-1 font-bold">
              {cartCount}
            </span>
          </Link>

          {loadingUser ? (
            <div className="w-8 h-8 rounded-full bg-base-300 animate-pulse"></div>
          ) : currentUser ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar btn-sm sm:btn-md">
                <div className="w-7 sm:w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                  <img
                    src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.name)}`}
                    alt={currentUser.name}
                  />
                </div>
              </label>
              <ul tabIndex={0} className="mt-3 z-50 p-2 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-box w-56 border border-base-200">
                <li className="px-4 py-2 border-b border-base-200 pointer-events-none">
                  <div className="flex flex-col gap-0.5 p-0">
                    <span className="font-bold text-sm text-base-content truncate">{currentUser.name}</span>
                    <span className="text-xs text-base-content/60 truncate">{currentUser.email}</span>
                    <span className="badge badge-primary badge-xs mt-1 font-medium">{currentUser.role}</span>
                  </div>
                </li>
                <li className="mt-1"><Link href="/account"><User className="w-4 h-4" /> My Profile</Link></li>
                <li><Link href="/my-orders"><Package className="w-4 h-4" /> My Orders</Link></li>
                <li><Link href="/wishlist"><Heart className="w-4 h-4" /> Wishlist</Link></li>

                {currentUser.role !== "Customer" && (
                  <>
                    <div className="divider my-1"></div>
                    <li>
                      <Link href="/admin/dashboard" className="text-primary font-semibold">
                        <ShieldCheck className="w-4 h-4" /> Staff Dashboard
                      </Link>
                    </li>
                  </>
                )}

                <div className="divider my-1"></div>
                <li>
                  <button onClick={handleLogout} className="text-error font-medium hover:bg-error/10">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/login"
                className="btn btn-xs sm:btn-sm btn-ghost gap-1 px-2 sm:px-3 text-xs sm:text-sm font-semibold"
              >
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/register"
                className="btn btn-xs sm:btn-sm btn-primary gap-1 px-2.5 sm:px-3.5 text-xs sm:text-sm font-semibold shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Register</span>
              </Link>
            </div>
          )}
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
            <Link href="/#flash-sale" className="hover:underline flex items-center gap-1">
              <span>🔥 Daily Flash Deals</span>
            </Link>
            <span>⚡ Up to 70% Off</span>
            <span>🚚 Free Delivery over ৳50</span>
          </div>
        </div>
      </div>
    </header>
  );
}
