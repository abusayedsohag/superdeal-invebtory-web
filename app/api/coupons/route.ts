import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export interface Coupon {
  id: string;
  code: string;
  type: "Fixed Amount" | "Percentage";
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  expiry: string; // ISO date string or formatted like YYYY-MM-DD
  status: "Active" | "Expired" | "Scheduled";
  isFirstOrderOnly: boolean;
  categoryScope: string;
  productScope: string;
  customerAudience: string;
  usagePerUser: number;
  createdAt: string;
  updatedAt?: string;
}

const DEFAULT_COUPONS: Coupon[] = [
  {
    id: "CPN-001",
    code: "SAVE500",
    type: "Fixed Amount",
    discountValue: 500,
    minOrder: 3000,
    maxDiscount: 500,
    usageLimit: 500,
    usedCount: 184,
    expiry: "2026-12-31",
    status: "Active",
    isFirstOrderOnly: false,
    categoryScope: "All Categories",
    productScope: "All Products",
    customerAudience: "All Customers",
    usagePerUser: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: "CPN-002",
    code: "SUPER20",
    type: "Percentage",
    discountValue: 20,
    minOrder: 50,
    maxDiscount: 1000,
    usageLimit: 1000,
    usedCount: 412,
    expiry: "2026-12-31",
    status: "Active",
    isFirstOrderOnly: false,
    categoryScope: "All Categories",
    productScope: "All Products",
    customerAudience: "All Customers",
    usagePerUser: 2,
    createdAt: new Date().toISOString()
  },
  {
    id: "CPN-003",
    code: "WELCOME100",
    type: "Fixed Amount",
    discountValue: 100,
    minOrder: 500,
    maxDiscount: 100,
    usageLimit: 2000,
    usedCount: 1240,
    expiry: "2026-11-15",
    status: "Active",
    isFirstOrderOnly: true,
    categoryScope: "All Categories",
    productScope: "All Products",
    customerAudience: "First-Time Buyers",
    usagePerUser: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: "CPN-004",
    code: "VIPGOLD50",
    type: "Percentage",
    discountValue: 50,
    minOrder: 5000,
    maxDiscount: 2500,
    usageLimit: 100,
    usedCount: 35,
    expiry: "2026-12-31",
    status: "Active",
    isFirstOrderOnly: false,
    categoryScope: "Fashion",
    productScope: "All Products",
    customerAudience: "VIP Gold Members",
    usagePerUser: 3,
    createdAt: new Date().toISOString()
  },
  {
    id: "CPN-005",
    code: "MEGA50",
    type: "Percentage",
    discountValue: 50,
    minOrder: 100,
    maxDiscount: 1500,
    usageLimit: 500,
    usedCount: 45,
    expiry: "2026-12-31",
    status: "Active",
    isFirstOrderOnly: false,
    categoryScope: "All Categories",
    productScope: "All Products",
    customerAudience: "All Customers",
    usagePerUser: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: "CPN-006",
    code: "WELCOME10",
    type: "Fixed Amount",
    discountValue: 10,
    minOrder: 0,
    maxDiscount: 10,
    usageLimit: 5000,
    usedCount: 120,
    expiry: "2026-12-31",
    status: "Active",
    isFirstOrderOnly: true,
    categoryScope: "All Categories",
    productScope: "All Products",
    customerAudience: "First-Time Buyers",
    usagePerUser: 1,
    createdAt: new Date().toISOString()
  }
];

