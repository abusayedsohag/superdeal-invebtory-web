"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  FolderTree, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Image as ImageIcon, 
  Globe, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  ChevronDown, 
  Layers, 
  Sparkles,
  Save,
  Tag
} from "lucide-react";

// Initial Category Tree Data Structure
const initialCategoryTree = [
  {
    id: "cat-1",
    name: "Electronics",
    slug: "electronics",
    icon: "💻",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1000&auto=format&fit=crop&q=80",
    seoTitle: "Best Electronics & Tech Accessories | SuperDeal",
    seoDescription: "Shop top rated laptops, mobile phones, headphones and smart accessories at lowest prices.",
    status: "Active",
    itemCount: 1450,
    subcategories: [
      { id: "sub-101", name: "Mobile", slug: "electronics/mobile", itemCount: 420, status: "Active" },
      { id: "sub-102", name: "Laptop", slug: "electronics/laptop", itemCount: 310, status: "Active" },
      { id: "sub-103", name: "Headphone", slug: "electronics/headphone", itemCount: 280, status: "Active" },
      { id: "sub-104", name: "Accessories", slug: "electronics/accessories", itemCount: 440, status: "Active" }
    ]
  },
  {
    id: "cat-2",
    name: "Fashion",
    slug: "fashion",
    icon: "👗",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&auto=format&fit=crop&q=80",
    seoTitle: "Trending Fashion Apparel & Shoes | SuperDeal",
    seoDescription: "Explore clothing collections for Men, Women and Kids with daily flash sales.",
    status: "Active",
    itemCount: 920,
    subcategories: [
      { id: "sub-201", name: "Men", slug: "fashion/men", itemCount: 380, status: "Active" },
      { id: "sub-202", name: "Women", slug: "fashion/women", itemCount: 410, status: "Active" },
      { id: "sub-203", name: "Kids", slug: "fashion/kids", itemCount: 130, status: "Active" }
    ]
  },
  {
    id: "cat-3",
    name: "Home & Kitchen",
    slug: "home-kitchen",
    icon: "🏠",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&auto=format&fit=crop&q=80",
    seoTitle: "Smart Home Appliances & Kitchenware | SuperDeal",
    seoDescription: "Upgrade your living room, dining and kitchen with high-quality home decor.",
    status: "Active",
    itemCount: 780,
    subcategories: [
      { id: "sub-301", name: "Kitchen Appliances", slug: "home-kitchen/appliances", itemCount: 320, status: "Active" },
      { id: "sub-302", name: "Furniture & Decor", slug: "home-kitchen/furniture", itemCount: 260, status: "Active" },
      { id: "sub-303", name: "Bedding & Bath", slug: "home-kitchen/bedding", itemCount: 200, status: "Active" }
    ]
  }
];

