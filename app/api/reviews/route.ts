import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export interface Review {
  id: string; // e.g. "REV-1001"
  productId?: string;
  productName: string;
  customerName: string;
  customerEmail?: string;
  customerAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  isVerifiedPurchase: boolean;
  status: "Pending" | "Approved" | "Rejected";
  adminReply?: string;
  createdAt: string; // ISO
  dateFormatted?: string;
  updatedAt?: string;
}

const DEFAULT_REVIEWS: Review[] = [
  {
    id: "REV-1001",
    productId: "1",
    productName: "Wireless Noise-Canceling Premium Headphones",
    customerName: "Abu Sayed",
    customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    rating: 5,
    comment: "Sound quality is extraordinary! ANC blocks out outside noise effortlessly. Worth every taka.",
    isVerifiedPurchase: true,
    status: "Pending",
    createdAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
    dateFormatted: "28 Oct 2026"
  },
  {
    id: "REV-1002",
    productId: "2",
    productName: "Ultra Smart Watch Series 7 Pro",
    customerName: "Tanvir Hossain",
    customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    rating: 5,
    comment: "Super smooth touch response and excellent battery performance! Highly recommended.",
    isVerifiedPurchase: true,
    status: "Approved",
    adminReply: "Thank you Tanvir! Glad you loved the smartwatch performance.",
    createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    dateFormatted: "27 Oct 2026"
  },
  {
    id: "REV-1003",
    productId: "3",
    productName: "Ergonomic Mechanical Gaming Keyboard",
    customerName: "Sharmin Sultana",
    customerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    rating: 4,
    comment: "Keys feel tactile and responsive. RGB lighting patterns look amazing at night.",
    isVerifiedPurchase: true,
    status: "Approved",
    createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    dateFormatted: "26 Oct 2026"
  },
  {
    id: "REV-1004",
    productId: "1",
    productName: "Wireless Noise-Canceling Premium Headphones",
    customerName: "Alex Harrison",
    customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    rating: 5,
    comment: "Absolute game changer for remote work! The noise cancellation blocks out background noise completely.",
    isVerifiedPurchase: true,
    status: "Approved",
    createdAt: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
    dateFormatted: "25 Oct 2026"
  }
];

export async function GET(request: Request) {
  try {
    const db = await getDb();
    const collection = db.collection("reviews");

    // Auto seed if collection is completely empty
    const count = await collection.countDocuments({});
    if (count === 0) {
      await collection.insertMany(DEFAULT_REVIEWS);
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    let filter: any = {};
    if (productId) {
      filter.$or = [
        { productId: productId },
        { productId: { $regex: productId, $options: "i" } }
      ];
    }
    if (status && status !== "all") {
      filter.status = status;
    }
    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { customerName: { $regex: q, $options: "i" } },
        { productName: { $regex: q, $options: "i" } },
        { comment: { $regex: q, $options: "i" } },
        { id: { $regex: q, $options: "i" } }
      ];
    }

    const reviews = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      reviews: reviews.map((r) => ({
        ...r,
        _id: r._id.toString()
      }))
    });
  } catch (error: any) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to fetch reviews"
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const collection = db.collection("reviews");
    const productsCollection = db.collection("products");
    const body = await request.json();

    const customerName = (body.customerName || "Customer").trim();
    const comment = (body.comment || "").trim();
    const rating = Math.min(5, Math.max(1, Number(body.rating) || 5));
    const productName = (body.productName || "Product").trim();
    const productId = body.productId || undefined;

    if (!comment) {
      return NextResponse.json({ success: false, message: "Review comment is required" }, { status: 400 });
    }

    const count = await collection.countDocuments({});
    const newId = `REV-${1000 + count + 1}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    const newReview: Review = {
      id: newId,
      productId,
      productName,
      customerName,
      customerEmail: body.customerEmail || undefined,
      customerAvatar: body.customerAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
      rating,
      comment,
      isVerifiedPurchase: Boolean(body.isVerifiedPurchase ?? true),
      status: "Pending", // Requires admin approval or set to Approved
      createdAt: now.toISOString(),
      dateFormatted: formattedDate
    };

    const result = await collection.insertOne(newReview);

    // Optionally increment review count on product in DB
    if (productId) {
      try {
        await productsCollection.updateOne(
          { $or: [{ id: productId }, { _id: new ObjectId(productId) }] },
          { $inc: { reviewCount: 1 } }
        );
      } catch (e) {
        console.error("Failed to increment product reviewCount:", e);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Your review has been submitted successfully and is pending approval!",
      review: {
        ...newReview,
        _id: result.insertedId.toString()
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to submit review"
    }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const db = await getDb();
    const collection = db.collection("reviews");
    const body = await request.json();

    const { id, _id, ...updateFields } = body;
    const filter = _id ? { _id: new ObjectId(_id) } : { id };

    if (!id && !_id) {
      return NextResponse.json({ success: false, message: "Review id is required" }, { status: 400 });
    }

    updateFields.updatedAt = new Date().toISOString();

    const result = await collection.updateOne(filter, { $set: updateFields });
    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Review updated successfully"
    });
  } catch (error: any) {
    console.error("PATCH /api/reviews error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to update review"
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const db = await getDb();
    const collection = db.collection("reviews");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const _id = searchParams.get("_id");

    if (!id && !_id) {
      return NextResponse.json({ success: false, message: "Review id is required" }, { status: 400 });
    }

    const filter = _id ? { _id: new ObjectId(_id) } : { id };
    const result = await collection.deleteOne(filter);

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error: any) {
    console.error("DELETE /api/reviews error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to delete review"
    }, { status: 500 });
  }
}
