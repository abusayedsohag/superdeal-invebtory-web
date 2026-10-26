"use client";

import { useEffect, useState, useMemo } from "react";
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
  Wallet,
  RefreshCw,
  Save,
  Edit3
} from "lucide-react";

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
  _id?: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  description: string;
  attachment: string;
  paymentMethod: "Bank Transfer" | "bKash Merchant" | "Nagad" | "Cash" | "Cheque";
  createdAt?: string;
}

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AdminExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<Expense | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [newExpense, setNewExpense] = useState<{
    amount: number;
    category: ExpenseCategory;
    date: string;
    description: string;
    attachmentName: string;
    paymentMethod: "Bank Transfer" | "bKash Merchant" | "Nagad" | "Cash" | "Cheque";
  }>({
    amount: 0,
    category: "Rent",
    date: "",
    description: "",
    attachmentName: "",
    paymentMethod: "Bank Transfer"
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

  // Fetch live expenses from DB
  const loadExpenses = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch("/api/expenses", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.expenses)) {
        setExpenses(data.expenses);
      }
    } catch (err) {
      console.error("Failed to load expenses from DB:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setNewExpense(prev => ({
      ...prev,
      date: prev.date || getTodayDateString(),
    }));
    loadExpenses();
  }, []);

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

  // Open Create Modal
  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setNewExpense({
      amount: 0,
      category: "Rent",
      date: getTodayDateString(),
      description: "",
      attachmentName: "",
      paymentMethod: "Bank Transfer"
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (exp: Expense) => {
    setEditingExpense(exp);
    setNewExpense({
      amount: exp.amount,
      category: exp.category,
      date: getTodayDateString(),
      description: exp.description,
      attachmentName: exp.attachment,
      paymentMethod: exp.paymentMethod
    });
    setIsAddModalOpen(true);
  };

  // Create or Update Expense in DB
  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.amount || !newExpense.description.trim()) {
      alert("Please provide amount and description.");
      return;
    }

    setIsSubmitting(true);
    try {
      const isEdit = Boolean(editingExpense);
      const url = "/api/expenses";
      const method = isEdit ? "PATCH" : "POST";
      const body = isEdit
        ? {
            id: editingExpense?.id,
            amount: Number(newExpense.amount),
            category: newExpense.category,
            description: newExpense.description,
            attachment: newExpense.attachmentName,
            paymentMethod: newExpense.paymentMethod,
          }
        : newExpense;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        await loadExpenses(true);
      } else {
        alert(data.message || "Failed to save expense");
      }
    } catch (err) {
      console.error("Save expense error:", err);
      alert("Failed to save expense record.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Expense from DB
  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense entry?")) return;

    try {
      const res = await fetch(`/api/expenses?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setExpenses(prev => prev.filter(e => e.id !== id));
      } else {
        alert(data.message || "Failed to delete expense");
      }
    } catch (err) {
      console.error("Delete expense error:", err);
      alert("Failed to delete expense record");
    }
  };

  // Aggregates
  const totalExpenseAmount = useMemo(() => expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0), [expenses]);
  const fixedOverhead = useMemo(() => expenses.filter(e => e.category === "Rent" || e.category === "Salary").reduce((s, e) => s + (Number(e.amount) || 0), 0), [expenses]);
  const utilitiesAndMarketing = useMemo(() => expenses.filter(e => ["Electricity", "Internet", "Marketing", "Packaging", "Transportation"].includes(e.category)).reduce((s, e) => s + (Number(e.amount) || 0), 0), [expenses]);

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        q === "" ||
        e.description.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.paymentMethod.toLowerCase().includes(q);

      if (filterCategory !== "all") {
        return matchesSearch && e.category === filterCategory;
      }
      return matchesSearch;
    });
  }, [expenses, searchQuery, filterCategory]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Receipt className="w-8 h-8 text-primary" /> Expense Management
          </h1>
          <p className="text-xs text-slate-500">
            Real-time overhead cost tracking from MongoDB: Rent, Salary, Electricity, Internet, Marketing, Packaging, Transportation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadExpenses(true)}
            disabled={refreshing || loading}
            className="btn btn-outline btn-sm gap-1.5"
            title="Reload live expenses from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button 
            onClick={handleOpenAddModal}
            className="btn btn-primary btn-sm gap-2 font-bold shadow-md rounded-xl"
          >
            <Plus className="w-4 h-4" /> Add New Expense
          </button>
        </div>
      </div>

      {/* KPI STAT CARDS & CATEGORY BREAKDOWN */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Expenses</p>
            <h3 className="text-2xl font-black text-red-600 font-mono mt-1">
              {loading ? <span className="loading loading-spinner loading-sm"></span> : `৳${totalExpenseAmount.toLocaleString()}`}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">{expenses.length} Logged Entries in DB</p>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Fixed Overhead (Rent & Salary)</p>
            <h3 className="text-2xl font-black text-slate-900 font-mono mt-1">
              {loading ? <span className="loading loading-spinner loading-sm"></span> : `৳${fixedOverhead.toLocaleString()}`}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Facility & Staff Payroll</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Variable & Marketing Costs</p>
            <h3 className="text-2xl font-black text-slate-900 font-mono mt-1">
              {loading ? <span className="loading loading-spinner loading-sm"></span> : `৳${utilitiesAndMarketing.toLocaleString()}`}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Utilities, Ads, Boxes & Fleet</p>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search description, ID, or payment channel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-sm input-bordered pl-9 w-full rounded-xl text-xs focus:outline-none"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          <button
            onClick={() => setFilterCategory("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterCategory === "all" 
                ? "bg-slate-900 text-white shadow-xs" 
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Categories
          </button>
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                filterCategory === cat 
                  ? "bg-primary text-white shadow-xs" 
                  : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {getCategoryIcon(cat)}
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* EXPENSES DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="table w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase">
              <th>Voucher ID & Date</th>
              <th>Category</th>
              <th>Description / Memo</th>
              <th>Payment Method</th>
              <th>Attachment</th>
              <th className="text-right">Expense Amount</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                  <span className="loading loading-spinner loading-md text-primary"></span>
                  <p className="mt-2 text-xs">Loading live expenses from MongoDB...</p>
                </td>
              </tr>
            ) : filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-400">
                  <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  No expense records match your search query.
                </td>
              </tr>
            ) : (
              filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/60">
                  <td>
                    <div>
                      <span className="font-extrabold text-primary font-mono block">{exp.id}</span>
                      <span className="text-[11px] text-slate-400 font-medium">{exp.date}</span>
                    </div>
                  </td>

                  <td>
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      {getCategoryIcon(exp.category)}
                      <span>{exp.category}</span>
                    </div>
                  </td>

                  <td className="max-w-xs sm:max-w-md">
                    <p className="font-medium text-slate-800 line-clamp-1">{exp.description}</p>
                  </td>

                  <td>
                    <span className="badge badge-sm badge-ghost font-medium">
                      {exp.paymentMethod}
                    </span>
                  </td>

                  <td>
                    {exp.attachment ? (
                      <button
                        onClick={() => setSelectedAttachment(exp)}
                        className="btn btn-xs btn-ghost gap-1 font-mono text-primary hover:underline"
                        title="View receipt attachment"
                      >
                        <Paperclip className="w-3.5 h-3.5" /> 
                        <span className="max-w-[120px] truncate">{exp.attachment}</span>
                      </button>
                    ) : (
                      <span className="text-slate-400 italic">None</span>
                    )}
                  </td>

                  <td className="text-right font-mono font-black text-sm text-red-600">
                    ৳{exp.amount.toLocaleString()}
                  </td>

                  <td className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(exp)}
                        className="btn btn-xs btn-ghost text-slate-500 hover:text-primary"
                        title="Edit expense"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="btn btn-xs btn-ghost text-slate-400 hover:text-error"
                        title="Delete expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW RECEIPT ATTACHMENT MODAL */}
      {selectedAttachment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Paperclip className="w-5 h-5 text-primary" />
                <span>Voucher Receipt Document</span>
              </div>
              <button onClick={() => setSelectedAttachment(null)} className="btn btn-ghost btn-circle btn-xs">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
              <FileText className="w-12 h-12 text-primary mx-auto" />
              <div>
                <p className="font-bold text-slate-900 font-mono text-sm">{selectedAttachment.attachment}</p>
                <p className="text-xs text-slate-500 mt-1">{selectedAttachment.description}</p>
                <p className="text-xs font-bold text-red-600 font-mono mt-1">Amount: ৳{selectedAttachment.amount.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setSelectedAttachment(null)} className="btn btn-sm btn-ghost font-bold">
                Close
              </button>
              <button 
                onClick={() => alert(`Simulating download for: ${selectedAttachment.attachment}`)}
                className="btn btn-sm btn-primary gap-1 font-bold"
              >
                <Download className="w-4 h-4" /> Download Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT EXPENSE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-primary" /> 
                  {editingExpense ? "Edit Expense Entry" : "Record Operational Expense"}
                </h3>
                <p className="text-xs text-slate-500">Live operational cost logging saved to MongoDB</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="btn btn-ghost btn-circle btn-xs"
                disabled={isSubmitting}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Expense Category *</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as ExpenseCategory })}
                    className="select select-sm select-bordered w-full rounded-xl focus:outline-none font-bold"
                    required
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Amount (৳) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="e.g. 45000"
                    value={newExpense.amount || ""}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                    className="input input-sm input-bordered w-full font-mono font-black text-base focus:outline-none rounded-xl"
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
                    className="input input-sm input-bordered w-full focus:outline-none rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Payment Channel *</label>
                  <select
                    value={newExpense.paymentMethod}
                    onChange={(e) => setNewExpense({ ...newExpense, paymentMethod: e.target.value as any })}
                    className="select select-sm select-bordered w-full rounded-xl focus:outline-none font-medium"
                    required
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
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-sm btn-primary font-bold rounded-xl"
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {editingExpense ? "Save Changes" : "Save Expense Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
