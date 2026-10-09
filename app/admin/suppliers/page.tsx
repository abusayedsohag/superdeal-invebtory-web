"use client";

import { useState } from "react";
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
  Printer
} from "lucide-react";

interface PaymentHistoryEntry {
  id: string;
  date: string;
  amount: number;
  paymentMethod: "Bank Transfer" | "bKash Merchant" | "Nagad" | "Cheque" | "Cash";
  referenceNo: string;
  note: string;
  remainingDue: number;
}

interface Supplier {
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
}

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([
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
          remainingDue: 60000
        },
        {
          id: "PAY-9002",
          date: "08 Oct 2026, 03:15 PM",
          amount: 20000,
          paymentMethod: "bKash Merchant",
          referenceNo: "BK-7749102",
          note: "Partial payment upon shipment arrival",
          remainingDue: 40000
        }
      ]
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
          remainingDue: 800000
        },
        {
          id: "PAY-8002",
          date: "20 Sep 2026, 04:30 PM",
          amount: 800000,
          paymentMethod: "Cheque",
          referenceNo: "CHQ-0091823",
          note: "Final ledger settlement",
          remainingDue: 0
        }
      ]
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
          remainingDue: 250000
        }
      ]
    }
  ]);

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

  // New Supplier Form State
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

  // Calculate Aggregates
  const totalSuppliersCount = suppliers.length;
  const aggregatePurchase = suppliers.reduce((acc, curr) => acc + curr.totalPurchase, 0);
  const aggregatePaid = suppliers.reduce((acc, curr) => acc + curr.paid, 0);
  const aggregateDue = suppliers.reduce((acc, curr) => acc + curr.due, 0);

  // Filter Logic
  const filteredSuppliers = suppliers.filter((sup) => {
    const matchesQuery = 
      sup.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sup.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sup.phone.includes(searchQuery) ||
      sup.products.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));

    if (filterDue === "has_due") return matchesQuery && sup.due > 0;
    if (filterDue === "paid") return matchesQuery && sup.due === 0;
    return matchesQuery;
  });

  // Add Supplier Handler
  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplier.companyName || !newSupplier.contactPerson || !newSupplier.phone) return;

    const productsArray = newSupplier.productsInput
      ? newSupplier.productsInput.split(",").map(s => s.trim()).filter(Boolean)
      : ["General Merchandise"];

    const purchaseNum = Number(newSupplier.totalPurchase) || 0;
    const paidNum = Number(newSupplier.paid) || 0;
    const dueNum = Math.max(0, purchaseNum - paidNum);

    const initialHistory: PaymentHistoryEntry[] = paidNum > 0 ? [
      {
        id: `PAY-${Date.now().toString().slice(-4)}`,
        date: new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        amount: paidNum,
        paymentMethod: "Bank Transfer",
        referenceNo: "INIT-OPENING",
        note: "Initial opening balance payment",
        remainingDue: dueNum
      }
    ] : [];

    const created: Supplier = {
      id: `SUP-00${suppliers.length + 1}`,
      companyName: newSupplier.companyName,
      contactPerson: newSupplier.contactPerson,
      designation: newSupplier.designation || "Vendor Representative",
      phone: newSupplier.phone,
      email: newSupplier.email || "info@vendor.com",
      address: newSupplier.address || "Dhaka, Bangladesh",
      products: productsArray,
      totalPurchase: purchaseNum,
      paid: paidNum,
      due: dueNum,
      status: "Active",
      paymentHistory: initialHistory
    };

    setSuppliers(prev => [created, ...prev]);
    setIsAddModalOpen(false);
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
  };

  // Payment Recording Handler with Payment History Log
  const handleMakePayment = () => {
    if (!selectedSupplier || payAmount <= 0) return;
    
    const newPaidTotal = selectedSupplier.paid + payAmount;
    const newDueTotal = Math.max(0, selectedSupplier.totalPurchase - newPaidTotal);

    const historyRecord: PaymentHistoryEntry = {
      id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      amount: payAmount,
      paymentMethod: payMethod,
      referenceNo: payRef || `TRX-${Math.floor(100000 + Math.random() * 900000)}`,
      note: payNote || "Supplier Due Settlement",
      remainingDue: newDueTotal
    };

    setSuppliers(prev => prev.map(s => {
      if (s.id === selectedSupplier.id) {
        const updated = {
          ...s,
          paid: newPaidTotal,
          due: newDueTotal,
          paymentHistory: [historyRecord, ...s.paymentHistory]
        };
        setSelectedSupplier(updated);
        return updated;
      }
      return s;
    }));

    setIsPayModalOpen(false);
    setPayAmount(0);
    setPayRef("");
    setPayNote("");
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
            Track vendor purchase totals, paid amounts, due balances, and full payment transaction histories
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-primary btn-sm gap-2 font-bold shadow-md rounded-xl"
        >
          <Plus className="w-4 h-4" /> Add New Supplier
        </button>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Suppliers</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalSuppliersCount}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Active Vendor Partners</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Purchases</p>
            <h3 className="text-2xl font-black text-slate-900 font-mono mt-1">
              ৳{aggregatePurchase.toLocaleString()}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Total Vendor Invoices</p>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Paid</p>
            <h3 className="text-2xl font-black text-emerald-600 font-mono mt-1">
              ৳{aggregatePaid.toLocaleString()}
            </h3>
            <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
              {((aggregatePaid / (aggregatePurchase || 1)) * 100).toFixed(1)}% Settled
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Due Balance</p>
            <h3 className="text-2xl font-black text-amber-600 font-mono mt-1">
              ৳{aggregateDue.toLocaleString()}
            </h3>
            <p className="text-[11px] text-amber-700 font-bold mt-0.5">Outstanding Liability</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company, contact, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-sm input-bordered w-full pl-9 text-xs focus:outline-none rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            value={filterDue}
            onChange={(e) => setFilterDue(e.target.value)}
            className="select select-sm select-bordered text-xs focus:outline-none rounded-xl font-bold"
          >
            <option value="all">All Payment Statuses</option>
            <option value="has_due">Outstanding Dues Only</option>
            <option value="paid">Fully Paid Only</option>
          </select>
        </div>
      </div>

      {/* SUPPLIERS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <th>Supplier / Company</th>
              <th>Contact Representative</th>
              <th className="text-right">Total Purchase</th>
              <th className="text-right">Paid Amount</th>
              <th className="text-right">Due Balance</th>
              <th className="text-center">Payment History Log</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSuppliers.map((sup) => (
              <tr key={sup.id} className="hover:bg-slate-50/50">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-primary">
                      {sup.companyName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900 text-sm">{sup.companyName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{sup.phone}</p>
                    </div>
                  </div>
                </td>

                <td>
                  <p className="font-bold text-slate-800 text-xs flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-primary" /> {sup.contactPerson}
                  </p>
                  <p className="text-[11px] text-slate-400">{sup.designation}</p>
                </td>

                <td className="text-right font-mono font-extrabold text-slate-900 text-base">
                  ৳{sup.totalPurchase.toLocaleString()}
                </td>

                <td className="text-right font-mono font-bold text-emerald-600 text-base">
                  ৳{sup.paid.toLocaleString()}
                </td>

                <td className="text-right">
                  {sup.due > 0 ? (
                    <span className="badge badge-error text-white font-mono font-extrabold text-xs px-2.5 py-1">
                      ৳{sup.due.toLocaleString()} DUE
                    </span>
                  ) : (
                    <span className="badge badge-success text-white font-mono font-bold text-xs px-2.5 py-1">
                      PAID IN FULL
                    </span>
                  )}
                </td>

                <td className="text-center">
                  <button
                    onClick={() => {
                      setSelectedSupplier(sup);
                      setActiveTab("history");
                    }}
                    className="btn btn-xs btn-ghost gap-1 font-bold text-slate-600 hover:text-primary"
                  >
                    <History className="w-3.5 h-3.5 text-primary" /> {sup.paymentHistory.length} Payments Logged
                  </button>
                </td>

                <td className="text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedSupplier(sup);
                        setActiveTab("overview");
                      }}
                      className="btn btn-xs btn-primary gap-1 font-bold rounded-lg"
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
                      >
                        <Wallet className="w-3.5 h-3.5" /> Pay Due
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
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
                <History className="w-4 h-4 text-primary" /> Supplier Payment History ({selectedSupplier.paymentHistory.length})
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
                    <span className="text-[11px] font-bold text-amber-600 uppercase block">Current Due</span>
                    <p className="font-mono font-black text-amber-600 text-xl mt-0.5">৳{selectedSupplier.due.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <User className="w-4 h-4 text-primary" /> Supplier Contact Details
                    </h4>
                    <p><strong>Name:</strong> {selectedSupplier.contactPerson}</p>
                    <p><strong>Designation:</strong> {selectedSupplier.designation}</p>
                    <p><strong>Phone:</strong> {selectedSupplier.phone}</p>
                    <p><strong>Email:</strong> {selectedSupplier.email}</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary" /> Office Address
                    </h4>
                    <p className="text-slate-700 font-medium">{selectedSupplier.address}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SUPPLIER PAYMENT HISTORY LOG */}
            {activeTab === "history" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                    <History className="w-4 h-4 text-primary" /> Supplier Payment Audit Trail & History
                  </h4>
                  {selectedSupplier.due > 0 && (
                    <button 
                      onClick={() => {
                        setPayAmount(selectedSupplier.due);
                        setIsPayModalOpen(true);
                      }}
                      className="btn btn-xs btn-warning text-slate-900 font-bold rounded-lg gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Payment Record
                    </button>
                  )}
                </div>

                {selectedSupplier.paymentHistory.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No payment transaction records logged yet for this supplier.
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 text-[11px] font-bold">
                          <th className="py-2.5 px-3">Date & Time</th>
                          <th className="py-2.5 px-3">Method</th>
                          <th className="py-2.5 px-3">Reference / TRX</th>
                          <th className="py-2.5 px-3 text-right">Amount Paid</th>
                          <th className="py-2.5 px-3 text-right">Remaining Due</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        {selectedSupplier.paymentHistory.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3 font-medium text-slate-600">{tx.date}</td>
                            <td className="py-2.5 px-3">
                              <span className="badge badge-sm badge-outline font-bold text-slate-800">
                                {tx.paymentMethod}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                              {tx.referenceNo}
                              {tx.note && <span className="block text-[10px] text-slate-400 font-sans font-normal">{tx.note}</span>}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                              +৳{tx.amount.toLocaleString()}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-black text-slate-900">
                              ৳{tx.remainingDue.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button 
                onClick={() => setSelectedSupplier(null)}
                className="btn btn-sm btn-ghost font-bold text-slate-600"
              >
                Close Window
              </button>

              {selectedSupplier.due > 0 && (
                <button 
                  onClick={() => {
                    setPayAmount(selectedSupplier.due);
                    setIsPayModalOpen(true);
                  }}
                  className="btn btn-sm btn-warning gap-1 text-slate-900 font-bold rounded-xl"
                >
                  <Wallet className="w-4 h-4" /> Pay Outstanding Due (৳{selectedSupplier.due.toLocaleString()})
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MAKE PAYMENT TO SUPPLIER MODAL */}
      {isPayModalOpen && selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-xl text-slate-900">Record Vendor Payment</h3>
                <p className="text-xs text-slate-500">{selectedSupplier.companyName}</p>
              </div>
              <button onClick={() => setIsPayModalOpen(false)} className="btn btn-ghost btn-circle btn-xs">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Financial Due Card */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="flex justify-between font-bold">
                <span>Total Purchase: ৳{selectedSupplier.totalPurchase.toLocaleString()}</span>
                <span>Paid So Far: ৳{selectedSupplier.paid.toLocaleString()}</span>
              </div>
              <div className="border-t border-amber-200 pt-1 flex justify-between items-center">
                <span className="font-black text-slate-800">Current Outstanding Due:</span>
                <span className="text-xl font-mono font-black text-amber-700">৳{selectedSupplier.due.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Payment Amount (৳) *</label>
                <input 
                  type="number"
                  max={selectedSupplier.due}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="input input-bordered w-full font-mono font-bold text-slate-900 text-base focus:outline-none rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Payment Method *</label>
                <select 
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="select select-bordered w-full font-bold focus:outline-none rounded-xl"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="bKash Merchant">bKash Merchant</option>
                  <option value="Nagad">Nagad MFS</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Transaction Ref / Cheque No.</label>
                <input 
                  type="text"
                  placeholder="e.g. TRX-992018 or CHQ-00129"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="input input-sm input-bordered w-full font-mono focus:outline-none rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Note / Memo</label>
                <input 
                  type="text"
                  placeholder="e.g. Partial settlement for PO-1023"
                  value={payNote}
                  onChange={(e) => setPayNote(e.target.value)}
                  className="input input-sm input-bordered w-full focus:outline-none rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button 
                onClick={() => setIsPayModalOpen(false)} 
                className="btn btn-sm btn-ghost font-bold text-slate-500"
              >
                Cancel
              </button>
              <button 
                onClick={handleMakePayment} 
                className="btn btn-sm btn-success text-white font-bold rounded-xl gap-1"
              >
                <CheckCircle2 className="w-4 h-4" /> Confirm & Record Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW SUPPLIER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-2xl text-slate-900">Add New Supplier</h3>
                <p className="text-xs text-slate-500">Register vendor details and opening balances</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="btn btn-ghost btn-circle btn-xs">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSupplier} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ABC Electronics Ltd"
                    value={newSupplier.companyName}
                    onChange={(e) => setNewSupplier({ ...newSupplier, companyName: e.target.value })}
                    className="input input-sm input-bordered w-full focus:outline-none rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Michael Scott"
                    value={newSupplier.contactPerson}
                    onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
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
                    placeholder="+880 1711-XXXXXX"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                    className="input input-sm input-bordered w-full focus:outline-none rounded-xl"
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
                <label className="font-bold text-slate-700">Office / Warehouse Address</label>
                <input
                  type="text"
                  placeholder="e.g. Level 5, Motijheel C/A, Dhaka"
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                  className="input input-sm input-bordered w-full focus:outline-none rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Supplied Products (comma-separated)</label>
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
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm btn-primary font-bold rounded-xl"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
