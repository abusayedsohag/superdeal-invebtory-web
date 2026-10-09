"use client";

import { useState } from "react";
import { 
  Receipt, 
  Plus, 
  Search, 
  Filter, 
  DollarSign, 
  Calendar, 
  Tag, 
  FileText, 
  Paperclip, 
  Building2, 
  UserCheck, 
  Zap, 
  Wifi, 
  Megaphone, 
  Package, 
  Truck, 
  MoreHorizontal, 
  Eye, 
  Trash2, 
  X, 
  CheckCircle2, 
  Download,
  CreditCard,
  Wallet
} from "lucide-react";

// Requested exact categories list
type ExpenseCategory = 
  | "Rent"
  | "Salary"
  | "Electricity"
  | "Internet"
  | "Marketing"
  | "Packaging"
  | "Transportation"
  | "Other";

interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  description: string;
  attachment: string; // File name or receipt URL
  paymentMethod: "Bank Transfer" | "bKash Merchant" | "Nagad" | "Cash" | "Cheque";
}

export default function AdminExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "EXP-2026-001",
      amount: 45000,
      category: "Rent",
      date: "01 Oct 2026",
      description: "Monthly warehouse building rent for Dhaka Central Hub",
      attachment: "rent_receipt_oct.pdf",
      paymentMethod: "Bank Transfer"
    },
    {
      id: "EXP-2026-002",
      amount: 120000,
      category: "Salary",
      date: "05 Oct 2026",
      description: "Staff monthly payroll salaries for October",
      attachment: "payroll_statement.pdf",
      paymentMethod: "Bank Transfer"
    },
    {
      id: "EXP-2026-003",
      amount: 8500,
      category: "Electricity",
      date: "04 Oct 2026",
      description: "DESCO commercial electricity bill for main office & warehouse",
      attachment: "desco_bill_oct.jpg",
      paymentMethod: "bKash Merchant"
    },
    {
      id: "EXP-2026-004",
      amount: 4000,
      category: "Internet",
      date: "02 Oct 2026",
      description: "Dedicated fiber optic broadband line monthly bill",
      attachment: "isp_invoice_oct.pdf",
      paymentMethod: "Nagad"
    },
    {
      id: "EXP-2026-005",
      amount: 15000,
      category: "Marketing",
      date: "06 Oct 2026",
      description: "Meta Ads Facebook & Instagram sponsored campaign budget",
      attachment: "meta_ads_invoice.pdf",
      paymentMethod: "Bank Transfer"
    },
    {
      id: "EXP-2026-006",
      amount: 6500,
      category: "Packaging",
      date: "07 Oct 2026",
      description: "Custom branded carton boxes, bubble wrap & adhesive tapes",
      attachment: "packaging_voucher.jpg",
      paymentMethod: "Cash"
    },
    {
      id: "EXP-2026-007",
      amount: 3200,
      category: "Transportation",
      date: "08 Oct 2026",
      description: "Inter-warehouse stock transfer van fuel & courier charges",
      attachment: "transport_memo.pdf",
      paymentMethod: "Cash"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<Expense | null>(null);

  // New Expense Form State
  const [newExpense, setNewExpense] = useState({
    amount: 0,
    category: "Rent" as ExpenseCategory,
    date: "2026-10-09",
    description: "",
    attachmentName: "",
    paymentMethod: "Bank Transfer" as const
  });

  const categoriesList: ExpenseCategory[] = [
    "Rent",
    "Salary",
    "Electricity",
    "Internet",
    "Marketing",
    "Packaging",
    "Transportation",
    "Other"
  ];

  const getCategoryIcon = (category: ExpenseCategory) => {
    switch (category) {
      case "Rent": return <Building2 className="w-4 h-4 text-blue-600" />;
      case "Salary": return <UserCheck className="w-4 h-4 text-emerald-600" />;
      case "Electricity": return <Zap className="w-4 h-4 text-amber-500" />;
      case "Internet": return <Wifi className="w-4 h-4 text-cyan-600" />;
      case "Marketing": return <Megaphone className="w-4 h-4 text-purple-600" />;
      case "Packaging": return <Package className="w-4 h-4 text-orange-600" />;
      case "Transportation": return <Truck className="w-4 h-4 text-indigo-600" />;
      default: return <Tag className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.amount || !newExpense.description) return;

    const formattedDate = new Date(newExpense.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    const created: Expense = {
      id: `EXP-2026-00${expenses.length + 1}`,
      amount: Number(newExpense.amount),
      category: newExpense.category,
      date: formattedDate,
      description: newExpense.description,
      attachment: newExpense.attachmentName || `${newExpense.category.toLowerCase()}_receipt.pdf`,
      paymentMethod: newExpense.paymentMethod
    };

    setExpenses(prev => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewExpense({
      amount: 0,
      category: "Rent",
      date: "2026-10-09",
      description: "",
      attachmentName: "",
      paymentMethod: "Bank Transfer"
    });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // Aggregates
  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = 
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterCategory !== "all") {
      return matchesSearch && e.category === filterCategory;
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Receipt className="w-8 h-8 text-primary" /> Expense Management
          </h1>
          <p className="text-xs text-slate-500">
            Track operational overhead costs: Rent, Salary, Electricity, Internet, Marketing, Packaging, Transportation, and attachments
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-primary btn-sm gap-2 font-bold shadow-md rounded-xl"
        >
          <Plus className="w-4 h-4" /> Add New Expense
        </button>
      </div>

      {/* KPI STAT CARDS & CATEGORY BREAKDOWN */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Expenses</p>
            <h3 className="text-2xl font-black text-red-600 font-mono mt-1">
              ৳{totalExpenseAmount.toLocaleString()}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">{expenses.length} Logged Entries</p>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Fixed Overhead (Rent & Salary)</p>
            <h3 className="text-2xl font-black text-slate-900 font-mono mt-1">
              ৳{expenses.filter(e => e.category === "Rent" || e.category === "Salary").reduce((s,e)=>s+e.amount,0).toLocaleString()}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Facility & Staff Pay</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Utilities & Logistics</p>
            <h3 className="text-2xl font-black text-slate-900 font-mono mt-1">
              ৳{expenses.filter(e => ["Electricity","Internet","Packaging","Transportation"].includes(e.category)).reduce((s,e)=>s+e.amount,0).toLocaleString()}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Bills, Freight & Packaging</p>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* SEARCH AND CATEGORY FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search expense description, ID or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-sm input-bordered w-full pl-9 text-xs focus:outline-none rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="select select-sm select-bordered text-xs focus:outline-none rounded-xl font-bold"
          >
            <option value="all">All Expense Categories</option>
            {categoriesList.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* EXPENSES DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <th>Expense ID</th>
              <th>Category</th>
              <th>Description</th>
              <th>Date</th>
              <th>Payment Method</th>
              <th>Attachment</th>
              <th className="text-right">Amount</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredExpenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-slate-50/50">
                <td className="font-mono text-xs font-bold text-slate-500">
                  {exp.id}
                </td>

                <td>
                  <span className="badge badge-sm badge-outline font-extrabold gap-1 text-slate-800">
                    {getCategoryIcon(exp.category)} {exp.category}
                  </span>
                </td>

                <td>
                  <p className="font-bold text-slate-900 text-xs max-w-xs">{exp.description}</p>
                </td>

                <td className="text-xs text-slate-500 font-medium">
                  {exp.date}
                </td>

                <td>
                  <span className="badge badge-neutral badge-xs font-bold text-slate-300">
                    {exp.paymentMethod}
                  </span>
                </td>

                <td>
                  {exp.attachment ? (
                    <button
                      onClick={() => setSelectedAttachment(exp)}
                      className="btn btn-xs btn-ghost gap-1 font-bold text-primary hover:underline text-[11px]"
                    >
                      <Paperclip className="w-3 h-3" /> {exp.attachment}
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-normal">None</span>
                  )}
                </td>

                <td className="text-right font-mono font-black text-red-600 text-base">
                  -৳{exp.amount.toLocaleString()}
                </td>

                <td className="text-center">
                  <button
                    onClick={() => handleDeleteExpense(exp.id)}
                    className="btn btn-xs btn-ghost text-red-500 font-bold"
                    title="Delete Expense Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW ATTACHMENT MODAL */}
      {selectedAttachment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-xl text-slate-900">Expense Voucher Attachment</h3>
                <p className="text-xs text-slate-500">{selectedAttachment.id}</p>
              </div>
              <button onClick={() => setSelectedAttachment(null)} className="btn btn-ghost btn-circle btn-xs">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <p><strong>Category:</strong> {selectedAttachment.category}</p>
              <p><strong>Description:</strong> {selectedAttachment.description}</p>
              <p><strong>Amount Paid:</strong> <span className="font-mono font-black text-red-600 text-base">৳{selectedAttachment.amount.toLocaleString()}</span></p>
              <p><strong>File Name:</strong> <code className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-primary">{selectedAttachment.attachment}</code></p>
            </div>

            {/* Document Preview Placeholder */}
            <div className="p-8 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 text-center space-y-2">
              <FileText className="w-12 h-12 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-600">Official Receipt Document Verified</p>
              <button 
                onClick={() => alert(`Downloading attachment file: ${selectedAttachment.attachment}`)}
                className="btn btn-xs btn-primary gap-1 font-bold rounded-lg"
              >
                <Download className="w-3.5 h-3.5" /> Download Attachment
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setSelectedAttachment(null)}
                className="btn btn-sm btn-ghost font-bold text-slate-600"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW EXPENSE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-2xl text-slate-900">Add New Expense</h3>
                <p className="text-xs text-slate-500">Record operational overhead costs and upload receipt</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="btn btn-ghost btn-circle btn-xs">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Expense Category *</label>
                  <select 
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as ExpenseCategory })}
                    className="select select-sm select-bordered w-full font-bold focus:outline-none rounded-xl"
                  >
                    {categoriesList.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Amount (৳) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    placeholder="e.g. 45000"
                    value={newExpense.amount || ""}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                    className="input input-sm input-bordered w-full font-mono font-bold text-slate-900 focus:outline-none rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Expense Date *</label>
                  <input
                    type="date"
                    required
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    className="input input-sm input-bordered w-full font-bold focus:outline-none rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Payment Method *</label>
                  <select
                    value={newExpense.paymentMethod}
                    onChange={(e) => setNewExpense({ ...newExpense, paymentMethod: e.target.value as any })}
                    className="select select-sm select-bordered w-full font-bold focus:outline-none rounded-xl"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="bKash Merchant">bKash Merchant</option>
                    <option value="Nagad">Nagad MFS</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Description / Memo *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Warehouse monthly building rent for Dhaka Central Hub"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="textarea textarea-bordered w-full font-sans focus:outline-none rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Attachment / Receipt File Name</label>
                <input
                  type="text"
                  placeholder="e.g. rent_receipt_oct.pdf"
                  value={newExpense.attachmentName}
                  onChange={(e) => setNewExpense({ ...newExpense, attachmentName: e.target.value })}
                  className="input input-sm input-bordered w-full font-mono focus:outline-none rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn btn-sm btn-ghost font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm btn-primary font-bold rounded-xl"
                >
                  Save Expense Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
