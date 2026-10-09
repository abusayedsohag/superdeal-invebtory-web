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
  Tag
} from "lucide-react";

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
}

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: "SUP-001",
      companyName: "Apex Wholesale Electronics Ltd",
      contactPerson: "Michael Scott",
      designation: "Sales Director",
      phone: "+880 1711-889900",
      email: "sales@apexelectronics.com",
      address: "Level 5, Motijheel Commercial Area, Dhaka",
      products: ["Wireless Headphones", "Gaming Mice", "Mechanical Keyboards", "Fast Cables"],
      totalPurchase: 2450000,
      paid: 1950000,
      due: 500000,
      status: "Active"
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
      status: "Active"
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
      status: "Active"
    },
    {
      id: "SUP-004",
      companyName: "Smart Line Importers & Traders",
      contactPerson: "Mahmud Hasan",
      designation: "Managing Partner",
      phone: "+880 1911-556677",
      email: "contact@smartlinebd.com",
      address: "Station Road, Rangpur",
      products: ["Home Appliances", "Electric Kettles", "LED Desk Lamps"],
      totalPurchase: 620000,
      paid: 470000,
      due: 150000,
      status: "Active"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterDue, setFilterDue] = useState("all"); // "all", "has_due", "paid"
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(0);

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
      status: "Active"
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

  // Payment Recording Handler
  const handleMakePayment = () => {
    if (!selectedSupplier || payAmount <= 0) return;
    
    setSuppliers(prev => prev.map(s => {
      if (s.id === selectedSupplier.id) {
        const newPaid = s.paid + payAmount;
        const newDue = Math.max(0, s.totalPurchase - newPaid);
        const updated = { ...s, paid: newPaid, due: newDue };
        setSelectedSupplier(updated);
        return updated;
      }
      return s;
    }));

    setIsPayModalOpen(false);
    setPayAmount(0);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Title & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Building2 className="w-8 h-8 text-primary" /> Supplier Management
          </h1>
          <p className="text-xs text-slate-500">
            Manage vendor profiles, supplied product catalogues, procurement totals, paid balances, and dues
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
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Purchase</p>
            <h3 className="text-2xl font-black text-slate-900 font-mono mt-1">
              ৳{(aggregatePurchase / 1000000).toFixed(2)}M
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Lifetime Procurement Value</p>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Paid Amount</p>
            <h3 className="text-2xl font-black text-emerald-600 font-mono mt-1">
              ৳{(aggregatePaid / 1000000).toFixed(2)}M
            </h3>
            <p className="text-[11px] text-emerald-700 mt-0.5 font-bold">
              {((aggregatePaid / aggregatePurchase) * 100).toFixed(1)}% Settled
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Due / Payable</p>
            <h3 className="text-2xl font-black text-amber-600 font-mono mt-1">
              ৳{(aggregateDue / 1000).toFixed(0)}K
            </h3>
            <p className="text-[11px] text-amber-700 mt-0.5 font-bold">Outstanding Liability</p>
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
            placeholder="Search company, contact, phone, or product..."
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

      {/* SUPPLIERS DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <th>Supplier / Company</th>
              <th>Contact Person</th>
              <th>Supplied Products</th>
              <th className="text-right">Total Purchase</th>
              <th className="text-right">Paid</th>
              <th className="text-right">Due Balance</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSuppliers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate-400 text-sm">
                  No suppliers found matching criteria.
                </td>
              </tr>
            ) : (
              filteredSuppliers.map((sup) => (
                <tr key={sup.id} className="hover:bg-slate-50/50">
                  {/* Company Name & Address */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-primary">
                        {sup.companyName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm">{sup.companyName}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" /> {sup.address}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Contact Person Details */}
                  <td>
                    <p className="font-bold text-slate-800 text-xs flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-primary" /> {sup.contactPerson}
                    </p>
                    <p className="text-[11px] text-slate-400">{sup.phone}</p>
                    <p className="text-[11px] text-slate-400">{sup.email}</p>
                  </td>

                  {/* Supplied Products Badges */}
                  <td>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {sup.products.map((prod, i) => (
                        <span key={i} className="badge badge-xs badge-neutral text-[10px] font-semibold">
                          {prod}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Financial Breakdown */}
                  <td className="text-right font-mono font-extrabold text-slate-900 text-sm">
                    ৳{sup.totalPurchase.toLocaleString()}
                  </td>

                  <td className="text-right font-mono font-bold text-emerald-600 text-sm">
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

                  {/* Action Buttons */}
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedSupplier(sup)}
                        className="btn btn-xs btn-primary gap-1 font-bold rounded-lg"
                        title="View Detailed Supplier Profile & Ledger"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>

                      {sup.due > 0 && (
                        <button
                          onClick={() => {
                            setSelectedSupplier(sup);
                            setPayAmount(sup.due);
                            setIsPayModalOpen(true);
                          }}
                          className="btn btn-xs btn-warning text-slate-900 gap-1 font-bold rounded-lg"
                          title="Record Payment to Supplier"
                        >
                          <Wallet className="w-3.5 h-3.5" /> Pay Due
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW SUPPLIER DETAILS MODAL */}
      {selectedSupplier && !isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="badge badge-primary font-bold text-xs">SUPPLIER DIRECTORY</span>
                <h3 className="font-black text-2xl text-slate-900 mt-1">{selectedSupplier.companyName}</h3>
                <p className="text-xs text-slate-500">Supplier ID: {selectedSupplier.id}</p>
              </div>
              <button 
                onClick={() => setSelectedSupplier(null)} 
                className="btn btn-ghost btn-circle btn-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Total Purchase</span>
                <p className="font-mono font-black text-slate-900 text-base mt-0.5">৳{selectedSupplier.totalPurchase.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-600 uppercase">Total Paid</span>
                <p className="font-mono font-black text-emerald-600 text-base mt-0.5">৳{selectedSupplier.paid.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-600 uppercase">Current Due Balance</span>
                <p className="font-mono font-black text-amber-600 text-base mt-0.5">৳{selectedSupplier.due.toLocaleString()}</p>
              </div>
            </div>

            {/* Contact Information & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <User className="w-4 h-4 text-primary" /> Contact Representative
                </h4>
                <p><strong>Name:</strong> {selectedSupplier.contactPerson}</p>
                <p><strong>Designation:</strong> {selectedSupplier.designation}</p>
                <p className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-primary" /> {selectedSupplier.phone}</p>
                <p className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-primary" /> {selectedSupplier.email}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" /> Warehouse / Office Address
                </h4>
                <p className="text-slate-700 font-medium">{selectedSupplier.address}</p>
                <div className="pt-2">
                  <span className="badge badge-success text-white text-[10px] font-bold">
                    Status: {selectedSupplier.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Product Portfolio */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Package className="w-4 h-4 text-primary" /> Supplied Products & Items Catalog
              </h4>
              <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                {selectedSupplier.products.map((p, idx) => (
                  <span key={idx} className="badge badge-primary badge-outline font-bold text-xs">
                    🏷️ {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button 
                onClick={() => setSelectedSupplier(null)}
                className="btn btn-sm btn-ghost font-bold text-slate-600"
              >
                Close
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

      {/* RECORD PAYMENT TO SUPPLIER MODAL */}
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

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-bold">Current Outstanding Due:</p>
              <p className="text-xl font-mono font-black text-amber-700">৳{selectedSupplier.due.toLocaleString()}</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Payment Amount (৳)</label>
              <input 
                type="number"
                max={selectedSupplier.due}
                value={payAmount}
                onChange={(e) => setPayAmount(Number(e.target.value))}
                className="input input-bordered w-full font-mono font-bold text-slate-900 focus:outline-none rounded-xl"
              />
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
                <CheckCircle2 className="w-4 h-4" /> Confirm Payment
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
                <p className="text-xs text-slate-500">Register vendor details, contact person, and initial purchases</p>
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
                    placeholder="e.g. Apex Electronics Ltd"
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
                  placeholder="Headphones, Keyboards, Fast Cables"
                  value={newSupplier.productsInput}
                  onChange={(e) => setNewSupplier({ ...newSupplier, productsInput: e.target.value })}
                  className="input input-sm input-bordered w-full focus:outline-none rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Total Opening Purchase (৳)</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
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
                    placeholder="0"
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
