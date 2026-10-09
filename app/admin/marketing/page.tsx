"use client";

import { useState, useEffect } from "react";
import { 
  Zap, 
  Plus, 
  ShoppingBag, 
  Trash2, 
  X
} from "lucide-react";

interface FlashSaleProduct {
  id: string;
  name: string;
  category: string;
  originalPrice: number;
  flashPrice: number;
  discount: string;
  allocatedStock: number;
  soldStock: number;
  image: string;
}

export default function AdminMarketingPage() {

  const [flashProducts, setFlashProducts] = useState<FlashSaleProduct[]>([
    {
      id: "fs-101",
      name: "iPhone Case (Silicone MagSafe)",
      category: "Accessories",
      originalPrice: 450,
      flashPrice: 250,
      discount: "44% OFF",
      allocatedStock: 200,
      soldStock: 142,
      image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=100&auto=format&fit=crop&q=80"
    },
    {
      id: "fs-102",
      name: "Ergonomic Optical Mouse",
      category: "Electronics",
      originalPrice: 890,
      flashPrice: 490,
      discount: "45% OFF",
      allocatedStock: 100,
      soldStock: 78,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&auto=format&fit=crop&q=80"
    },
    {
      id: "fs-103",
      name: "Mechanical Gaming Keyboard",
      category: "Electronics",
      originalPrice: 1600,
      flashPrice: 990,
      discount: "38% OFF",
      allocatedStock: 80,
      soldStock: 65,
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100&auto=format&fit=crop&q=80"
    },
    {
      id: "fs-104",
      name: "Wireless Gaming Headphone",
      category: "Electronics",
      originalPrice: 1950,
      flashPrice: 1150,
      discount: "41% OFF",
      allocatedStock: 150,
      soldStock: 112,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80"
    }
  ]);

  // Dynamic Countdown Timer Logic (Simulating 04 : 32 : 18)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Product Form State
  const [newProductName, setNewProductName] = useState("");
  const [newOrigPrice, setNewOrigPrice] = useState(1000);
  const [newFlashPrice, setNewFlashPrice] = useState(600);
  const [newStock, setNewStock] = useState(50);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName) return;

    const discPercent = Math.round(((newOrigPrice - newFlashPrice) / newOrigPrice) * 100);

    const created: FlashSaleProduct = {
      id: `fs-${Date.now().toString().slice(-4)}`,
      name: newProductName,
      category: "General",
      originalPrice: newOrigPrice,
      flashPrice: newFlashPrice,
      discount: `${discPercent}% OFF`,
      allocatedStock: newStock,
      soldStock: 0,
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&auto=format&fit=crop&q=80"
    };

    setFlashProducts(prev => [...prev, created]);
    setIsAddModalOpen(false);
    setNewProductName("");
  };

  const handleRemoveProduct = (id: string) => {
    setFlashProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Zap className="w-8 h-8 text-amber-500 fill-amber-500" /> Flash Sale Management
          </h1>
          <p className="text-xs text-slate-500">
            Schedule limited-time promotion events, set start/end timestamps, assign discounted products, and monitor countdown timers
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-primary btn-sm gap-2 font-bold shadow-md rounded-xl"
        >
          <Plus className="w-4 h-4" /> Add Product to Flash Sale
        </button>
      </div>

      {/* FLASH SALE PRODUCTS TREE & LIST (Exact Requested Structure) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-xl text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" /> Included Flash Sale Products
            </h3>
            <p className="text-xs text-slate-500">Products assigned to active flash sale campaign</p>
          </div>
          <span className="badge badge-primary font-bold text-xs">{flashProducts.length} Items</span>
        </div>

        {/* Interactive Products Table */}
        <div className="overflow-x-auto">
          <table className="table w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <th>Product Name</th>
                <th>Regular Price</th>
                <th>Flash Sale Price</th>
                <th>Discount</th>
                <th>Stock Claim Progress</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {flashProducts.map((p) => {
                const soldPercent = Math.round((p.soldStock / p.allocatedStock) * 100);

                return (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td>
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm">{p.name}</p>
                          <span className="text-[10px] text-slate-400">{p.category}</span>
                        </div>
                      </div>
                    </td>

                    <td className="font-mono text-slate-400 line-through text-xs font-bold">
                      ৳{p.originalPrice.toLocaleString()}
                    </td>

                    <td className="font-mono font-black text-amber-600 text-base">
                      ৳{p.flashPrice.toLocaleString()}
                    </td>

                    <td>
                      <span className="badge badge-error text-white font-black text-xs px-2 py-0.5">
                        {p.discount}
                      </span>
                    </td>

                    <td className="w-48">
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-slate-600">{p.soldStock} claimed</span>
                          <span className="text-primary font-mono">{soldPercent}%</span>
                        </div>
                        <progress className="progress progress-primary w-full h-2" value={soldPercent} max="100"></progress>
                      </div>
                    </td>

                    <td className="text-right">
                      <button
                        onClick={() => handleRemoveProduct(p.id)}
                        className="btn btn-xs btn-ghost text-red-500 font-bold"
                        title="Remove from Flash Sale"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD PRODUCT TO FLASH SALE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-xl text-slate-900">Add Flash Sale Product</h3>
                <p className="text-xs text-slate-500">Assign discount price and stock allocation</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="btn btn-ghost btn-circle btn-xs">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Headphone"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="input input-sm input-bordered w-full focus:outline-none rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Regular Price (৳)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newOrigPrice}
                    onChange={(e) => setNewOrigPrice(Number(e.target.value))}
                    className="input input-sm input-bordered w-full font-mono focus:outline-none rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Flash Sale Price (৳)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newFlashPrice}
                    onChange={(e) => setNewFlashPrice(Number(e.target.value))}
                    className="input input-sm input-bordered w-full font-mono focus:outline-none rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Allocated Flash Stock</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={newStock}
                  onChange={(e) => setNewStock(Number(e.target.value))}
                  className="input input-sm input-bordered w-full font-mono focus:outline-none rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn btn-sm btn-ghost font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm btn-primary font-bold rounded-xl"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
