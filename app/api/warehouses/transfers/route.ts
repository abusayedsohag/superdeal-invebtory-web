import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export interface WarehouseTransfer {
  id: string;
  date: string;
  from: string;
  to: string;
  productId?: string;
  product: string;
  qty: number;
  transport: string;
  operator: string;
  note?: string;
  status: "In Transit" | "Completed" | "Cancelled";
  badgeColor: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Normalizes warehouse names/identifiers to a clean key for comparison
 */
function normalizeWh(wh: string) {
  if (!wh) return "";
  const lower = wh.toLowerCase().trim();
  if (lower.includes("dhaka") || lower === "maindhaka") return "Dhaka Central Warehouse";
  if (lower.includes("chittagong") || lower.includes("subctg")) return "Chittagong Port Warehouse";
  if (lower.includes("rangpur")) return "Rangpur Regional Warehouse";
  if (lower.includes("sylhet")) return "Sylhet Regional Depot";
  return wh.trim();
}

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection("warehouse_transfers");

    const transfers = await collection.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({
      success: true,
      transfers,
    });
  } catch (error) {
    console.error("Fetch transfers error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch transfers",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const transfersCollection = db.collection("warehouse_transfers");
    const productsCollection = db.collection("products");
    const movementsCollection = db.collection("stock_movements");

    const body = await request.json();
    const { from, to, product, productId, qty, transport, note, operator = "Super Admin" } = body;

    if (!from || !to || !product || !qty) {
      return NextResponse.json(
        { success: false, message: "Source Warehouse, Destination Hub, Product, and Quantity are required" },
        { status: 400 }
      );
    }

    if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
      return NextResponse.json(
        { success: false, message: "Source and destination warehouse cannot be the same" },
        { status: 400 }
      );
    }

    const transferQty = Number(qty);
    if (isNaN(transferQty) || transferQty <= 0) {
      return NextResponse.json(
        { success: false, message: "Transfer quantity must be greater than 0" },
        { status: 400 }
      );
    }

    // 1. Locate the product in DB
    let filter: any = {};
    if (productId) {
      filter = { $or: [{ id: productId }, { sku: productId }] };
      if (ObjectId.isValid(productId)) {
        filter.$or.push({ _id: new ObjectId(productId) });
      }
    } else {
      // Find by product name
      filter = { name: product };
    }

    const productDoc = await productsCollection.findOne(filter);
    if (!productDoc) {
      return NextResponse.json(
        { success: false, message: "Product not found in database" },
        { status: 404 }
      );
    }

    // 2. Resolve warehouseStocks breakdown
    const currentWarehouseStocks: Record<string, number> = productDoc.warehouseStocks || {};
    const fromKey = normalizeWh(from);
    const toKey = normalizeWh(to);

    // If warehouseStocks hasn't been initialized yet, initialize from total stock & product's assigned warehouse
    const currentTotalStock = Number(productDoc.stock || 0);
    const existingWhName = normalizeWh(productDoc.warehouse || "Dhaka Central Warehouse");

    if (Object.keys(currentWarehouseStocks).length === 0) {
      currentWarehouseStocks[existingWhName] = currentTotalStock;
    }

    const sourceStock = Number(currentWarehouseStocks[fromKey] ?? (existingWhName === fromKey ? currentTotalStock : 0));

    // Check if source hub has enough stock
    if (sourceStock < transferQty) {
      return NextResponse.json(
        {
          success: false,
          message: `Insufficient stock at ${from}. Available: ${sourceStock} Units, Requested: ${transferQty} Units.`,
        },
        { status: 400 }
      );
    }

    // 3. Deduct from Source Hub immediately (in transit)
    const newSourceStock = Math.max(0, sourceStock - transferQty);
    currentWarehouseStocks[fromKey] = newSourceStock;

    // In Transit: Keep track in warehouseStocks or transit tracking
    // If destination already has items, retain them; otherwise 0
    if (currentWarehouseStocks[toKey] === undefined) {
      currentWarehouseStocks[toKey] = 0;
    }

    // Update product in DB
    await productsCollection.updateOne(
      { _id: productDoc._id },
      {
        $set: {
          warehouseStocks: currentWarehouseStocks,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    // 4. Create Transfer Record
    const newId = `TRF-${Date.now().toString().slice(-6)}`;
    const formattedDate = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const newTransfer: WarehouseTransfer = {
      id: newId,
      date: formattedDate,
      from,
      to,
      productId: productDoc.id || String(productDoc._id),
      product: productDoc.name,
      qty: transferQty,
      transport: transport || "Direct Fleet Transfer",
      operator,
      note: note || "",
      status: "In Transit",
      badgeColor: "badge-primary",
      createdAt: new Date().toISOString(),
    };

    const result = await transfersCollection.insertOne(newTransfer);

    // 5. Create Audit Movement Entry
    await movementsCollection.insertOne({
      productId: productDoc.id || String(productDoc._id),
      productName: productDoc.name,
      sku: productDoc.sku || "",
      type: "Other",
      change: -transferQty,
      reference: newId,
      operator,
      reason: `Dispatched transfer from ${from} to ${to}`,
      warehouse: from,
      previousStock: sourceStock,
      resultStock: newSourceStock,
      date: formattedDate,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: `Stock transfer ${newId} initiated: -${transferQty} dispatched from ${from}`,
      transfer: { ...newTransfer, _id: result.insertedId },
      updatedWarehouseStocks: currentWarehouseStocks,
    });
  } catch (error) {
    console.error("Create transfer error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create transfer",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const db = await getDb();
    const transfersCollection = db.collection("warehouse_transfers");
    const productsCollection = db.collection("products");
    const movementsCollection = db.collection("stock_movements");

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "Transfer ID and status are required" },
        { status: 400 }
      );
    }

    const transferDoc = await transfersCollection.findOne({ id });
    if (!transferDoc) {
      return NextResponse.json(
        { success: false, message: "Transfer not found" },
        { status: 404 }
      );
    }

    // Only process state transition if status is actually changing
    if (transferDoc.status === status) {
      return NextResponse.json({ success: true, message: "Status already set" });
    }

    const transferQty = Number(transferDoc.qty || 0);
    const fromKey = normalizeWh(transferDoc.from);
    const toKey = normalizeWh(transferDoc.to);

    // Locate product
    let prodFilter: any = { id: transferDoc.productId };
    if (ObjectId.isValid(transferDoc.productId)) {
      prodFilter = { $or: [{ id: transferDoc.productId }, { _id: new ObjectId(transferDoc.productId) }] };
    }
    const productDoc = await productsCollection.findOne(prodFilter);

    if (productDoc) {
      const currentWarehouseStocks: Record<string, number> = productDoc.warehouseStocks || {};

      // If Marking as Completed: add transferQty to destination warehouse
      if (status === "Completed" && transferDoc.status === "In Transit") {
        const destStock = Number(currentWarehouseStocks[toKey] || 0);
        currentWarehouseStocks[toKey] = destStock + transferQty;

        // If the product was previously solely attached to 'from', update product.warehouse to destination or multi
        await productsCollection.updateOne(
          { _id: productDoc._id },
          {
            $set: {
              warehouse: toKey,
              warehouseStocks: currentWarehouseStocks,
              updatedAt: new Date().toISOString(),
            },
          }
        );

        // Movement audit log for receiving depot
        await movementsCollection.insertOne({
          productId: productDoc.id || String(productDoc._id),
          productName: productDoc.name,
          sku: productDoc.sku || "",
          type: "Other",
          change: transferQty,
          reference: transferDoc.id,
          operator: "Receiving Hub Staff",
          reason: `Stock received at ${transferDoc.to} from ${transferDoc.from}`,
          warehouse: transferDoc.to,
          previousStock: destStock,
          resultStock: destStock + transferQty,
          date: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          createdAt: new Date().toISOString(),
        });
      }

      // If Cancelling an In Transit transfer: roll back stock to Source Warehouse
      if (status === "Cancelled" && transferDoc.status === "In Transit") {
        const sourceStock = Number(currentWarehouseStocks[fromKey] || 0);
        currentWarehouseStocks[fromKey] = sourceStock + transferQty;

        await productsCollection.updateOne(
          { _id: productDoc._id },
          {
            $set: {
              warehouseStocks: currentWarehouseStocks,
              updatedAt: new Date().toISOString(),
            },
          }
        );

        await movementsCollection.insertOne({
          productId: productDoc.id || String(productDoc._id),
          productName: productDoc.name,
          sku: productDoc.sku || "",
          type: "Other",
          change: transferQty,
          reference: transferDoc.id,
          operator: "Admin",
          reason: `Cancelled transfer: Restored ${transferQty} to ${transferDoc.from}`,
          warehouse: transferDoc.from,
          previousStock: sourceStock,
          resultStock: sourceStock + transferQty,
          date: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          createdAt: new Date().toISOString(),
        });
      }
    }

    let badgeColor = "badge-primary";
    if (status === "Completed") badgeColor = "badge-success text-white";
    if (status === "Cancelled") badgeColor = "badge-error text-white";

    await transfersCollection.updateOne(
      { id },
      { $set: { status, badgeColor, updatedAt: new Date().toISOString() } }
    );

    return NextResponse.json({
      success: true,
      message: `Transfer marked as ${status} and database stock balances updated`,
    });
  } catch (error) {
    console.error("Update transfer error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update transfer",
      },
      { status: 500 }
    );
  }
}
