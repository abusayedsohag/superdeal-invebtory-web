"use client";

import { useState, useEffect } from "react";
import { 
  Zap, 
  Plus, 
  ShoppingBag, 
  Trash2, 
  X,
  RefreshCw,
  Clock,
  Calendar,
  Flame,
  CheckCircle2,
  TrendingUp,
  Percent,
  Search,
  Filter,
  Eye,
  AlertCircle
} from "lucide-react";

interface FlashSaleCampaign {
  title: string;
  subtitle: string;
  badge: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface FlashSaleProduct {
  _id?: string;
  id: string;
  name: string;
  category: string;
  originalPrice: number;
  flashPrice: number;
  discount: string;
  allocatedStock: number;
  soldStock: number;
  image: string;
  isActive?: boolean;
}

interface CatalogProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  regularPrice?: number;
  stock: number;
  images?: string[];
}

export default function AdminMarketingPage() {
  const [flashProducts, setFlashProducts] = useState<FlashSaleProduct[]>([]);
  const [campaign, setCampaign] = useState<FlashSaleCampaign>({
    title: "Flash Sale Hot Deals",
    subtitle: "Massive discount prices ending very soon!",
    badge: "FLASH DEAL",
    startTime: "",
    endTime: "",
    isActive: true,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Available Catalog Products for Easy Selection
  const [catalogProducts, setCatalogProducts] = useState<CatalogProduct[]>([]);
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>("");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Flash Product Form State
  const [newProductName, setNewProductName] = useState("");
  const [newCategory, setNewCategory] = useState("Electronics");
  const [newOrigPrice, setNewOrigPrice] = useState(1000);
  const [newFlashPrice, setNewFlashPrice] = useState(600);
  const [newStock, setNewStock] = useState(50);
  const [newImage, setNewImage] = useState("");

  // Campaign Edit Form State (SSR safe)
  const [campaignForm, setCampaignForm] = useState({
    title: "",
    subtitle: "",
    badge: "",
    endTime: "",
    isActive: true
  });

  // Countdown display
  const [timeLeft, setTimeLeft] = useState<{ hours: string; minutes: string; seconds: string }>({
    hours: "00",
    minutes: "00",
    seconds: "00"
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch Flash Deals & Campaign
  const fetchFlashDeals = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await fetch("/api/flash-deals", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        if (Array.isArray(data.items)) {
          setFlashProducts(data.items);
        }
        if (data.campaign) {
          setCampaign(data.campaign);
          // Format endTime for datetime-local input safely
          let formattedEnd = "";
          if (data.campaign.endTime) {
            try {
              const d = new Date(data.campaign.endTime);
              if (!isNaN(d.getTime())) {
                const pad = (n: number) => String(n).padStart(2, "0");
                formattedEnd = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
              }
            } catch (e) {
              console.error("Date format error:", e);
            }
          }
          setCampaignForm({
            title: data.campaign.title,
            subtitle: data.campaign.subtitle,
            badge: data.campaign.badge,
            endTime: formattedEnd,
            isActive: data.campaign.isActive ?? true
          });
        }
      }
    } catch (err) {
      console.error("Failed to load flash deals:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch existing product catalog so admin can pick existing products directly
  const fetchCatalogProducts = async () => {
    try {
      const res = await fetch("/api/products?limit=100", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setCatalogProducts(data.products);
      }
    } catch (e) {
      console.error("Failed to load catalog products:", e);
    }
  };

  useEffect(() => {
    fetchFlashDeals();
    fetchCatalogProducts();
  }, []);

  // Countdown Timer calculation
  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!campaign.endTime) return;
      const target = new Date(campaign.endTime).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const totalSec = Math.floor(difference / 1000);
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;

      setTimeLeft({
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0")
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [campaign.endTime]);

  // When user picks a product from catalog dropdown, populate form
  const handleSelectCatalogProduct = (prodId: string) => {
    setSelectedCatalogId(prodId);
    if (!prodId) return;

    const prod = catalogProducts.find((p) => p.id === prodId);
    if (prod) {
      setNewProductName(prod.name);
      setNewCategory(prod.category || "General");
      const orig = prod.regularPrice || prod.price || 1000;
      setNewOrigPrice(orig);
      // default 30% discount
      setNewFlashPrice(Math.round(orig * 0.7));
      setNewStock(Math.min(prod.stock || 50, 50));
      if (prod.images && prod.images.length > 0) {
        setNewImage(prod.images[0]);
      }
    }
  };

  // Add Product to Flash Sale
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    setIsSubmitting(true);
    const discPercent = Math.max(1, Math.round(((newOrigPrice - newFlashPrice) / newOrigPrice) * 100));

    try {
      const res = await fetch("/api/flash-deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedCatalogId || undefined,
          name: newProductName.trim(),
          category: newCategory,
          originalPrice: newOrigPrice,
          flashPrice: newFlashPrice,
          discount: `${discPercent}% OFF`,
          allocatedStock: newStock,
          soldStock: 0,
          image: newImage || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80"
        })
      });

      const data = await res.json();
      if (data.success && data.item) {
        setFlashProducts((prev) => [data.item, ...prev]);
        setIsAddModalOpen(false);
        showToast(`'${newProductName}' added to Flash Sale!`);
        // Reset form
        setNewProductName("");
        setSelectedCatalogId("");
        setNewOrigPrice(1000);
        setNewFlashPrice(600);
        setNewStock(50);
        setNewImage("");
      } else {
        alert(data.message || "Failed to add product");
      }
    } catch (err) {
      console.error("Add flash product error:", err);
      alert("Network error adding flash sale product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remove Product from Flash Sale
  const handleRemoveProduct = async (product: FlashSaleProduct) => {
    if (!confirm(`Remove '${product.name}' from flash sale?`)) return;

    // Optimistic remove
    setFlashProducts((prev) => prev.filter((p) => p.id !== product.id));

    try {
      const param = product._id ? `_id=${product._id}` : `id=${product.id}`;
      const res = await fetch(`/api/flash-deals?${param}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Product removed from Flash Sale");
      } else {
        showToast(data.message || "Failed to remove product");
        fetchFlashDeals(false);
      }
    } catch (err) {
      console.error("Remove flash product error:", err);
      fetchFlashDeals(false);
    }
  };

  // Save Campaign Settings (Title, End Time, Active Status)
  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/flash-deals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: "campaign",
          title: campaignForm.title,
          subtitle: campaignForm.subtitle,
          badge: campaignForm.badge,
          endTime: campaignForm.endTime ? new Date(campaignForm.endTime).toISOString() : campaign.endTime,
          isActive: campaignForm.isActive
        })
      });

      const data = await res.json();
      if (data.success) {
        setCampaign((prev) => ({
          ...prev,
          title: campaignForm.title,
          subtitle: campaignForm.subtitle,
          badge: campaignForm.badge,
          endTime: campaignForm.endTime ? new Date(campaignForm.endTime).toISOString() : prev.endTime,
          isActive: campaignForm.isActive
        }));
        setIsCampaignModalOpen(false);
        showToast("Campaign settings updated successfully!");
      } else {
        alert(data.message || "Failed to update campaign");
      }
    } catch (err) {
      console.error("Save campaign error:", err);
      alert("Network error updating campaign settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick stats calculations
  const totalAllocated = flashProducts.reduce((sum, p) => sum + (p.allocatedStock || 0), 0);
  const totalClaimed = flashProducts.reduce((sum, p) => sum + (p.soldStock || 0), 0);
  const claimRate = totalAllocated > 0 ? Math.round((totalClaimed / totalAllocated) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-success shadow-lg text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Zap className="w-8 h-8 text-amber-500 fill-amber-500" /> Flash Sale Management
          </h1>
          <p className="text-xs text-slate-500">
            Schedule limited-time promotion events, set start/end timestamps, assign discounted products, and sync live to homepage
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchFlashDeals(false)}
            disabled={isRefreshing}
            className="btn btn-outline btn-sm gap-2 font-bold rounded-xl"
            title="Refresh Flash Deals"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => setIsCampaignModalOpen(true)}
            className="btn btn-neutral btn-sm gap-2 font-bold rounded-xl"
          >
            <Clock className="w-4 h-4 text-amber-400" /> Edit Campaign Timer
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary btn-sm gap-2 font-bold shadow-md rounded-xl"
          >
            <Plus className="w-4 h-4" /> Add Product to Flash Sale
          </button>
        </div>
      </div>

      {/* LIVE CAMPAIGN BANNER CARD */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="badge badge-warning text-slate-950 font-black text-xs px-3 py-1 uppercase tracking-wider">
              {campaign.badge || "FLASH DEAL"}
            </span>
            <span className={`badge ${campaign.isActive ? "badge-success text-white" : "badge-ghost text-white/80"} font-bold text-xs`}>
              {campaign.isActive ? "● Active on Website" : "○ Inactive"}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{campaign.title}</h2>
          <p className="text-xs text-white/85">{campaign.subtitle}</p>
        </div>

        {/* Live Countdown Display */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col items-center md:items-end space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 animate-pulse" /> Live Deal Countdown
          </span>
          <div className="flex items-center gap-2 font-mono text-xl sm:text-2xl font-black">
            <div className="bg-slate-950/40 px-3 py-1.5 rounded-xl border border-white/10 text-center">
              <span>{timeLeft.hours}</span>
              <span className="block text-[9px] font-sans font-normal text-white/70">HRS</span>
            </div>
            <span>:</span>
            <div className="bg-slate-950/40 px-3 py-1.5 rounded-xl border border-white/10 text-center">
              <span>{timeLeft.minutes}</span>
              <span className="block text-[9px] font-sans font-normal text-white/70">MIN</span>
            </div>
            <span>:</span>
            <div className="bg-slate-950/40 px-3 py-1.5 rounded-xl border border-white/10 text-center text-amber-300">
              <span>{timeLeft.seconds}</span>
              <span className="block text-[9px] font-sans font-normal text-white/70">SEC</span>
            </div>
          </div>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-primary" /> Flash Products
          </span>
          <p className="text-2xl font-black text-slate-900">{flashProducts.length}</p>
          <span className="text-[11px] text-slate-500">Live in flash catalog</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" /> Total Stock Pool
          </span>
          <p className="text-2xl font-black text-amber-600">{totalAllocated.toLocaleString()}</p>
          <span className="text-[11px] text-slate-500">Allocated units</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Units Claimed
          </span>
          <p className="text-2xl font-black text-emerald-600">{totalClaimed.toLocaleString()}</p>
          <span className="text-[11px] text-slate-500">Claimed by shoppers</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-indigo-500" /> Claim Rate
          </span>
          <p className="text-2xl font-black text-indigo-600">{claimRate}%</p>
          <span className="text-[11px] text-slate-500">Stock sellout velocity</span>
        </div>
      </div>

      {/* FLASH SALE PRODUCTS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-xl text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" /> Included Flash Sale Products
            </h3>
            <p className="text-xs text-slate-500">Products assigned to active flash sale campaign synced with customer homepage</p>
          </div>
          <span className="badge badge-primary font-bold text-xs">{flashProducts.length} Items</span>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-xs font-bold text-slate-500">Loading flash sale products from database...</p>
          </div>
        ) : flashProducts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Zap className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-lg">No Flash Sale Products</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't assigned any products to the flash sale yet. Click below to add one.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary btn-sm rounded-xl font-bold gap-2 mt-2"
            >
              <Plus className="w-4 h-4" /> Add Flash Product
            </button>
          </div>
        ) : (
          /* Interactive Products Table */
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
                  const soldPercent = p.allocatedStock > 0 
                    ? Math.min(100, Math.round(((p.soldStock || 0) / p.allocatedStock) * 100))
                    : 0;

                  return (
                    <tr key={p.id || p._id} className="hover:bg-slate-50/50">
                      <td>
                        <div className="flex items-center gap-3">
                          <img 
                            src={p.image || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&auto=format&fit=crop&q=80"} 
                            alt={p.name} 
                            className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0" 
                          />
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
                            <span className="text-slate-600">{p.soldStock || 0} claimed</span>
                            <span className="text-primary font-mono">{soldPercent}%</span>
                          </div>
                          <progress className="progress progress-primary w-full h-2" value={soldPercent} max="100"></progress>
                        </div>
                      </td>

                      <td className="text-right">
                        <button
                          onClick={() => handleRemoveProduct(p)}
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
        )}
      </div>

      {/* EDIT CAMPAIGN MODAL */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-xl text-slate-900">Edit Campaign & Timer</h3>
                <p className="text-xs text-slate-500">Configure countdown timestamp and event titles</p>
              </div>
              <button onClick={() => setIsCampaignModalOpen(false)} className="btn btn-ghost btn-circle btn-xs">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={campaignForm.title}
                  onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
                  className="input input-sm input-bordered w-full font-bold focus:outline-none rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Subtitle / Description</label>
                <input
                  type="text"
                  value={campaignForm.subtitle}
                  onChange={(e) => setCampaignForm({ ...campaignForm, subtitle: e.target.value })}
                  className="input input-sm input-bordered w-full focus:outline-none rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Badge Label</label>
                  <input
                    type="text"
                    value={campaignForm.badge}
                    onChange={(e) => setCampaignForm({ ...campaignForm, badge: e.target.value })}
                    className="input input-sm input-bordered w-full font-bold uppercase focus:outline-none rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Campaign Status</label>
                  <select
                    value={campaignForm.isActive ? "active" : "inactive"}
                    onChange={(e) => setCampaignForm({ ...campaignForm, isActive: e.target.value === "active" })}
                    className="select select-sm select-bordered w-full font-bold focus:outline-none rounded-xl"
                  >
                    <option value="active">Active (Shown on site)</option>
                    <option value="inactive">Paused / Inactive</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Deal Ends At (Timestamp) *</label>
                <input
                  type="datetime-local"
                  required
                  value={campaignForm.endTime}
                  onChange={(e) => setCampaignForm({ ...campaignForm, endTime: e.target.value })}
                  className="input input-sm input-bordered w-full font-mono font-bold focus:outline-none rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCampaignModalOpen(false)}
                  className="btn btn-sm btn-ghost font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-sm btn-primary font-bold rounded-xl"
                >
                  {isSubmitting ? "Saving..." : "Save Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD PRODUCT TO FLASH SALE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-xl text-slate-900">Add Product to Flash Sale</h3>
                <p className="text-xs text-slate-500">Pick from existing product catalog or create new flash entry</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="btn btn-ghost btn-circle btn-xs">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              {/* Optional: Pick from Catalog */}
              {catalogProducts.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <label className="font-bold text-slate-700 block">Select from Existing Inventory (Optional)</label>
                  <select
                    value={selectedCatalogId}
                    onChange={(e) => handleSelectCatalogProduct(e.target.value)}
                    className="select select-sm select-bordered w-full font-bold focus:outline-none rounded-xl text-xs"
                  >
                    <option value="">-- Choose existing product or enter custom below --</option>
                    {catalogProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (৳{p.regularPrice || p.price} | Stock: {p.stock})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Gaming Headphone ANC"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="input input-sm input-bordered w-full focus:outline-none rounded-xl font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Category</label>
                <input
                  type="text"
                  placeholder="e.g. Electronics"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="input input-sm input-bordered w-full focus:outline-none rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Regular Price (৳) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newOrigPrice}
                    onChange={(e) => setNewOrigPrice(Number(e.target.value))}
                    className="input input-sm input-bordered w-full font-mono font-bold focus:outline-none rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Flash Sale Price (৳) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newFlashPrice}
                    onChange={(e) => setNewFlashPrice(Number(e.target.value))}
                    className="input input-sm input-bordered w-full font-mono font-bold text-amber-600 focus:outline-none rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Allocated Flash Stock *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="input input-sm input-bordered w-full font-mono focus:outline-none rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Calculated Discount</label>
                  <div className="input input-sm input-bordered w-full flex items-center bg-slate-100 font-mono font-bold text-red-600 rounded-xl">
                    {newOrigPrice > newFlashPrice
                      ? `${Math.round(((newOrigPrice - newFlashPrice) / newOrigPrice) * 100)}% OFF`
                      : "0% OFF"}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="input input-sm input-bordered w-full focus:outline-none rounded-xl text-xs font-mono"
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
                  disabled={isSubmitting}
                  className="btn btn-sm btn-primary font-bold rounded-xl"
                >
                  {isSubmitting ? "Adding..." : "Add to Flash Sale"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
