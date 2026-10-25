"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  Barcode,
  MapPin,
  CheckCircle,
  Copy,
  Sparkles,
  Sliders,
  X,
} from "lucide-react";

interface Variant {
  id: string;
  attr1Name?: string;
  attr1Value: string;
  attr2Name?: string;
  attr2Value?: string;
  color?: string;
  size?: string;
  sku: string;
  price: number;
  stock: number;
  barcode: string;
  image?: string;
}

interface SubcategoryItem {
  id: string;
  name: string;
  slug?: string;
  status?: string;
}

interface CategoryItem {
  id: string;
  name: string;
  slug?: string;
  subcategories?: SubcategoryItem[];
}

const COMMON_ATTRIBUTES: { [key: string]: string } = {
  Color: "Color (e.g. Black, White, Red)",
  Size: "Size (e.g. S, M, L, XL, XXL)",
  "Storage (ROM)": "Storage (ROM) (e.g. 128GB, 256GB, 512GB, 1TB)",
  RAM: "RAM (e.g. 8GB, 16GB, 32GB)",
  "Shoe Size": "Shoe Size (e.g. EU 40, EU 41, EU 42, US 9)",
  "Weight / Volume": "Weight / Volume (e.g. 250g, 500g, 1kg, 2L)",
  "Bottle Volume": "Bottle Volume (e.g. 30ml, 50ml, 100ml)",
  Flavor: "Flavor (e.g. Vanilla, Chocolate, Mango)",
  "Scent / Fragrance": "Scent / Fragrance (e.g. Oud, Amber, Floral)",
  Material: "Material (e.g. Leather, Cotton, Teak Wood)",
  "Dimension / Bed Size": "Dimension / Bed Size (e.g. Single, Queen, King)",
  "Pack Quantity": "Pack Quantity (e.g. 1-Pack, 3-Pack, 10-Pack)",
  Edition: "Edition (e.g. Standard, Pro, Limited Edition)",
  Connectivity: "Connectivity (e.g. WiFi, 5G, Bluetooth)",
  "Custom Attribute": "Custom Attribute (Type your own)",
};

function ProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEditMode = Boolean(editId);

  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  // Product Basic Info Form State
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [category, setCategory] = useState("Fashion");
  const [subcategory, setSubcategory] = useState("");
  const [brand, setBrand] = useState("");
  const [tags, setTags] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [status, setStatus] = useState("Active");

  // Multi-Image State
  const [mainImage, setMainImage] = useState(
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
  );
  const [galleryImages, setGalleryImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80",
  ]);

  // Pricing Form State
  const [purchasePrice, setPurchasePrice] = useState<number>(50);
  const [costPrice, setCostPrice] = useState<number>(55);
  const [regularPrice, setRegularPrice] = useState<number>(100);
  const [salePrice, setSalePrice] = useState<number>(85);
  const [wholesalePrice, setWholesalePrice] = useState<number>(65);
  const [discountPercent, setDiscountPercent] = useState<number>(15);
  const [taxPercent, setTaxPercent] = useState<number>(7.5);

  // Profit margin calculation
  const profit = salePrice - costPrice;
  const marginPercent = salePrice > 0 ? ((profit / salePrice) * 100).toFixed(1) : "0";

  // Inventory Form State
  const [stock, setStock] = useState<number>(145);
  const [reservedStock, setReservedStock] = useState<number>(15);
  const [reorderLevel, setReorderLevel] = useState<number>(20);
  const [minStock, setMinStock] = useState<number>(10);
  const [maxStock, setMaxStock] = useState<number>(500);
  const [warehouse, setWarehouse] = useState("MainDhaka");
  const [rackLocation, setRackLocation] = useState("Rack B-04 / Shelf 3");

  const availableStock = Math.max(0, stock - reservedStock);

  // Dynamic Variant Attributes Configuration
  const [attr1Type, setAttr1Type] = useState<string>("Color");
  const [customAttr1Name, setCustomAttr1Name] = useState<string>("");
  const [attr2Type, setAttr2Type] = useState<string>("Size");
  const [customAttr2Name, setCustomAttr2Name] = useState<string>("");

  // Variants Generator State
  const [variants, setVariants] = useState<Variant[]>([
    {
      id: "1",
      attr1Name: "Color",
      attr1Value: "Black",
      attr2Name: "Size",
      attr2Value: "M",
      color: "Black",
      size: "M",
      sku: "VAR-BLK-M",
      price: 85,
      stock: 40,
      barcode: "890123456701",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80",
    },
    {
      id: "2",
      attr1Name: "Color",
      attr1Value: "White",
      attr2Name: "Size",
      attr2Value: "L",
      color: "White",
      size: "L",
      sku: "VAR-WHT-L",
      price: 85,
      stock: 35,
      barcode: "890123456702",
      image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=200&auto=format&fit=crop&q=80",
    },
  ]);

  // Load available categories and their subcategories from DB
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch("/api/categories/category");
        const data = await res.json();
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
          if (!isEditMode && !category) {
            const firstCat = data.categories[0];
            setCategory(firstCat.name);
            const firstSubs = (firstCat.subcategories || []).filter(
              (s: SubcategoryItem) => s.status !== "Inactive"
            );
            if (firstSubs.length > 0) {
              setSubcategory(firstSubs[0].name);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCats();
  }, [isEditMode, category]);

  // When category changes, auto-select the first subcategory or clear if none
  const handleCategoryChange = (newCatName: string) => {
    setCategory(newCatName);
    const selectedCat = categories.find((c) => c.name === newCatName);
    const activeSubs = (selectedCat?.subcategories || []).filter(
      (s) => s.status !== "Inactive"
    );
    if (activeSubs.length > 0) {
      setSubcategory(activeSubs[0].name);
    } else {
      setSubcategory("");
    }

    // Auto-suggest attributes based on selected category if still on default
    const catLower = newCatName.toLowerCase();
    if (catLower.includes("elect") || catLower.includes("gadget") || catLower.includes("computer")) {
      handleAttr1TypeChange("Storage (ROM)");
      handleAttr2TypeChange("RAM");
    } else if (catLower.includes("shoe") || catLower.includes("footwear")) {
      handleAttr1TypeChange("Color");
      handleAttr2TypeChange("Shoe Size");
    } else if (catLower.includes("beauty") || catLower.includes("perfume") || catLower.includes("cosmetic")) {
      handleAttr1TypeChange("Bottle Volume");
      handleAttr2TypeChange("Scent / Fragrance");
    } else if (catLower.includes("food") || catLower.includes("grocery") || catLower.includes("supp")) {
      handleAttr1TypeChange("Weight / Volume");
      handleAttr2TypeChange("Flavor");
    } else if (catLower.includes("furn") || catLower.includes("home") || catLower.includes("decor")) {
      handleAttr1TypeChange("Dimension / Bed Size");
      handleAttr2TypeChange("Material");
    } else if (catLower.includes("fashion") || catLower.includes("apparel") || catLower.includes("cloth")) {
      handleAttr1TypeChange("Color");
      handleAttr2TypeChange("Size");
    }
  };

  // Find subcategories belonging to currently selected category
  const selectedCategoryObj = categories.find((c) => c.name === category);
  const availableSubcategories = (selectedCategoryObj?.subcategories || []).filter(
    (s) => s.status !== "Inactive"
  );

  // If in Edit Mode, fetch existing product data from DB
  useEffect(() => {
    if (!editId) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?id=${editId}`);
        const data = await res.json();

        if (data.success && data.product) {
          const p = data.product;
          setName(p.name || "");
          setSku(p.sku || "");
          setBarcode(p.barcode || "");
          setCategory(p.category || "Fashion");
          setSubcategory(p.subcategory || "");
          setBrand(p.brand || "");
          setTags(Array.isArray(p.tags) ? p.tags.join(", ") : p.tags || "");
          setShortDescription(p.shortDescription || "");
          setDescription(p.description || "");
          setVideoUrl(p.videoUrl || "");
          setStatus(p.status || "Active");

          // Images
          if (Array.isArray(p.images) && p.images.length > 0) {
            setMainImage(p.images[0] || "");
            setGalleryImages(p.images.slice(1).filter(Boolean));
          } else if (p.image) {
            setMainImage(p.image);
            setGalleryImages([]);
          }

          setPurchasePrice(Number(p.purchasePrice || 0));
          setCostPrice(Number(p.costPrice || 0));
          setRegularPrice(Number(p.regularPrice || p.price || 0));
          setSalePrice(Number(p.salePrice || p.price || 0));
          setWholesalePrice(Number(p.wholesalePrice || 0));
          setDiscountPercent(Number(p.discountPercent || 0));
          setTaxPercent(Number(p.taxPercent || 0));

          setStock(Number(p.stock || 0));
          setReservedStock(Number(p.reservedStock || 0));
          setReorderLevel(Number(p.reorderLevel || 5));
          setMinStock(Number(p.minStock || 0));
          setMaxStock(Number(p.maxStock || 1000));
          setWarehouse(p.warehouse || "MainDhaka");
          setRackLocation(p.rackLocation || "");

          if (Array.isArray(p.variants) && p.variants.length > 0) {
            const mappedVariants: Variant[] = p.variants.map((v: any, idx: number) => ({
              id: v.id || String(idx + 1),
              attr1Name: v.attr1Name || "Color",
              attr1Value: v.attr1Value || v.color || "Default",
              attr2Name: v.attr2Name || "Size",
              attr2Value: v.attr2Value || v.size || "",
              color: v.color || v.attr1Value || "Default",
              size: v.size || v.attr2Value || "",
              sku: v.sku || `VAR-${idx + 1}`,
              price: Number(v.price || p.salePrice || p.price || 0),
              stock: Number(v.stock ?? 10),
              barcode: v.barcode || "",
              image: v.image || p.images?.[0] || "",
            }));
            setVariants(mappedVariants);

            if (mappedVariants[0]?.attr1Name) {
              const a1 = mappedVariants[0].attr1Name;
              if (COMMON_ATTRIBUTES[a1]) {
                setAttr1Type(a1);
                setCustomAttr1Name("");
              } else {
                setAttr1Type("Custom Attribute");
                setCustomAttr1Name(a1);
              }
            }
            if (mappedVariants[0]?.attr2Name) {
              const a2 = mappedVariants[0].attr2Name;
              if (COMMON_ATTRIBUTES[a2]) {
                setAttr2Type(a2);
                setCustomAttr2Name("");
              } else {
                setAttr2Type("Custom Attribute");
                setCustomAttr2Name(a2);
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch product for edit:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [editId]);

  // Gallery image helpers
  const addGalleryImage = () => {
    setGalleryImages([...galleryImages, ""]);
  };

  const updateGalleryImage = (index: number, val: string) => {
    const updated = [...galleryImages];
    updated[index] = val;
    setGalleryImages(updated);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const currentAttr1Name = attr1Type === "Custom Attribute" ? (customAttr1Name.trim() || "Custom Attr 1") : attr1Type;
  const currentAttr2Name = attr2Type === "Custom Attribute" ? (customAttr2Name.trim() || "Custom Attr 2") : attr2Type;

  // Change attribute 1 dropdown handler
  const handleAttr1TypeChange = (newType: string) => {
    setAttr1Type(newType);
    const finalName = newType === "Custom Attribute" ? (customAttr1Name.trim() || "Custom Attr 1") : newType;
    setVariants((prev) =>
      prev.map((v) => ({
        ...v,
        attr1Name: finalName,
      }))
    );
  };

  // Change attribute 2 dropdown handler
  const handleAttr2TypeChange = (newType: string) => {
    setAttr2Type(newType);
    const finalName = newType === "Custom Attribute" ? (customAttr2Name.trim() || "Custom Attr 2") : newType;
    setVariants((prev) =>
      prev.map((v) => ({
        ...v,
        attr2Name: finalName,
      }))
    );
  };

  // Variant row helpers
  const addVariantRow = () => {
    const newId = (variants.length + 1).toString();

    setVariants([
      ...variants,
      {
        id: newId,
        attr1Name: currentAttr1Name,
        attr1Value: `Option ${newId}`,
        attr2Name: currentAttr2Name,
        attr2Value: "Standard",
        color: `Option ${newId}`,
        size: "Standard",
        sku: `${sku || "VAR"}-${newId}`,
        price: salePrice || 85,
        stock: 20,
        barcode: `89012345670${newId}`,
        image: mainImage || "",
      },
    ]);
  };

  const removeVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const updateVariant = (id: string, field: keyof Variant, value: any) => {
    setVariants(
      variants.map((v) => {
        if (v.id === id) {
          const updated = { ...v, [field]: value };
          if (field === "attr1Value") updated.color = value;
          if (field === "attr2Value") updated.size = value;
          return updated;
        }
        return v;
      })
    );
  };

  const handleSaveProduct = async (e?: React.FormEvent, saveAsDraft = false) => {
    if (e) e.preventDefault();

    if (!name.trim()) {
      alert("Product name is required!");
      setActiveTab("basic");
      return;
    }

    setSaving(true);
    try {
      // Gather all images (Main Image first, then non-empty gallery images)
      const allImages = [
        mainImage.trim(),
        ...galleryImages.map((img) => img.trim()),
      ].filter(Boolean);

      // Clean variants
      const cleanedVariants = variants.map((v) => ({
        ...v,
        attr1Name: currentAttr1Name,
        attr2Name: currentAttr2Name,
        color: v.attr1Value || v.color || "Default",
        size: v.attr2Value || v.size || "",
        image: v.image?.trim() || mainImage.trim(),
      }));

      const payload: any = {
        name: name.trim(),
        sku: sku.trim() || undefined,
        barcode: barcode.trim() || undefined,
        category: category || "General",
        subcategory: subcategory.trim() || undefined,
        brand: brand.trim() || undefined,
        tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        videoUrl: videoUrl.trim(),
        images: allImages.length > 0 ? allImages : undefined,
        purchasePrice: Number(purchasePrice || 0),
        costPrice: Number(costPrice || 0),
        regularPrice: Number(regularPrice || 0),
        price: Number(salePrice || 0),
        salePrice: Number(salePrice || 0),
        wholesalePrice: Number(wholesalePrice || 0),
        discountPercent: Number(discountPercent || 0),
        taxPercent: Number(taxPercent || 0),
        stock: Number(stock || 0),
        reservedStock: Number(reservedStock || 0),
        reorderLevel: Number(reorderLevel || 5),
        minStock: Number(minStock || 0),
        maxStock: Number(maxStock || 1000),
        warehouse: warehouse || "MainDhaka",
        rackLocation: rackLocation.trim(),
        variants: cleanedVariants,
        status: saveAsDraft ? "Draft" : status,
      };

      let res;
      if (isEditMode) {
        payload.id = editId;
        res = await fetch("/api/products", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save product");
      }

      router.push("/admin/products");
    } catch (err) {
      console.error("Save product error:", err);
      alert(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center space-y-3">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-sm text-slate-500 font-medium">Loading product details from database...</p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => handleSaveProduct(e, false)} className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="btn btn-ghost btn-circle btn-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {isEditMode ? `Edit Product: ${name || "..."}` : "Add New Product"}
              </h1>
              {isEditMode && (
                <span className="badge badge-primary badge-sm font-bold">Edit Mode</span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Configure product details, multi-photos, multi-attribute variants, and inventory in MongoDB
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSaveProduct(undefined, true)}
            className="btn btn-outline btn-sm font-semibold"
          >
            Save Draft
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary btn-sm gap-2 font-bold shadow-md shadow-primary/20"
          >
            {saving ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isEditMode ? "Update Product" : "Publish Product"}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs tabs-boxed bg-white p-1 rounded-2xl border border-slate-200 shadow-xs flex overflow-x-auto no-scrollbar">
        {[
          { id: "basic", label: "Basic Details & Photos", icon: Package },
          { id: "pricing", label: "Pricing & Margins", icon: DollarSign },
          { id: "inventory", label: "Inventory & Warehouses", icon: Boxes },
          { id: "variants", label: "Product Variants Matrix", icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab text-xs sm:text-sm font-bold gap-2 shrink-0 py-2 ${
                activeTab === tab.id
                  ? "tab-active bg-primary text-white rounded-xl"
                  : "text-slate-600"
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
              {tab.id === "basic" && (
                <span className="badge badge-xs badge-neutral">
                  {1 + galleryImages.filter(Boolean).length} Photos
                </span>
              )}
              {tab.id === "variants" && (
                <span className="badge badge-xs badge-primary text-white">
                  {variants.length} Vars
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 1. BASIC PRODUCT DETAILS & MULTI-IMAGES */}
      {activeTab === "basic" && (
        <div className="space-y-6">
          {/* Main Info Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" /> Product Identity & Classification
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold uppercase text-slate-500">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Wireless Noise-Canceling Headphones"
                  className="input input-sm input-bordered w-full focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Master SKU Code</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. SD-HEAD-9081 (Auto-generated if empty)"
                  className="input input-sm input-bordered w-full font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Product Barcode (EAN/UPC)</label>
                <div className="relative">
                  <Barcode className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="e.g. 890123456700"
                    className="input input-sm input-bordered pl-9 w-full font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Category *</label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="select select-sm select-bordered w-full focus:outline-none"
                >
                  {categories.length > 0 ? (
                    categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion & Apparel</option>
                      <option value="Gadgets">Gadgets</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Home">Home & Kitchen</option>
                    </>
                  )}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500 flex items-center justify-between">
                  <span>Subcategory</span>
                  {availableSubcategories.length > 0 ? (
                    <span className="text-[10px] text-primary font-semibold">
                      {availableSubcategories.length} subcategories from DB
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">None in DB</span>
                  )}
                </label>

                {availableSubcategories.length > 0 ? (
                  <select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="select select-sm select-bordered w-full focus:outline-none"
                  >
                    <option value="">-- Select Subcategory (Optional) --</option>
                    {subcategory &&
                      !availableSubcategories.some((s) => s.name === subcategory) && (
                        <option value={subcategory}>{subcategory} (Current)</option>
                      )}
                    {availableSubcategories.map((sub) => (
                      <option key={sub.id} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    placeholder="No subcategories in DB (optional)"
                    className="input input-sm input-bordered w-full focus:outline-none"
                  />
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Brand Name</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. SoundMaster, SuperFit, ProKey"
                  className="input input-sm input-bordered w-full focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="select select-sm select-bordered w-full focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Draft">Draft</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold uppercase text-slate-500">Tags (Comma separated)</label>
                <div className="relative">
                  <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. wireless, bluetooth, headphones, audio"
                    className="input input-sm input-bordered pl-9 w-full focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold uppercase text-slate-500">Short Description</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Quick 1-2 sentence product overview..."
                  className="input input-sm input-bordered w-full focus:outline-none"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold uppercase text-slate-500">Full Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed product specifications, materials, warranty info..."
                  className="textarea textarea-bordered w-full text-sm focus:outline-none"
                ></textarea>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold uppercase text-slate-500">Video Demonstration Link (YouTube/Vimeo)</label>
                <div className="relative">
                  <Video className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="input input-sm input-bordered pl-9 w-full focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Photos Section: Main Cover Image + Multiple Gallery Images */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-indigo-600" /> Product Photos & Media Gallery
                </h2>
                <p className="text-xs text-slate-500">
                  Set the primary cover photo and add multiple gallery pictures for customer storefront
                </p>
              </div>
              <span className="badge badge-primary font-bold text-xs">
                {1 + galleryImages.filter(Boolean).length} Total Photos
              </span>
            </div>

            {/* 1. Main Cover Image */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-700 flex items-center justify-between">
                <span>Primary Cover Photo (Main) *</span>
                <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  Displayed on catalog cards
                </span>
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50/70 rounded-2xl border border-slate-200">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-xs shrink-0 flex items-center justify-center relative">
                  {mainImage ? (
                    <img
                      src={mainImage}
                      alt="Main Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80";
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-300" />
                  )}
                  <span className="badge badge-xs badge-primary absolute top-1 left-1 text-[8px] font-bold">
                    Main
                  </span>
                </div>

                <div className="w-full space-y-1.5">
                  <div className="relative">
                    <ImageIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={mainImage}
                      onChange={(e) => setMainImage(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-... (Main Cover URL)"
                      className="input input-sm input-bordered pl-9 w-full focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Paste an image URL from Unsplash, Cloudinary, AWS S3, or your CDN.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Multiple Gallery Photos */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                  <span>Additional Gallery Photos (Multiple)</span>
                  <span className="badge badge-xs badge-neutral">{galleryImages.length}</span>
                </label>
                <button
                  type="button"
                  onClick={addGalleryImage}
                  className="btn btn-xs btn-outline btn-primary gap-1 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Gallery Photo
                </button>
              </div>

              {galleryImages.length === 0 ? (
                <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
                  <ImageIcon className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 font-medium">No additional gallery photos yet.</p>
                  <button
                    type="button"
                    onClick={addGalleryImage}
                    className="btn btn-xs btn-primary gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Photo URL
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {galleryImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0 flex items-center justify-center">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&auto=format&fit=crop&q=80";
                            }}
                          />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-slate-300" />
                        )}
                      </div>

                      <div className="flex-1">
                        <input
                          type="text"
                          value={imgUrl}
                          onChange={(e) => updateGalleryImage(idx, e.target.value)}
                          placeholder={`Gallery Photo #${idx + 1} Image URL...`}
                          className="input input-xs sm:input-sm input-bordered w-full focus:outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="btn btn-ghost btn-xs text-slate-400 hover:text-error"
                        title="Remove photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
              <label className="text-xs font-bold uppercase text-slate-500">Purchase Price (৳)</label>
              <input
                type="number"
                step="0.01"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                className="input input-sm input-bordered w-full font-bold focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Cost Price (৳)</label>
              <input
                type="number"
                step="0.01"
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="input input-sm input-bordered w-full font-bold focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Regular Price (৳)</label>
              <input
                type="number"
                step="0.01"
                value={regularPrice}
                onChange={(e) => setRegularPrice(Number(e.target.value))}
                className="input input-sm input-bordered w-full font-bold focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Selling Price (৳)</label>
              <input
                type="number"
                step="0.01"
                required
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                className="input input-sm input-bordered w-full text-primary font-black focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Wholesale Price (৳)</label>
              <input
                type="number"
                step="0.01"
                value={wholesalePrice}
                onChange={(e) => setWholesalePrice(Number(e.target.value))}
                className="input input-sm input-bordered w-full font-bold focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Discount (%)</label>
              <input
                type="number"
                step="0.1"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="input input-sm input-bordered w-full focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Tax / VAT (%)</label>
              <input
                type="number"
                step="0.1"
                value={taxPercent}
                onChange={(e) => setTaxPercent(Number(e.target.value))}
                className="input input-sm input-bordered w-full focus:outline-none"
              />
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
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="input input-sm input-bordered w-full font-bold focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Reserved Stock</label>
              <input
                type="number"
                value={reservedStock}
                onChange={(e) => setReservedStock(Number(e.target.value))}
                className="input input-sm input-bordered w-full focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Available Stock</label>
              <input
                type="number"
                value={availableStock}
                readOnly
                className="input input-sm input-bordered w-full font-black text-emerald-600 bg-slate-50 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Reorder Level Alert</label>
              <input
                type="number"
                value={reorderLevel}
                onChange={(e) => setReorderLevel(Number(e.target.value))}
                className="input input-sm input-bordered w-full font-bold text-error focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Minimum Stock</label>
              <input
                type="number"
                value={minStock}
                onChange={(e) => setMinStock(Number(e.target.value))}
                className="input input-sm input-bordered w-full focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Maximum Stock Capacity</label>
              <input
                type="number"
                value={maxStock}
                onChange={(e) => setMaxStock(Number(e.target.value))}
                className="input input-sm input-bordered w-full focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Primary Warehouse</label>
              <select
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
                className="select select-sm select-bordered w-full focus:outline-none"
              >
                <option value="MainDhaka">Main Warehouse (Dhaka)</option>
                <option value="SubCtg">Sub Warehouse (Chittagong)</option>
                <option value="CentralFulfillment">Central Fulfillment Center</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Shelf / Rack ID Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={rackLocation}
                  onChange={(e) => setRackLocation(e.target.value)}
                  placeholder="e.g. Rack B-04 / Shelf 3"
                  className="input input-sm input-bordered pl-9 w-full focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. VARIANTS MATRIX WITH MULTI-CATEGORY ATTRIBUTES & VARIANT IMAGES */}
      {activeTab === "variants" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" /> Multi-Category Product Variants Matrix
              </h2>
              <p className="text-xs text-slate-500">
                Configure variants with custom category attributes (e.g., Storage, RAM, Size, Weight, Volume, Flavor) and dedicated variant photos
              </p>
            </div>
            <button
              type="button"
              onClick={addVariantRow}
              className="btn btn-sm btn-primary gap-1 font-bold shadow-md shadow-primary/20 shrink-0"
            >
              <Plus className="w-4 h-4" /> Add Variant Row
            </button>
          </div>

          {/* Attribute Configuration Dropdowns & Custom Fields */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
              <label className="text-xs font-extrabold uppercase text-slate-800 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-primary" />
                <span>Configure Variant Attributes (Select from Dropdown or Type Custom):</span>
              </label>
              <span className="text-[11px] text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                Current Table Columns: <span className="font-extrabold text-primary">{currentAttr1Name}</span> &{" "}
                <span className="font-extrabold text-indigo-600">{currentAttr2Name}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Attribute 1 Configuration Dropdown */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black">1</span>
                    <span>Attribute 1 (Dropdown)</span>
                  </label>
                  <span className="badge badge-xs badge-primary font-bold text-white">Required</span>
                </div>

                <select
                  value={attr1Type}
                  onChange={(e) => handleAttr1TypeChange(e.target.value)}
                  className="select select-sm select-bordered w-full font-bold focus:outline-none"
                >
                  {Object.keys(COMMON_ATTRIBUTES).map((key) => (
                    <option key={key} value={key}>
                      {COMMON_ATTRIBUTES[key]}
                    </option>
                  ))}
                </select>

                {attr1Type === "Custom Attribute" && (
                  <div className="pt-1 space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase">Type Custom Attribute Name:</label>
                    <input
                      type="text"
                      value={customAttr1Name}
                      onChange={(e) => {
                        setCustomAttr1Name(e.target.value);
                        const val = e.target.value.trim() || "Custom Attr 1";
                        setVariants((prev) => prev.map((v) => ({ ...v, attr1Name: val })));
                      }}
                      placeholder="e.g. Scent, Voltage, Edition, Pattern..."
                      className="input input-xs input-bordered w-full font-bold focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Attribute 2 Configuration Dropdown */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-black">2</span>
                    <span>Attribute 2 (Dropdown)</span>
                  </label>
                  <span className="badge badge-xs badge-ghost font-medium">Optional</span>
                </div>

                <select
                  value={attr2Type}
                  onChange={(e) => handleAttr2TypeChange(e.target.value)}
                  className="select select-sm select-bordered w-full font-bold focus:outline-none"
                >
                  <option value="None">None (Single Attribute Only)</option>
                  {Object.keys(COMMON_ATTRIBUTES).map((key) => (
                    <option key={key} value={key}>
                      {COMMON_ATTRIBUTES[key]}
                    </option>
                  ))}
                </select>

                {attr2Type === "Custom Attribute" && (
                  <div className="pt-1 space-y-1">
                    <label className="text-[10px] font-bold text-indigo-600 uppercase">Type Custom Attribute Name:</label>
                    <input
                      type="text"
                      value={customAttr2Name}
                      onChange={(e) => {
                        setCustomAttr2Name(e.target.value);
                        const val = e.target.value.trim() || "Custom Attr 2";
                        setVariants((prev) => prev.map((v) => ({ ...v, attr2Name: val })));
                      }}
                      placeholder="e.g. Material, RAM, Fit, Finish..."
                      className="input input-xs input-bordered w-full font-bold focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Variants Table */}
          {variants.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
              <Layers className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">
                No variants configured for this product yet.
              </p>
              <button
                type="button"
                onClick={addVariantRow}
                className="btn btn-xs btn-primary gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add First Variant
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="table w-full text-xs">
                <thead>
                  <tr className="uppercase bg-slate-100/80 border-b border-slate-200 text-slate-600 font-extrabold">
                    <th className="min-w-44">Variant Photo (URL)</th>
                    <th className="min-w-32">{currentAttr1Name} *</th>
                    <th className="min-w-32">{currentAttr2Name}</th>
                    <th className="min-w-32">Variant SKU</th>
                    <th className="min-w-24">Price (৳)</th>
                    <th className="min-w-24">Stock Qty</th>
                    <th className="min-w-32">Barcode</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {variants.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/70">
                      {/* 1. Variant Photo + Input */}
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0 flex items-center justify-center">
                            {v.image ? (
                              <img
                                src={v.image}
                                alt={v.attr1Value || "Variant"}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80";
                                }}
                              />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-slate-300" />
                            )}
                          </div>
                          <div className="space-y-1 w-full min-w-32">
                            <input
                              type="text"
                              value={v.image || ""}
                              onChange={(e) => updateVariant(v.id, "image", e.target.value)}
                              placeholder="Photo URL..."
                              className="input input-xs input-bordered w-full text-[10px] focus:outline-none"
                            />
                            {mainImage && v.image !== mainImage && (
                              <button
                                type="button"
                                onClick={() => updateVariant(v.id, "image", mainImage)}
                                className="text-[9px] text-primary hover:underline font-bold block"
                              >
                                Use Main Photo
                              </button>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* 2. Attribute 1 Value */}
                      <td>
                        <input
                          type="text"
                          required
                          value={v.attr1Value || ""}
                          onChange={(e) => updateVariant(v.id, "attr1Value", e.target.value)}
                          placeholder={`Value for ${currentAttr1Name}...`}
                          className="input input-xs input-bordered w-full font-bold focus:outline-none"
                        />
                      </td>

                      {/* 3. Attribute 2 Value */}
                      <td>
                        <input
                          type="text"
                          disabled={attr2Type === "None"}
                          value={attr2Type === "None" ? "" : (v.attr2Value || "")}
                          onChange={(e) => updateVariant(v.id, "attr2Value", e.target.value)}
                          placeholder={attr2Type === "None" ? "Not applicable" : `Value for ${currentAttr2Name}...`}
                          className={`input input-xs input-bordered w-full font-medium focus:outline-none ${
                            attr2Type === "None" ? "bg-slate-100 opacity-60 cursor-not-allowed" : ""
                          }`}
                        />
                      </td>

                      {/* 4. Variant SKU */}
                      <td>
                        <input
                          type="text"
                          value={v.sku}
                          onChange={(e) => updateVariant(v.id, "sku", e.target.value)}
                          placeholder="e.g. VAR-01"
                          className="input input-xs input-bordered font-mono w-full focus:outline-none"
                        />
                      </td>

                      {/* 5. Variant Price */}
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          value={v.price}
                          onChange={(e) => updateVariant(v.id, "price", Number(e.target.value))}
                          className="input input-xs input-bordered w-full font-bold focus:outline-none"
                        />
                      </td>

                      {/* 6. Variant Stock */}
                      <td>
                        <input
                          type="number"
                          value={v.stock}
                          onChange={(e) => updateVariant(v.id, "stock", Number(e.target.value))}
                          className="input input-xs input-bordered w-full font-extrabold text-slate-900 focus:outline-none"
                        />
                      </td>

                      {/* 7. Barcode */}
                      <td>
                        <input
                          type="text"
                          value={v.barcode}
                          onChange={(e) => updateVariant(v.id, "barcode", e.target.value)}
                          placeholder="Barcode..."
                          className="input input-xs input-bordered font-mono w-full focus:outline-none"
                        />
                      </td>

                      {/* 8. Delete Action */}
                      <td className="text-right">
                        <button
                          type="button"
                          onClick={() => removeVariant(v.id)}
                          className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                          title="Delete variant"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </form>
  );
}

export default function AdminNewProductPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto py-20 text-center space-y-3">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-sm text-slate-500 font-medium">Loading product form...</p>
        </div>
      }
    >
      <ProductForm />
    </Suspense>
  );
}
