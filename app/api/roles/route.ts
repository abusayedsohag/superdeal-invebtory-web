import { getDb } from "@/lib/mongodb";
import { RoleDocument, UserRole } from "@/types/user";
import { NextResponse } from "next/server";

// Default System Roles & Route Permissions Matrix
const DEFAULT_SYSTEM_ROLES: RoleDocument[] = [
  {
    name: "Super Admin",
    level: 1,
    description: "Unrestricted root system access across all admin routes and configurations",
    badgeColor: "bg-rose-500/25 text-rose-300 border border-rose-500/40",
    isSystemRole: true,
    permissions: {
      dashboard: { view: true, create: true, edit: true, delete: true },
      products: { view: true, create: true, edit: true, delete: true },
      categories: { view: true, create: true, edit: true, delete: true },
      inventory: { view: true, create: true, edit: true, delete: true },
      barcode: { view: true, create: true, edit: true, delete: true },
      warehouses: { view: true, create: true, edit: true, delete: true },
      purchases: { view: true, create: true, edit: true, delete: true },
      suppliers: { view: true, create: true, edit: true, delete: true },
      orders: { view: true, create: true, edit: true, delete: true },
      returns: { view: true, create: true, edit: true, delete: true },
      delivery: { view: true, create: true, edit: true, delete: true },
      customers: { view: true, create: true, edit: true, delete: true },
      expenses: { view: true, create: true, edit: true, delete: true },
      coupons: { view: true, create: true, edit: true, delete: true },
      marketing: { view: true, create: true, edit: true, delete: true },
      reviews: { view: true, create: true, edit: true, delete: true },
      reports: { view: true, create: true, edit: true, delete: true },
      "users-roles": { view: true, create: true, edit: true, delete: true },
      settings: { view: true, create: true, edit: true, delete: true },
    },
  },
  {
    name: "Admin",
    level: 2,
    description: "Full store operational management except system settings and role tampering",
    badgeColor: "bg-blue-500/25 text-blue-300 border border-blue-500/40",
    isSystemRole: true,
    permissions: {
      dashboard: { view: true, create: true, edit: true, delete: true },
      products: { view: true, create: true, edit: true, delete: true },
      categories: { view: true, create: true, edit: true, delete: true },
      inventory: { view: true, create: true, edit: true, delete: true },
      barcode: { view: true, create: true, edit: true, delete: true },
      warehouses: { view: true, create: true, edit: true, delete: false },
      purchases: { view: true, create: true, edit: true, delete: false },
      suppliers: { view: true, create: true, edit: true, delete: false },
      orders: { view: true, create: true, edit: true, delete: false },
      returns: { view: true, create: true, edit: true, delete: false },
      delivery: { view: true, create: true, edit: true, delete: false },
      customers: { view: true, create: true, edit: true, delete: false },
      expenses: { view: true, create: true, edit: true, delete: false },
      coupons: { view: true, create: true, edit: true, delete: true },
      marketing: { view: true, create: true, edit: true, delete: true },
      reviews: { view: true, create: true, edit: true, delete: true },
      reports: { view: true, create: true, edit: false, delete: false },
      "users-roles": { view: false, create: false, edit: false, delete: false },
      settings: { view: false, create: false, edit: false, delete: false },
    },
  },
  {
    name: "Inventory Manager",
    level: 3,
    description: "Stock audits, Warehouses, Barcode entries, and Supplier procurement",
    badgeColor: "bg-amber-500/25 text-amber-300 border border-amber-500/40",
    isSystemRole: true,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false },
      products: { view: true, create: true, edit: true, delete: false },
      categories: { view: true, create: true, edit: true, delete: false },
      inventory: { view: true, create: true, edit: true, delete: true },
      barcode: { view: true, create: true, edit: true, delete: false },
      warehouses: { view: true, create: true, edit: true, delete: false },
      purchases: { view: true, create: true, edit: true, delete: false },
      suppliers: { view: true, create: true, edit: true, delete: false },
      orders: { view: false, create: false, edit: false, delete: false },
      returns: { view: false, create: false, edit: false, delete: false },
      delivery: { view: false, create: false, edit: false, delete: false },
      customers: { view: false, create: false, edit: false, delete: false },
      expenses: { view: false, create: false, edit: false, delete: false },
      coupons: { view: false, create: false, edit: false, delete: false },
      marketing: { view: false, create: false, edit: false, delete: false },
      reviews: { view: false, create: false, edit: false, delete: false },
      reports: { view: true, create: false, edit: false, delete: false },
      "users-roles": { view: false, create: false, edit: false, delete: false },
      settings: { view: false, create: false, edit: false, delete: false },
    },
  },
  {
    name: "Sales Manager",
    level: 4,
    description: "Customer orders processing, returns claims, and verified reviews moderation",
    badgeColor: "bg-emerald-500/25 text-emerald-300 border border-emerald-500/40",
    isSystemRole: true,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false },
      products: { view: true, create: false, edit: false, delete: false },
      categories: { view: true, create: false, edit: false, delete: false },
      inventory: { view: false, create: false, edit: false, delete: false },
      barcode: { view: false, create: false, edit: false, delete: false },
      warehouses: { view: false, create: false, edit: false, delete: false },
      purchases: { view: false, create: false, edit: false, delete: false },
      suppliers: { view: false, create: false, edit: false, delete: false },
      orders: { view: true, create: true, edit: true, delete: false },
      returns: { view: true, create: true, edit: true, delete: false },
      delivery: { view: false, create: false, edit: false, delete: false },
      customers: { view: true, create: true, edit: true, delete: false },
      expenses: { view: false, create: false, edit: false, delete: false },
      coupons: { view: true, create: true, edit: true, delete: false },
      marketing: { view: true, create: true, edit: true, delete: false },
      reviews: { view: true, create: true, edit: true, delete: false },
      reports: { view: true, create: false, edit: false, delete: false },
      "users-roles": { view: false, create: false, edit: false, delete: false },
      settings: { view: false, create: false, edit: false, delete: false },
    },
  },
  {
    name: "Delivery Manager",
    level: 5,
    description: "Courier consignments dispatching, tracking code updates, and waybill printing",
    badgeColor: "bg-sky-500/25 text-sky-300 border border-sky-500/40",
    isSystemRole: true,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false },
      products: { view: false, create: false, edit: false, delete: false },
      categories: { view: false, create: false, edit: false, delete: false },
      inventory: { view: false, create: false, edit: false, delete: false },
      barcode: { view: false, create: false, edit: false, delete: false },
      warehouses: { view: true, create: false, edit: false, delete: false },
      purchases: { view: false, create: false, edit: false, delete: false },
      suppliers: { view: false, create: false, edit: false, delete: false },
      orders: { view: true, create: false, edit: true, delete: false },
      returns: { view: true, create: false, edit: false, delete: false },
      delivery: { view: true, create: true, edit: true, delete: false },
      customers: { view: false, create: false, edit: false, delete: false },
      expenses: { view: false, create: false, edit: false, delete: false },
      coupons: { view: false, create: false, edit: false, delete: false },
      marketing: { view: false, create: false, edit: false, delete: false },
      reviews: { view: false, create: false, edit: false, delete: false },
      reports: { view: false, create: false, edit: false, delete: false },
      "users-roles": { view: false, create: false, edit: false, delete: false },
      settings: { view: false, create: false, edit: false, delete: false },
    },
  },
  {
    name: "Accountant",
    level: 6,
    description: "Financial expenditure tracking, Purchase orders audit, and Fiscal reports",
    badgeColor: "bg-purple-500/25 text-purple-300 border border-purple-500/40",
    isSystemRole: true,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false },
      products: { view: false, create: false, edit: false, delete: false },
      categories: { view: false, create: false, edit: false, delete: false },
      inventory: { view: false, create: false, edit: false, delete: false },
      barcode: { view: false, create: false, edit: false, delete: false },
      warehouses: { view: false, create: false, edit: false, delete: false },
      purchases: { view: true, create: false, edit: false, delete: false },
      suppliers: { view: false, create: false, edit: false, delete: false },
      orders: { view: true, create: false, edit: false, delete: false },
      returns: { view: true, create: false, edit: false, delete: false },
      delivery: { view: false, create: false, edit: false, delete: false },
      customers: { view: false, create: false, edit: false, delete: false },
      expenses: { view: true, create: true, edit: true, delete: true },
      coupons: { view: true, create: false, edit: false, delete: false },
      marketing: { view: false, create: false, edit: false, delete: false },
      reviews: { view: false, create: false, edit: false, delete: false },
      reports: { view: true, create: true, edit: false, delete: false },
      "users-roles": { view: false, create: false, edit: false, delete: false },
      settings: { view: false, create: false, edit: false, delete: false },
    },
  },
];

