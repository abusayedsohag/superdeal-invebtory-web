import { getDb } from "@/lib/mongodb";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { UserDocument } from "@/types/user";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, authenticated: false, message: "No active session" },
        { status: 401 }
      );
    }

    const payload = await verifyAuthToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, authenticated: false, message: "Invalid or expired session" },
        { status: 401 }
      );
    }

    const db = await getDb();
    const usersCollection = db.collection<UserDocument>("users");
    const user = await usersCollection.findOne({ id: payload.userId });

    if (!user) {
      return NextResponse.json(
        { success: false, authenticated: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Exclude passwordHash from response
    const { passwordHash, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: safeUser,
    });
  } catch (error) {
    console.error("Auth Me API error:", error);
    return NextResponse.json(
      { success: false, authenticated: false, message: "Failed to verify session" },
      { status: 500 }
    );
  }
}
