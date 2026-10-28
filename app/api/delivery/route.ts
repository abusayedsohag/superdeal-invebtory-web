import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export type CourierProvider = "Steadfast" | "Pathao" | "RedX" | "Custom";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courier = searchParams.get("courier");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const db = await getDb();
    const deliveryCollection = db.collection("deliveries");
    const couriersCollection = db.collection("courier_configs");

    // Auto-seed couriers config if empty
    const configsCount = await couriersCollection.countDocuments({});
    if (configsCount === 0) {
      const defaultConfigs = [
        {
          name: "Steadfast",
          logoText: "⚡ Steadfast Courier",
          status: "Connected",
          apiKey: "st_live_99812039102",
          webhookUrl: "https://superdeal.com/api/webhooks/steadfast",
          totalShipments: 1420,
        },
        {
          name: "Pathao",
          logoText: "🚴 Pathao Courier",
          status: "Connected",
          apiKey: "pth_live_77192038102",
          webhookUrl: "https://superdeal.com/api/webhooks/pathao",
          totalShipments: 980,
        },
        {
          name: "RedX",
          logoText: "🔴 RedX Logistics",
          status: "Connected",
          apiKey: "redx_token_88912301",
          webhookUrl: "https://superdeal.com/api/webhooks/redx",
          totalShipments: 450,
        },
        {
          name: "Custom",
          logoText: "🛵 In-House Delivery Team",
          status: "Connected",
          apiKey: "INTERNAL_RIDER_TEAM",
          webhookUrl: "N/A - Direct Dispatch",
          totalShipments: 210,
        },
      ];
      await couriersCollection.insertMany(defaultConfigs);
    }

    // Auto-seed delivery orders if empty
    const deliveriesCount = await deliveryCollection.countDocuments({});
    if (deliveriesCount === 0) {
      const defaultDeliveries = [
        {
          id: "DEL-1001",
          orderId: "SD-10293",
          customerName: "Rahim Ahmed",
          customerPhone: "+880 1711-223344",
          district: "Dhaka",
          address: "House 42, Road 11, Block D, Banani",
          courier: "Steadfast",
          trackingCode: "SD-9283928",
          cashToCollect: 2450,
          status: "In Transit",
          dispatchDate: "27 Oct 2026",
          estimatedDelivery: "29 Oct 2026",
          createdAt: new Date().toISOString(),
        },
        {
          id: "DEL-1002",
          orderId: "SD-10294",
          customerName: "Tanvir Hossain",
          customerPhone: "+880 1819-223344",
          district: "Chittagong",
          address: "Agrabad Commercial Area",
          courier: "Pathao",
          trackingCode: "PTH-889120",
          cashToCollect: 0,
          status: "Consignment Created",
          dispatchDate: "26 Oct 2026",
          estimatedDelivery: "28 Oct 2026",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "DEL-1003",
          orderId: "SD-10295",
          customerName: "Sharmin Sultana",
          customerPhone: "+880 1733-445566",
          district: "Sylhet",
          address: "Lane 3, Zindabazar",
          courier: "RedX",
          trackingCode: "REDX-77491",
          cashToCollect: 3200,
          status: "Out for Delivery",
          dispatchDate: "25 Oct 2026",
          estimatedDelivery: "27 Oct 2026",
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: "DEL-1004",
          orderId: "SD-10296",
          customerName: "Mahmud Hasan",
          customerPhone: "+880 1911-887766",
          district: "Rangpur",
          address: "Station Road, Near Town Hall",
          courier: "Custom",
          trackingCode: "RIDER-04",
          cashToCollect: 890,
          status: "Delivered",
          dispatchDate: "24 Oct 2026",
          estimatedDelivery: "26 Oct 2026",
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        },
      ];
      await deliveryCollection.insertMany(defaultDeliveries);
    }

    const query: any = {};
    if (courier && courier !== "all") {
      query.courier = courier;
    }
    if (status && status !== "all") {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { id: { $regex: search, $options: "i" } },
        { orderId: { $regex: search, $options: "i" } },
        { trackingCode: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { customerPhone: { $regex: search, $options: "i" } },
        { district: { $regex: search, $options: "i" } },
      ];
    }

    const [deliveries, courierConfigs] = await Promise.all([
      deliveryCollection.find(query).sort({ createdAt: -1 }).toArray(),
      couriersCollection.find({}).toArray(),
    ]);

    // Shipment stats
    const [total, inTransit, outForDelivery, delivered] = await Promise.all([
      deliveryCollection.countDocuments({}),
      deliveryCollection.countDocuments({ status: "In Transit" }),
      deliveryCollection.countDocuments({ status: "Out for Delivery" }),
      deliveryCollection.countDocuments({ status: "Delivered" }),
    ]);

    return NextResponse.json({
      success: true,
      deliveries,
      courierConfigs,
      stats: {
        total,
        inTransit,
        outForDelivery,
        delivered,
      },
    });
  } catch (error) {
    console.error("Error fetching delivery shipments:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load delivery data" },
      { status: 500 }
    );
  }
}

