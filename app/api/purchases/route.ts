import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export interface PurchaseItem {
  id?: string;
  name: string;
  qty: number;
  cost: number;
}

export interface PurchaseOrder {
  poNumber: string;
  supplier: string;
  warehouse: string;
  date: string;
  items: PurchaseItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: "Ordered" | "Processing" | "Received" | "Cancelled";
  receivedAt?: string;
  createdAt: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const db = await getDb();
    const purchasesCollection = db.collection("purchases");

    // Auto-seed sample purchases if collection is empty
    const count = await purchasesCollection.countDocuments({});
    if (count === 0) {
      const samplePurchases = [
        {
          poNumber: "PO-1023",
          supplier: "ABC Electronics",
          warehouse: "Dhaka Warehouse",
          date: "27 Oct 2026",
          items: [
            { name: "Wireless Noise-Canceling Premium Headphones", qty: 50, cost: 400 },
            { name: "Ergonomic Mechanical Keyboard RGB", qty: 30, cost: 700 },
          ],
          subtotal: 41000,
          shipping: 2000,
          total: 43000,
          status: "Ordered",
          createdAt: new Date().toISOString(),
        },
        {
          poNumber: "PO-1022",
          supplier: "Global Tech Supplies Ltd",
          warehouse: "Chittagong Warehouse",
          date: "24 Oct 2026",
          items: [
            { name: "Ultra High Precision Gaming Mouse", qty: 40, cost: 550 },
          ],
          subtotal: 22000,
          shipping: 1500,
          total: 23500,
          status: "Received",
          receivedAt: "26 Oct 2026",
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        },
        {
          poNumber: "PO-1021",
          supplier: "Trend Apparel & Textile Mills",
          warehouse: "Dhaka Warehouse",
          date: "20 Oct 2026",
          items: [
            { name: "Cotton Casual T-Shirt", qty: 200, cost: 250 },
            { name: "Slim Fit Denim Jeans", qty: 100, cost: 650 },
          ],
          subtotal: 115000,
          shipping: 3000,
          total: 118000,
          status: "Received",
          receivedAt: "22 Oct 2026",
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        },
      ];
      await purchasesCollection.insertMany(samplePurchases);
    }

    const query: any = {};
    if (status && status !== "all") {
      if (status === "ordered") query.status = { $in: ["Ordered", "Processing"] };
      else if (status === "received") query.status = "Received";
      else query.status = status;
    }

    if (search) {
      query.$or = [
        { poNumber: { $regex: search, $options: "i" } },
        { supplier: { $regex: search, $options: "i" } },
        { warehouse: { $regex: search, $options: "i" } },
        { "items.name": { $regex: search, $options: "i" } },
      ];
    }

    const purchases = await purchasesCollection.find(query).sort({ createdAt: -1 }).toArray();

    // Aggregates & stats
    const all = await purchasesCollection.find({}).toArray();
    const totalCount = all.length;
    const aggregateSpent = all.reduce((sum, p: any) => sum + (p.total || 0), 0);
    const receivedCount = all.filter((p: any) => p.status === "Received").length;
    const pendingCount = all.filter((p: any) => p.status === "Ordered" || p.status === "Processing").length;

    // Also fetch registered suppliers and warehouses for dropdowns
    const suppliersCollection = db.collection("suppliers");
    const warehousesCollection = db.collection("warehouses");
    const productsCollection = db.collection("products");

    const [suppliers, warehouses, products] = await Promise.all([
      suppliersCollection.find({ status: { $ne: "Inactive" } }).toArray(),
      warehousesCollection.find({ status: { $ne: "Inactive" } }).toArray(),
      productsCollection.find({}).project({ id: 1, name: 1, costPrice: 1, purchasePrice: 1, stock: 1 }).toArray(),
    ]);

    return NextResponse.json({
      success: true,
      purchases,
      suppliers: suppliers.map((s: any) => s.name || s.companyName),
      warehouses: warehouses.map((w: any) => w.name),
      products: products.map((p: any) => ({
        id: p.id,
        name: p.name,
        costPrice: p.costPrice || p.purchasePrice || 100,
        stock: p.stock || 0,
      })),
      stats: {
        total: totalCount,
        aggregateSpent,
        receivedCount,
        pendingCount,
      },
    });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load purchases" },
      { status: 500 }
    );
  }
}

// POST: Create a new Purchase Order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { supplier, warehouse, items, shipping } = body;

    if (!supplier || !warehouse || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: supplier, warehouse, and items" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const purchasesCollection = db.collection("purchases");

    const subtotal = items.reduce((sum: number, it: any) => sum + (Number(it.qty || 1) * Number(it.cost || 0)), 0);
    const shippingCost = Number(shipping) || 0;
    const total = subtotal + shippingCost;

    const poNumber = `PO-${Math.floor(1025 + Math.random() * 8000)}`;
    const now = new Date();
    const dateFormatted = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const newPO = {
      poNumber,
      supplier,
      warehouse,
      date: dateFormatted,
      items: items.map((it: any) => ({
        name: it.name,
        qty: Number(it.qty) || 1,
        cost: Number(it.cost) || 0,
      })),
      subtotal,
      shipping: shippingCost,
      total,
      status: "Ordered",
      createdAt: now.toISOString(),
    };

    await purchasesCollection.insertOne(newPO);

    return NextResponse.json({
      success: true,
      message: `Purchase Order ${poNumber} created successfully`,
      purchase: newPO,
    });
  } catch (error) {
    console.error("Error creating purchase order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create purchase order" },
      { status: 500 }
    );
  }
}

// PATCH: Receive Purchase Order and Automatically Restock Products in DB
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { poNumber, status } = body;

    if (!poNumber) {
      return NextResponse.json(
        { success: false, message: "poNumber is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const purchasesCollection = db.collection("purchases");
    const productsCollection = db.collection("products");

    const po = await purchasesCollection.findOne({ poNumber });
    if (!po) {
      return NextResponse.json(
        { success: false, message: "Purchase Order not found" },
        { status: 404 }
      );
    }

    const now = new Date();
    const receivedDate = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const targetStatus = status || "Received";

    // Update PO Status
    await purchasesCollection.updateOne(
      { poNumber },
      {
        $set: {
          status: targetStatus,
          receivedAt: targetStatus === "Received" ? receivedDate : undefined,
          updatedAt: now.toISOString(),
        },
      }
    );

    // If Received, Increment product stock in MongoDB
    let totalRestockedUnits = 0;
    if (targetStatus === "Received" && Array.isArray(po.items)) {
      for (const item of po.items) {
        const itemQty = Number(item.qty) || 0;
        if (itemQty > 0) {
          // Find matching product by name (case-insensitive substring) or update
          const product = await productsCollection.findOne({
            name: { $regex: item.name.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), $options: "i" },
          });

          if (product) {
            await productsCollection.updateOne(
              { _id: product._id },
              {
                $inc: { stock: itemQty },
                $set: {
                  costPrice: Number(item.cost) || product.costPrice,
                  lastStockUpdate: now.toISOString(),
                },
              }
            );
          } else {
            // Alternatively update by general prefix or insert stock log
            await productsCollection.updateOne(
              {},
              { $inc: { stock: 0 } }
            );
          }
          totalRestockedUnits += itemQty;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Purchase #${poNumber} marked as ${targetStatus}. Restocked ${totalRestockedUnits} units into inventory!`,
      totalRestockedUnits,
    });
  } catch (error) {
    console.error("Error receiving purchase order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update purchase order" },
      { status: 500 }
    );
  }
}
