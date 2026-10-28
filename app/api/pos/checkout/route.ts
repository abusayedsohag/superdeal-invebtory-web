import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const productsCollection = db.collection("products");
    const ordersCollection = db.collection("orders");
    const body = await request.json();

    const items = Array.isArray(body.items) ? body.items : [];
    if (items.length === 0) {
      return NextResponse.json({ success: false, message: "No items in POS cart" }, { status: 400 });
    }

    const total = Number(body.total) || 0;
    const paymentMethod = body.paymentMethod || "Cash (POS Terminal)";
    const cashier = body.cashier || "Admin Terminal";

    const posOrderId = `POS-${Date.now().toString().slice(-6)}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }) + `, ` + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

    // 1. Create order record in orders collection
    const orderDoc = {
      id: posOrderId,
      customer: "Walk-in Customer (POS)",
      phone: body.customerPhone || "POS-WALKIN",
      email: "pos@superdeal.com",
      district: "Dhaka",
      upazila: "Main Hub",
      address: "Physical Counter Terminal 1",
      items: items.map((it: any) => ({
        id: it.id || it.sku,
        sku: it.sku,
        name: it.name,
        price: Number(it.price) || 0,
        qty: Number(it.qty) || 1,
        image: it.image
      })),
      subtotal: total,
      shipping: 0,
      tax: 0,
      total,
      paymentMethod,
      paymentStatus: "Paid",
      orderStatus: "Delivered", // POS sales are delivered over the counter immediately
      cashier,
      source: "POS_TERMINAL",
      createdAt: now.toISOString(),
      dateFormatted: formattedDate
    };

    await ordersCollection.insertOne(orderDoc);

    // 2. Live stock deduction for each product in DB
    const stockUpdateResults = [];
    for (const it of items) {
      const qtyToDeduct = Number(it.qty) || 1;
      const filter = it.barcode 
        ? { $or: [{ barcode: it.barcode }, { sku: it.sku }, { id: it.id }] }
        : { $or: [{ sku: it.sku }, { id: it.id }, { name: it.name }] };

      const updateRes = await productsCollection.updateOne(filter, {
        $inc: { stock: -qtyToDeduct }
      });
      stockUpdateResults.push({ item: it.name, updated: updateRes.modifiedCount > 0 });
    }

    return NextResponse.json({
      success: true,
      message: `POS Sale completed successfully! Order #${posOrderId} generated and inventory updated.`,
      orderId: posOrderId,
      total,
      stockUpdated: stockUpdateResults
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/pos/checkout error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to complete POS sale"
    }, { status: 500 });
  }
}
