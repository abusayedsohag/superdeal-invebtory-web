"use client";

import { Settings, Save, Store, CreditCard, DollarSign, Bell, ShieldCheck } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">System & Store Settings</h1>
          <p className="text-xs text-slate-500">Configure global shop parameters, tax, payment gateways, and notifications</p>
        </div>
        <button className="btn btn-primary btn-sm gap-2 font-bold shadow-md shadow-primary/20">
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* General Store Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Store className="w-5 h-5 text-primary" /> Store Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Store Name</label>
                <input type="text" defaultValue="SuperDeal E-Commerce" className="input input-sm input-bordered w-full" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Support Email</label>
                <input type="email" defaultValue="support@superdeal.com" className="input input-sm input-bordered w-full" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Currency Symbol</label>
                <select className="select select-sm select-bordered w-full">
                  <option>USD (\$)</option>
                  <option>BDT (৳)</option>
                  <option>EUR (€)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Default Tax Rate (%)</label>
                <input type="number" defaultValue="5" className="input input-sm input-bordered w-full" />
              </div>
            </div>
          </div>

          {/* Payment Gateways */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-5 h-5 text-primary" /> Active Payment Gateways
            </h3>
            <div className="space-y-3">
              {[
                { name: "Stripe Credit/Debit Card", desc: "Accept Visa, Mastercard, AMEX online", active: true },
                { name: "bKash & Nagad Mobile Payments", desc: "Instant mobile banking checkout in Bangladesh", active: true },
                { name: "Cash on Delivery (COD)", desc: "Customer pays upon delivery receipt", active: true }
              ].map((gw, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{gw.name}</h4>
                    <p className="text-[11px] text-slate-500">{gw.desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked={gw.active} className="toggle toggle-primary toggle-sm" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security & System Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 h-fit">
          <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-primary" /> System Info
          </h3>
          <div className="space-y-2 text-xs text-slate-600">
            <p className="flex justify-between"><span>Framework:</span> <strong className="text-slate-900">Next.js 16 (App Router)</strong></p>
            <p className="flex justify-between"><span>Styling Engine:</span> <strong className="text-slate-900">Tailwind CSS v4 + DaisyUI v5</strong></p>
            <p className="flex justify-between"><span>Language:</span> <strong className="text-slate-900">TypeScript</strong></p>
            <p className="flex justify-between"><span>Environment:</span> <strong className="text-success font-bold">Production Ready</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
