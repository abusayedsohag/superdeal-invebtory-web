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
    const ordersCollection = db.collection("orders");
    const reviewsCollection = db.collection("reviews");
    const returnsCollection = db.collection("returns");
    const deliveriesCollection = db.collection("deliveries");
    const purchasesCollection = db.collection("purchases");

    // Run parallel counts
    const [totalProducts, totalCategories, totalWarehouses, totalSuppliers, totalExpenses, totalCoupons, totalOrders, newOrders, lowStockCount, outOfStockCount, pendingReviews, pendingReturns, inTransitDeliveries, orderedPurchases] = await Promise.all([
      productsCollection.countDocuments({}),
      categoriesCollection.countDocuments({ status: { $ne: "Inactive" } }),
      warehousesCollection.countDocuments({ status: { $ne: "Inactive" } }),
      suppliersCollection.countDocuments({ status: { $ne: "Inactive" } }),
      expensesCollection.countDocuments({}),
      couponsCollection.countDocuments({ status: "Active" }),
      ordersCollection.countDocuments({}),
      ordersCollection.countDocuments({ orderStatus: { $in: ["Pending", "Confirmed"] } }),
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
      reviewsCollection.countDocuments({ status: "Pending" }),
      returnsCollection.countDocuments({ status: "Pending" }),
      deliveriesCollection.countDocuments({ status: { $in: ["In Transit", "Out for Delivery"] } }),
      purchasesCollection.countDocuments({ status: { $in: ["Ordered", "Processing"] } }),
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
        orders: totalOrders,
        newOrders: newOrders,
        pendingReviews: pendingReviews,
        pendingReturns: pendingReturns,
        activeDeliveries: inTransitDeliveries,
        pendingPurchases: orderedPurchases,
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
