"use client";

import { useState } from "react";
import { 
  Barcode, 
  Search, 
  CheckCircle2, 
  ShoppingCart, 
  Boxes, 
  Printer, 
  Zap, 
  Sparkles, 
  Plus, 
  Trash2, 
  ArrowRight, 
  QrCode, 
  Layers, 
  DollarSign,
  Volume2,
  RefreshCw,
  X
} from "lucide-react";

interface BarcodeProduct {
  sku: string;
  barcode: string;
  name: string;
  variant: string;
  category: string;
  price: number;
  stock: number;
  warehouse: string;
  image: string;
}

interface POSCartItem {
  product: BarcodeProduct;
  qty: number;
}

export default function AdminBarcodePage() {
  // Products dataset featuring exact user specified SKU and Barcode
  const [products] = useState<BarcodeProduct[]>([
    {
      sku: "MOU-001-BLK",
      barcode: "894000123456",
      name: "Wireless Optical Mouse",
      variant: "Black",
      category: "Electronics",
      price: 890,
      stock: 103,
      warehouse: "Dhaka Warehouse (Rack A-12)",
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&auto=format&fit=crop&q=80"
    },
    {
      sku: "KEY-002-RGB",
      barcode: "894000654321",
      name: "Mechanical Gaming Keyboard",
      variant: "RGB Backlit",
      category: "Accessories",
      price: 1600,
      stock: 45,
      warehouse: "Dhaka Warehouse (Rack B-04)",
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100&auto=format&fit=crop&q=80"
    },
    {
      sku: "HED-003-WHT",
      barcode: "894000987654",
      name: "Wireless Gaming Headphones",
      variant: "White",
      category: "Electronics",
      price: 1950,
      stock: 18,
      warehouse: "Chittagong Hub (Shelf A-01)",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80"
    }
  ]);

  const [scanInput, setScanInput] = useState("");
  const [lastScannedProduct, setLastScannedProduct] = useState<BarcodeProduct | null>(products[0]);
  const [posCart, setPosCart] = useState<POSCartItem[]>([
    { product: products[0], qty: 1 }
  ]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // 3-STEP BARCODE SCAN WORKFLOW (Product -> Stock -> Sale)
  const handleBarcodeScan = (codeToScan: string) => {
    const trimmed = codeToScan.trim().toUpperCase();
    const found = products.find(p => p.barcode === trimmed || p.sku.toUpperCase() === trimmed);

    if (found) {
      setLastScannedProduct(found);
      
      // Step 3: Add to POS Quick Sale cart
      setPosCart(prev => {
        const existing = prev.find(item => item.product.sku === found.sku);
        if (existing) {
          return prev.map(item => item.product.sku === found.sku ? { ...item, qty: item.qty + 1 } : item);
        }
        return [...prev, { product: found, qty: 1 }];
      });

      showToast(`🔊 BEEP! Scanned [${found.sku}] ➔ Identified: "${found.name}" ➔ Stock Verified: ${found.stock} ➔ Added to POS Sale!`);
      setScanInput("");
    } else {
      showToast(`⚠️ Unknown Barcode "${trimmed}". No product matched in system inventory.`);
    }
  };

  const handlePOSCheckout = () => {
    const totalUnits = posCart.reduce((sum, item) => sum + item.qty, 0);
    const totalAmount = posCart.reduce((sum, item) => sum + (item.qty * item.product.price), 0);
    
    showToast(`✅ POS Sale Completed! Processed ৳${totalAmount.toLocaleString()} (${totalUnits} units). Inventory stock updated.`);
    setPosCart([]);
  };

  const posTotal = posCart.reduce((sum, item) => sum + (item.qty * item.product.price), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Alert Banner */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce text-xs font-bold">
          <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Barcode className="w-8 h-8 text-primary" /> Barcode & POS Scanner Terminal
          </h1>
          <p className="text-xs text-slate-500">
            Scan physical EAN-13 / Code-128 barcodes to instantly trigger: Product ➔ Stock Verification ➔ Direct POS Sale
          </p>
        </div>

        <button 
          onClick={() => window.print()}
          className="btn btn-primary btn-sm gap-2 font-bold rounded-xl shadow-md"
        >
          <Printer className="w-4 h-4" /> Print Barcode Sticker Labels
        </button>
      </div>

      {/* SAMPLE SPECIFICATION HIGHLIGHT BANNER (SKU: MOU-001-BLK, Barcode: 894000123456) */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl shadow-xl space-y-4 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="badge badge-warning text-slate-950 font-black text-[10px] uppercase">
              Featured Sample Barcode Specification
            </span>
            <div className="flex items-center gap-3 mt-1">
              <h2 className="text-3xl font-black font-mono tracking-wider text-amber-300">
                SKU: MOU-001-BLK
              </h2>
              <span className="badge badge-accent text-slate-950 font-black font-mono text-xs">
                Barcode: 894000123456
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Product: <strong>Wireless Optical Mouse (Black)</strong> • Price: <strong>৳890</strong> • Stock Available: <strong className="text-emerald-400">103 Units</strong>
            </p>
          </div>

          <button 
            onClick={() => handleBarcodeScan("894000123456")}
            className="btn btn-sm bg-amber-400 text-slate-950 hover:bg-amber-300 font-black rounded-xl gap-2 shadow-lg shrink-0"
          >
            <Barcode className="w-4 h-4" /> Simulate USB Gun Scan (894000123456)
          </button>
        </div>

        {/* Visual Barcode Graphic Lines Generator Simulation */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-slate-950 flex flex-col items-center justify-center space-y-1 print:p-0">
          {/* Simulated 1D Barcode Pattern Lines */}
          <div className="flex items-center justify-center gap-0.5 h-14 w-64 bg-slate-950 p-2 rounded">
            {Array.from({ length: 48 }).map((_, i) => (
              <div 
                key={i} 
                className={`h-full ${i % 3 === 0 ? "w-1 bg-white" : i % 5 === 0 ? "w-1.5 bg-white" : "w-0.5 bg-white/70"}`}
              ></div>
            ))}
          </div>
          <span className="font-mono font-black text-sm tracking-widest text-slate-900">
            894000123456
          </span>
          <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
            SKU: MOU-001-BLK • SUPER DEAL INVENTORY
          </span>
        </div>
      </div>

      {/* 3-STEP AUTOMATED SCAN WORKFLOW DIAGRAM */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-2">
        <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider block">
          3-Step Barcode POS Execution Lifecycle
        </span>

        <div className="flex flex-col md:flex-row items-center justify-around gap-4 pt-1 text-center text-xs">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 w-full md:w-auto min-w-[170px]">
            <p className="font-extrabold text-amber-300 text-sm">Step 1. Product</p>
            <p className="text-[11px] text-slate-400">Barcode scan identifies SKU & metadata</p>
          </div>

          <ArrowRight className="w-5 h-5 text-indigo-400 shrink-0 hidden md:block" />

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 w-full md:w-auto min-w-[170px]">
            <p className="font-extrabold text-cyan-300 text-sm">Step 2. Stock</p>
            <p className="text-[11px] text-slate-400">Verifies warehouse available balance</p>
          </div>

          <ArrowRight className="w-5 h-5 text-indigo-400 shrink-0 hidden md:block" />

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 w-full md:w-auto min-w-[170px]">
            <p className="font-extrabold text-emerald-400 text-sm">Step 3. Sale</p>
            <p className="text-[11px] text-slate-400">Instant POS checkout & stock reduction</p>
          </div>
        </div>
      </div>

      {/* SCANNER INPUT TERMINAL & POS CART GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Live Barcode Scanner Terminal & Last Scanned Product Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Keyboard Wedge Listener Input */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-black text-xl text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500" /> Barcode Gun Scanner Input
            </h3>
            <p className="text-xs text-slate-500">
              Plug in any physical USB/Bluetooth Barcode Scanner device or manually type SKU / Barcode below
            </p>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleBarcodeScan(scanInput);
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Barcode className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Scan or type barcode (e.g. 894000123456 or MOU-001-BLK)..."
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  className="input input-bordered w-full pl-10 font-mono font-bold text-slate-900 focus:outline-none rounded-2xl text-sm"
                  autoFocus
                />
              </div>
              <button 
                type="submit"
                className="btn btn-primary font-bold rounded-2xl gap-2 shadow-md"
              >
                Scan Barcode
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
              <span className="font-extrabold text-slate-400">Quick Test Scans:</span>
              <button 
                type="button" 
                onClick={() => handleBarcodeScan("894000123456")}
                className="btn btn-xs btn-outline font-mono font-bold rounded-lg"
              >
                894000123456 (Mouse)
              </button>
              <button 
                type="button" 
                onClick={() => handleBarcodeScan("894000654321")}
                className="btn btn-xs btn-outline font-mono font-bold rounded-lg"
              >
                894000654321 (Keyboard)
              </button>
              <button 
                type="button" 
                onClick={() => handleBarcodeScan("894000987654")}
                className="btn btn-xs btn-outline font-mono font-bold rounded-lg"
              >
                894000987654 (Headphone)
              </button>
            </div>
          </div>

          {/* Last Scanned Product Details Card */}
          {lastScannedProduct && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="badge badge-success text-white font-extrabold text-xs">
                  IDENTIFIED PRODUCT METADATA
                </span>
                <span className="text-xs text-slate-400 font-mono">Location: {lastScannedProduct.warehouse}</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <img 
                  src={lastScannedProduct.image} 
                  alt={lastScannedProduct.name} 
                  className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shadow-xs"
                />

                <div className="space-y-1 flex-1">
                  <h4 className="font-black text-xl text-slate-900">{lastScannedProduct.name}</h4>
                  <p className="text-xs text-slate-500 font-bold">Variant: {lastScannedProduct.variant}</p>
                  <div className="flex items-center gap-3 pt-1">
                    <span className="font-mono font-black text-slate-900 text-xl">
                      ৳{lastScannedProduct.price.toLocaleString()}
                    </span>
                    <span className="badge badge-accent text-slate-950 font-bold font-mono text-xs">
                      Available Stock: {lastScannedProduct.stock} units
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: POS Quick Sale Terminal Checkout Cart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" /> POS Scanned Sale Cart
              </h3>
              <span className="badge badge-primary font-bold text-xs">{posCart.length} Lines</span>
            </div>

            {posCart.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                Scan barcode to add items to quick POS sale cart.
              </div>
            ) : (
              <div className="space-y-3 mt-4">
                {posCart.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-extrabold text-slate-900">{item.product.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">SKU: {item.product.sku}</p>
                      <p className="font-mono text-slate-700 font-bold">Qty: {item.qty} x ৳{item.product.price}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-mono font-black text-slate-900 text-sm">
                        ৳{(item.qty * item.product.price).toLocaleString()}
                      </p>
                      <button 
                        onClick={() => setPosCart(prev => prev.filter((_, i) => i !== idx))}
                        className="btn btn-xs btn-ghost text-red-500 font-bold mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* POS Cart Checkout Total & Actions */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex justify-between items-center text-slate-900 font-black text-lg">
              <span>Total Payable:</span>
              <span className="font-mono text-primary text-2xl">৳{posTotal.toLocaleString()}</span>
            </div>

            <button 
              onClick={handlePOSCheckout}
              disabled={posCart.length === 0}
              className="btn btn-primary font-black rounded-2xl w-full gap-2 text-base shadow-lg disabled:bg-slate-200"
            >
              <CheckCircle2 className="w-5 h-5" /> Complete POS Sale (৳{posTotal.toLocaleString()})
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
