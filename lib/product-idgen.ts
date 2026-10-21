import { getDb } from "./mongodb";

export async function generateProductId(): Promise<string> {
    const db = await getDb();
    const collection = db.collection("products");

    const data = await collection.find({ id: /^prod-\d+$/ }).project({ id: 1 }).toArray();

    const maxId = data.reduce((max, num) => {
        const number = Number(num.id?.replace("prod-", ""));
        return Math.max(max, isNaN(number) ? 0 : number);
    }, 0);

    return `prod-${maxId + 1}`;
}
