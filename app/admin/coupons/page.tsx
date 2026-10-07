import { Ticket, Plus, Tag, Calendar, CheckCircle2, Copy } from "lucide-react";

export default function AdminCouponsPage() {
  const coupons = [
    { code: "SUPER20", discount: "20% OFF", type: "Percentage", minOrder: "\$50.00", expiry: "Dec 31, 2026", usages: "412 Times", status: "Active" },
    { code: "WELCOME10", discount: "\$10 OFF", type: "Fixed Amount", minOrder: "\$30.00", expiry: "Nov 30, 2026", usages: "1,240 Times", status: "Active" },
    { code: "FLASH50", discount: "50% OFF", type: "Percentage", minOrder: "\$100.00", expiry: "Oct 10, 2026", usages: "89 Times", status: "Expired" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Discount Coupons</h1>
          <p className="text-xs text-slate-500">Create and manage promotional discount codes for customers</p>
        </div>
        <button className="btn btn-primary btn-sm gap-2 font-bold shadow-md shadow-primary/20">
          <Plus className="w-4 h-4" /> Create New Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((c, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-black text-2xl text-primary font-mono bg-primary/10 px-3 py-1 rounded-xl border border-primary/20 inline-block">
                  {c.code}
                </span>
                <p className="text-xs text-slate-500 mt-2 font-semibold">{c.type}</p>
              </div>
              <span className={`badge ${c.status === "Active" ? "badge-success text-white" : "badge-neutral"} font-bold`}>
                {c.status}
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-600 border-t border-b border-slate-100 py-3">
              <p className="flex justify-between"><span>Discount Value:</span> <strong className="text-slate-900 text-sm">{c.discount}</strong></p>
              <p className="flex justify-between"><span>Minimum Order:</span> <strong className="text-slate-900">{c.minOrder}</strong></p>
              <p className="flex justify-between"><span>Valid Until:</span> <strong className="text-slate-900">{c.expiry}</strong></p>
              <p className="flex justify-between"><span>Total Redeemed:</span> <strong className="text-primary font-bold">{c.usages}</strong></p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button className="btn btn-xs btn-outline gap-1"><Copy className="w-3 h-3" /> Copy Code</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
