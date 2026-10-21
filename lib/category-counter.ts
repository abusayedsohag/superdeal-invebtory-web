import { getDb } from "./mongodb";

/**
 * Increment category itemCount by delta (+1 or -1)
 * Supports matching category by name or id, and subcategory by name or id.
 */
export async function adjustCategoryItemCount(
  categoryNameOrId: string,
  subcategoryNameOrId?: string,
  delta: number = 1
) {
  if (!categoryNameOrId || delta === 0) return;

  try {
    const db = await getDb();
    const categoriesCollection = db.collection("categories");

    // Match parent category by name (case-insensitive) or id
    const parentQuery = {
      $or: [
        { name: { $regex: `^${categoryNameOrId.trim()}$`, $options: "i" } },
        { id: categoryNameOrId.trim() },
      ],
    };

    // 1. Update parent category itemCount
    await categoriesCollection.updateOne(parentQuery, [
      {
        $set: {
          itemCount: {
            $max: [0, { $add: [{ $ifNull: ["$itemCount", 0] }, delta] }],
          },
        },
      },
    ]);

    // 2. If subcategory specified, update matching subcategory's itemCount
    if (subcategoryNameOrId && subcategoryNameOrId.trim()) {
      const subTrimmed = subcategoryNameOrId.trim();

      // Find the parent to locate the right subcategory
      const parentDoc = await categoriesCollection.findOne(parentQuery);
      if (parentDoc && Array.isArray(parentDoc.subcategories)) {
        const subIndex = parentDoc.subcategories.findIndex(
          (s: any) =>
            s.name?.toLowerCase() === subTrimmed.toLowerCase() ||
            s.id === subTrimmed ||
            s.slug === subTrimmed
        );

        if (subIndex !== -1) {
          const currentSubCount = Number(parentDoc.subcategories[subIndex].itemCount || 0);
          const newSubCount = Math.max(0, currentSubCount + delta);

          const fieldPath = `subcategories.${subIndex}.itemCount`;
          await categoriesCollection.updateOne(
            { _id: parentDoc._id },
            { $set: { [fieldPath]: newSubCount } }
          );
        }
      }
    }
  } catch (error) {
    console.error("Failed to adjust category itemCount:", error);
  }
}

/**
 * Recalculate and synchronize exact item counts for all categories & subcategories from the products collection.
 * This ensures 100% accuracy even if products were added/deleted externally.
 */
export async function syncCategoryItemCounts() {
  try {
    const db = await getDb();
    const categoriesCollection = db.collection("categories");
    const productsCollection = db.collection("products");

    // Aggregate product counts grouped by category and subcategory
    const aggregation = await productsCollection
      .aggregate([
        {
          $group: {
            _id: {
              category: { $ifNull: ["$category", ""] },
              subcategory: { $ifNull: ["$subcategory", ""] },
            },
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    // Map parent counts and subcategory counts
    const parentCounts: Record<string, number> = {};
    const subCounts: Record<string, Record<string, number>> = {};

    for (const item of aggregation) {
      const cat = (item._id.category || "").trim().toLowerCase();
      const sub = (item._id.subcategory || "").trim().toLowerCase();
      const cnt = item.count;

      if (cat) {
        parentCounts[cat] = (parentCounts[cat] || 0) + cnt;
        if (sub) {
          if (!subCounts[cat]) subCounts[cat] = {};
          subCounts[cat][sub] = (subCounts[cat][sub] || 0) + cnt;
        }
      }
    }

    // Update all categories in database
    const allCategories = await categoriesCollection.find({}).toArray();

    for (const cat of allCategories) {
      const catKey = (cat.name || "").trim().toLowerCase();
      const catIdKey = (cat.id || "").trim().toLowerCase();
      const totalCount = parentCounts[catKey] ?? parentCounts[catIdKey] ?? 0;

      const updatedSubs = Array.isArray(cat.subcategories)
        ? cat.subcategories.map((sub: any) => {
            const subKey = (sub.name || "").trim().toLowerCase();
            const subIdKey = (sub.id || "").trim().toLowerCase();
            const subSlugKey = (sub.slug || "").trim().toLowerCase();
            const catSubMap = subCounts[catKey] || subCounts[catIdKey] || {};
            const count =
              catSubMap[subKey] ??
              catSubMap[subIdKey] ??
              catSubMap[subSlugKey] ??
              0;
            return {
              ...sub,
              itemCount: count,
            };
          })
        : [];

      await categoriesCollection.updateOne(
        { _id: cat._id },
        {
          $set: {
            itemCount: totalCount,
            subcategories: updatedSubs,
          },
        }
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to sync category item counts:", error);
    return { success: false, error };
  }
}
