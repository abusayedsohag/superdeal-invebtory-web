import { ShoppingBag, Plus, Search, Eye, FileText, CheckCircle2 } from "lucide-react";

export default function AdminPurchasesPage() {
  const purchaseOrders = [
    { poNumber: "PO-2026-089", supplier: "Apex Wholesale Electronics", date: "Oct 04, 2026", itemsCount: 150, totalAmount: "\$18,450.00", status: "Received", badgeColor: "badge-success" },
    { poNumber: "PO-2026-088", supplier: "Global Tech Supplies Ltd", date: "Oct 01, 2026", itemsCount: 80, totalAmount: "\$9,200.00", status: "Approved", badgeColor: "badge-primary" },
    { poNumber: "PO-2026-087", supplier: "Trend Apparel & Fashion Co", date: "Sep 25, 2026", itemsCount: 300, totalAmount: "\$12,000.00", status: "Pending Approval", badgeColor: "badge-warning" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Purchase Orders</h1>
          <p className="text-xs text-slate-500">Track inventory procurement from suppliers and PO approvals</p>
        </div>
        <button className="btn btn-primary btn-sm gap-2 font-bold shadow-md shadow-primary/20">
          <Plus className="w-4 h-4" /> Create Purchase Order
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
              <th>PO Number</th>
              <th>Supplier</th>
              <th>PO Date</th>
              <th>Items Qty</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {purchaseOrders.map((po, idx) => (
              <tr key={idx}>
                <td className="font-extrabold text-primary">{po.poNumber}</td>
                <td className="font-bold text-slate-900">{po.supplier}</td>
                <td className="text-xs text-slate-500">{po.date}</td>
                <td className="text-xs font-semibold text-slate-700">{po.itemsCount} units</td>
                <td className="font-mono font-bold text-slate-900">{po.totalAmount}</td>
                <td>
                  <span className={`badge ${po.badgeColor} text-white font-bold text-xs`}>
                    {po.status}
                  </span>
                </td>
                <td className="text-right">
                  <button className="btn btn-ghost btn-xs text-slate-600 gap-1">
                    <Eye className="w-3.5 h-3.5" /> View PO
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