// POST: Create new Consignment / Shipment for an order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, courier, customerName, customerPhone, district, address, cashToCollect } = body;

    if (!orderId || !courier) {
      return NextResponse.json(
        { success: false, message: "orderId and courier are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const deliveryCollection = db.collection("deliveries");
    const ordersCollection = db.collection("orders");
    const couriersCollection = db.collection("courier_configs");

    // Generate unique courier tracking code
    let prefix = "SD";
    if (courier === "Pathao") prefix = "PTH";
    else if (courier === "RedX") prefix = "REDX";
    else if (courier === "Custom") prefix = "RIDER";
    const trackingCode = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newId = `DEL-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const dispatchDate = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const estDate = new Date(Date.now() + 86400000 * 2).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const newDelivery = {
      id: newId,
      orderId,
      customerName: customerName || "Customer",
      customerPhone: customerPhone || "",
      district: district || "Dhaka",
      address: address || "",
      courier,
      trackingCode,
      cashToCollect: Number(cashToCollect) || 0,
      status: "Consignment Created",
      dispatchDate,
      estimatedDelivery: estDate,
      createdAt: now.toISOString(),
    };

    await deliveryCollection.insertOne(newDelivery);

    // Update the corresponding order with tracking code, courier and shipped status
    await ordersCollection.updateOne(
      { id: orderId },
      {
        $set: {
          trackingCode,
          courier,
          orderStatus: "Shipped",
          updatedAt: now.toISOString(),
        },
      }
    );

    // Increment courier totalShipments
    await couriersCollection.updateOne(
      { name: courier },
      { $inc: { totalShipments: 1 } }
    );

    return NextResponse.json({
      success: true,
      message: `Consignment created with tracking code: ${trackingCode}`,
      delivery: newDelivery,
    });
  } catch (error) {
    console.error("Error creating consignment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create consignment" },
      { status: 500 }
    );
  }
}

// PATCH: Update Delivery Status or Courier API Key Config
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { action, trackingCode, status, courierName, apiKey, webhookUrl } = body;

    const db = await getDb();

    // Action 1: Update shipment status
    if (action === "updateStatus" || (!action && trackingCode && status)) {
      const deliveryCollection = db.collection("deliveries");
      const ordersCollection = db.collection("orders");

      const res = await deliveryCollection.updateOne(
        { trackingCode },
        { $set: { status, updatedAt: new Date().toISOString() } }
      );

      // Sync status to orders table
      let orderStatusMap: string = "Shipped";
      if (status === "Delivered") orderStatusMap = "Delivered";
      else if (status === "Out for Delivery") orderStatusMap = "Out for Delivery";
      else if (status === "In Transit") orderStatusMap = "Shipped";

      await ordersCollection.updateOne(
        { trackingCode },
        { 
          $set: { 
            orderStatus: orderStatusMap,
            paymentStatus: status === "Delivered" ? "Paid" : undefined,
            updatedAt: new Date().toISOString() 
          } 
        }
      );

      return NextResponse.json({
        success: true,
        message: `Delivery status updated to ${status}`,
      });
    }

    // Action 2: Update courier integration config
    if (action === "updateConfig" || courierName) {
      const couriersCollection = db.collection("courier_configs");
      await couriersCollection.updateOne(
        { name: courierName },
        {
          $set: {
            apiKey: apiKey || "",
            webhookUrl: webhookUrl || "",
            updatedAt: new Date().toISOString(),
          },
        },
        { upsert: true }
      );

      return NextResponse.json({
        success: true,
        message: `Credentials updated for ${courierName}`,
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action or parameters" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error updating delivery:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update delivery" },
      { status: 500 }
    );
  }
}
