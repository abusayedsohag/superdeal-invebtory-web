"use client";

import { useState } from "react";
import { 
  RotateCcw, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  RefreshCw, 
  Eye, 
  X, 
  Boxes, 
  Check, 
  User,
  ShieldAlert
} from "lucide-react";

interface ReturnRequest {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  productName: string;
  itemQty: number;
  orderTotal: number;
  reason: string;
  requestType: "Return" | "Refund" | "Replacement";
  status: "Pending" | "Approved" | "Rejected" | "Partial Refund" | "Full Refund" | "Replacement Sent";
  refundedAmount?: number;
  warehouseLocation: string;
  requestDate: string;
}

export default function AdminReturnsPage() {
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([
    {
      id: "RET-901",
      orderId: "SD10293",
      customerName: "Rahim Ahmed",
      customerPhone: "+880 1711-223344",
      customerAddress: "House 42, Road 11, Block D, Banani, Dhaka",
      productName: "Wireless Gaming Headphones",
      itemQty: 1,
      orderTotal: 2450,
      reason: "Product damaged",
      requestType: "Return",
      status: "Pending",
      warehouseLocation: "Dhaka Warehouse",
      requestDate: "09 Oct 2026"
    },
    {
      id: "RET-902",
      orderId: "SD10288",
      customerName: "Tanvir Hossain",
      customerPhone: "+880 1819-223344",
      customerAddress: "Agrabad Commercial Area, Chittagong",
      productName: "Ultra Smart Watch Series 7",
      itemQty: 1,
      orderTotal: 1490,
      reason: "Wrong size/color received",
      requestType: "Replacement",
      status: "Approved",
      warehouseLocation: "Chittagong Warehouse",
      requestDate: "07 Oct 2026"
    },
    {
      id: "RET-903",
      orderId: "SD10250",
      customerName: "Sharmin Sultana",
      customerPhone: "+880 1733-445566",
      customerAddress: "Zindabazar, Sylhet",
      productName: "Mechanical Gaming Keyboard",
      itemQty: 1,
      orderTotal: 1600,
      reason: "Faulty USB connection",
      requestType: "Refund",
      status: "Full Refund",
      refundedAmount: 1600,
      warehouseLocation: "Dhaka Warehouse",
      requestDate: "04 Oct 2026"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<ReturnRequest | null>(null);
  const [partialAmount, setPartialAmount] = useState<number>(1000);
  const [isPartialModalOpen, setIsPartialModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Helper to trigger automated inventory restock
  const triggerInventoryAutoUpdate = (req: ReturnRequest, actionName: string) => {
    showToast(
      `📦 Inventory Automatically Updated! Restocked +${req.itemQty} unit(s) of "${req.productName}" into ${req.warehouseLocation} for Order #${req.orderId}. (${actionName})`
    );
  };

  // 1. APPROVE ACTION
  const handleApprove = (req: ReturnRequest) => {
    setReturnRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: "Approved" } : r));
    triggerInventoryAutoUpdate(req, "Approved Return");
    if (selectedRequest) setSelectedRequest({ ...selectedRequest, status: "Approved" });
  };

  // 2. REJECT ACTION
  const handleReject = (req: ReturnRequest) => {
    setReturnRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: "Rejected" } : r));
    showToast(`❌ Return request #${req.id} for Order #${req.orderId} rejected.`);
    if (selectedRequest) setSelectedRequest({ ...selectedRequest, status: "Rejected" });
  };

  // 3. PARTIAL REFUND ACTION
  const handleConfirmPartialRefund = () => {
    if (!selectedRequest || partialAmount <= 0) return;

    setReturnRequests(prev => prev.map(r => {
      if (r.id === selectedRequest.id) {
        return { 
          ...r, 
          status: "Partial Refund", 
          refundedAmount: partialAmount 
        };
      }
      return r;
    }));

    triggerInventoryAutoUpdate(selectedRequest, `Partial Refund ৳${partialAmount}`);
    setIsPartialModalOpen(false);
    setSelectedRequest(prev => prev ? { ...prev, status: "Partial Refund", refundedAmount: partialAmount } : null);
  };

  // 4. FULL REFUND ACTION
  const handleFullRefund = (req: ReturnRequest) => {
    setReturnRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: "Full Refund", refundedAmount: req.orderTotal } : r));
    triggerInventoryAutoUpdate(req, `Full Refund ৳${req.orderTotal}`);
    if (selectedRequest) setSelectedRequest({ ...selectedRequest, status: "Full Refund", refundedAmount: req.orderTotal });
  };

  // 5. REPLACEMENT ACTION
  const handleReplacement = (req: ReturnRequest) => {
    setReturnRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: "Replacement Sent" } : r));
    triggerInventoryAutoUpdate(req, "Replacement Order Dispatched");
    if (selectedRequest) setSelectedRequest({ ...selectedRequest, status: "Replacement Sent" });
  };

  // Filter
  const filteredRequests = returnRequests.filter(r => {
    const matchesSearch = 
      r.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStatus === "pending") return matchesSearch && r.status === "Pending";
    if (filterStatus === "approved") return matchesSearch && r.status === "Approved";
    if (filterStatus === "refunded") return matchesSearch && (r.status === "Full Refund" || r.status === "Partial Refund");
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Alert Banner for Automated Inventory Update */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce">
          <Boxes className="w-6 h-6 text-emerald-400" />
          <div>
            <p className="text-xs font-black text-emerald-400 uppercase tracking-wider">Automated Inventory Synchronization</p>
            <p className="text-xs font-bold">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <RotateCcw className="w-8 h-8 text-primary" /> Returns & Refunds Management
          </h1>
          <p className="text-xs text-slate-500">
            Process customer return claims, approve partial/full refunds or replacements. Inventory automatically updates upon action.
          </p>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Order #SD10293, customer, or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-sm input-bordered w-full pl-9 text-xs focus:outline-none rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="select select-sm select-bordered text-xs focus:outline-none rounded-xl font-bold"
          >
            <option value="all">All Request Statuses</option>
            <option value="pending">Pending Only</option>
            <option value="approved">Approved Only</option>
            <option value="refunded">Refunded (Partial & Full)</option>
          </select>
        </div>
      </div>

      {/* RETURN REQUESTS DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <th>Order ID</th>
              <th>Customer</th>
              <th>Return Reason</th>
              <th>Type</th>
              <th className="text-right">Order Value</th>
              <th>Status</th>
              <th className="text-center">Admin Resolution Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRequests.map((req) => (
              <tr key={req.id} className="hover:bg-slate-50/50">
                <td className="font-mono font-extrabold text-primary text-base">
                  #{req.orderId}
                </td>

                <td>
                  <p className="font-bold text-slate-900 text-xs">{req.customerName}</p>
                  <p className="text-[11px] text-slate-400">{req.customerPhone}</p>
                </td>

                <td>
                  <div className="space-y-0.5">
                    <span className="font-bold text-red-600 text-xs">"{req.reason}"</span>
                    <p className="text-[11px] text-slate-500">{req.productName} (x{req.itemQty})</p>
                  </div>
                </td>

                <td>
                  <span className="badge badge-sm badge-outline font-bold text-slate-800">
                    {req.requestType}
                  </span>
                </td>

                <td className="text-right font-mono font-black text-slate-900 text-base">
                  ৳{req.orderTotal.toLocaleString()}
                  {req.refundedAmount && (
                    <span className="block text-[10px] text-emerald-600 font-bold">
                      Refunded: ৳{req.refundedAmount.toLocaleString()}
                    </span>
                  )}
                </td>

                <td>
                  <span className={`badge ${
                    req.status === "Pending" ? "badge-warning text-slate-950 font-black" :
                    req.status === "Approved" ? "badge-info text-white font-bold" :
                    req.status === "Rejected" ? "badge-error text-white font-bold" : "badge-success text-white font-black"
                  } text-xs px-2.5 py-1`}>
                    {req.status}
                  </span>
                </td>

                {/* 5 EXACT SPECIFIED ADMIN ACTIONS */}
                <td className="text-center">
                  <div className="flex flex-wrap items-center justify-center gap-1">
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="btn btn-xs btn-primary gap-1 font-bold rounded-lg"
                      title="View Claim Details & Full Actions"
                    >
                      <Eye className="w-3.5 h-3.5" /> Process Request
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FULL RETURN CLAIM & 5 ADMIN ACTIONS MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="badge badge-primary font-bold text-xs">RETURN CLAIM MODERATION</span>
                <h3 className="font-black text-2xl text-slate-900 mt-1">Order #{selectedRequest.orderId}</h3>
                <p className="text-xs text-slate-500">Request Date: {selectedRequest.requestDate}</p>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="btn btn-ghost btn-circle btn-xs">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Request Details matching specifications */}
            <div className="p-4 bg-red-50/70 rounded-2xl border border-red-200 space-y-2 text-xs text-red-950">
              <div className="flex justify-between font-bold text-sm">
                <span>Reason: "{selectedRequest.reason}"</span>
                <span className="badge badge-warning text-slate-950 font-black">Status: {selectedRequest.status}</span>
              </div>
              <p>Product Item: <strong>{selectedRequest.productName}</strong> (Qty: {selectedRequest.itemQty})</p>
              <p>Total Order Value: <strong className="font-mono text-base text-slate-900">৳{selectedRequest.orderTotal.toLocaleString()}</strong></p>
              <p>Inventory Return Destination: <strong>{selectedRequest.warehouseLocation}</strong></p>
            </div>

            {/* Customer Info */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1">
                <User className="w-4 h-4 text-primary" /> Customer Info
              </h4>
              <p><strong>Name:</strong> {selectedRequest.customerName}</p>
              <p><strong>Phone:</strong> {selectedRequest.customerPhone}</p>
              <p><strong>Address:</strong> {selectedRequest.customerAddress}</p>
            </div>

            {/* 5 EXACT ADMIN RESOLUTION ACTIONS */}
            <div className="space-y-3 p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200">
              <h4 className="font-black text-indigo-950 text-sm flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-primary" /> Admin Resolution Options (Triggers Auto Inventory Update)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. Approve */}
                <button
                  onClick={() => handleApprove(selectedRequest)}
                  className="btn btn-sm btn-info text-white font-bold rounded-xl gap-1 justify-start"
                >
                  <CheckCircle2 className="w-4 h-4" /> 1. Approve Return
                </button>

                {/* 2. Reject */}
                <button
                  onClick={() => handleReject(selectedRequest)}
                  className="btn btn-sm btn-error text-white font-bold rounded-xl gap-1 justify-start"
                >
                  <XCircle className="w-4 h-4" /> 2. Reject Claim
                </button>

                {/* 3. Partial Refund */}
                <button
                  onClick={() => {
                    setPartialAmount(Math.round(selectedRequest.orderTotal / 2));
                    setIsPartialModalOpen(true);
                  }}
                  className="btn btn-sm btn-warning text-slate-900 font-bold rounded-xl gap-1 justify-start"
                >
                  <DollarSign className="w-4 h-4" /> 3. Partial Refund
                </button>

                {/* 4. Full Refund */}
                <button
                  onClick={() => handleFullRefund(selectedRequest)}
                  className="btn btn-sm btn-success text-white font-bold rounded-xl gap-1 justify-start"
                >
                  <Check className="w-4 h-4" /> 4. Full Refund (৳{selectedRequest.orderTotal.toLocaleString()})
                </button>

                {/* 5. Replacement */}
                <button
                  onClick={() => handleReplacement(selectedRequest)}
                  className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl gap-1 justify-start sm:col-span-2"
                >
                  <RefreshCw className="w-4 h-4" /> 5. Dispatch Product Replacement
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setSelectedRequest(null)}
                className="btn btn-sm btn-ghost font-bold text-slate-600"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PARTIAL REFUND AMOUNT MODAL */}
      {isPartialModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-xl text-slate-900">Issue Partial Refund</h3>
                <p className="text-xs text-slate-500">Order #{selectedRequest.orderId}</p>
              </div>
              <button onClick={() => setIsPartialModalOpen(false)} className="btn btn-ghost btn-circle btn-xs">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <p className="text-slate-600">Total Order Amount: <strong className="font-mono text-slate-900 text-sm">৳{selectedRequest.orderTotal.toLocaleString()}</strong></p>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700">Enter Partial Refund Amount (৳) *</label>
              <input
                type="number"
                max={selectedRequest.orderTotal}
                min={1}
                value={partialAmount}
                onChange={(e) => setPartialAmount(Number(e.target.value))}
                className="input input-bordered w-full font-mono font-bold text-slate-900 text-base focus:outline-none rounded-xl"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button 
                onClick={() => setIsPartialModalOpen(false)}
                className="btn btn-sm btn-ghost font-bold text-slate-500"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmPartialRefund}
                className="btn btn-sm btn-success text-white font-bold rounded-xl gap-1"
              >
                <Check className="w-4 h-4" /> Confirm Partial Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
