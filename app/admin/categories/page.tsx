"use client";

import { useEffect, useState } from "react";
import { DynamicIcon } from "lucide-react/dynamic";
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  ChevronRight,
  ChevronDown,
  Save,
} from "lucide-react";

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  image?: string;
  icon?: string;
  itemCount: number;
  seoTitle?: string;
  seoDescription?: string;
  status: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  icon?: string;
  itemCount?: number;
  seoTitle?: string;
  seoDescription?: string;
  status?: string;
  subcategories: Subcategory[];
}

export default function AdminCategoriesPage() {

  const [categoryTree, setCategoryTree] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({"cat-1": true,});

  // Modal State for Category Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const result = await response.json();

      if (result.success) {
        setCategoryTree(result.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [isModalOpen]);

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    parent: "none",
    slug: "",
    image: "",
    icon: "",
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
      id: "",
      name: "",
      parent: "none",
      slug: "",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&auto=format&fit=crop&q=80",
      icon: "",
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
      slug: "",
      image: cat.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&auto=format&fit=crop&q=80",
      icon: cat.icon,
      seoTitle: cat.seoTitle || `${cat.name} Collection | SuperDeal`,
      seoDescription: cat.seoDescription || `Buy top rated ${cat.name} online with discount coupons.`,
      status: cat.status
    });
    setIsModalOpen(true);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const generatedSlug =
      formData.slug.trim() ||
      formData.name.trim().toLowerCase().replace(/\s+/g, "-");

    const isParent = formData.parent === "none";

    const parentCategory = isParent ? null :
      categoryTree.find((c) => c.id === formData.parent);

    if (!isParent && !parentCategory) {
      alert("Parent category not Found");
      return;
    }

    const finalSlug = isParent
      ? generatedSlug
      : `${parentCategory?.slug}/${generatedSlug}`;


    const data = {
      name: formData.name.trim(),
      slug: finalSlug,
      parentId: isParent ? null : formData.parent,
      image: formData.image || "",
      icon: formData.icon || "",
      seoTitle: formData.seoTitle || "",
      seoDescription: formData.seoDescription || "",
      status: formData.status,
    };

    try {
      const isCreate = modalMode === "create";

      const response = await fetch("/api/categories", {
        method: isCreate ? "POST" : "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          isCreate ? data : { ...data, id: formData.id }
        ),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save category");
      }
    } catch (error) {
      console.error("Save category error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
    setIsModalOpen(false);
  };

  const handleDeleteCategory = async (catId: string, isSub = false, parentId = "") => {
    const itemType = isSub ? "subcategory" : "category";
    if (!confirm(`Are you sure you want to delete this ${itemType}?`)) return;

    setDeletingId(catId);
    try {
      const response = await fetch("/api/categories", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: catId,
          parentId: isSub ? parentId : null,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || `Failed to delete ${itemType}`);
      }

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
    } catch (error) {
      console.error("Delete category error:", error);
      alert(error instanceof Error ? error.message : "Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleStatus = async (catId: string, isSub = false, parentId = "") => {
    let newStatus = "Active";
    if (!isSub) {
      const cat = categoryTree.find(c => c.id === catId);
      newStatus = cat?.status === "Active" ? "Inactive" : "Active";
      setCategoryTree(prev =>
        prev.map(c => c.id === catId ? { ...c, status: newStatus } : c)
      );
    } else {
      const parent = categoryTree.find(p => p.id === parentId);
      const sub = parent?.subcategories.find(s => s.id === catId);
      newStatus = sub?.status === "Active" ? "Inactive" : "Active";
      setCategoryTree(prev =>
        prev.map(p => {
          if (p.id === parentId) {
            return {
              ...p,
              subcategories: p.subcategories.map(s => s.id === catId ? { ...s, status: newStatus } : s)
            };
          }
          return p;
        })
      );
    }

    try {
      await fetch("/api/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: catId,
          parentId: isSub ? parentId : null,
          status: newStatus,
        }),
      });
    } catch (err) {
      console.error("Failed to update status in DB:", err);
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

                  <div className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center shrink-0">
                    <DynamicIcon
                      name={parentCat.icon as any}
                      size={40}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base truncate">{parentCat.name}</h3>
                      <span className="badge badge-primary font-bold text-xs">{parentCat.itemCount} items</span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 font-mono truncate badge badge-soft">{parentCat.subcategories.length} Subcategories</p>
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

                  <button
                    onClick={() => handleDeleteCategory(parentCat.id)}
                    disabled={deletingId === parentCat.id}
                    title="Delete category"
                    className="btn btn-ghost btn-xs text-slate-600 hover:text-error"
                  >
                    {deletingId === parentCat.id ? (
                      <span className="loading loading-spinner loading-xs text-error"></span>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
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
                          <DynamicIcon
                            name={sub.icon as any}
                            size={20}
                          />
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
                          <button
                            onClick={() => handleDeleteCategory(sub.id, true, parentCat.id)}
                            disabled={deletingId === sub.id}
                            title="Delete subcategory"
                            className="btn btn-ghost btn-xs text-slate-600 hover:text-error"
                          >
                            {deletingId === sub.id ? (
                              <span className="loading loading-spinner loading-xs text-error"></span>
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
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
                  <label className="text-xs font-bold uppercase text-slate-500">Category Name</label>
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
                    required
                    disabled={modalMode === "edit"}
                    className="select select-sm select-bordered w-full focus:outline-none"
                  >
                    <option value="none">Root Category</option>
                    {categoryTree.map(cat => (
                      <option key={cat.id} value={cat.id}>Under: {cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500">Slug</label>
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
                    required
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="input input-sm input-bordered w-full focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500">Lucide Icon Name</label>
                  <input
                    type="text"
                    value={formData.icon as any}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    required
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
