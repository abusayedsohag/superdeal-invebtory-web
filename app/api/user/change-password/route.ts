import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getSessionUser, verifyPassword, hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword, confirmPassword } = await req.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: "All password fields are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "New password and confirmation do not match" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const user = await db.collection("users").findOne({ email: session.email.toLowerCase() });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { success: false, message: "Account password not found. Please contact support." },
        { status: 400 }
      );
    }

    const isMatch = await verifyPassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    const newHashed = await hashPassword(newPassword);
    await db.collection("users").updateOne(
      { email: session.email.toLowerCase() },
      { $set: { passwordHash: newHashed, updatedAt: new Date().toISOString() } }
    );

    return NextResponse.json({
      success: true,
      message: "Password changed successfully! Keep your new credentials safe."
    });
  } catch (error: any) {
    console.error("POST /api/user/change-password error:", error);
    return NextResponse.json({ success: false, message: "Failed to update password" }, { status: 500 });
  }
}
