import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const db = await getDb()
        const collection = db.collection("categories")

        const categories = await collection.find({},
            { projection: { name: 1 } }).toArray();

        return NextResponse.json({
            success: true,
            categories,
        });
    } catch (error) {
        console.error("Product fetch error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to fetch products" },
            { status: 500 }
        );
    }
}