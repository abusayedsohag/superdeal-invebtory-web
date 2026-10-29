import { getDb } from "@/lib/mongodb";
import { comparePassword, hashPassword, signAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { UserDocument } from "@/types/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Please provide both email and password" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = await getDb();
    const usersCollection = db.collection<UserDocument>("users");

    // Auto-seed default Super Admin and demo accounts if users collection is empty
    const usersCount = await usersCollection.countDocuments({});
    if (usersCount === 0) {
      const defaultAdminPassHash = await hashPassword("admin123");
      const defaultCustomerPassHash = await hashPassword("123456");
      const now = new Date().toISOString();

      const seedUsers: UserDocument[] = [
        {
          id: "USR-0001",
          name: "Super Administrator",
          email: "admin@superdeal.com",
          phone: "+880 1700-000000",
          passwordHash: defaultAdminPassHash,
          provider: "credentials",
          role: "Super Admin",
          status: "Active",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
          createdAt: now,
          lastLogin: now,
        },
        {
          id: "USR-0002",
          name: "Abu Sayed",
          email: "sayed@example.com",
          phone: "+880 1711-223344",
          passwordHash: defaultCustomerPassHash,
          provider: "credentials",
          role: "Customer",
          status: "Active",
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Abu%20Sayed",
          district: "Dhaka",
          address: "House 42, Road 11, Block D, Banani, Dhaka-1213",
          rewardPoints: 540,
          totalOrders: 18,
          totalSpent: 48500,
          createdAt: now,
          lastLogin: now,
        },
        {
          id: "USR-0003",
          name: "Inventory Manager Rafiq",
          email: "inventory@superdeal.com",
          phone: "+880 1819-001122",
          passwordHash: defaultAdminPassHash,
          provider: "credentials",
          role: "Inventory Manager",
          status: "Active",
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Rafiq",
          createdAt: now,
          lastLogin: now,
        },
        {
          id: "USR-0004",
          name: "Accountant Kamal",
          email: "accountant@superdeal.com",
          phone: "+880 1911-334455",
          passwordHash: defaultAdminPassHash,
          provider: "credentials",
          role: "Accountant",
          status: "Active",
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Kamal",
          createdAt: now,
          lastLogin: now,
        },
      ];

      await usersCollection.insertMany(seedUsers);
    }

    // Find user in database
    const user = await usersCollection.findOne({ email: cleanEmail });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (user.status === "Inactive" || user.status === "Suspended") {
      return NextResponse.json(
        { success: false, message: "Your account is inactive. Please contact support." },
        { status: 403 }
      );
    }

    // Verify Password
    if (!user.passwordHash) {
      return NextResponse.json(
        { success: false, message: "Please sign in using your social login provider (Google/Facebook)." },
        { status: 400 }
      );
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Update lastLogin timestamp
    const now = new Date().toISOString();
    await usersCollection.updateOne({ _id: user._id }, { $set: { lastLogin: now } });

    // Generate JWT Auth token
    const token = await signAuthToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    });

    const response = NextResponse.json({
      success: true,
      message: "Login successful!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
    });

    // Set HTTP-only secure cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred during login" },
      { status: 500 }
    );
  }
}
