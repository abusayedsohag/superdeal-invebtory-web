import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const db = await getDb();
    const collection = db.collection("returns");

    // Auto-seed sample returns if collection is empty
    const count = await collection.countDocuments({});
    if (count === 0) {
      const sampleReturns = [
        {
          id: "RET-901",
          orderId: "SD10293",
          customerName: "Rahim Ahmed",
          customerPhone: "+880 1711-223344",
          customerAddress: "House 42, Road 11, Block D, Banani, Dhaka",
          productId: "prod-1",
          productName: "Wireless Noise-Canceling Premium Headphones",
          itemQty: 1,
          orderTotal: 2450,
          reason: "Product damaged during courier transit",
          requestType: "Return",
          status: "Pending",
          warehouseLocation: "Dhaka Central Warehouse",
          requestDate: "27 Oct 2026",
          createdAt: new Date().toISOString(),
        },
        {
          id: "RET-902",
          orderId: "SD10288",
          customerName: "Tanvir Hossain",
          customerPhone: "+880 1819-223344",
          customerAddress: "Agrabad Commercial Area, Chittagong",
          productId: "prod-2",
          productName: "Ergonomic Mechanical Keyboard RGB",
          itemQty: 1,
          orderTotal: 1490,
          reason: "Wrong color switch delivered",
          requestType: "Replacement",
          status: "Approved",
          warehouseLocation: "Chittagong Hub",
          requestDate: "25 Oct 2026",
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: "RET-903",
          orderId: "SD10250",
          customerName: "Sharmin Sultana",
          customerPhone: "+880 1733-445566",
          customerAddress: "Zindabazar, Sylhet",
          productId: "prod-3",
          productName: "Ultra High Precision Gaming Mouse",
          itemQty: 1,
          orderTotal: 1600,
          reason: "Defective sensor not tracking properly",
          requestType: "Refund",
          status: "Full Refund",
          refundedAmount: 1600,
          warehouseLocation: "Dhaka Central Warehouse",
          requestDate: "22 Oct 2026",
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        },
      ];
      await collection.insertMany(sampleReturns);
    }

    const query: any = {};
    if (orderId) {
      query.orderId = orderId;
    }
    if (status && status !== "all") {
      if (status === "pending") query.status = "Pending";
      else if (status === "approved") query.status = "Approved";
      else if (status === "refunded") query.status = { $in: ["Full Refund", "Partial Refund"] };
      else query.status = status;
    }
    if (search) {
      query.$or = [
        { id: { $regex: search, $options: "i" } },
        { orderId: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { customerPhone: { $regex: search, $options: "i" } },
        { productName: { $regex: search, $options: "i" } },
        { reason: { $regex: search, $options: "i" } },
      ];
    }

    const returns = await collection.find(query).sort({ createdAt: -1 }).toArray();

    // Stats
    const [total, pending, approved, refunded, rejected] = await Promise.all([
      collection.countDocuments({}),
      collection.countDocuments({ status: "Pending" }),
      collection.countDocuments({ status: "Approved" }),
      collection.countDocuments({ status: { $in: ["Full Refund", "Partial Refund"] } }),
      collection.countDocuments({ status: "Rejected" }),
    ]);

    return NextResponse.json({
      success: true,
      returns,
      stats: {
        total,
        pending,
        approved,
        refunded,
        rejected,
      },
    });
  } catch (error) {
    console.error("Error fetching returns:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch return requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, customerName, customerPhone, customerAddress, productId, productName, itemQty, orderTotal, reason, requestType, warehouseLocation } = body;

    if (!orderId || !customerName || !reason) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (orderId, customerName, reason)" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection("returns");

    // Check if a return request already exists for this order
    const existing = await collection.findOne({ orderId, status: { $ne: "Rejected" } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: `A return request (${existing.id}) has already been submitted for this order.` },
        { status: 400 }
      );
    }

    const newId = `RET-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const newReturn = {
      id: newId,
      orderId,
      customerName,
      customerPhone: customerPhone || "",
      customerAddress: customerAddress || "",
      productId: productId || "",
      productName: productName || "Order Item(s)",
      itemQty: Number(itemQty) || 1,
      orderTotal: Number(orderTotal) || 0,
      reason,
      requestType: requestType || "Return",
      status: "Pending",
      warehouseLocation: warehouseLocation || "Dhaka Central Warehouse",
      requestDate: formattedDate,
      createdAt: now.toISOString(),
    };

    await collection.insertOne(newReturn);

    // Also update order with return request flag
    const ordersCollection = db.collection("orders");
    await ordersCollection.updateOne(
      { id: orderId },
      { $set: { returnRequested: true, returnRequestId: newId } }
    );

    return NextResponse.json({
      success: true,
      message: "Return request submitted successfully",
      returnRequest: newReturn,
    });
  } catch (error) {
    console.error("Error creating return request:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit return request" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, refundedAmount, restockInventory, adminNotes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "Missing id or status" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection("returns");
    const returnReq = await collection.findOne({ id });

    if (!returnReq) {
      return NextResponse.json(
        { success: false, message: "Return request not found" },
        { status: 404 }
      );
    }

    const updateData: any = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (refundedAmount !== undefined) {
      updateData.refundedAmount = Number(refundedAmount);
    }
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    await collection.updateOne({ id }, { $set: updateData });

    // Automated Inventory Restock if requested or on approval/refund
    let restocked = false;
    if (restockInventory && returnReq.productId && returnReq.itemQty) {
      const productsCollection = db.collection("products");
      await productsCollection.updateOne(
        { id: returnReq.productId },
        { $inc: { stock: Number(returnReq.itemQty) } }
      );
      restocked = true;
    }

    // Update order status if full refund
    if (status === "Full Refund") {
      const ordersCollection = db.collection("orders");
      await ordersCollection.updateOne(
        { id: returnReq.orderId },
        { $set: { paymentStatus: "Refunded", orderStatus: "Refunded" } }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Return request updated to ${status}${restocked ? " and inventory restocked" : ""}`,
      restocked,
    });
  } catch (error) {
    console.error("Error updating return request:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update return request" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection("returns");
    const result = await collection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Return request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Return request deleted successfully" });
  } catch (error) {
    console.error("Error deleting return request:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete return request" },
      { status: 500 }
    );
  }
}
