"use client";

import { Search, Bell, Moon, Sun, ShieldAlert, Store, User } from "lucide-react";
import Link from "next/link";

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 bg-base-100 border-b border-base-200 px-6 py-3 flex items-center justify-between shadow-xs">
      {/* Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
          <input
            type="text"
            placeholder="Search orders, SKU, inventory, suppliers..."
            className="input input-sm input-bordered pl-9 w-full focus:outline-none bg-base-200/50 focus:bg-base-100"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Back to Store */}
        <Link 
          href="/" 
          className="btn btn-sm btn-ghost text-xs gap-1.5 font-medium hidden sm:flex"
        >
          <Store className="w-3.5 h-3.5 text-primary" />
          Customer Website
        </Link>

        {/* System Alert Status */}
        <div className="hidden lg:flex items-center gap-2 bg-error/10 text-error px-2.5 py-1 rounded-full text-xs font-semibold">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>4 Low Stock Items</span>
        </div>

        {/* Notifications */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle btn-sm relative">
            <Bell className="w-4 h-4" />
            <span className="badge badge-xs badge-primary absolute top-0.5 right-0.5"></span>
          </label>
          <div tabIndex={0} className="dropdown-content z-[1] card card-compact w-80 p-2 shadow-xl bg-base-100 border border-base-200">
            <div className="card-body">
              <h3 className="font-bold text-sm flex justify-between items-center">
                <span>Notifications</span>
                <span className="badge badge-sm badge-primary">3 New</span>
              </h3>
              <ul className="divide-y divide-base-200 text-xs my-2">
                <li className="py-2">
                  <p className="font-semibold text-base-content">New Order #ORD-8921</p>
                  <p className="text-base-content/60">Customer placed an order worth \$450.00</p>
                </li>
                <li className="py-2">
                  <p className="font-semibold text-error">Low Stock Warning!</p>
                  <p className="text-base-content/60">Wireless Headphones stock left: 2 units</p>
                </li>
                <li className="py-2">
                  <p className="font-semibold text-base-content">Supplier Purchase Order Approved</p>
                  <p className="text-base-content/60">PO #7731 confirmed by Apex Wholesale</p>
                </li>
              </ul>
              <button className="btn btn-xs btn-outline btn-block">View All Notifications</button>
            </div>
          </div>
        </div>

        {/* Admin Profile Dropdown */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar btn-sm">
            <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Admin" />
            </div>
          </label>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-200">
            <li className="menu-title px-4 py-1 text-xs">Super Admin</li>
            <li><Link href="/admin/settings"><User className="w-4 h-4" /> Account Settings</Link></li>
            <li><Link href="/admin/users-roles"><ShieldAlert className="w-4 h-4" /> Security & Roles</Link></li>
            <div className="divider my-1"></div>
            <li><Link href="/" className="text-primary font-semibold"><Store className="w-4 h-4" /> Go to Storefront</Link></li>
          </ul>
        </div>
      </div>
    </header>
  );
}
