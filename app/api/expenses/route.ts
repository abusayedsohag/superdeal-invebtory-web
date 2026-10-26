import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export type ExpenseCategory = 
  | "Rent"
  | "Salary"
  | "Electricity"
  | "Internet"
  | "Marketing"
  | "Packaging"
  | "Transportation"
  | "Other";

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  description: string;
  attachment: string;
  paymentMethod: "Bank Transfer" | "bKash Merchant" | "Nagad" | "Cash" | "Cheque";
  createdAt: string;
  updatedAt?: string;
}

export async function GET(request: Request) {
  try {
    const db = await getDb();
    const collection = db.collection("expenses");

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let filter: any = {};
    if (category && category !== "all") {
      filter.category = category;
    }
    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { description: { $regex: q, $options: "i" } },
        { id: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { paymentMethod: { $regex: q, $options: "i" } },
      ];
    }

    let expenses = await collection.find(filter).sort({ createdAt: -1 }).toArray();

    // If database has 0 expenses, seed standard initial expenses
    if (expenses.length === 0 && (!category || category === "all") && !search) {
      const defaultExpenses: Expense[] = [
        {
          id: "EXP-2026-001",
          amount: 45000,
          category: "Rent",
          date: "01 Oct 2026",
          description: "Monthly warehouse building rent for Dhaka Central Hub",
          attachment: "rent_receipt_oct.pdf",
          paymentMethod: "Bank Transfer",
          createdAt: new Date("2026-10-01T10:00:00Z").toISOString(),
        },
        {
          id: "EXP-2026-002",
          amount: 120000,
          category: "Salary",
          date: "05 Oct 2026",
          description: "Staff monthly payroll salaries for October",
          attachment: "payroll_statement.pdf",
          paymentMethod: "Bank Transfer",
          createdAt: new Date("2026-10-05T12:00:00Z").toISOString(),
        },
        {
          id: "EXP-2026-003",
          amount: 8500,
          category: "Electricity",
          date: "04 Oct 2026",
          description: "DESCO commercial electricity bill for main office & warehouse",
          attachment: "desco_bill_oct.jpg",
          paymentMethod: "bKash Merchant",
          createdAt: new Date("2026-10-04T14:30:00Z").toISOString(),
        },
        {
          id: "EXP-2026-004",
          amount: 4000,
          category: "Internet",
          date: "02 Oct 2026",
          description: "Dedicated fiber optic broadband line monthly bill",
          attachment: "isp_invoice_oct.pdf",
          paymentMethod: "Nagad",
          createdAt: new Date("2026-10-02T09:15:00Z").toISOString(),
        },
        {
          id: "EXP-2026-005",
          amount: 15000,
          category: "Marketing",
          date: "06 Oct 2026",
          description: "Meta Ads Facebook & Instagram sponsored campaign budget",
          attachment: "meta_ads_invoice.pdf",
          paymentMethod: "Bank Transfer",
          createdAt: new Date("2026-10-06T16:00:00Z").toISOString(),
        },
        {
          id: "EXP-2026-006",
          amount: 6500,
          category: "Packaging",
          date: "07 Oct 2026",
          description: "Custom branded carton boxes, bubble wrap & adhesive tapes",
          attachment: "packaging_voucher.jpg",
          paymentMethod: "Cash",
          createdAt: new Date("2026-10-07T11:45:00Z").toISOString(),
        },
        {
          id: "EXP-2026-007",
          amount: 3200,
          category: "Transportation",
          date: "08 Oct 2026",
          description: "Inter-warehouse stock transfer van fuel & courier charges",
          attachment: "transport_memo.pdf",
          paymentMethod: "Cash",
          createdAt: new Date("2026-10-08T15:20:00Z").toISOString(),
        },
      ];

      await collection.insertMany(defaultExpenses);
      expenses = await collection.find({}).sort({ createdAt: -1 }).toArray();
    }

    // Compute metrics
    const totalAmount = expenses.reduce((sum: number, e: any) => sum + Number(e.amount || 0), 0);
    const fixedOverhead = expenses
      .filter((e: any) => e.category === "Rent" || e.category === "Salary")
      .reduce((sum: number, e: any) => sum + Number(e.amount || 0), 0);
    const utilitiesAndMarketing = expenses
      .filter((e: any) => ["Electricity", "Internet", "Marketing", "Packaging", "Transportation"].includes(e.category))
      .reduce((sum: number, e: any) => sum + Number(e.amount || 0), 0);

    return NextResponse.json({
      success: true,
      expenses,
      summary: {
        totalAmount,
        totalCount: expenses.length,
        fixedOverhead,
        utilitiesAndMarketing,
      },
    });
  } catch (error) {
    console.error("Fetch expenses error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch expenses",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const collection = db.collection("expenses");

    const body = await request.json();
    const {
      amount,
      category,
      date,
      description,
      attachment,
      attachmentName,
      paymentMethod = "Bank Transfer",
    } = body;

    const parsedAmount = Number(amount);
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid expense amount is required" },
        { status: 400 }
      );
    }

    if (!description || !description.trim()) {
      return NextResponse.json(
        { success: false, message: "Expense description is required" },
        { status: 400 }
      );
    }

    const count = await collection.countDocuments({});
    const newId = `EXP-2026-${String(count + 1).padStart(3, "0")}`;

    const formattedDate = date
      ? new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

    const newExpense: Expense = {
      id: newId,
      amount: parsedAmount,
      category: category || "Other",
      date: formattedDate,
      description: description.trim(),
      attachment: attachment || attachmentName || `${(category || "other").toLowerCase()}_receipt.pdf`,
      paymentMethod: paymentMethod || "Bank Transfer",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await collection.insertOne(newExpense);

    return NextResponse.json({
      success: true,
      message: "Expense record created successfully",
      expense: { ...newExpense, _id: result.insertedId },
    });
  } catch (error) {
    console.error("Create expense error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create expense",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const db = await getDb();
    const collection = db.collection("expenses");

    const body = await request.json();
    const { id, _id, ...updateFields } = body;

    const targetId = id || _id;
    if (!targetId) {
      return NextResponse.json(
        { success: false, message: "Expense ID is required for updating" },
        { status: 400 }
      );
    }

    if (updateFields.amount !== undefined) {
      updateFields.amount = Number(updateFields.amount);
    }

    updateFields.updatedAt = new Date().toISOString();

    let filter: any = { id: targetId };
    if (ObjectId.isValid(targetId)) {
      filter = { $or: [{ id: targetId }, { _id: new ObjectId(targetId) }] };
    }

    const result = await collection.updateOne(filter, { $set: updateFields });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Expense record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Expense record updated successfully",
    });
  } catch (error) {
    console.error("Update expense error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update expense",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const db = await getDb();
    const collection = db.collection("expenses");

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Expense ID is required for deletion" },
        { status: 400 }
      );
    }

    let filter: any = { id };
    if (ObjectId.isValid(id)) {
      filter = { $or: [{ id }, { _id: new ObjectId(id) }] };
    }

    const result = await collection.deleteOne(filter);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Expense record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Expense record deleted successfully",
    });
  } catch (error) {
    console.error("Delete expense error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to delete expense",
      },
      { status: 500 }
    );
  }
}
