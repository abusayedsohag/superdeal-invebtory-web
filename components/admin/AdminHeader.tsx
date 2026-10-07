"use client";

import { Search, Bell, ShieldAlert, Store, User, Menu } from "lucide-react";
import Link from "next/link";

interface AdminHeaderProps {
  onToggleMobileSidebar?: () => void;
}

export default function AdminHeader({ onToggleMobileSidebar }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-base-100 border-b border-base-200 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-xs">
      {/* Mobile Toggle & Search Bar */}
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <button
          onClick={onToggleMobileSidebar}
          className="btn btn-ghost btn-square btn-sm md:hidden text-slate-700"
          aria-label="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
          <input
            type="text"
            placeholder="Search SKU, orders..."
            className="input input-xs sm:input-sm input-bordered pl-8 sm:pl-9 w-full focus:outline-none bg-base-200/50 focus:bg-base-100 text-xs"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Quick Back to Store */}
        <Link 
          href="/" 
          className="btn btn-sm btn-ghost text-xs gap-1.5 font-medium hidden sm:flex"
        >
          <Store className="w-3.5 h-3.5 text-primary" />
          Storefront
        </Link>

        {/* Notifications */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle btn-sm relative">
            <Bell className="w-4 h-4" />
            <span className="badge badge-xs badge-primary absolute top-0.5 right-0.5"></span>
          </label>
          <div tabIndex={0} className="dropdown-content z-[1] card card-compact w-72 sm:w-80 p-2 shadow-xl bg-base-100 border border-base-200">
            <div className="card-body">
              <h3 className="font-bold text-xs sm:text-sm flex justify-between items-center">
                <span>Notifications</span>
                <span className="badge badge-sm badge-primary">3 New</span>
              </h3>
              <ul className="divide-y divide-base-200 text-xs my-2">
                <li className="py-1.5">
                  <p className="font-semibold text-base-content">New Order #ORD-8921</p>
                  <p className="text-base-content/60 text-[10px]">Customer placed order \$450.00</p>
                </li>
                <li className="py-1.5">
                  <p className="font-semibold text-error">Low Stock Warning!</p>
                  <p className="text-base-content/60 text-[10px]">Wireless Headphones stock: 2 units</p>
                </li>
              </ul>
              <button className="btn btn-xs btn-outline btn-block">View Notifications</button>
            </div>
          </div>
        </div>

        {/* Admin Profile Dropdown */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar btn-sm">
            <div className="w-7 sm:w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Admin" />
            </div>
          </label>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-box w-48 sm:w-52 border border-base-200">
            <li className="menu-title px-4 py-1 text-xs">Super Admin</li>
            <li><Link href="/admin/settings"><User className="w-4 h-4" /> Settings</Link></li>
            <li><Link href="/admin/users-roles"><ShieldAlert className="w-4 h-4" /> Security</Link></li>
            <div className="divider my-1"></div>
            <li><Link href="/" className="text-primary font-semibold"><Store className="w-4 h-4" /> Go to Store</Link></li>
          </ul>
        </div>
      </div>
    </header>
  );
}
