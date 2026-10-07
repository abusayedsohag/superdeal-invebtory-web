import { Truck, Plus, Search, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export default function AdminSuppliersPage() {
  const suppliers = [
    { id: "1", name: "Apex Wholesale Electronics", contact: "Michael Scott", email: "michael@apexelec.com", phone: "+1 (555) 234-5678", location: "Shenzhen, China", totalOrders: 28, status: "Active" },
    { id: "2", name: "Global Tech Supplies Ltd", contact: "Sarah Jenkins", email: "sarah@globaltech.com", phone: "+1 (555) 987-6543", location: "California, USA", totalOrders: 14, status: "Active" },
    { id: "3", name: "Trend Apparel & Fashion Co", contact: "David Miller", email: "david@trendapparel.com", phone: "+44 20 7946 0912", location: "London, UK", totalOrders: 9, status: "Active" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Supplier Directory</h1>
          <p className="text-xs text-slate-500">Manage vendor relationships, contact info, and order histories</p>
        </div>
        <button className="btn btn-primary btn-sm gap-2 font-bold shadow-md shadow-primary/20">
          <Plus className="w-4 h-4" /> Add New Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {suppliers.map((s) => (
          <div key={s.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">{s.name}</h3>
                <span className="badge badge-success badge-sm text-white font-bold">{s.status}</span>
              </div>
              <span className="text-2xl p-2 bg-slate-100 rounded-xl">🏢</span>
            </div>

            <div className="space-y-2 text-xs text-slate-600 border-t border-b border-slate-100 py-3">
              <p className="flex items-center gap-2"><strong>Contact:</strong> {s.contact}</p>
              <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-primary" /> {s.email}</p>
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-primary" /> {s.phone}</p>
              <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary" /> {s.location}</p>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="font-semibold text-slate-500">Orders: <strong>{s.totalOrders} POs</strong></span>
              <button className="btn btn-xs btn-outline btn-primary gap-1">
                View Details <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
