import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const user = await db.collection("users").findOne(
      { email: session.email.toLowerCase() },
      { projection: { passwordHash: 0 } }
    );

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Dynamically calculate user's real orders and spent amount from orders collection
    const userEmail = session.email.toLowerCase();
    const userPhone = user.phone || "";
    const orderQuery: any = {
      $or: [
        { email: { $regex: new RegExp(`^${userEmail}$`, "i") } }
      ]
    };
    if (userPhone && userPhone.length >= 8) {
      orderQuery.$or.push({ phone: userPhone });
    }

    const userOrders = await db.collection("orders").find(orderQuery).toArray();
    const dynamicOrdersCount = userOrders.length > 0 ? userOrders.length : (user.totalOrders || 0);
    const dynamicTotalSpent = userOrders.length > 0
      ? userOrders.reduce((sum, ord) => sum + (Number(ord.total) || 0), 0)
      : (user.totalSpent || 0);

    return NextResponse.json({
      success: true,
      profile: {
        id: user.id || user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        avatar: user.avatar || "",
        role: user.role,
        address: user.address || "",
        district: user.district || "",
        upazila: user.upazila || "",
        rewardPoints: user.rewardPoints || 0,
        totalOrders: dynamicOrdersCount,
        totalSpent: dynamicTotalSpent,
        createdAt: user.createdAt || new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error("GET /api/user/profile error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { name, phone, address, district, upazila, avatar } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ success: false, message: "Valid name is required" }, { status: 400 });
    }

    const db = await getDb();
    const updateFields: Record<string, any> = {
      name: name.trim(),
      phone: (phone || "").trim(),
      address: (address || "").trim(),
      district: (district || "").trim(),
      upazila: (upazila || "").trim(),
      updatedAt: new Date().toISOString()
    };

    if (avatar && typeof avatar === "string") {
      updateFields.avatar = avatar.trim();
    }

    await db.collection("users").updateOne(
      { email: session.email.toLowerCase() },
      { $set: updateFields }
    );

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully!",
      updatedProfile: updateFields
    });
  } catch (error: any) {
    console.error("PUT /api/user/profile error:", error);
    return NextResponse.json({ success: false, message: "Failed to update profile" }, { status: 500 });
  }
}
