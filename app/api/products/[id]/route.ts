import { getDb } from "@/lib/mongodb";
import { adjustCategoryItemCount } from "@/lib/category-counter";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    const collection = db.collection("products");

    let filter: any = { $or: [{ id }, { slug: id }] };
    if (ObjectId.isValid(id)) {
      filter.$or.push({ _id: new ObjectId(id) });
    }

    const product = await collection.findOne(filter);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Fetch single product error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch product",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    const collection = db.collection("products");

    const body = await request.json();
    body.updatedAt = new Date().toISOString();

    let filter: any = { id };
    if (ObjectId.isValid(id)) {
      filter = { $or: [{ id }, { _id: new ObjectId(id) }] };
    }

    const oldProduct = await collection.findOne(filter);

    const result = await collection.updateOne(filter, { $set: body });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Rebalance category item counts if category/subcategory changed
    if (
      oldProduct &&
      ((body.category && body.category !== oldProduct.category) ||
        (body.subcategory !== undefined && body.subcategory !== oldProduct.subcategory))
    ) {
      const newCategory = body.category || oldProduct.category;
      const newSubcategory =
        body.subcategory !== undefined ? body.subcategory : oldProduct.subcategory;

      if (oldProduct.category) {
        await adjustCategoryItemCount(oldProduct.category, oldProduct.subcategory, -1);
      }
      if (newCategory) {
        await adjustCategoryItemCount(newCategory, newSubcategory, 1);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Update single product error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update product",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    const collection = db.collection("products");

    let filter: any = { id };
    if (ObjectId.isValid(id)) {
      filter = { $or: [{ id }, { _id: new ObjectId(id) }] };
    }

    // Fetch existing product to know its category & subcategory before deleting
    const productToDelete = await collection.findOne(filter);

    const result = await collection.deleteOne(filter);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Decrement category and subcategory item count
    if (productToDelete && productToDelete.category) {
      await adjustCategoryItemCount(
        productToDelete.category,
        productToDelete.subcategory,
        -1
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete single product error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to delete product",
      },
      { status: 500 }
    );
  }
}