export async function GET(request: Request) {
  try {
    const db = await getDb();
    const collection = db.collection("coupons");

    // Auto-seed if empty
    const count = await collection.countDocuments({});
    if (count === 0) {
      await collection.insertMany(DEFAULT_COUPONS);
    }

    const { searchParams } = new URL(request.url);
    const validateCode = searchParams.get("validate");
    const code = searchParams.get("code")?.trim().toUpperCase();
    const subtotalParam = searchParams.get("subtotal");

    // Validate Coupon Mode for Cart/Checkout
    if (validateCode === "true" || code) {
      if (!code) {
        return NextResponse.json({
          valid: false,
          message: "Please enter a coupon code."
        }, { status: 400 });
      }

      const coupon = await collection.findOne({ code });
      if (!coupon) {
        return NextResponse.json({
          valid: false,
          message: `Coupon code '${code}' is invalid!`
        }, { status: 404 });
      }

      // Check Status
      if (coupon.status !== "Active") {
        return NextResponse.json({
          valid: false,
          message: `Coupon '${code}' is currently ${coupon.status.toLowerCase()}!`
        }, { status: 400 });
      }

      // Check Expiry
      if (coupon.expiry) {
        const expiryDate = new Date(coupon.expiry);
        // If valid date, compare with end of that day
        if (!isNaN(expiryDate.getTime())) {
          expiryDate.setHours(23, 59, 59, 999);
          if (new Date() > expiryDate) {
            return NextResponse.json({
              valid: false,
              message: `Coupon '${code}' has expired on ${coupon.expiry}!`
            }, { status: 400 });
          }
        }
      }

      // Check Usage Limit
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return NextResponse.json({
          valid: false,
          message: `Coupon '${code}' usage limit has been reached!`
        }, { status: 400 });
      }

      const subtotal = Number(subtotalParam) || 0;
      // Check Minimum Order Amount
      if (coupon.minOrder && subtotal < coupon.minOrder) {
        return NextResponse.json({
          valid: false,
          message: `Coupon '${code}' requires a minimum subtotal of ৳${coupon.minOrder.toFixed(2)}!`
        }, { status: 400 });
      }

      // Calculate Discount
      let calculatedDiscount = 0;
      if (coupon.type === "Fixed Amount") {
        calculatedDiscount = Number(coupon.discountValue) || 0;
      } else {
        calculatedDiscount = (subtotal * (Number(coupon.discountValue) || 0)) / 100;
        if (coupon.maxDiscount && calculatedDiscount > coupon.maxDiscount) {
          calculatedDiscount = coupon.maxDiscount;
        }
      }

      return NextResponse.json({
        valid: true,
        message: `Coupon '${code}' applied successfully!`,
        coupon: {
          id: coupon.id,
          code: coupon.code,
          type: coupon.type === "Fixed Amount" ? "fixed" : "percent",
          discount: Number(coupon.discountValue) || 0,
          calculatedDiscount: Math.min(calculatedDiscount, subtotal),
          minOrder: coupon.minOrder,
          maxDiscount: coupon.maxDiscount,
          isFirstOrderOnly: coupon.isFirstOrderOnly
        }
      });
    }

    // List mode for Admin Panel
    const search = searchParams.get("search");
    const type = searchParams.get("type");

    let filter: any = {};
    if (type && type !== "all") {
      filter.type = type;
    }
    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { code: { $regex: q, $options: "i" } },
        { id: { $regex: q, $options: "i" } },
        { categoryScope: { $regex: q, $options: "i" } },
        { customerAudience: { $regex: q, $options: "i" } }
      ];
    }

    const coupons = await collection.find(filter).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({
      success: true,
      coupons: coupons.map(c => ({
        ...c,
        _id: c._id.toString()
      }))
    });
  } catch (error: any) {
    console.error("Error in GET /api/coupons:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to fetch coupons"
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const collection = db.collection("coupons");
    const body = await request.json();

    const code = (body.code || "").trim().toUpperCase();
    if (!code) {
      return NextResponse.json({ success: false, message: "Coupon code is required" }, { status: 400 });
    }

    // Check duplicate code
    const existing = await collection.findOne({ code });
    if (existing) {
      return NextResponse.json({ success: false, message: `Coupon code '${code}' already exists!` }, { status: 400 });
    }

    const count = await collection.countDocuments({});
    const nextId = `CPN-${String(count + 1).padStart(3, "0")}`;

    const newCoupon: Coupon = {
      id: body.id || nextId,
      code,
      type: body.type === "Percentage" ? "Percentage" : "Fixed Amount",
      discountValue: Number(body.discountValue) || 0,
      minOrder: Number(body.minOrder) || 0,
      maxDiscount: body.maxDiscount ? Number(body.maxDiscount) : undefined,
      usageLimit: Number(body.usageLimit) || 100,
      usedCount: 0,
      expiry: body.expiry || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      status: body.status || "Active",
      isFirstOrderOnly: Boolean(body.isFirstOrderOnly),
      categoryScope: body.categoryScope || "All Categories",
      productScope: body.productScope || "All Products",
      customerAudience: body.customerAudience || "All Customers",
      usagePerUser: Number(body.usagePerUser) || 1,
      createdAt: new Date().toISOString()
    };

    const result = await collection.insertOne(newCoupon);

    return NextResponse.json({
      success: true,
      message: "Coupon created successfully",
      coupon: { ...newCoupon, _id: result.insertedId.toString() }
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/coupons:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to create coupon"
    }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const db = await getDb();
    const collection = db.collection("coupons");
    const body = await request.json();

    const { id, _id, incrementUsed, ...updateFields } = body;
    const filter = _id 
      ? { _id: new ObjectId(_id) } 
      : { id };

    if (!id && !_id) {
      return NextResponse.json({ success: false, message: "Coupon ID or _id is required" }, { status: 400 });
    }

    if (incrementUsed) {
      const res = await collection.updateOne(filter, {
        $inc: { usedCount: 1 },
        $set: { updatedAt: new Date().toISOString() }
      });
      return NextResponse.json({ success: true, message: "Coupon usage incremented" });
    }

    updateFields.updatedAt = new Date().toISOString();
    if (updateFields.code) {
      updateFields.code = updateFields.code.trim().toUpperCase();
    }

    const result = await collection.updateOne(filter, { $set: updateFields });

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Coupon updated successfully" });
  } catch (error: any) {
    console.error("Error in PATCH /api/coupons:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to update coupon"
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const db = await getDb();
    const collection = db.collection("coupons");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const _id = searchParams.get("_id");

    if (!id && !_id) {
      return NextResponse.json({ success: false, message: "Coupon id or _id is required" }, { status: 400 });
    }

    const filter = _id ? { _id: new ObjectId(_id) } : { id };
    const result = await collection.deleteOne(filter);

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Coupon deleted successfully" });
  } catch (error: any) {
    console.error("Error in DELETE /api/coupons:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to delete coupon"
    }, { status: 500 });
  }
}
