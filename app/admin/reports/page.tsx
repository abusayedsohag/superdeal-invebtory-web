import { BarChart3, Download, FileText, Calendar, ArrowUpRight, TrendingUp } from "lucide-react";

export default function AdminReportsPage() {
  const reportsList = [
    { title: "Monthly Sales Revenue Report", category: "Sales & Income", date: "Generated Oct 07, 2026", format: "PDF / CSV" },
    { title: "Inventory Valuation & Audit Report", category: "Inventory", date: "Generated Oct 01, 2026", format: "PDF / Excel" },
    { title: "Net Profit & Loss Statement (P&L)", category: "Accounting", date: "Generated Sep 30, 2026", format: "PDF" },
    { title: "Customer Acquisition & Retention Report", category: "Marketing", date: "Generated Sep 28, 2026", format: "CSV" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Reports & Analytics</h1>
          <p className="text-xs text-slate-500">Download audit reports, financial statements, and store growth metrics</p>
        </div>
        <button className="btn btn-primary btn-sm gap-2 font-bold">
          <Download className="w-4 h-4" /> Export All Summary
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportsList.map((r, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="badge badge-primary badge-outline text-[10px] font-bold">{r.category}</span>
                <h3 className="font-extrabold text-lg text-slate-900">{r.title}</h3>
                <p className="text-xs text-slate-400">{r.date}</p>
              </div>
              <FileText className="w-8 h-8 text-slate-300 shrink-0" />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-500">Format: {r.format}</span>
              <button className="btn btn-xs btn-outline btn-primary gap-1">
                <Download className="w-3.5 h-3.5" /> Download Report
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
