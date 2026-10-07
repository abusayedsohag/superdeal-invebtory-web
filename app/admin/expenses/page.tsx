import { Receipt, Plus, Search, DollarSign, Calendar, Tag } from "lucide-react";

export default function AdminExpensesPage() {
  const expenses = [
    { id: "EXP-101", title: "Warehouse Monthly Rent", category: "Facility & Rent", amount: "\$2,500.00", date: "Oct 01, 2026", approvedBy: "Super Admin" },
    { id: "EXP-102", title: "Facebook & IG Ad Campaign", category: "Marketing", amount: "\$1,200.00", date: "Oct 03, 2026", approvedBy: "Marketing Lead" },
    { id: "EXP-103", title: "Packaging Boxes & Tape", category: "Packaging & Logistics", amount: "\$450.00", date: "Oct 05, 2026", approvedBy: "Inventory Mgr" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Expenses Tracker</h1>
          <p className="text-xs text-slate-500">Record and monitor store operating overhead costs and bills</p>
        </div>
        <button className="btn btn-primary btn-sm gap-2 font-bold shadow-md shadow-primary/20">
          <Plus className="w-4 h-4" /> Add New Expense
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
              <th>Expense ID</th>
              <th>Description / Title</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Approved By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((e) => (
              <tr key={e.id}>
                <td className="font-mono text-xs text-slate-500">{e.id}</td>
                <td className="font-bold text-slate-900">{e.title}</td>
                <td><span className="badge badge-outline text-xs font-semibold">{e.category}</span></td>
                <td className="font-mono font-bold text-error">-{e.amount}</td>
                <td className="text-xs text-slate-500">{e.date}</td>
                <td className="text-xs text-slate-700">{e.approvedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