export default function AdminCategoriesPage() {
  const [categoryTree, setCategoryTree] = useState(initialCategoryTree);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "cat-1": true,
    "cat-2": true,
    "cat-3": true
  });

  // Modal State for Category Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  
  // Form State
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    parent: "none",
    slug: "",
    image: "",
    banner: "",
    seoTitle: "",
    seoDescription: "",
    status: "Active"
  });

  const toggleExpand = (id: string) => {
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setFormData({
      id: `cat-${Date.now()}`,
      name: "",
      parent: "none",
      slug: "",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&auto=format&fit=crop&q=80",
      banner: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1000&auto=format&fit=crop&q=80",
      seoTitle: "",
      seoDescription: "",
      status: "Active"
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: any, parentId = "none") => {
    setModalMode("edit");
    setFormData({
      id: cat.id,
      name: cat.name,
      parent: parentId,
      slug: cat.slug,
      image: cat.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&auto=format&fit=crop&q=80",
      banner: cat.banner || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1000&auto=format&fit=crop&q=80",
      seoTitle: cat.seoTitle || `${cat.name} Collection | SuperDeal`,
      seoDescription: cat.seoDescription || `Buy top rated ${cat.name} online with discount coupons.`,
      status: cat.status
    });
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) return;

    const generatedSlug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-");

    if (formData.parent === "none") {
      // Root Parent Category
      if (modalMode === "create") {
        setCategoryTree(prev => [
          ...prev,
          {
            id: formData.id,
            name: formData.name,
            slug: generatedSlug,
            icon: "📦",
            image: formData.image,
            banner: formData.banner,
            seoTitle: formData.seoTitle,
            seoDescription: formData.seoDescription,
            status: formData.status,
            itemCount: 0,
            subcategories: []
          }
        ]);
      } else {
        setCategoryTree(prev =>
          prev.map(c => c.id === formData.id ? { ...c, ...formData, slug: generatedSlug } : c)
        );
      }
    } else {
      // Subcategory under parent
      setCategoryTree(prev =>
        prev.map(parentCat => {
          if (parentCat.id === formData.parent) {
            const exists = parentCat.subcategories.some(s => s.id === formData.id);
            const updatedSubcats = exists
              ? parentCat.subcategories.map(s => s.id === formData.id ? { ...s, name: formData.name, slug: `${parentCat.slug}/${generatedSlug}`, status: formData.status } : s)
              : [...parentCat.subcategories, { id: formData.id, name: formData.name, slug: `${parentCat.slug}/${generatedSlug}`, itemCount: 0, status: formData.status }];
            return { ...parentCat, subcategories: updatedSubcats };
          }
          return parentCat;
        })
      );
    }

    setIsModalOpen(false);
  };

  const handleDeleteCategory = (catId: string, isSub = false, parentId = "") => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    if (!isSub) {
      setCategoryTree(prev => prev.filter(c => c.id !== catId));
    } else {
      setCategoryTree(prev =>
        prev.map(p => {
          if (p.id === parentId) {
            return { ...p, subcategories: p.subcategories.filter(s => s.id !== catId) };
          }
          return p;
        })
      );
    }
  };

  const toggleStatus = (catId: string, isSub = false, parentId = "") => {
    if (!isSub) {
      setCategoryTree(prev =>
        prev.map(c => c.id === catId ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" } : c)
      );
    } else {
      setCategoryTree(prev =>
        prev.map(p => {
          if (p.id === parentId) {
            return {
              ...p,
              subcategories: p.subcategories.map(s => s.id === catId ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" } : s)
            };
          }
          return p;
        })
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Category Management</h1>
          <p className="text-xs text-slate-500">Organize parent categories, subcategories, images, slugs, and SEO metadata</p>
        </div>
        <button onClick={handleOpenCreateModal} className="btn btn-primary btn-sm gap-2 font-bold shadow-md shadow-primary/20">
          <Plus className="w-4 h-4" /> Add Category / Subcategory
        </button>
      </div>

      {/* Category Tree Hierarchy Cards */}
      <div className="space-y-4">
        {categoryTree.map((parentCat) => {
          const isExpanded = expandedCategories[parentCat.id];

          return (
            <div key={parentCat.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Parent Category Header Row */}
              <div className="p-4 bg-slate-50/80 flex items-center justify-between gap-4 border-b border-slate-200">
                <div className="flex items-center gap-3 min-w-0">
                  <button onClick={() => toggleExpand(parentCat.id)} className="btn btn-ghost btn-xs btn-square">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>

                  <img src={parentCat.image} alt={parentCat.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{parentCat.icon}</span>
                      <h3 className="font-extrabold text-slate-900 text-base truncate">{parentCat.name}</h3>
                      <span className="badge badge-primary font-bold text-xs">{parentCat.itemCount} items</span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono truncate">Slug: /{parentCat.slug}</p>
                  </div>
                </div>

                {/* Parent Category Controls */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleStatus(parentCat.id)} 
                    className={`badge badge-sm font-bold cursor-pointer ${parentCat.status === "Active" ? "badge-success text-white" : "badge-neutral"}`}
                  >
                    {parentCat.status}
                  </button>

                  <button onClick={() => handleOpenEditModal(parentCat)} className="btn btn-ghost btn-xs text-slate-600 hover:text-primary">
                    <Edit className="w-4 h-4" />
                  </button>

                  <button onClick={() => handleDeleteCategory(parentCat.id)} className="btn btn-ghost btn-xs text-slate-600 hover:text-error">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subcategories Tree Section */}
              {isExpanded && (
                <div className="p-4 bg-white space-y-2">
                  <div className="text-[11px] font-bold uppercase text-slate-400 pl-8 mb-2 flex items-center gap-1">
                    <FolderTree className="w-3.5 h-3.5" /> Subcategories ({parentCat.subcategories.length})
                  </div>

                  <div className="space-y-1.5 pl-6 sm:pl-10">
                    {parentCat.subcategories.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between p-2.5 bg-slate-50/50 hover:bg-slate-100/60 rounded-xl border border-slate-100 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 font-mono">├──</span>
                          <span className="font-bold text-slate-900">{sub.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">/{sub.slug}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 font-medium">{sub.itemCount} items</span>
                          <button 
                            onClick={() => toggleStatus(sub.id, true, parentCat.id)} 
                            className={`badge badge-xs font-bold cursor-pointer ${sub.status === "Active" ? "badge-success text-white" : "badge-neutral"}`}
                          >
                            {sub.status}
                          </button>
                          <button onClick={() => handleOpenEditModal(sub, parentCat.id)} className="btn btn-ghost btn-xs text-slate-600 hover:text-primary">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteCategory(sub.id, true, parentCat.id)} className="btn btn-ghost btn-xs text-slate-600 hover:text-error">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT CATEGORY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-lg text-slate-900">
                {modalMode === "create" ? "Add New Category / Subcategory" : `Edit Category: ${formData.name}`}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost btn-circle btn-xs">✕</button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold uppercase text-slate-500">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Electronics, Mobile, Laptops"
                    className="input input-sm input-bordered w-full focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500">Parent Category</label>
                  <select
                    value={formData.parent}
                    onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                    className="select select-sm select-bordered w-full focus:outline-none"
                  >
                    <option value="none">Root Category (Main)</option>
                    {categoryTree.map(cat => (
                      <option key={cat.id} value={cat.id}>Under: {cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500">Slug (Auto Generated)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. electronics"
                    className="input input-sm input-bordered w-full font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500">Thumbnail Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="input input-sm input-bordered w-full focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500">Banner Image URL</label>
                  <input
                    type="text"
                    value={formData.banner}
                    onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                    className="input input-sm input-bordered w-full focus:outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold uppercase text-slate-500">SEO Title</label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    placeholder="e.g. Buy Electronics Online | SuperDeal"
                    className="input input-sm input-bordered w-full focus:outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold uppercase text-slate-500">SEO Meta Description</label>
                  <textarea
                    rows={2}
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    placeholder="Short SEO description for search engines..."
                    className="textarea textarea-bordered w-full text-xs focus:outline-none"
                  ></textarea>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="select select-sm select-bordered w-full focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-sm btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-sm btn-primary gap-1 font-bold">
                  <Save className="w-4 h-4" /> Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
