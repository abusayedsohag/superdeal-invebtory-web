import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const db = await getDb();
        const collection = db.collection("categories");

        const categories = await collection.find(
            { status: { $ne: "Inactive" } },
            { projection: { id: 1, name: 1, slug: 1, icon: 1, status: 1 } }
        ).toArray();

        return NextResponse.json({
            success: true,
            categories,
        });
    } catch (error) {
        console.error("Product fetch error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}
