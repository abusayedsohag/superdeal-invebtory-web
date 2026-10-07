"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Save, 
  ArrowLeft, 
  Package, 
  DollarSign, 
  Boxes, 
  Layers, 
  Image as ImageIcon, 
  Video, 
  Tag, 
  Plus, 
  Trash2, 
  Percent, 
  Barcode, 
  MapPin, 
  CheckCircle2,
  Sparkles
} from "lucide-react";

export default function AdminNewProductPage() {
  const [activeTab, setActiveTab] = useState("basic");

  // Pricing state for auto margin calculation
  const [purchasePrice, setPurchasePrice] = useState<number>(50);
  const [regularPrice, setRegularPrice] = useState<number>(100);
  const [salePrice, setSalePrice] = useState<number>(85);
  const [wholesalePrice, setWholesalePrice] = useState<number>(65);
  const [costPrice, setCostPrice] = useState<number>(55);
  const [taxPercent, setTaxPercent] = useState<number>(7.5);
  const [discountPercent, setDiscountPercent] = useState<number>(15);

  // Profit margin calculation
  const profit = salePrice - costPrice;
  const marginPercent = salePrice > 0 ? ((profit / salePrice) * 100).toFixed(1) : 0;

  // Variants Generator State
  const [variants, setVariants] = useState([
    { id: "1", color: "Black", size: "M", sku: "TSH-BLK-M", price: 85, stock: 40, barcode: "890123456701", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80" },
    { id: "2", color: "Black", size: "L", sku: "TSH-BLK-L", price: 85, stock: 35, barcode: "890123456702", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80" },
    { id: "3", color: "White", size: "M", sku: "TSH-WHT-M", price: 85, stock: 50, barcode: "890123456703", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=200&auto=format&fit=crop&q=80" },
    { id: "4", color: "Red", size: "XL", sku: "TSH-RED-XL", price: 85, stock: 20, barcode: "890123456704", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=200&auto=format&fit=crop&q=80" }
  ]);

  const addVariantRow = () => {
    const newId = (variants.length + 1).toString();
    setVariants([
      ...variants,
      { id: newId, color: "Navy Blue", size: "L", sku: `TSH-NVY-${newId}`, price: 85, stock: 25, barcode: `89012345670${newId}`, image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80" }
    ]);
  };

  const removeVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="btn btn-ghost btn-circle btn-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Add New Product</h1>
            <p className="text-xs text-slate-500">Configure product details, pricing, inventory metrics, and variants</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm">Save Draft</button>
          <button className="btn btn-primary btn-sm gap-2 font-bold shadow-md shadow-primary/20">
            <Save className="w-4 h-4" /> Publish Product
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs tabs-boxed bg-white p-1 rounded-2xl border border-slate-200 shadow-xs flex overflow-x-auto no-scrollbar">
        {[
          { id: "basic", label: "Basic Details", icon: Package },
          { id: "pricing", label: "Pricing & Margins", icon: DollarSign },
          { id: "inventory", label: "Inventory & Warehouses", icon: Boxes },
          { id: "variants", label: "Product Variants Matrix", icon: Layers }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab text-xs sm:text-sm font-bold gap-2 shrink-0 py-2 ${
                activeTab === tab.id ? "tab-active bg-primary text-white rounded-xl" : "text-slate-600"
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* 1. BASIC PRODUCT DETAILS */}
      {activeTab === "basic" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" /> Product Identity & Classification
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold uppercase text-slate-500">Product Name *</label>
              <input type="text" defaultValue="Premium Cotton Crewneck T-Shirt" className="input input-sm input-bordered w-full focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Master SKU Code *</label>
              <input type="text" defaultValue="TSH-PREM-2026" className="input input-sm input-bordered w-full font-mono focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Product Barcode (EAN/UPC)</label>
              <div className="relative">
                <Barcode className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" defaultValue="890123456700" className="input input-sm input-bordered pl-9 w-full font-mono focus:outline-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Category *</label>
              <select defaultValue="Fashion" className="select select-sm select-bordered w-full focus:outline-none">
                <option value="Fashion">Fashion & Apparel</option>
                <option value="Electronics">Electronics & Tech</option>
                <option value="Home">Home & Kitchen</option>
                <option value="Beauty">Beauty & Health</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Subcategory</label>
              <select defaultValue="MenWear" className="select select-sm select-bordered w-full focus:outline-none">
                <option value="MenWear">Men's Clothing</option>
                <option value="WomenWear">Women's Clothing</option>
                <option value="KidsWear">Kids & Baby</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Brand Name</label>
              <input type="text" defaultValue="SuperFit Collection" className="input input-sm input-bordered w-full focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Tags (Comma separated)</label>
              <div className="relative">
                <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" defaultValue="tshirt, cotton, casual, summer, fashion" className="input input-sm input-bordered pl-9 w-full focus:outline-none" />
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold uppercase text-slate-500">Short Description</label>
              <input type="text" defaultValue="Ultra-soft 100% breathable combed cotton t-shirt with reinforced double stitching." className="input input-sm input-bordered w-full focus:outline-none" />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold uppercase text-slate-500">Full Description</label>
              <textarea rows={4} className="textarea textarea-bordered w-full text-sm focus:outline-none" defaultValue="Made from premium 180 GSM combed organic cotton, this everyday t-shirt combines classic style with exceptional durability. Designed for maximum comfort during long daily wear. Pre-shrunk fabric prevents washing shrinkage."></textarea>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold uppercase text-slate-500">Video Demonstration Link (YouTube/Vimeo)</label>
              <div className="relative">
                <Video className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="https://youtube.com/watch?v=demo" className="input input-sm input-bordered pl-9 w-full focus:outline-none" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PRICING & MARGINS */}
      {activeTab === "pricing" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" /> Pricing Structure & Tax Calculations
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Purchase Price (\$)</label>
              <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(Number(e.target.value))} className="input input-sm input-bordered w-full font-bold focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Cost Price (\$)</label>
              <input type="number" value={costPrice} onChange={(e) => setCostPrice(Number(e.target.value))} className="input input-sm input-bordered w-full font-bold focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Regular Price (\$)</label>
              <input type="number" value={regularPrice} onChange={(e) => setRegularPrice(Number(e.target.value))} className="input input-sm input-bordered w-full font-bold focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Sale Price (\$)</label>
              <input type="number" value={salePrice} onChange={(e) => setSalePrice(Number(e.target.value))} className="input input-sm input-bordered w-full text-primary font-black focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Wholesale Price (\$)</label>
              <input type="number" value={wholesalePrice} onChange={(e) => setWholesalePrice(Number(e.target.value))} className="input input-sm input-bordered w-full font-bold focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Discount (%)</label>
              <input type="number" value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))} className="input input-sm input-bordered w-full focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Tax / VAT (%)</label>
              <input type="number" value={taxPercent} onChange={(e) => setTaxPercent(Number(e.target.value))} className="input input-sm input-bordered w-full focus:outline-none" />
            </div>

            <div className="space-y-1 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <label className="text-xs font-bold uppercase text-emerald-800">Calculated Margin</label>
              <p className="text-xl font-black text-emerald-700">+{marginPercent}%</p>
              <p className="text-[10px] text-emerald-600">Profit: \${profit.toFixed(2)} / unit</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. INVENTORY & WAREHOUSE */}
      {activeTab === "inventory" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-purple-600" /> Stock Quantities & Warehouse Locations
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Current Stock</label>
              <input type="number" defaultValue="145" className="input input-sm input-bordered w-full font-bold focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Reserved Stock</label>
              <input type="number" defaultValue="15" className="input input-sm input-bordered w-full focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Available Stock</label>
              <input type="number" defaultValue="130" className="input input-sm input-bordered w-full font-black text-emerald-600 focus:outline-none" readOnly />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Reorder Level Alert</label>
              <input type="number" defaultValue="20" className="input input-sm input-bordered w-full font-bold text-error focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Minimum Stock</label>
              <input type="number" defaultValue="10" className="input input-sm input-bordered w-full focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Maximum Stock Capacity</label>
              <input type="number" defaultValue="500" className="input input-sm input-bordered w-full focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Primary Warehouse</label>
              <select defaultValue="MainDhaka" className="select select-sm select-bordered w-full focus:outline-none">
                <option value="MainDhaka">Main Warehouse (Dhaka)</option>
                <option value="SubCtg">Sub Warehouse (Chittagong)</option>
                <option value="CentralFulfillment">Central Fulfillment Center</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Shelf / Rack ID Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" defaultValue="Rack B-04 / Shelf 3" className="input input-sm input-bordered pl-9 w-full focus:outline-none" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. VARIANTS MATRIX GENERATOR */}
      {activeTab === "variants" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" /> Product Variants Matrix
              </h2>
              <p className="text-xs text-slate-500">Configure custom variant attributes (Color × Size) with independent SKU, Price, and Stock</p>
            </div>
            <button onClick={addVariantRow} className="btn btn-sm btn-outline btn-primary gap-1">
              <Plus className="w-4 h-4" /> Add Variant Row
            </button>
          </div>

          {/* Variants Table */}
          <div className="overflow-x-auto">
            <table className="table w-full text-xs">
              <thead>
                <tr className="uppercase bg-slate-50 border-b border-slate-200 text-slate-500">
                  <th>Variant Image</th>
                  <th>Color</th>
                  <th>Size</th>
                  <th>Variant SKU</th>
                  <th>Price (\$)</th>
                  <th>Stock Qty</th>
                  <th>Barcode</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {variants.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/50">
                    <td>
                      <img src={v.image} alt={v.color} className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                    </td>
                    <td>
                      <input type="text" defaultValue={v.color} className="input input-xs input-bordered w-24 font-bold" />
                    </td>
                    <td>
                      <input type="text" defaultValue={v.size} className="input input-xs input-bordered w-16 font-bold" />
                    </td>
                    <td>
                      <input type="text" defaultValue={v.sku} className="input input-xs input-bordered font-mono w-28" />
                    </td>
                    <td>
                      <input type="number" defaultValue={v.price} className="input input-xs input-bordered w-20 font-bold" />
                    </td>
                    <td>
                      <input type="number" defaultValue={v.stock} className="input input-xs input-bordered w-20 font-extrabold text-slate-900" />
                    </td>
                    <td>
                      <input type="text" defaultValue={v.barcode} className="input input-xs input-bordered font-mono w-32" />
                    </td>
                    <td className="text-right">
                      <button onClick={() => removeVariant(v.id)} className="btn btn-ghost btn-xs text-error hover:bg-error/10">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
