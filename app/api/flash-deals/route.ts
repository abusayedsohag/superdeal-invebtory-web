import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export interface FlashSaleCampaign {
  id: string; // e.g. "default-flash-campaign"
  title: string;
  subtitle: string;
  badge: string;
  startTime: string; // ISO
  endTime: string;   // ISO
  isActive: boolean;
  updatedAt?: string;
}

export interface FlashSaleItem {
  id: string; // e.g. "fs-101"
  productId?: string; // Link to main products collection if selected
  name: string;
  category: string;
  originalPrice: number;
  flashPrice: number;
  discount: string; // e.g. "44% OFF"
  allocatedStock: number;
  soldStock: number;
  image: string;
  rating?: number;
  reviews?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

const DEFAULT_CAMPAIGN: FlashSaleCampaign = {
  id: "default-campaign",
  title: "Flash Sale Hot Deals",
  subtitle: "Massive discount prices ending very soon!",
  badge: "FLASH DEAL",
  startTime: new Date().toISOString(),
  // Default end time: 4 hours 28 minutes from now
  endTime: new Date(Date.now() + (4 * 3600 + 28 * 60 + 15) * 1000).toISOString(),
  isActive: true,
  updatedAt: new Date().toISOString(),
};

const DEFAULT_ITEMS: FlashSaleItem[] = [
  {
    id: "fs-101",
    name: "iPhone Case (Silicone MagSafe)",
    category: "Accessories",
    originalPrice: 450,
    flashPrice: 250,
    discount: "44% OFF",
    allocatedStock: 200,
    soldStock: 142,
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviews: 215,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "fs-102",
    name: "Ergonomic Optical Mouse",
    category: "Electronics",
    originalPrice: 890,
    flashPrice: 490,
    discount: "45% OFF",
    allocatedStock: 100,
    soldStock: 78,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviews: 94,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "fs-103",
    name: "Mechanical Gaming Keyboard",
    category: "Electronics",
    originalPrice: 1600,
    flashPrice: 990,
    discount: "38% OFF",
    allocatedStock: 80,
    soldStock: 65,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviews: 189,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "fs-104",
    name: "Wireless Gaming Headphone ANC",
    category: "Electronics",
    originalPrice: 1950,
    flashPrice: 1150,
    discount: "41% OFF",
    allocatedStock: 150,
    soldStock: 112,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviews: 340,
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

export async function GET(request: Request) {
  try {
    const db = await getDb();
    const itemsCollection = db.collection("flash_deals");
    const campaignCollection = db.collection("flash_sale_campaign");

    // Auto-seed campaign settings if empty
    let campaign = await campaignCollection.findOne({ id: "default-campaign" });
    if (!campaign) {
      await campaignCollection.insertOne(DEFAULT_CAMPAIGN);
      campaign = DEFAULT_CAMPAIGN as any;
    }

    // Auto-seed items if empty
    const itemsCount = await itemsCollection.countDocuments({});
    if (itemsCount === 0) {
      await itemsCollection.insertMany(DEFAULT_ITEMS);
    }

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    let filter: any = {};
    if (activeOnly) {
      filter.isActive = { $ne: false };
    }

    const items = await itemsCollection.find(filter).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({
      success: true,
      campaign: {
        title: campaign?.title || DEFAULT_CAMPAIGN.title,
        subtitle: campaign?.subtitle || DEFAULT_CAMPAIGN.subtitle,
        badge: campaign?.badge || DEFAULT_CAMPAIGN.badge,
        startTime: campaign?.startTime || DEFAULT_CAMPAIGN.startTime,
        endTime: campaign?.endTime || DEFAULT_CAMPAIGN.endTime,
        isActive: campaign?.isActive ?? true,
      },
      items: items.map(it => ({
        ...it,
        _id: it._id.toString()
      }))
    });
  } catch (error: any) {
    console.error("GET /api/flash-deals error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to fetch flash deals"
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const itemsCollection = db.collection("flash_deals");
    const body = await request.json();

    const name = (body.name || "").trim();
    const originalPrice = Number(body.originalPrice) || 0;
    const flashPrice = Number(body.flashPrice) || 0;
    const allocatedStock = Number(body.allocatedStock) || 50;

    if (!name) {
      return NextResponse.json({ success: false, message: "Product name is required" }, { status: 400 });
    }
    if (originalPrice <= 0 || flashPrice <= 0) {
      return NextResponse.json({ success: false, message: "Prices must be greater than 0" }, { status: 400 });
    }

    const discPercent = Math.max(1, Math.round(((originalPrice - flashPrice) / originalPrice) * 100));

    const newItem: FlashSaleItem = {
      id: body.id || `fs-${Date.now().toString().slice(-4)}`,
      productId: body.productId || undefined,
      name,
      category: body.category || "General",
      originalPrice,
      flashPrice,
      discount: body.discount || `${discPercent}% OFF`,
      allocatedStock,
      soldStock: Number(body.soldStock) || 0,
      image: body.image || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80",
      rating: body.rating ? Number(body.rating) : 4.8,
      reviews: body.reviews ? Number(body.reviews) : 100,
      isActive: body.isActive ?? true,
      createdAt: new Date().toISOString()
    };

    const result = await itemsCollection.insertOne(newItem);

    return NextResponse.json({
      success: true,
      message: "Flash sale product added successfully",
      item: { ...newItem, _id: result.insertedId.toString() }
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/flash-deals error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to add flash sale product"
    }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const db = await getDb();
    const body = await request.json();

    // 1. Update Campaign Settings
    if (body.target === "campaign") {
      const campaignCollection = db.collection("flash_sale_campaign");
      const updateData: any = { updatedAt: new Date().toISOString() };
      if (body.title !== undefined) updateData.title = body.title;
      if (body.subtitle !== undefined) updateData.subtitle = body.subtitle;
      if (body.badge !== undefined) updateData.badge = body.badge;
      if (body.startTime !== undefined) updateData.startTime = body.startTime;
      if (body.endTime !== undefined) updateData.endTime = body.endTime;
      if (body.isActive !== undefined) updateData.isActive = body.isActive;

      await campaignCollection.updateOne(
        { id: "default-campaign" },
        { $set: updateData },
        { upsert: true }
      );

      return NextResponse.json({
        success: true,
        message: "Flash sale campaign settings updated successfully"
      });
    }

    // 2. Update Flash Item or Increment Sold
    const itemsCollection = db.collection("flash_deals");
    const { id, _id, incrementSold, ...updateFields } = body;

    const filter = _id ? { _id: new ObjectId(_id) } : { id };

    if (!id && !_id) {
      return NextResponse.json({ success: false, message: "Item id or _id is required" }, { status: 400 });
    }

    if (incrementSold) {
      await itemsCollection.updateOne(filter, {
        $inc: { soldStock: 1 },
        $set: { updatedAt: new Date().toISOString() }
      });
      return NextResponse.json({ success: true, message: "Sold count incremented" });
    }

    updateFields.updatedAt = new Date().toISOString();
    if (updateFields.originalPrice && updateFields.flashPrice) {
      const oP = Number(updateFields.originalPrice);
      const fP = Number(updateFields.flashPrice);
      updateFields.discount = `${Math.round(((oP - fP) / oP) * 100)}% OFF`;
    }

    const result = await itemsCollection.updateOne(filter, { $set: updateFields });
    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Item updated successfully" });
  } catch (error: any) {
    console.error("PATCH /api/flash-deals error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to update flash deal"
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const db = await getDb();
    const itemsCollection = db.collection("flash_deals");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const _id = searchParams.get("_id");

    if (!id && !_id) {
      return NextResponse.json({ success: false, message: "Item id or _id is required" }, { status: 400 });
    }

    const filter = _id ? { _id: new ObjectId(_id) } : { id };
    const result = await itemsCollection.deleteOne(filter);

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Flash deal item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Item removed from flash sale" });
  } catch (error: any) {
    console.error("DELETE /api/flash-deals error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to delete item"
    }, { status: 500 });
  }
}
