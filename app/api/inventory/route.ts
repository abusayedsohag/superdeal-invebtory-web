import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export interface StockMovement {
  id?: string;
  productId: string;
  productName: string;
  sku: string;
  type: "Damage" | "Lost" | "Expired" | "Correction" | "Return" | "Purchase" | "Sale" | "Other";
  change: number; // e.g. -5 or +10
  reference: string; // e.g. "ADJ-2026-001" or "Order #ORD-7712"
  operator: string;
  reason?: string;
  warehouse?: string;
  previousStock: number;
  resultStock: number;
  date: string; // ISO string or human string
  createdAt: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const limit = Number(searchParams.get("limit") || 50);

    const db = await getDb();
    const productsCollection = db.collection("products");
    const movementsCollection = db.collection("stock_movements");

    // Fetch all products to calculate real-time inventory stats and levels
    const products = await productsCollection
      .find({})
      .sort({ updatedAt: -1, createdAt: -1 })
      .toArray();

    // Calculate aggregated inventory KPIs
    let totalStockUnits = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let totalStockValuation = 0;

    const inventoryItems = products.map((p: any) => {
      const stock = Number(p.stock ?? 0);
      const minStock = Number(p.minStock ?? p.reorderLevel ?? 5);
      const maxStock = Number(p.maxStock ?? 500);
      const costPrice = Number(p.costPrice ?? p.purchasePrice ?? (p.price ? p.price * 0.7 : 0));
      const value = stock * costPrice;

      totalStockUnits += stock;
      totalStockValuation += value;

      let status = "Healthy";
      if (stock <= 0) {
        status = "Out of Stock";
        outOfStockCount++;
      } else if (stock <= minStock) {
        status = "Low Stock";
        lowStockCount++;
      }

      return {
        id: p.id || String(p._id),
        _id: String(p._id),
        name: p.name || "Unnamed Product",
        sku: p.sku || `SKU-${p.id || p._id}`,
        category: p.category || "General",
        warehouse: p.warehouse || "Main Warehouse (Dhaka)",
        rackLocation: p.rackLocation || "",
        availableStock: Math.max(0, stock - Number(p.reservedStock || 0)),
        stock: stock,
        minStock: minStock,
        maxStock: maxStock,
        costPrice: costPrice,
        price: Number(p.price || 0),
        totalValue: value,
        formattedValue: `৳${value >= 1000 ? (value / 1000).toFixed(1) + "k" : value.toLocaleString()}`,
        status: status,
      };
    });

    // Stock valuation formatted
    let formattedValuation = "৳0";
    if (totalStockValuation >= 1000000) {
      formattedValuation = `৳${(totalStockValuation / 1000000).toFixed(1)}M`;
    } else if (totalStockValuation >= 1000) {
      formattedValuation = `৳${(totalStockValuation / 1000).toFixed(1)}k`;
    } else {
      formattedValuation = `৳${totalStockValuation.toLocaleString()}`;
    }

    const stats = {
      totalProducts: products.length,
      totalStock: totalStockUnits.toLocaleString(),
      lowStock: lowStockCount,
      outOfStock: outOfStockCount,
      stockValue: formattedValuation,
      rawStockValue: totalStockValuation,
    };

    // Filter movements if productId specified, or return most recent movements
    const moveQuery: any = {};
    if (productId && productId !== "all") {
      moveQuery.$or = [{ productId }, { sku: productId }, { productName: productId }];
    }

    const movements = await movementsCollection
      .find(moveQuery)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      stats,
      items: inventoryItems,
      movements,
    });
  } catch (error) {
    console.error("Fetch inventory error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch inventory",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const productsCollection = db.collection("products");
    const movementsCollection = db.collection("stock_movements");

    const body = await request.json();
    const {
      productId,
      adjustmentType, // "Damage" | "Lost" | "Expired" | "Correction" | "Return" | "Other"
      quantity,
      reason,
      warehouse,
      operator = "Admin",
    } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product selection is required" },
        { status: 400 }
      );
    }

    const qty = Number(quantity);
    if (!qty || isNaN(qty) || qty <= 0) {
      return NextResponse.json(
        { success: false, message: "Quantity must be greater than zero" },
        { status: 400 }
      );
    }

    // Find the product by id or _id or sku
    let filter: any = { $or: [{ id: productId }, { sku: productId }] };
    if (ObjectId.isValid(productId)) {
      filter.$or.push({ _id: new ObjectId(productId) });
    }

    const product = await productsCollection.findOne(filter);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Selected product not found in database" },
        { status: 404 }
      );
    }

    const currentStock = Number(product.stock ?? 0);
    const minStock = Number(product.minStock ?? product.reorderLevel ?? 5);

    // Negative changes reduce stock (Damage, Lost, Expired)
    const isNegative = ["Damage", "Lost", "Expired"].includes(adjustmentType);
    const delta = isNegative ? -Math.abs(qty) : Math.abs(qty);
    const newStock = Math.max(0, currentStock + delta);
    const reservedStock = Number(product.reservedStock ?? 0);
    const newAvailable = Math.max(0, newStock - reservedStock);

    // Update status
    let newStatus = product.status || "Active";
    if (newStock <= 0) {
      newStatus = "Out of Stock";
    } else if (newStock <= minStock) {
      newStatus = "Low Stock";
    } else {
      newStatus = "Active";
    }

    // Update product stock in DB
    await productsCollection.updateOne(
      { _id: product._id },
      {
        $set: {
          stock: newStock,
          availableStock: newAvailable,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    // Create Audit Log in stock_movements
    const referenceId = `ADJ-${Date.now().toString().slice(-6)}`;
    const formattedChange = delta > 0 ? `+${delta}` : `${delta}`;

    const movementDoc: StockMovement = {
      productId: product.id || String(product._id),
      productName: product.name,
      sku: product.sku || `SKU-${product.id}`,
      type: adjustmentType,
      change: delta,
      reference: referenceId,
      operator: operator || "Inventory Mgr",
      reason: reason || `Manual stock adjustment (${adjustmentType})`,
      warehouse: warehouse || product.warehouse || "Main Warehouse (Dhaka)",
      previousStock: currentStock,
      resultStock: newStock,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: new Date().toISOString(),
    };

    const insertResult = await movementsCollection.insertOne(movementDoc);

    return NextResponse.json({
      success: true,
      message: `Stock successfully adjusted for ${product.name}`,
      previousStock: currentStock,
      newStock,
      movement: { ...movementDoc, _id: insertResult.insertedId },
    });
  } catch (error) {
    console.error("Inventory adjustment error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to adjust stock",
      },
      { status: 500 }
    );
  }
}
