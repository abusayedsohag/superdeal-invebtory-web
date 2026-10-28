import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  sku?: string;
  isFlashDeal?: boolean;
}

export interface CustomerOrder {
  id: string; // e.g. "ORD-10298"
  customer: string;
  phone: string;
  email: string;
  district: string;
  upazila: string;
  address: string;
  deliveryInstruction?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  couponCode?: string;
  couponDiscount?: number;
  total: number;
  paymentMethod: string;
  paymentStatus: "Pending" | "Paid" | "Failed";
  orderStatus: 
    | "Pending"
    | "Confirmed"
    | "Processing"
    | "Packed"
    | "Shipped"
    | "Out for Delivery"
    | "Delivered"
    | "Cancelled"
    | "Returned"
    | "Refunded";
  trackingCode?: string;
  courier?: string;
  createdAt: string; // ISO
  dateFormatted?: string;
  updatedAt?: string;
}

const DEFAULT_ORDERS: CustomerOrder[] = [
  {
    id: "ORD-10293",
    customer: "Rahim Ahmed",
    phone: "+880 1711223344",
    email: "rahim@example.com",
    district: "Dhaka",
    upazila: "Banani",
    address: "House 42, Road 11, Block D",
    items: [
      { id: "1", name: "Wireless Gaming Headphones", price: 1950, qty: 1, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80" },
      { id: "2", name: "USB-C Fast Cable", price: 500, qty: 1, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&auto=format&fit=crop&q=80" }
    ],
    subtotal: 2450,
    shipping: 0,
    tax: 0,
    total: 2450,
    paymentMethod: "COD",
    paymentStatus: "Pending",
    orderStatus: "Processing",
    createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    dateFormatted: "28 Oct 2026, 02:45 PM"
  },
  {
    id: "ORD-10294",
    customer: "Tanvir Hossain",
    phone: "+880 1819223344",
    email: "tanvir@example.com",
    district: "Chittagong",
    upazila: "Agrabad",
    address: "Commercial Area, Agrabad",
    items: [
      { id: "3", name: "Ultra Smart Watch Series 7 Pro", price: 1490, qty: 1, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80" }
    ],
    subtotal: 1490,
    shipping: 0,
    tax: 0,
    total: 1490,
    paymentMethod: "bKash MFS",
    paymentStatus: "Paid",
    orderStatus: "Confirmed",
    createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    dateFormatted: "28 Oct 2026, 01:15 PM"
  },
  {
    id: "ORD-10295",
    customer: "Sharmin Sultana",
    phone: "+880 1733445566",
    email: "sharmin@example.com",
    district: "Sylhet",
    upazila: "Zindabazar",
    address: "Tower 4, Zindabazar Point",
    items: [
      { id: "4", name: "Mechanical Gaming Keyboard", price: 1600, qty: 2, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&auto=format&fit=crop&q=80" }
    ],
    subtotal: 3200,
    shipping: 0,
    tax: 0,
    total: 3200,
    paymentMethod: "Nagad MFS",
    paymentStatus: "Paid",
    orderStatus: "Packed",
    createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    dateFormatted: "27 Oct 2026, 11:30 AM"
  },
  {
    id: "ORD-10296",
    customer: "Mahmud Hasan",
    phone: "+880 1911887766",
    email: "mahmud@example.com",
    district: "Rangpur",
    upazila: "Station Road",
    address: "Main Plaza, Station Road",
    items: [
      { id: "5", name: "Ergonomic Optical Mouse", price: 890, qty: 1, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&auto=format&fit=crop&q=80" }
    ],
    subtotal: 890,
    shipping: 0,
    tax: 0,
    total: 890,
    paymentMethod: "COD",
    paymentStatus: "Pending",
    orderStatus: "Out for Delivery",
    createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    dateFormatted: "26 Oct 2026, 04:20 PM"
  }
];

export async function GET(request: Request) {
  try {
    const db = await getDb();
    const collection = db.collection("orders");

    // Auto seed if collection is completely empty
    const count = await collection.countDocuments({});
    if (count === 0) {
      await collection.insertMany(DEFAULT_ORDERS);
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const phone = searchParams.get("phone");
    const email = searchParams.get("email");
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    // If fetching single order by id
    if (id) {
      const cleanId = id.trim().replace(/^#/, "");
      const order = await collection.findOne({
        $or: [
          { id: cleanId },
          { id: `#${cleanId}` },
          { id: { $regex: cleanId, $options: "i" } }
        ]
      });

      if (!order) {
        return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        order: { ...order, _id: order._id.toString() }
      });
    }

    let filter: any = {};
    if (status && status !== "all") {
      filter.orderStatus = status;
    }
    if (phone) {
      filter.phone = { $regex: phone.trim(), $options: "i" };
    }
    if (email) {
      filter.email = { $regex: email.trim(), $options: "i" };
    }
    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { id: { $regex: q, $options: "i" } },
        { customer: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
        { district: { $regex: q, $options: "i" } },
        { "items.name": { $regex: q, $options: "i" } }
      ];
    }

    const orders = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      orders: orders.map((o) => ({
        ...o,
        _id: o._id.toString()
      }))
    });
  } catch (error: any) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to fetch orders"
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const ordersCollection = db.collection("orders");
    const productsCollection = db.collection("products");
    const couponsCollection = db.collection("coupons");
    const body = await request.json();

    const customer = (body.customer || "").trim();
    const phone = (body.phone || "").trim();
    const items: OrderItem[] = Array.isArray(body.items) ? body.items : [];

    if (!customer) {
      return NextResponse.json({ success: false, message: "Customer name is required" }, { status: 400 });
    }
    if (!phone) {
      return NextResponse.json({ success: false, message: "Customer phone is required" }, { status: 400 });
    }
    if (items.length === 0) {
      return NextResponse.json({ success: false, message: "Cart cannot be empty" }, { status: 400 });
    }

    // Generate Order ID
    const totalCount = await ordersCollection.countDocuments({});
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-${Date.now().toString().slice(-4)}${randomSuffix.toString().slice(-2)}`;

    const subtotal = Number(body.subtotal) || 0;
    const shipping = Number(body.shipping) || 0;
    const tax = Number(body.tax) || 0;
    const couponDiscount = Number(body.couponDiscount) || 0;
    const total = Number(body.total) || Math.max(0, subtotal + shipping + tax - couponDiscount);

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }) + `, ` + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

    const newOrder: CustomerOrder = {
      id: orderId,
      customer,
      phone,
      email: (body.email || "").trim(),
      district: body.district || "Dhaka",
      upazila: body.upazila || "Banani",
      address: body.address || "",
      deliveryInstruction: body.deliveryInstruction || "",
      items,
      subtotal,
      shipping,
      tax,
      couponCode: body.couponCode || undefined,
      couponDiscount,
      total,
      paymentMethod: body.paymentMethod || "COD",
      paymentStatus: body.paymentStatus || (body.paymentMethod === "COD" ? "Pending" : "Paid"),
      orderStatus: "Pending",
      createdAt: now.toISOString(),
      dateFormatted: formattedDate
    };

    const result = await ordersCollection.insertOne(newOrder);

    // 1. Deduct Stock from Products Collection if matched by SKU or ID
    for (const item of items) {
      try {
        const itemQty = Number(item.qty) || 1;
        // Check by id or sku or name
        const filter = item.id.startsWith("flash-")
          ? { $or: [{ name: item.name }, { sku: item.sku }] }
          : { $or: [{ id: item.id }, { sku: item.sku }, { name: item.name }] };

        await productsCollection.updateOne(filter, {
          $inc: { stock: -itemQty }
        });
      } catch (err) {
        console.error("Error deducting product stock:", err);
      }
    }

    // 2. Increment coupon usage if used
    if (body.couponCode) {
      try {
        await couponsCollection.updateOne(
          { code: body.couponCode.toUpperCase() },
          { $inc: { usedCount: 1 } }
        );
      } catch (err) {
        console.error("Error incrementing coupon usedCount:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      order: {
        ...newOrder,
        _id: result.insertedId.toString()
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to place order"
    }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const db = await getDb();
    const collection = db.collection("orders");
    const body = await request.json();

    const { id, _id, ...updateFields } = body;
    const filter = _id ? { _id: new ObjectId(_id) } : { id };

    if (!id && !_id) {
      return NextResponse.json({ success: false, message: "Order id or _id is required" }, { status: 400 });
    }

    updateFields.updatedAt = new Date().toISOString();

    const result = await collection.updateOne(filter, { $set: updateFields });
    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Order updated successfully" });
  } catch (error: any) {
    console.error("PATCH /api/orders error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to update order"
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const db = await getDb();
    const collection = db.collection("orders");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const _id = searchParams.get("_id");

    if (!id && !_id) {
      return NextResponse.json({ success: false, message: "Order id or _id is required" }, { status: 400 });
    }

    const filter = _id ? { _id: new ObjectId(_id) } : { id };
    const result = await collection.deleteOne(filter);

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Order deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/orders error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to delete order"
    }, { status: 500 });
  }
}
