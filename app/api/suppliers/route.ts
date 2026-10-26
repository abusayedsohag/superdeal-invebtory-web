import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export interface PaymentHistoryEntry {
  id: string;
  date: string;
  amount: number;
  paymentMethod: "Bank Transfer" | "bKash Merchant" | "Nagad" | "Cheque" | "Cash";
  referenceNo: string;
  note: string;
  remainingDue: number;
  createdAt?: string;
}

export interface Supplier {
  id: string;
  companyName: string;
  contactPerson: string;
  designation: string;
  phone: string;
  email: string;
  address: string;
  products: string[];
  totalPurchase: number;
  paid: number;
  due: number;
  status: "Active" | "Inactive";
  paymentHistory: PaymentHistoryEntry[];
  createdAt?: string;
  updatedAt?: string;
}

export async function GET(request: Request) {
  try {
    const db = await getDb();
    const collection = db.collection("suppliers");

    let suppliers = await collection.find({}).sort({ createdAt: -1 }).toArray();

    // If database has 0 suppliers, seed the initial curated vendors
    if (suppliers.length === 0) {
      const defaultSuppliers: Supplier[] = [
        {
          id: "SUP-001",
          companyName: "ABC Electronics Ltd",
          contactPerson: "Michael Scott",
          designation: "Sales Director",
          phone: "+880 1711-889900",
          email: "sales@abcelectronics.com",
          address: "Level 5, Motijheel Commercial Area, Dhaka",
          products: ["Wireless Mice", "Mechanical Keyboards", "Fast Cables"],
          totalPurchase: 100000,
          paid: 60000,
          due: 40000,
          status: "Active",
          paymentHistory: [
            {
              id: "PAY-9001",
              date: "02 Oct 2026, 11:30 AM",
              amount: 40000,
              paymentMethod: "Bank Transfer",
              referenceNo: "TRX-8891230",
              note: "Advance payment on PO placement",
              remainingDue: 60000,
              createdAt: new Date().toISOString(),
            },
            {
              id: "PAY-9002",
              date: "08 Oct 2026, 03:15 PM",
              amount: 20000,
              paymentMethod: "bKash Merchant",
              referenceNo: "BK-7749102",
              note: "Partial payment upon shipment arrival",
              remainingDue: 40000,
              createdAt: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "SUP-002",
          companyName: "Global Tech Supplies & Components",
          contactPerson: "Sarah Hossain",
          designation: "Account Manager",
          phone: "+880 1819-223344",
          email: "info@globaltechbd.com",
          address: "Agrabad Commercial Area, Chittagong",
          products: ["Ultra Smart Watches", "Bluetooth Speakers", "4K Webcams"],
          totalPurchase: 1800000,
          paid: 1800000,
          due: 0,
          status: "Active",
          paymentHistory: [
            {
              id: "PAY-8001",
              date: "01 Sep 2026, 10:00 AM",
              amount: 1000000,
              paymentMethod: "Bank Transfer",
              referenceNo: "TRX-109283",
              note: "Initial procurement installment",
              remainingDue: 800000,
              createdAt: new Date().toISOString(),
            },
            {
              id: "PAY-8002",
              date: "20 Sep 2026, 04:30 PM",
              amount: 800000,
              paymentMethod: "Cheque",
              referenceNo: "CHQ-0091823",
              note: "Final ledger settlement",
              remainingDue: 0,
              createdAt: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "SUP-003",
          companyName: "Trend Apparel & Textile Mills",
          contactPerson: "David Miller",
          designation: "Export Manager",
          phone: "+880 1733-445566",
          email: "orders@trendapparel.com",
          address: "Plot 12, EPZ Area, Savar, Dhaka",
          products: ["Cotton T-Shirts", "Denim Jeans", "Winter Hoodies"],
          totalPurchase: 950000,
          paid: 700000,
          due: 250000,
          status: "Active",
          paymentHistory: [
            {
              id: "PAY-7001",
              date: "15 Sep 2026, 02:00 PM",
              amount: 700000,
              paymentMethod: "Bank Transfer",
              referenceNo: "TRX-445109",
              note: "Bulk apparel deposit",
              remainingDue: 250000,
              createdAt: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      await collection.insertMany(defaultSuppliers);
      suppliers = await collection.find({}).sort({ createdAt: -1 }).toArray();
    }

    return NextResponse.json({
      success: true,
      suppliers,
    });
  } catch (error) {
    console.error("Fetch suppliers error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch suppliers",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const collection = db.collection("suppliers");

    const body = await request.json();
    const {
      companyName,
      contactPerson,
      designation,
      phone,
      email,
      address,
      products,
      productsInput,
      totalPurchase = 0,
      paid = 0,
    } = body;

    if (!companyName || !companyName.trim()) {
      return NextResponse.json(
        { success: false, message: "Company name is required" },
        { status: 400 }
      );
    }

    if (!contactPerson || !phone) {
      return NextResponse.json(
        { success: false, message: "Contact person and phone number are required" },
        { status: 400 }
      );
    }

    const purchaseNum = Number(totalPurchase) || 0;
    const paidNum = Number(paid) || 0;
    const dueNum = Math.max(0, purchaseNum - paidNum);

    const productsArray = Array.isArray(products) && products.length > 0
      ? products
      : productsInput
      ? String(productsInput).split(",").map(s => s.trim()).filter(Boolean)
      : ["General Supplies"];

    const count = await collection.countDocuments({});
    const newId = `SUP-${String(count + 1).padStart(3, "0")}`;

    const initialHistory: PaymentHistoryEntry[] = paidNum > 0 ? [
      {
        id: `PAY-${Date.now().toString().slice(-4)}`,
        date: new Date().toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        amount: paidNum,
        paymentMethod: "Bank Transfer",
        referenceNo: "INIT-OPENING",
        note: "Initial opening balance payment",
        remainingDue: dueNum,
        createdAt: new Date().toISOString(),
      },
    ] : [];

    const newSupplier: Supplier = {
      id: newId,
      companyName: companyName.trim(),
      contactPerson: contactPerson.trim(),
      designation: designation?.trim() || "Sales Representative",
      phone: phone.trim(),
      email: email?.trim() || "info@vendor.com",
      address: address?.trim() || "Dhaka, Bangladesh",
      products: productsArray,
      totalPurchase: purchaseNum,
      paid: paidNum,
      due: dueNum,
      status: "Active",
      paymentHistory: initialHistory,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await collection.insertOne(newSupplier);

    return NextResponse.json({
      success: true,
      message: `Supplier '${companyName}' added successfully`,
      supplier: { ...newSupplier, _id: result.insertedId },
    });
  } catch (error) {
    console.error("Create supplier error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create supplier",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const db = await getDb();
    const collection = db.collection("suppliers");

    const body = await request.json();
    const { id, _id, action, payment, ...updateFields } = body;

    const targetId = id || _id;
    if (!targetId) {
      return NextResponse.json(
        { success: false, message: "Supplier ID is required" },
        { status: 400 }
      );
    }

    let filter: any = { id: targetId };
    if (ObjectId.isValid(targetId)) {
      filter = { $or: [{ id: targetId }, { _id: new ObjectId(targetId) }] };
    }

    // Action: Recording a new payment transaction
    if (action === "make_payment" && payment) {
      const supplierDoc = await collection.findOne(filter);
      if (!supplierDoc) {
        return NextResponse.json(
          { success: false, message: "Supplier not found" },
          { status: 404 }
        );
      }

      const payAmount = Number(payment.amount);
      if (!payAmount || payAmount <= 0) {
        return NextResponse.json(
          { success: false, message: "Payment amount must be greater than 0" },
          { status: 400 }
        );
      }

      const newPaidTotal = Number(supplierDoc.paid || 0) + payAmount;
      const newDueTotal = Math.max(0, Number(supplierDoc.totalPurchase || 0) - newPaidTotal);

      const historyRecord: PaymentHistoryEntry = {
        id: `PAY-${Date.now().toString().slice(-4)}`,
        date: new Date().toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        amount: payAmount,
        paymentMethod: payment.paymentMethod || "Bank Transfer",
        referenceNo: payment.referenceNo || `TRX-${Date.now().toString().slice(-6)}`,
        note: payment.note || "Supplier Due Settlement",
        remainingDue: newDueTotal,
        createdAt: new Date().toISOString(),
      };

      await collection.updateOne(filter, {
        $set: {
          paid: newPaidTotal,
          due: newDueTotal,
          updatedAt: new Date().toISOString(),
        },
        $push: {
          paymentHistory: {
            $each: [historyRecord],
            $position: 0,
          } as any,
        },
      });

      const updatedSupplier = await collection.findOne(filter);

      return NextResponse.json({
        success: true,
        message: `Payment of ৳${payAmount.toLocaleString()} recorded successfully`,
        supplier: updatedSupplier,
        paymentRecord: historyRecord,
      });
    }

    // Normal details edit
    updateFields.updatedAt = new Date().toISOString();
    if (updateFields.totalPurchase !== undefined && updateFields.paid !== undefined) {
      updateFields.due = Math.max(0, Number(updateFields.totalPurchase) - Number(updateFields.paid));
    }

    const result = await collection.updateOne(filter, { $set: updateFields });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Supplier not found" },
        { status: 404 }
      );
    }

    const updatedSupplier = await collection.findOne(filter);

    return NextResponse.json({
      success: true,
      message: "Supplier updated successfully",
      supplier: updatedSupplier,
    });
  } catch (error) {
    console.error("Update supplier error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update supplier",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const db = await getDb();
    const collection = db.collection("suppliers");

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Supplier ID is required for deletion" },
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
        { success: false, message: "Supplier not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    console.error("Delete supplier error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to delete supplier",
      },
      { status: 500 }
    );
  }
}
