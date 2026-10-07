"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Edit, Trash2, Eye, Package, Layers } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([
    { id: "1", sku: "SD-HEAD-9081", name: "Wireless Noise-Canceling Headphones", category: "Electronics", costPrice: 120.00, price: 199.99, stock: 18, variantsCount: 3, status: "Active" },
    { id: "2", sku: "SD-WTC-7721", name: "Ultra Smart Watch Series 7 Pro", category: "Gadgets", costPrice: 90.00, price: 149.00, stock: 25, variantsCount: 4, status: "Active" },
    { id: "3", sku: "SD-KEY-1022", name: "Ergonomic Mechanical Gaming Keyboard", category: "Accessories", costPrice: 50.00, price: 89.99, stock: 4, variantsCount: 2, status: "Low Stock" },
    { id: "4", sku: "TSH-PREM-2026", name: "Premium Cotton Crewneck T-Shirt", category: "Fashion", costPrice: 55.00, price: 85.00, stock: 145, variantsCount: 12, status: "Active" },
    { id: "5", sku: "SD-MOU-2201", name: "Minimalist Wireless Optical Mouse", category: "Electronics", costPrice: 15.00, price: 29.99, stock: 0, variantsCount: 1, status: "Out of Stock" }
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Products Catalog</h1>
          <p className="text-xs text-slate-500">Manage store items, pricing, SKU, variants, and stock metrics</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary btn-sm gap-2 font-bold shadow-md shadow-primary/20">
          <Plus className="w-4 h-4" /> Add New Product
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by SKU or Name..."
            className="input input-sm input-bordered pl-9 w-full focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select className="select select-sm select-bordered focus:outline-none">
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Gadgets</option>
            <option>Accessories</option>
            <option>Fashion</option>
          </select>
          <select className="select select-sm select-bordered focus:outline-none">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
              <th>Master SKU</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Cost Price</th>
              <th>Selling Price</th>
              <th>Variants</th>
              <th>Stock Qty</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50">
                <td className="font-mono text-xs text-slate-500">{p.sku}</td>
                <td className="font-bold text-slate-900">{p.name}</td>
                <td className="text-xs text-slate-600">{p.category}</td>
                <td className="text-slate-500">\${p.costPrice.toFixed(2)}</td>
                <td className="font-extrabold text-slate-900">\${p.price.toFixed(2)}</td>
                <td>
                  <span className="badge badge-indigo badge-outline text-[11px] font-bold gap-1">
                    <Layers className="w-3 h-3 text-indigo-600" /> {p.variantsCount} Variants
                  </span>
                </td>
                <td>
                  <span className={`font-bold ${p.stock <= 5 ? "text-error" : "text-slate-800"}`}>
                    {p.stock} units
                  </span>
                </td>
                <td>
                  <span className={`badge badge-sm font-bold ${
                    p.status === "Active" ? "badge-success text-white" :
                    p.status === "Low Stock" ? "badge-warning" : "badge-error text-white"
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href="/admin/products/new" className="btn btn-ghost btn-xs text-slate-600 hover:text-primary">
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                    <button className="btn btn-ghost btn-xs text-slate-600 hover:text-error">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
