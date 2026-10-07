"use client";

import { User, Mail, Phone, MapPin, KeyRound, Award, Package, Heart, Save } from "lucide-react";

export default function AccountPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-lg">
        <div className="avatar">
          <div className="w-24 rounded-full ring ring-primary ring-offset-slate-900 ring-offset-2">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" alt="Profile" />
          </div>
        </div>
        <div className="space-y-1 text-center md:text-left flex-1">
          <h1 className="text-2xl md:text-3xl font-black">Abu Sayed</h1>
          <p className="text-xs text-slate-300">Customer since January 2024 • Member Tier: Gold</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
            <span className="badge badge-primary font-bold">Gold Member</span>
            <span className="badge badge-outline text-white font-bold">540 Reward Points</span>
          </div>
        </div>
      </div>

      {/* Account Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-base-100 p-5 rounded-2xl border border-base-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl"><Package className="w-6 h-6" /></div>
          <div>
            <p className="text-2xl font-black">12</p>
            <p className="text-xs text-base-content/60 font-semibold">Total Orders Placed</p>
          </div>
        </div>
        <div className="bg-base-100 p-5 rounded-2xl border border-base-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-secondary/10 text-secondary rounded-xl"><Heart className="w-6 h-6" /></div>
          <div>
            <p className="text-2xl font-black">3</p>
            <p className="text-xs text-base-content/60 font-semibold">Wishlist Saved</p>
          </div>
        </div>
        <div className="bg-base-100 p-5 rounded-2xl border border-base-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-accent/10 text-accent rounded-xl"><Award className="w-6 h-6" /></div>
          <div>
            <p className="text-2xl font-black">540</p>
            <p className="text-xs text-base-content/60 font-semibold">SuperPoints Earned</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Details Form */}
        <div className="lg:col-span-2 bg-base-100 p-6 rounded-3xl border border-base-200 shadow-xs space-y-6">
          <h2 className="text-xl font-black flex items-center gap-2 border-b border-base-200 pb-3">
            <User className="w-5 h-5 text-primary" /> Personal Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-base-content/60">Full Name</label>
              <input type="text" defaultValue="Abu Sayed" className="input input-sm input-bordered w-full focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-base-content/60">Email Address</label>
              <input type="email" defaultValue="sayed@example.com" className="input input-sm input-bordered w-full focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-base-content/60">Phone Number</label>
              <input type="tel" defaultValue="+880 1700 000000" className="input input-sm input-bordered w-full focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-base-content/60">Default Language</label>
              <select className="select select-sm select-bordered w-full focus:outline-none">
                <option>English</option>
                <option>Bengali</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold uppercase text-base-content/60">Default Shipping Address</label>
              <input type="text" defaultValue="House 42, Road 11, Block D, Banani, Dhaka-1213" className="input input-sm input-bordered w-full focus:outline-none" />
            </div>
          </div>
          <button className="btn btn-primary btn-sm rounded-xl gap-2 font-bold">
            <Save className="w-4 h-4" /> Save Profile Changes
          </button>
        </div>

        {/* Change Password / Security */}
        <div className="bg-base-100 p-6 rounded-3xl border border-base-200 shadow-xs space-y-6 h-fit">
          <h2 className="text-xl font-black flex items-center gap-2 border-b border-base-200 pb-3">
            <KeyRound className="w-5 h-5 text-primary" /> Account Security
          </h2>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-base-content/60">Current Password</label>
              <input type="password" placeholder="••••••••" className="input input-sm input-bordered w-full focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-base-content/60">New Password</label>
              <input type="password" placeholder="••••••••" className="input input-sm input-bordered w-full focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-base-content/60">Confirm New Password</label>
              <input type="password" placeholder="••••••••" className="input input-sm input-bordered w-full focus:outline-none" />
            </div>
          </div>
          <button className="btn btn-outline btn-primary btn-sm btn-block rounded-xl font-bold">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