export async function GET() {
  try {
    const db = await getDb();
    const rolesCollection = db.collection<RoleDocument>("roles");

    // Auto-seed default roles matrix if empty
    const count = await rolesCollection.countDocuments({});
    if (count === 0) {
      await rolesCollection.insertMany(DEFAULT_SYSTEM_ROLES);
    }

    const roles = await rolesCollection.find({}).sort({ level: 1 }).toArray();

    // Also fetch staff members list
    const usersCollection = db.collection("users");
    const staffMembers = await usersCollection
      .find({ role: { $ne: "Customer" } })
      .project({ passwordHash: 0 })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      roles,
      staffMembers,
    });
  } catch (error) {
    console.error("Roles fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch roles & permissions" },
      { status: 500 }
    );
  }
}

// PATCH: Update route permissions for a specific role
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { roleName, permissions } = body;

    if (!roleName || !permissions) {
      return NextResponse.json(
        { success: false, message: "Role name and permissions are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const rolesCollection = db.collection<RoleDocument>("roles");

    const now = new Date().toISOString();
    const result = await rolesCollection.updateOne(
      { name: roleName as UserRole },
      {
        $set: {
          permissions,
          updatedAt: now,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: `Permissions for role '${roleName}' updated successfully!`,
    });
  } catch (error) {
    console.error("Role update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update role permissions" },
      { status: 500 }
    );
  }
}
