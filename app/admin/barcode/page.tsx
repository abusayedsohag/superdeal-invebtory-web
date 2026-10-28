"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Barcode, 
  Search, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Zap, 
  Layers, 
  DollarSign, 
  Boxes, 
  RefreshCw, 
  X,
  PackagePlus,
  ExternalLink,
  Edit3,
  Check
} from "lucide-react";

interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  category: string;
  price: number;
  regularPrice?: number;
  stock: number;
  warehouse?: string;
  image: string;
}

export default function AdminBarcodePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [warehouses, setWarehouses] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Barcode Scan / Search State
  const [barcodeInput, setBarcodeInput] = useState("");
  const [matchedProduct, setMatchedProduct] = useState<Product | null>(null);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [stockToAdd, setStockToAdd] = useState<number>(10);
  const [isSavingStock, setIsSavingStock] = useState(false);

  // New Product Modal (When Scanned Barcode is New)
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // New Product Form State
  const [newBarcode, setNewBarcode] = useState("");
  const [newSku, setNewSku] = useState("");
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Electronics");
  const [newPrice, setNewPrice] = useState<number>(999);
  const [newRegularPrice, setNewRegularPrice] = useState<number>(1299);
  const [newStock, setNewStock] = useState<number>(50);
  const [newWarehouse, setNewWarehouse] = useState("Dhaka Warehouse");
  const [newImage, setNewImage] = useState("");

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Fetch live products
  const fetchProducts = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await fetch("/api/products?limit=200", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        const formatted: Product[] = data.products.map((p: any) => ({
          id: p.id,
          sku: p.sku || `SKU-${p.id}`,
          barcode: p.barcode || (p.sku ? p.sku.replace(/[^0-9]/g, "").padEnd(12, "0").slice(0, 12) : ""),
          name: p.name,
          category: p.category || "General",
          price: Number(p.salePrice || p.price || 0),
          regularPrice: Number(p.regularPrice || p.price || 0),
          stock: Number(p.stock || 0),
          warehouse: p.warehouse || "Dhaka Warehouse",
          image: Array.isArray(p.images) && p.images.length > 0 
            ? p.images[0] 
            : "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&auto=format&fit=crop&q=80"
        }));

        setProducts(formatted);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch categories & warehouses for dropdowns
  const fetchMeta = async () => {
    try {
      const [catRes, warRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/warehouses")
      ]);
      const catData = await catRes.json();
      const warData = await warRes.json();
      if (catData.success && Array.isArray(catData.categories)) {
        setCategories(catData.categories);
      }
      if (warData.success && Array.isArray(warData.warehouses)) {
        setWarehouses(warData.warehouses);
      }
    } catch (e) {
      console.error("Failed to fetch categories/warehouses:", e);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchMeta();
  }, []);

  // Handle Scanning Barcode
  const handleScanBarcode = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    // Search in DB loaded products
    const found = products.find(
      (p) =>
        p.barcode.toUpperCase() === trimmed ||
        p.sku.toUpperCase() === trimmed ||
        p.id.toUpperCase() === trimmed
    );

    if (found) {
      // Existing product found -> show options to update stock or edit
      setMatchedProduct(found);
      showToast(`📦 Product Found: "${found.name}" (Stock: ${found.stock}). You can quick-add stock below.`);
    } else {
      // New Barcode! Open Quick Entry Modal with scanned barcode
      setMatchedProduct(null);
      setNewBarcode(trimmed);
      // Auto generate suggested SKU from barcode
      const randomPrefix = "PROD";
      setNewSku(`${randomPrefix}-${trimmed.slice(-6)}`);
      setNewName("");
      setNewStock(50);
      setIsNewProductModalOpen(true);
      showToast(`⚡ New Barcode [${trimmed}] detected! Fill details to register in DB.`);
    }
    setBarcodeInput("");
  };

  // Quick Restock existing product
  const handleQuickAddStock = async () => {
    if (!matchedProduct || stockToAdd <= 0) return;
    setIsSavingStock(true);

    try {
      const newTotalStock = matchedProduct.stock + stockToAdd;
      const res = await fetch(`/api/products/${matchedProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newTotalStock })
      });

      const data = await res.json();
      if (data.success) {
        setMatchedProduct({ ...matchedProduct, stock: newTotalStock });
        setProducts((prev) =>
          prev.map((p) => (p.id === matchedProduct.id ? { ...p, stock: newTotalStock } : p))
        );
        showToast(`✅ Stock updated! Added +${stockToAdd} units to "${matchedProduct.name}". New Stock: ${newTotalStock}`);
        setIsAddStockOpen(false);
      } else {
        alert(data.message || "Failed to update stock");
      }
    } catch (e) {
      console.error("Error updating stock:", e);
      alert("Network error updating stock");
    } finally {
      setIsSavingStock(false);
    }
  };

  // Create New Product with Scanned Barcode in MongoDB
  const handleCreateProductWithBarcode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newBarcode.trim() || !newSku.trim()) {
      alert("Please fill in Product Name, SKU, and Barcode.");
      return;
    }

    setIsCreatingProduct(true);
    try {
      const payload = {
        name: newName.trim(),
        sku: newSku.trim().toUpperCase(),
        barcode: newBarcode.trim().toUpperCase(),
        category: newCategory,
        price: Number(newPrice) || 0,
        regularPrice: Number(newRegularPrice) || Number(newPrice) || 0,
        costPrice: Math.round((Number(newPrice) || 0) * 0.7),
        stock: Number(newStock) || 0,
        warehouse: newWarehouse,
        images: newImage ? [newImage.trim()] : ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80"],
        status: "Active",
        description: `Registered via Barcode Gun Scanner (${newBarcode}).`
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success && data.product) {
        const created = data.product;
        const newFormatted: Product = {
          id: created.id,
          sku: created.sku,
          barcode: created.barcode,
          name: created.name,
          category: created.category,
          price: created.price,
          regularPrice: created.regularPrice,
          stock: created.stock,
          warehouse: created.warehouse,
          image: created.images?.[0] || payload.images[0]
        };

        setProducts((prev) => [newFormatted, ...prev]);
        setMatchedProduct(newFormatted);
        setIsNewProductModalOpen(false);
        showToast(`🎉 Product "${newFormatted.name}" successfully created with Barcode ${newFormatted.barcode}!`);
      } else {
        alert(data.message || "Failed to register product");
      }
    } catch (err) {
      console.error("Product creation error:", err);
      alert("Network error creating product");
    } finally {
      setIsCreatingProduct(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Alert Banner */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce text-xs font-bold">
          <Zap className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Barcode className="w-8 h-8 text-primary" /> Barcode Product Entry & Management
          </h1>
          <p className="text-xs text-slate-500">
            Scan any physical barcode sticker to instantly register new products into MongoDB or update stock levels
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchProducts(false)}
            disabled={isRefreshing}
            className="btn btn-outline btn-sm gap-2 font-bold rounded-xl"
            title="Refresh inventory"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Products
          </button>
          <button 
            onClick={() => {
              setNewBarcode(`894${Date.now().toString().slice(-9)}`);
              setNewSku(`SKU-${Date.now().toString().slice(-6)}`);
              setNewName("");
              setIsNewProductModalOpen(true);
            }}
            className="btn btn-primary btn-sm gap-2 font-bold rounded-xl shadow-md"
          >
            <Plus className="w-4 h-4" /> Add Product with Custom Barcode
          </button>
        </div>
      </div>

      {/* BARCODE SCANNER ENTRY TERMINAL */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-xl text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500" /> Barcode Gun Scanner Terminal
            </h3>
            <p className="text-xs text-slate-500">
              Scan product barcode: If new ➔ automatically opens Product Entry Form. If existing ➔ opens Quick Stock Adder.
            </p>
          </div>
          <span className="badge badge-primary font-bold text-xs">{products.length} Products in System</span>
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleScanBarcode(barcodeInput);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Barcode className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Scan physical barcode or type any number (e.g. 894000123456)..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              className="input input-bordered w-full pl-10 font-mono font-bold text-slate-900 focus:outline-none rounded-2xl text-sm"
              autoFocus
            />
          </div>
          <button 
            type="submit"
            className="btn btn-primary font-bold rounded-2xl gap-2 shadow-md px-6"
          >
            Scan & Check
          </button>
        </form>

        {/* Quick Simulator Barcode buttons for test without machine */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider block">
            ⚡ Quick Test Simulator (Click any existing barcode OR click "Test New Unregistered Barcode"):
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button 
              type="button" 
              onClick={() => handleScanBarcode(`894${Math.floor(100000000 + Math.random() * 900000000)}`)}
              className="btn btn-xs bg-amber-400 text-slate-950 hover:bg-amber-300 font-bold rounded-lg gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Test Brand-New Barcode Entry
            </button>
            {products.slice(0, 5).map((p) => (
              <button 
                key={p.id}
                type="button" 
                onClick={() => handleScanBarcode(p.barcode || p.sku)}
                className="btn btn-xs btn-outline font-mono font-bold rounded-lg gap-1 hover:btn-primary"
              >
                <Barcode className="w-3 h-3" />
                <span>{p.barcode || p.sku}</span>
                <span className="text-slate-400">({p.name.slice(0, 14)}...)</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MATCHED PRODUCT RESULT & QUICK STOCK MANAGEMENT */}
      {matchedProduct && (
        <div className="bg-white p-6 rounded-3xl border border-primary/30 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="badge badge-success text-white font-extrabold text-xs flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> EXISTING PRODUCT IDENTIFIED
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsAddStockOpen(!isAddStockOpen)}
                className="btn btn-xs btn-primary font-bold rounded-lg gap-1"
              >
                <Boxes className="w-3.5 h-3.5" /> {isAddStockOpen ? "Close Quick Stock" : "+ Add Stock"}
              </button>
              <Link 
                href={`/admin/products/new?id=${matchedProduct.id}`}
                className="btn btn-xs btn-outline font-bold rounded-lg gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" /> Full Edit
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <img 
              src={matchedProduct.image} 
              alt={matchedProduct.name} 
              className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
            />

            <div className="space-y-1 flex-1">
              <h4 className="font-black text-xl text-slate-900">{matchedProduct.name}</h4>
              <p className="text-xs text-slate-500 font-bold">
                Category: <span className="text-slate-800">{matchedProduct.category}</span> • 
                Warehouse: <span className="text-slate-800">{matchedProduct.warehouse}</span>
              </p>
              <div className="flex items-center gap-3 pt-1">
                <span className="badge badge-neutral font-mono font-bold text-xs">
                  Barcode: {matchedProduct.barcode}
                </span>
                <span className="badge badge-ghost font-mono font-bold text-xs">
                  SKU: {matchedProduct.sku}
                </span>
                <span className="font-mono font-black text-slate-900 text-lg">
                  ৳{matchedProduct.price.toLocaleString()}
                </span>
                <span className="badge badge-accent text-slate-950 font-bold font-mono text-xs">
                  Current Stock: {matchedProduct.stock} units
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stock Add Box */}
          {isAddStockOpen && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 pt-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Add Stock Units:</span>
                <input 
                  type="number"
                  min={1}
                  value={stockToAdd}
                  onChange={(e) => setStockToAdd(Number(e.target.value))}
                  className="input input-sm input-bordered w-24 font-mono font-bold focus:outline-none rounded-xl"
                />
                <span className="text-xs text-slate-500">
                  ➔ New Stock will be <strong>{matchedProduct.stock + stockToAdd} units</strong>
                </span>
              </div>

              <button
                onClick={handleQuickAddStock}
                disabled={isSavingStock || stockToAdd <= 0}
                className="btn btn-sm btn-primary font-bold rounded-xl gap-1.5 shadow-sm"
              >
                {isSavingStock ? "Updating..." : "Save New Stock"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* REGISTERED PRODUCTS BARCODE TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
              <Barcode className="w-5 h-5 text-primary" /> Registered Products Barcode Directory
            </h3>
            <p className="text-xs text-slate-500">All inventory products with their assigned EAN/UPC barcodes and SKUs</p>
          </div>
          <span className="badge badge-primary font-bold text-xs">{products.length} Products</span>
        </div>

        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-xs font-bold text-slate-500">Loading barcode products from database...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No products found. Scan a barcode above to add your first product.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200">
                  <th>Product Name</th>
                  <th>Barcode Number</th>
                  <th>SKU Code</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td>
                      <div className="flex items-center gap-3">
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" 
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-sm line-clamp-1">{p.name}</p>
                          <span className="text-[10px] text-slate-400">{p.warehouse}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="font-mono font-black text-primary text-xs bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/20">
                        {p.barcode || "N/A"}
                      </span>
                    </td>

                    <td className="font-mono text-slate-700 font-bold">
                      {p.sku}
                    </td>

                    <td className="font-bold text-slate-600">
                      {p.category}
                    </td>

                    <td className="font-mono font-black text-slate-900 text-sm">
                      ৳{p.price.toLocaleString()}
                    </td>

                    <td>
                      <span className={`badge ${p.stock > 0 ? "badge-success text-white" : "badge-error text-white"} font-bold text-xs font-mono`}>
                        {p.stock} units
                      </span>
                    </td>

                    <td className="text-right">
                      <button
                        onClick={() => {
                          setMatchedProduct(p);
                          setIsAddStockOpen(true);
                        }}
                        className="btn btn-xs btn-outline font-bold rounded-lg gap-1"
                      >
                        <Boxes className="w-3 h-3 text-primary" /> +Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* NEW PRODUCT WITH BARCODE MODAL */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="badge badge-warning text-slate-950 font-black text-[10px] uppercase">
                  Barcode Product Entry
                </span>
                <h3 className="font-black text-2xl text-slate-900 mt-1">Register New Product</h3>
                <p className="text-xs text-slate-500">Instantly save new product linked to scanned barcode</p>
              </div>
              <button onClick={() => setIsNewProductModalOpen(false)} className="btn btn-ghost btn-circle btn-xs">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProductWithBarcode} className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-1 text-amber-900">
                <span className="text-[10px] font-extrabold uppercase">Scanned Barcode:</span>
                <div className="flex items-center gap-2 font-mono font-black text-lg text-amber-950">
                  <Barcode className="w-5 h-5 text-amber-600" /> {newBarcode}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless RGB Keyboard"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="input input-sm input-bordered w-full font-bold focus:outline-none rounded-xl"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value.toUpperCase())}
                    className="input input-sm input-bordered w-full font-mono font-bold focus:outline-none rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="select select-sm select-bordered w-full font-bold focus:outline-none rounded-xl"
                  >
                    {categories.length > 0 ? (
                      categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))
                    ) : (
                      <>
                        <option value="Electronics">Electronics</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Gadgets">Gadgets</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Sale Price (৳) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="input input-sm input-bordered w-full font-mono font-bold focus:outline-none rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Regular Price (৳)</label>
                  <input
                    type="number"
                    min={1}
                    value={newRegularPrice}
                    onChange={(e) => setNewRegularPrice(Number(e.target.value))}
                    className="input input-sm input-bordered w-full font-mono focus:outline-none rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Opening Stock *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="input input-sm input-bordered w-full font-mono font-bold focus:outline-none rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Warehouse Location</label>
                  <select
                    value={newWarehouse}
                    onChange={(e) => setNewWarehouse(e.target.value)}
                    className="select select-sm select-bordered w-full font-bold focus:outline-none rounded-xl"
                  >
                    {warehouses.length > 0 ? (
                      warehouses.map((w) => (
                        <option key={w.id} value={w.name}>{w.name}</option>
                      ))
                    ) : (
                      <>
                        <option value="Dhaka Warehouse">Dhaka Warehouse</option>
                        <option value="Chittagong Hub">Chittagong Hub</option>
                        <option value="Sylhet Warehouse">Sylhet Warehouse</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Product Image URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="input input-sm input-bordered w-full focus:outline-none rounded-xl font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="btn btn-sm btn-ghost font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingProduct}
                  className="btn btn-sm btn-primary font-bold rounded-xl px-5"
                >
                  {isCreatingProduct ? "Registering..." : "Save Product to DB"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
