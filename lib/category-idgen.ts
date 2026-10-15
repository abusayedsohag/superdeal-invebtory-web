import { getDb } from "./mongodb";

export async function generateCategoryId(parentId?: string | null): Promise<string> {
    const db = await getDb();
    const collection = db.collection("categories");

    if (!parentId) {
        const data = await collection.find({ id: /^cat-\d+$/ }).project({ id: 1 }).toArray();

        const maxId = data.reduce((max, num) => {
            const number = Number(num.id.replace("cat-", ""));
            return Math.max(max, number);
        }, 0);
        return data ? `cat-${maxId + 1}` : `cat-1` ;
    }

    const parent = await collection.findOne(
        { id: parentId },
        { projection: { id: 1, subcategories: 1 } }
    );

    if (!parent) {
        throw new Error(`Parent category not found: ${parentId}`);
    }
    const subcategories = parent.subcategories || [];

    const subdata = subcategories.reduce((submax: number, subnum: { id?: string }) => {
        const number = Number(subnum.id?.replace("sub-", ""));
        return Math.max(submax, number);
    }, 0);
    return subdata ? `sub-${subdata + 1}` : `sub-${parentId.replace("cat-", "")}01`

}