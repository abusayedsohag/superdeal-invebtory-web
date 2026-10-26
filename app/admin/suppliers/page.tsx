"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Package, 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Trash2, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Wallet, 
  CreditCard, 
  X,
  TrendingUp,
  History,
  Receipt,
  ArrowDownRight,
  Printer,
  RefreshCw,
  Save
} from "lucide-react";

export interface PaymentHistoryEntry {
  id: string;
  date: string;
  amount: number;
  paymentMethod: "Bank Transfer" | "bKash Merchant" | "Nagad" | "Cheque" | "Cash";
  referenceNo: string;
  note: string;
  remainingDue: number;
}

export interface Supplier {
  id: string;
  _id?: string;
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
}

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterDue, setFilterDue] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "history">("overview");

  // Payment Form State
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<"Bank Transfer" | "bKash Merchant" | "Nagad" | "Cheque" | "Cash">("Bank Transfer");
  const [payRef, setPayRef] = useState<string>("");
  const [payNote, setPayNote] = useState<string>("");
  const [submittingPayment, setSubmittingPayment] = useState(false);

  // New Supplier Form State
  const [isSubmittingSupplier, setIsSubmittingSupplier] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [newSupplier, setNewSupplier] = useState({
    companyName: "",
    contactPerson: "",
    designation: "Sales Executive",
    phone: "",
    email: "",
    address: "",
    productsInput: "",
    totalPurchase: 0,
    paid: 0
  });

  // Fetch Suppliers from MongoDB
  const fetchSuppliers = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch("/api/suppliers", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.suppliers)) {
        setSuppliers(data.suppliers);
        // If a supplier is currently selected, update its reference
        if (selectedSupplier) {
          const fresh = data.suppliers.find((s: Supplier) => s.id === selectedSupplier.id);
          if (fresh) setSelectedSupplier(fresh);
        }
      }
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Calculate Aggregates
  const totalSuppliersCount = suppliers.length;
  const aggregatePurchase = useMemo(() => suppliers.reduce((acc, curr) => acc + (Number(curr.totalPurchase) || 0), 0), [suppliers]);
  const aggregatePaid = useMemo(() => suppliers.reduce((acc, curr) => acc + (Number(curr.paid) || 0), 0), [suppliers]);
  const aggregateDue = useMemo(() => suppliers.reduce((acc, curr) => acc + (Number(curr.due) || 0), 0), [suppliers]);

  // Filter Logic
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((sup) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = 
        q === "" ||
        sup.companyName.toLowerCase().includes(q) ||
        sup.contactPerson.toLowerCase().includes(q) ||
        sup.phone.includes(q) ||
        (Array.isArray(sup.products) && sup.products.some(p => p.toLowerCase().includes(q)));

      if (filterDue === "has_due") return matchesQuery && sup.due > 0;
      if (filterDue === "paid") return matchesQuery && sup.due === 0;
      return matchesQuery;
    });
  }, [suppliers, searchQuery, filterDue]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingSupplier(null);
    setNewSupplier({
      companyName: "",
      contactPerson: "",
      designation: "Sales Executive",
      phone: "",
      email: "",
      address: "",
      productsInput: "",
      totalPurchase: 0,
      paid: 0
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (sup: Supplier) => {
    setEditingSupplier(sup);
    setNewSupplier({
      companyName: sup.companyName,
      contactPerson: sup.contactPerson,
      designation: sup.designation,
      phone: sup.phone,
      email: sup.email,
      address: sup.address,
      productsInput: Array.isArray(sup.products) ? sup.products.join(", ") : "",
      totalPurchase: sup.totalPurchase,
      paid: sup.paid
    });
    setIsAddModalOpen(true);
  };

  // Add / Edit Supplier in DB
  const handleSaveSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplier.companyName || !newSupplier.contactPerson || !newSupplier.phone) {
      alert("Please enter Company Name, Contact Person, and Phone.");
      return;
    }

    setIsSubmittingSupplier(true);
    try {
      const isEdit = Boolean(editingSupplier);
      const url = "/api/suppliers";
      const method = isEdit ? "PATCH" : "POST";
      const body = isEdit
        ? {
            id: editingSupplier?.id,
            companyName: newSupplier.companyName,
            contactPerson: newSupplier.contactPerson,
            designation: newSupplier.designation,
            phone: newSupplier.phone,
            email: newSupplier.email,
            address: newSupplier.address,
            productsInput: newSupplier.productsInput,
            totalPurchase: Number(newSupplier.totalPurchase) || 0,
            paid: Number(newSupplier.paid) || 0,
          }
        : newSupplier;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        await fetchSuppliers(true);
      } else {
        alert(data.message || "Failed to save supplier");
      }
    } catch (err) {
      console.error("Error saving supplier:", err);
      alert("Error saving supplier");
    } finally {
      setIsSubmittingSupplier(false);
    }
  };

  // Delete Supplier from DB
  const handleDeleteSupplier = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete supplier '${name}'?`)) return;

    try {
      const res = await fetch(`/api/suppliers?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setSuppliers(prev => prev.filter(s => s.id !== id));
        if (selectedSupplier?.id === id) setSelectedSupplier(null);
      } else {
        alert(data.message || "Failed to delete supplier");
      }
    } catch (err) {
      console.error("Delete supplier error:", err);
      alert("Failed to delete supplier");
    }
  };

  // Make Payment in DB
  const handleMakePayment = async () => {
    if (!selectedSupplier || payAmount <= 0) {
      alert("Please enter a valid payment amount greater than 0");
      return;
    }

    setSubmittingPayment(true);
    try {
      const res = await fetch("/api/suppliers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedSupplier.id,
          action: "make_payment",
          payment: {
            amount: payAmount,
            paymentMethod: payMethod,
            referenceNo: payRef || `TRX-${Date.now().toString().slice(-6)}`,
            note: payNote || "Supplier Due Settlement",
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.supplier) {
        setSelectedSupplier(data.supplier);
        setSuppliers(prev => prev.map(s => s.id === data.supplier.id ? data.supplier : s));
        setIsPayModalOpen(false);
        setPayAmount(0);
        setPayRef("");
        setPayNote("");
      } else {
        alert(data.message || "Failed to record payment");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Failed to record payment");
    } finally {
      setSubmittingPayment(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Wallet className="w-8 h-8 text-primary" /> Supplier Due Management
          </h1>
          <p className="text-xs text-slate-500">
            Track vendor purchase totals, paid amounts, due balances, and full payment transaction histories in MongoDB
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchSuppliers(true)}
            disabled={refreshing || loading}
            className="btn btn-outline btn-sm gap-1.5"
            title="Reload live suppliers from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button 
            onClick={handleOpenAddModal}
            className="btn btn-primary btn-sm gap-2 font-bold shadow-md rounded-xl"
          >
            <Plus className="w-4 h-4" /> Add New Supplier
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Suppliers</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {loading ? <span className="loading loading-spinner loading-sm"></span> : totalSuppliersCount}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Active Vendor Partners</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Purchases</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {loading ? <span className="loading loading-spinner loading-sm"></span> : `৳${aggregatePurchase.toLocaleString()}`}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Cumulative Invoiced</p>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Amount Paid</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">
              {loading ? <span className="loading loading-spinner loading-sm"></span> : `৳${aggregatePaid.toLocaleString()}`}
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Settled Vendor Claims</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Outstanding Due</p>
            <h3 className="text-2xl font-black text-amber-500 mt-1">
              {loading ? <span className="loading loading-spinner loading-sm"></span> : `৳${aggregateDue.toLocaleString()}`}
            </h3>
            <p className="text-[11px] text-amber-600 font-bold mt-0.5">Payable Balance</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by company, contact person, phone or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-sm input-bordered pl-9 w-full rounded-xl text-xs focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            value={filterDue}
            onChange={(e) => setFilterDue(e.target.value)}
            className="select select-sm select-bordered rounded-xl text-xs focus:outline-none"
          >
            <option value="all">All Suppliers ({suppliers.length})</option>
            <option value="has_due">Has Outstanding Due</option>
            <option value="paid">Fully Settled (৳0 Due)</option>
          </select>
        </div>
      </div>

      {/* SUPPLIERS DIRECTORY TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="table w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase">
              <th>Supplier Info</th>
              <th>Contact Person</th>
              <th>Supplied Products</th>
              <th className="text-right">Total Purchase</th>
              <th className="text-right">Paid</th>
              <th className="text-right">Due Balance</th>
              <th className="text-center">Ledger History</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <span className="loading loading-spinner loading-md text-primary"></span>
                  <p className="mt-2 text-xs">Loading suppliers from MongoDB...</p>
                </td>
              </tr>
            ) : filteredSuppliers.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-slate-400">
                  <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  No suppliers found matching your query.
                </td>
              </tr>
            ) : (
              filteredSuppliers.map((sup) => (
                <tr key={sup.id} className="hover:bg-slate-50/60">
                  <td>
                    <div>
                      <span className="font-extrabold text-sm text-slate-900 block">{sup.companyName}</span>
                      <span className="font-mono text-[10px] text-slate-400">{sup.id}</span>
                    </div>
                  </td>

                  <td>
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800 flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" /> {sup.contactPerson}
                      </p>
                      <p className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" /> {sup.phone}
                      </p>
                    </div>
                  </td>

                  <td>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {Array.isArray(sup.products) && sup.products.map((p, i) => (
                        <span key={i} className="badge badge-xs badge-ghost font-medium">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="text-right font-mono font-bold text-slate-900">
                    ৳{sup.totalPurchase.toLocaleString()}
                  </td>

                  <td className="text-right font-mono font-bold text-emerald-600">
                    ৳{sup.paid.toLocaleString()}
                  </td>

                  <td className="text-right">
                    <span className={`font-mono font-black text-sm px-2 py-0.5 rounded-lg ${
                      sup.due > 0 ? "bg-amber-50 text-amber-600 border border-amber-200" : "text-slate-400"
                    }`}>
                      ৳{sup.due.toLocaleString()}
                    </span>
                  </td>

                  <td className="text-center">
                    <button
                      onClick={() => {
                        setSelectedSupplier(sup);
                        setActiveTab("history");
                      }}
                      className="btn btn-xs btn-ghost gap-1 font-bold text-slate-600 hover:text-primary"
                    >
                      <History className="w-3.5 h-3.5 text-primary" /> {sup.paymentHistory?.length || 0} Payments
                    </button>
                  </td>

                  <td className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedSupplier(sup);
                          setActiveTab("overview");
                        }}
                        className="btn btn-xs btn-primary gap-1 font-bold rounded-lg"
                        title="View details"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>

                      {sup.due > 0 && (
                        <button
                          onClick={() => {
                            setSelectedSupplier(sup);
                            setPayAmount(sup.due);
                            setIsPayModalOpen(true);
                          }}
                          className="btn btn-xs btn-warning text-slate-900 gap-1 font-bold rounded-lg"
                          title="Record payment"
                        >
                          <Wallet className="w-3.5 h-3.5" /> Pay Due
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenEditModal(sup)}
                        className="btn btn-xs btn-ghost text-slate-500 hover:text-primary"
                        title="Edit supplier"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteSupplier(sup.id, sup.companyName)}
                        className="btn btn-xs btn-ghost text-slate-400 hover:text-error"
                        title="Delete supplier"
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

      {/* VIEW SUPPLIER DETAILS & PAYMENT HISTORY MODAL */}
      {selectedSupplier && !isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="badge badge-primary font-bold text-xs">SUPPLIER LEDGER</span>
                <h3 className="font-black text-2xl text-slate-900 mt-1">{selectedSupplier.companyName}</h3>
                <p className="text-xs text-slate-500">Contact: {selectedSupplier.contactPerson} ({selectedSupplier.phone})</p>
              </div>
              <button 
                onClick={() => setSelectedSupplier(null)} 
                className="btn btn-ghost btn-circle btn-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TAB SELECTOR: Overview vs Payment History */}
            <div className="flex border-b border-slate-200 text-xs font-bold">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-2 px-4 border-b-2 transition-colors ${
                  activeTab === "overview" 
                    ? "border-primary text-primary font-black" 
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Financial Summary & Details
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`py-2 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === "history" 
                    ? "border-primary text-primary font-black" 
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <History className="w-4 h-4 text-primary" /> Supplier Payment History ({selectedSupplier.paymentHistory?.length || 0})
              </button>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                {/* Financial Summary Breakdown */}
                <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Total Purchase</span>
                    <p className="font-mono font-black text-slate-900 text-xl mt-0.5">৳{selectedSupplier.totalPurchase.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-600 uppercase block">Total Paid</span>
                    <p className="font-mono font-black text-emerald-600 text-xl mt-0.5">৳{selectedSupplier.paid.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-amber-600 uppercase block">Outstanding Due</span>
                    <p className="font-mono font-black text-amber-500 text-xl mt-0.5">৳{selectedSupplier.due.toLocaleString()}</p>
                  </div>
                </div>

                {/* Vendor Contact & Address Info */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <h4 className="font-extrabold text-slate-900">Contact & Address Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                    <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary shrink-0" /> {selectedSupplier.email}</p>
                    <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary shrink-0" /> {selectedSupplier.phone}</p>
                    <p className="flex items-center gap-2 col-span-2"><MapPin className="w-4 h-4 text-primary shrink-0" /> {selectedSupplier.address}</p>
                  </div>
                </div>

                {/* Supplied Items Chips */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 block">Catalog Products Supplied:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.isArray(selectedSupplier.products) && selectedSupplier.products.map((p, idx) => (
                      <span key={idx} className="badge badge-md badge-outline font-bold text-primary border-primary/30">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PAYMENT HISTORY LOG */}
            {activeTab === "history" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-primary" /> Payment Transactions Audit Trail
                  </h4>
                  {selectedSupplier.due > 0 && (
                    <button
                      onClick={() => {
                        setPayAmount(selectedSupplier.due);
                        setIsPayModalOpen(true);
                      }}
                      className="btn btn-xs btn-primary font-bold gap-1 rounded-xl"
                    >
                      <Plus className="w-3.5 h-3.5" /> Make New Payment
                    </button>
                  )}
                </div>

                {!selectedSupplier.paymentHistory || selectedSupplier.paymentHistory.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
                    No payment transactions recorded for this supplier yet.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                    {selectedSupplier.paymentHistory.map((pay) => (
                      <div key={pay.id} className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl mt-0.5">
                            <ArrowDownRight className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-sm text-slate-900">৳{pay.amount.toLocaleString()}</span>
                              <span className="badge badge-success text-white text-[10px] font-bold">{pay.paymentMethod}</span>
                              <span className="badge badge-outline text-[10px] font-mono">{pay.referenceNo}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{pay.note}</p>
                            <span className="text-[10px] text-slate-400 font-mono block mt-1">{pay.date}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block font-semibold">Remaining Due:</span>
                          <span className="font-mono font-extrabold text-sm text-slate-900">৳{pay.remainingDue.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-xs text-slate-400 font-mono">Supplier ID: {selectedSupplier.id}</span>
              <div className="flex items-center gap-2">
                {selectedSupplier.due > 0 && (
                  <button
                    onClick={() => {
                      setPayAmount(selectedSupplier.due);
                      setIsPayModalOpen(true);
                    }}
                    className="btn btn-sm btn-warning text-slate-900 font-bold gap-1.5 rounded-xl"
                  >
                    <Wallet className="w-4 h-4" /> Pay Outstanding Due
                  </button>
                )}
                <button
                  onClick={() => setSelectedSupplier(null)}
                  className="btn btn-sm btn-ghost font-bold rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAKE PAYMENT MODAL */}
      {isPayModalOpen && selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" /> Record Supplier Payment
                </h3>
                <p className="text-xs text-slate-500">Pay against outstanding invoice for {selectedSupplier.companyName}</p>
              </div>
              <button 
                onClick={() => setIsPayModalOpen(false)}
                className="btn btn-ghost btn-circle btn-xs"
                disabled={submittingPayment}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between text-xs">
              <span className="font-bold text-amber-800">Current Outstanding Due:</span>
              <strong className="font-mono text-base text-amber-600 font-black">৳{selectedSupplier.due.toLocaleString()}</strong>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Payment Amount (৳) *</label>
                <input 
                  type="number"
                  min={1}
                  max={selectedSupplier.due}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="input input-sm input-bordered w-full font-mono font-black text-lg focus:outline-none rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Payment Channel / Method *</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="select select-sm select-bordered w-full rounded-xl focus:outline-none"
                >
                  <option value="Bank Transfer">Bank Transfer (EFT / RTGS)</option>
                  <option value="bKash Merchant">bKash Merchant Gateway</option>
                  <option value="Nagad">Nagad Direct Payment</option>
                  <option value="Cheque">Bank Account Cheque</option>
                  <option value="Cash">Cash Voucher</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Reference / Transaction ID *</label>
                <input 
                  type="text"
                  placeholder="e.g. TRX-908123 or CHQ-4401"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="input input-sm input-bordered w-full font-mono focus:outline-none rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Payment Remarks / Note</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Partial settlement for October electronics shipment..."
                  value={payNote}
                  onChange={(e) => setPayNote(e.target.value)}
                  className="textarea textarea-bordered w-full focus:outline-none rounded-xl"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="btn btn-sm btn-ghost font-bold text-slate-500"
                  disabled={submittingPayment}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleMakePayment}
                  disabled={submittingPayment || payAmount <= 0}
                  className="btn btn-sm btn-primary font-bold gap-1 rounded-xl"
                >
                  {submittingPayment ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save & Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT SUPPLIER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" /> {editingSupplier ? "Edit Supplier Details" : "Register New Supplier Partner"}
                </h3>
                <p className="text-xs text-slate-500">Persist vendor profile and procurement balance in MongoDB</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="btn btn-ghost btn-circle btn-xs"
                disabled={isSubmittingSupplier}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Company Name *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Apex Tech Hardware Ltd"
                  value={newSupplier.companyName}
                  onChange={(e) => setNewSupplier({ ...newSupplier, companyName: e.target.value })}
                  className="input input-sm input-bordered w-full focus:outline-none rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Contact Person *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Tanvir Ahmed"
                    value={newSupplier.contactPerson}
                    onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                    className="input input-sm input-bordered w-full focus:outline-none rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Designation</label>
                  <input 
                    type="text"
                    placeholder="e.g. Sales Manager"
                    value={newSupplier.designation}
                    onChange={(e) => setNewSupplier({ ...newSupplier, designation: e.target.value })}
                    className="input input-sm input-bordered w-full focus:outline-none rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Phone Number *</label>
                  <input 
                    type="text"
                    required
                    placeholder="+880 17XXXXXXXX"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                    className="input input-sm input-bordered w-full font-mono focus:outline-none rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Email Address</label>
                  <input 
                    type="email"
                    placeholder="sales@company.com"
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                    className="input input-sm input-bordered w-full focus:outline-none rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Office / Factory Address</label>
                <input 
                  type="text"
                  placeholder="e.g. Level 4, Plot 9, Motijheel C/A, Dhaka"
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                  className="input input-sm input-bordered w-full focus:outline-none rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Supplied Products (Comma Separated)</label>
                <input 
                  type="text"
                  placeholder="Mice, Keyboards, Fast Cables"
                  value={newSupplier.productsInput}
                  onChange={(e) => setNewSupplier({ ...newSupplier, productsInput: e.target.value })}
                  className="input input-sm input-bordered w-full focus:outline-none rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Total Purchase (৳)</label>
                  <input 
                    type="number"
                    min={0}
                    placeholder="100000"
                    value={newSupplier.totalPurchase || ""}
                    onChange={(e) => setNewSupplier({ ...newSupplier, totalPurchase: Number(e.target.value) })}
                    className="input input-sm input-bordered w-full font-mono focus:outline-none rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Paid Amount (৳)</label>
                  <input 
                    type="number"
                    min={0}
                    placeholder="60000"
                    value={newSupplier.paid || ""}
                    onChange={(e) => setNewSupplier({ ...newSupplier, paid: Number(e.target.value) })}
                    className="input input-sm input-bordered w-full font-mono focus:outline-none rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn btn-sm btn-ghost font-bold text-slate-500"
                  disabled={isSubmittingSupplier}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSupplier}
                  className="btn btn-sm btn-primary font-bold rounded-xl"
                >
                  {isSubmittingSupplier ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {editingSupplier ? "Save Changes" : "Save Supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
