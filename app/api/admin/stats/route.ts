import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await getDb();
    const productsCollection = db.collection("products");
    const categoriesCollection = db.collection("categories");
    const warehousesCollection = db.collection("warehouses");
    const suppliersCollection = db.collection("suppliers");
    const expensesCollection = db.collection("expenses");
    const couponsCollection = db.collection("coupons");

    // Run parallel counts
    const [totalProducts, totalCategories, totalWarehouses, totalSuppliers, totalExpenses, totalCoupons, lowStockCount, outOfStockCount] = await Promise.all([
      productsCollection.countDocuments({}),
      categoriesCollection.countDocuments({ status: { $ne: "Inactive" } }),
      warehousesCollection.countDocuments({ status: { $ne: "Inactive" } }),
      suppliersCollection.countDocuments({ status: { $ne: "Inactive" } }),
      expensesCollection.countDocuments({}),
      couponsCollection.countDocuments({ status: "Active" }),
      productsCollection.countDocuments({
        $and: [
          { stock: { $gt: 0 } },
          {
            $expr: {
              $lte: [
                "$stock",
                { $ifNull: ["$minStock", { $ifNull: ["$reorderLevel", 5] }] },
              ],
            },
          },
        ],
      }),
      productsCollection.countDocuments({
        $or: [{ stock: { $lte: 0 } }, { stock: { $exists: false } }],
      }),
    ]);

    // Inventory alert count: combined low stock + out of stock
    const inventoryAlerts = lowStockCount + outOfStockCount;

    return NextResponse.json({
      success: true,
      counts: {
        products: totalProducts,
        categories: totalCategories,
        warehouses: totalWarehouses || 3,
        suppliers: totalSuppliers || 3,
        expenses: totalExpenses,
        coupons: totalCoupons,
        lowStock: lowStockCount,
        outOfStock: outOfStockCount,
        inventoryAlerts,
      },
    });
  } catch (error) {
    console.error("Sidebar stats fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch counts",
        counts: {
          products: 0,
          categories: 0,
          lowStock: 0,
          outOfStock: 0,
          inventoryAlerts: 0,
        },
      },
      { status: 500 }
    );
  }
}
