import { generateCategoryId } from "@/lib/category-idgen";
import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";


interface Subcategory {
    id: string;
    name: string;
    slug: string;
    image?: string;
    icon?: string;
    itemCount: number;
    seoTitle?: string;
    seoDescription?: string;
    status: string;
}

interface Category {
    id: string;
    name: string;
    slug: string;
    image?: string;
    icon?: string;
    itemCount?: number;
    seoTitle?: string;
    seoDescription?: string;
    status?: string;
    subcategories: Subcategory[];
}

export async function GET() {
    try {
        const db = await getDb()
        const collection = db.collection("categories")

        const categories = await collection.find({}).toArray();

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

export async function POST(request: Request) {
    try {
        const db = await getDb();
        const collection = db.collection<Category>("categories");

        const body = await request.json();
        const { name, slug, parentId, image, icon, seoTitle, seoDescription, status } = body;

        if (parentId) {
            const subId = await generateCategoryId(parentId);
            const result = await collection.updateOne(
                { id: parentId },
                {
                    $push: {
                        subcategories: {
                            id: subId,
                            name,
                            slug,
                            image,
                            icon,
                            itemCount: 0,
                            seoTitle,
                            seoDescription,
                            status,
                        },
                    },
                }
            )

            if (result.matchedCount === 0) {
                return NextResponse.json(
                    { success: false, message: "Parent category not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                message: "Subcategory created successfully",
                subcategoryId: subId,
            });
        } else {
            const newParent = await generateCategoryId()

            const result = await collection.insertOne(
                {
                    id: newParent,
                    name,
                    slug,
                    image,
                    icon,
                    seoTitle,
                    itemCount: 0,
                    seoDescription,
                    status,
                    subcategories: [],
                }
            )

            return NextResponse.json({
                success: true,
                result
            });
        }


    } catch (error) {

        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const db = await getDb();
        const collection = db.collection<Category>("categories");

        const body = await request.json();
        const { id, name, slug, parentId, image, icon, seoTitle, seoDescription, status } = body;

        if (!id || !name || !slug) {
            return NextResponse.json(
                {
                    success: false,
                    message: "ID, name and slug are required",
                },
                { status: 400 }
            );
        }

        const updateData = {
            name,
            slug,
            image,
            icon,
            seoTitle,
            seoDescription,
            status,
        };

        

        if (parentId) {

            const result = await collection.updateOne(
                {
                    id: parentId,
                    "subcategories.id": id,
                },
                {
                    $set: {
                        "subcategories.$.name": name,
                        "subcategories.$.slug": slug,
                        "subcategories.$.image": image,
                        "subcategories.$.icon": icon,
                        "subcategories.$.seoTitle": seoTitle,
                        "subcategories.$.seoDescription": seoDescription,
                        "subcategories.$.status": status,
                    },
                }
            )

            console.log(result)
            // console.log(await collection.findOne({id: parentId}))

            if (result.modifiedCount === 0) {
                return NextResponse.json(
                    { success: false, message: "Parent category not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                message: "Subcategory update successfully",
            });
        }

        const result = await collection.updateOne(
            { id },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Category not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Category updated successfully",
        });


    } catch (error) {

        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

