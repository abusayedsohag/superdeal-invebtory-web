"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import {
  LayoutDashboard,
  Package,
  Grid,
  Boxes,
  ShoppingBag,
  Truck,
  ShoppingCart,
  Users,
  Receipt,
  Ticket,
  Megaphone,
  BarChart3,
  UserCheck,
  Settings,
  Store,
  LogOut,
  ChevronRight
} from "lucide-react";

function SidebarLinks() {
  const pathname = usePathname();

  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package, badge: "142" },
    { label: "Categories", href: "/admin/categories", icon: Grid, badge: "18" },
    { label: "Inventory", href: "/admin/inventory", icon: Boxes, badge: "Low: 4", badgeColor: "badge-error" },
    { label: "Purchases", href: "/admin/purchases", icon: ShoppingBag },
    { label: "Suppliers", href: "/admin/suppliers", icon: Truck },
    { label: "Orders", href: "/admin/orders", icon: ShoppingCart, badge: "12 New", badgeColor: "badge-primary" },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Expenses", href: "/admin/expenses", icon: Receipt },
    { label: "Coupons", href: "/admin/coupons", icon: Ticket },
    { label: "Marketing", href: "/admin/marketing", icon: Megaphone },
    { label: "Reports", href: "/admin/reports", icon: BarChart3 },
    { label: "Users & Roles", href: "/admin/users-roles", icon: UserCheck },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
        Management
      </div>
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
              isActive
                ? "bg-primary text-white font-semibold shadow-md shadow-primary/20"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
              <span>{item.label}</span>
            </div>
            {item.badge ? (
              <span className={`badge badge-xs ${item.badgeColor || "badge-neutral"} font-bold`}>
                {item.badge}
              </span>
            ) : (
              <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? "opacity-100" : ""}`} />
            )}
          </Link>
        );
      })}
    </div>
  );
}

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-slate-100 min-h-screen flex flex-col border-r border-slate-800 shadow-xl shrink-0">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-xl font-extrabold text-white">
          <span className="bg-primary text-white p-1.5 rounded-lg text-lg">🔐</span>
          <span>Super<span className="text-primary">Admin</span></span>
        </Link>
        <span className="badge badge-xs badge-outline text-slate-400">v2.4</span>
      </div>

      {/* Navigation Links wrapped in Suspense */}
      <Suspense fallback={<div className="flex-1"></div>}>
        <SidebarLinks />
      </Suspense>

      {/* Store Link & Admin Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/50 space-y-2">
        <Link
          href="/"
          className="btn btn-outline btn-sm btn-block justify-start border-slate-700 text-slate-300 hover:bg-primary hover:text-white hover:border-primary gap-2"
        >
          <Store className="w-4 h-4 text-primary" />
          Go to Customer Store
        </Link>

        <div className="flex items-center gap-3 pt-2 px-1">
          <div className="avatar">
            <div className="w-8 rounded-full ring ring-primary ring-offset-slate-900 ring-offset-1">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Super Admin" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">Super Admin</p>
            <p className="text-[10px] text-slate-400 truncate">admin@superdeal.com</p>
          </div>
          <button className="btn btn-ghost btn-xs btn-circle text-slate-400 hover:text-error">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
