import { generateProductId } from "@/lib/product-idgen";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

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
  slug: string;
  sku: string;
  barcode?: string;
  category: string;
  subcategory?: string;
  brand?: string;
  tags?: string[] | string;
  shortDescription?: string;
  description?: string;
  videoUrl?: string;
  images?: string[];
  purchasePrice?: number;
  costPrice: number;
  regularPrice?: number;
  price: number;
  salePrice?: number;
  wholesalePrice?: number;
  discountPercent?: number;
  taxPercent?: number;
  stock: number;
  reservedStock?: number;
  availableStock?: number;
  reorderLevel?: number;
  minStock?: number;
  maxStock?: number;
  warehouse?: string;
  rackLocation?: string;
  variantsCount: number;
  variants?: Variant[];
  status: string;
  rating?: number;
  reviewCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export async function GET(request: Request) {
  try {
    const db = await getDb();
    const collection = db.collection<Product>("products");

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    // If specific ID requested
    if (id) {
      let filter: any = { id };
      if (ObjectId.isValid(id)) {
        filter = { $or: [{ id }, { _id: new ObjectId(id) }] };
      }
      const product = await collection.findOne(filter);
      if (!product) {
        return NextResponse.json(
          { success: false, message: "Product not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, product });
    }

    // Build filter query
    const filterQuery: any = {};

    if (search && search.trim()) {
      const term = search.trim();
      filterQuery.$or = [
        { name: { $regex: term, $options: "i" } },
        { sku: { $regex: term, $options: "i" } },
        { barcode: { $regex: term, $options: "i" } },
        { brand: { $regex: term, $options: "i" } },
        { category: { $regex: term, $options: "i" } },
      ];
    }

    if (category && category !== "All Categories") {
      filterQuery.category = { $regex: `^${category}$`, $options: "i" };
    }

    if (status && status !== "All Statuses") {
      filterQuery.status = status;
    }

    const products = await collection
      .find(filterQuery)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      products,
      total: products.length,
    });
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const collection = db.collection<Product>("products");

    const body = await request.json();
    const {
      name,
      sku,
      barcode,
      category,
      subcategory,
      brand,
      tags,
      shortDescription,
      description,
      videoUrl,
      images,
      purchasePrice,
      costPrice,
      regularPrice,
      price,
      salePrice,
      wholesalePrice,
      discountPercent,
      taxPercent,
      stock,
      reservedStock,
      reorderLevel,
      minStock,
      maxStock,
      warehouse,
      rackLocation,
      variants,
      status,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Product name is required" },
        { status: 400 }
      );
    }

    const newId = await generateProductId();
    const finalPrice = Number(salePrice || price || regularPrice || 0);
    const finalCost = Number(costPrice || purchasePrice || 0);
    const finalStock = Number(stock || 0);
    const finalReserved = Number(reservedStock || 0);
    const finalAvailable = Math.max(0, finalStock - finalReserved);
    const finalReorder = Number(reorderLevel || 5);
    const parsedVariants: Variant[] = Array.isArray(variants) ? variants : [];

    // Auto determine status based on inventory stock
    let finalStatus = status || "Active";
    if (finalStock <= 0) {
      finalStatus = "Out of Stock";
    } else if (finalStock <= finalReorder) {
      finalStatus = "Low Stock";
    }

    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newProduct: Product = {
      id: newId,
      name: name.trim(),
      slug: generatedSlug,
      sku: sku?.trim() || `SKU-${newId.toUpperCase()}`,
      barcode: barcode?.trim() || "",
      category: category || "General",
      subcategory: subcategory || "",
      brand: brand || "",
      tags: Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map(t => t.trim()) : [],
      shortDescription: shortDescription || "",
      description: description || "",
      videoUrl: videoUrl || "",
      images: Array.isArray(images) && images.length > 0 ? images : [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
      ],
      purchasePrice: Number(purchasePrice || 0),
      costPrice: finalCost,
      regularPrice: Number(regularPrice || finalPrice),
      price: finalPrice,
      salePrice: finalPrice,
      wholesalePrice: Number(wholesalePrice || 0),
      discountPercent: Number(discountPercent || 0),
      taxPercent: Number(taxPercent || 0),
      stock: finalStock,
      reservedStock: finalReserved,
      availableStock: finalAvailable,
      reorderLevel: finalReorder,
      minStock: Number(minStock || 0),
      maxStock: Number(maxStock || 1000),
      warehouse: warehouse || "MainDhaka",
      rackLocation: rackLocation || "",
      variantsCount: parsedVariants.length,
      variants: parsedVariants,
      status: finalStatus,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await collection.insertOne(newProduct);

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      productId: newId,
      result,
    });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create product",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const db = await getDb();
    const collection = db.collection<Product>("products");

    const body = await request.json();
    const { id, ...updateFields } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required for update" },
        { status: 400 }
      );
    }

    // Recalculate stock and status if relevant
    if (updateFields.stock !== undefined) {
      const stock = Number(updateFields.stock);
      const reserved = Number(updateFields.reservedStock ?? 0);
      const reorder = Number(updateFields.reorderLevel ?? 5);

      updateFields.stock = stock;
      updateFields.availableStock = Math.max(0, stock - reserved);

      if (!updateFields.status || updateFields.status === "Active" || updateFields.status === "Low Stock" || updateFields.status === "Out of Stock") {
        if (stock <= 0) {
          updateFields.status = "Out of Stock";
        } else if (stock <= reorder) {
          updateFields.status = "Low Stock";
        } else {
          updateFields.status = "Active";
        }
      }
    }

    if (Array.isArray(updateFields.variants)) {
      updateFields.variantsCount = updateFields.variants.length;
    }

    if (updateFields.price !== undefined) {
      updateFields.price = Number(updateFields.price);
      updateFields.salePrice = Number(updateFields.price);
    }

    if (updateFields.costPrice !== undefined) {
      updateFields.costPrice = Number(updateFields.costPrice);
    }

    updateFields.updatedAt = new Date().toISOString();

    let filter: any = { id };
    if (ObjectId.isValid(id)) {
      filter = { $or: [{ id }, { _id: new ObjectId(id) }] };
    }

    const result = await collection.updateOne(filter, { $set: updateFields });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update product",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const db = await getDb();
    const collection = db.collection<Product>("products");

    let id = "";
    const { searchParams } = new URL(request.url);
    const queryId = searchParams.get("id");

    if (queryId) {
      id = queryId;
    } else {
      try {
        const body = await request.json();
        id = body.id;
      } catch {
        // empty body
      }
    }

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required for deletion" },
        { status: 400 }
      );
    }

    let filter: any = { id };
    if (ObjectId.isValid(id)) {
      filter = { $or: [{ id }, { _id: new ObjectId(id) }] };
    }

    const result = await collection.deleteOne(filter);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to delete product",
      },
      { status: 500 }
    );
  }
}
