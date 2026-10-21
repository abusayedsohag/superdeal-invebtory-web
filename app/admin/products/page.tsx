"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  Layers,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface Variant {
  id: string;
  color?: string;
  size?: string;
  attr1Name?: string;
  attr1Value?: string;
  attr2Name?: string;
  attr2Value?: string;
  sku: string;
  price: number;
  stock: number;
  barcode: string;
  image?: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  costPrice: number;
  price: number;
  stock: number;
  variantsCount: number;
  variants?: Variant[];
  status: string;
  image?: string;
  images?: string[];
  barcode?: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch products from DB via API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);

        // Extract unique categories for filter
        const uniqueCats = Array.from(
          new Set(data.products.map((p: Product) => p.category).filter(Boolean))
        ) as string[];
        setCategories(uniqueCats);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle product deletion via API
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete product");
      }

      // Optimistic state update
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Delete product error:", error);
      alert(error instanceof Error ? error.message : "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter products based on search, category and status
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        searchTerm.trim() === "" ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.barcode && p.barcode.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory =
        selectedCategory === "All Categories" ||
        p.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchStatus =
        selectedStatus === "All Statuses" || p.status === selectedStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Products Catalog</h1>
          <p className="text-xs text-slate-500">
            Manage inventory items, pricing, SKU, variants, and stock metrics in MongoDB
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="btn btn-outline btn-sm gap-1.5"
            title="Reload products from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link
            href="/admin/products/new"
            className="btn btn-primary btn-sm gap-2 font-bold shadow-md shadow-primary/20"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </Link>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by SKU or Name..."
            className="input input-sm input-bordered pl-9 w-full focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="select select-sm select-bordered focus:outline-none"
          >
            <option value="All Categories">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="select select-sm select-bordered focus:outline-none"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
              <th>Image</th>
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
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-12">
                  <span className="loading loading-spinner loading-md text-primary"></span>
                  <p className="text-xs text-slate-400 mt-2 font-medium">
                    Loading products from database...
                  </p>
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-slate-400">
                  <Package className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="font-bold text-slate-600">No products found</p>
                  <p className="text-xs text-slate-400">
                    Try adjusting your filters or click "Add New Product" to create one.
                  </p>
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const isDeleting = deletingId === p.id;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="p-2">
                      <img
                        src={p.images}
                        alt={p.name}
                        className="object-cover w-12 h-12 rounded-xl"
                      />
                    </td>
                    <td className="font-mono text-xs text-slate-500 font-bold">{p.sku}</td>
                    <td>
                      <div className="font-bold text-slate-900 line-clamp-1">{p.name}</div>
                      {p.barcode && (
                        <div className="text-[10px] text-slate-400 font-mono">
                          Barcode: {p.barcode}
                        </div>
                      )}
                    </td>
                    <td className="text-xs text-slate-600">
                      <span className="badge badge-sm badge-ghost font-medium">{p.category}</span>
                    </td>
                    <td className="text-slate-500">${Number(p.costPrice || 0).toFixed(2)}</td>
                    <td className="font-extrabold text-slate-900">
                      ${Number(p.price || 0).toFixed(2)}
                    </td>
                    <td>
                      <span className="badge badge-indigo badge-outline text-[11px] font-bold gap-1">
                        <Layers className="w-3 h-3 text-indigo-600" />{" "}
                        {p.variantsCount || (p.variants?.length ?? 0)} Variants
                      </span>
                    </td>
                    <td>
                      <span
                        className={`font-bold ${p.stock <= 5 ? "text-error" : "text-slate-800"
                          }`}
                      >
                        {p.stock} units
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm font-bold ${p.status === "Active"
                            ? "badge-success text-white"
                            : p.status === "Low Stock"
                              ? "badge-warning"
                              : p.status === "Draft"
                                ? "badge-neutral"
                                : "badge-error text-white"
                          }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit Button */}
                        <Link
                          href={`/admin/products/new?id=${p.id}`}
                          className="btn btn-ghost btn-xs text-slate-600 hover:text-primary"
                          title="Edit product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>

                        {/* Customer View Button */}
                        <Link
                          href={`/products/${p.id}`}
                          target="_blank"
                          className="btn btn-ghost btn-xs text-slate-600 hover:text-indigo-600"
                          title="View on customer storefront"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          disabled={isDeleting}
                          className="btn btn-ghost btn-xs text-slate-600 hover:text-error"
                          title="Delete product"
                        >
                          {isDeleting ? (
                            <span className="loading loading-spinner loading-xs text-error"></span>
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
