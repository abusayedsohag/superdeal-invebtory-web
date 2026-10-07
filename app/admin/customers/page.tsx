import { Users, Search, Mail, Phone, ShoppingCart, Award } from "lucide-react";

export default function AdminCustomersPage() {
  const customers = [
    { id: "1", name: "Abu Sayed", email: "sayed@example.com", phone: "+880 17000000", orders: 12, totalSpend: "\$2,450.00", tier: "Gold Member", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
    { id: "2", name: "Jane Cooper", email: "jane@example.com", phone: "+1 555-0192", orders: 5, totalSpend: "\$890.00", tier: "Silver Member", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" },
    { id: "3", name: "Robert Fox", email: "fox@example.com", phone: "+1 555-0143", orders: 3, totalSpend: "\$420.00", tier: "Bronze Member", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Registered Customers</h1>
          <p className="text-xs text-slate-500">View registered users, order metrics, and customer loyalty tiers</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
              <th>Customer</th>
              <th>Email & Phone</th>
              <th>Total Orders</th>
              <th>Lifetime Spend</th>
              <th>Loyalty Tier</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((c) => (
              <tr key={c.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <img src={c.image} alt={c.name} className="w-10 h-10 rounded-full object-cover ring ring-primary/20" />
                    <span className="font-bold text-slate-900">{c.name}</span>
                  </div>
                </td>
                <td className="text-xs">
                  <p className="text-slate-900 font-semibold">{c.email}</p>
                  <p className="text-slate-400">{c.phone}</p>
                </td>
                <td className="font-extrabold text-slate-900">{c.orders} orders</td>
                <td className="font-mono font-bold text-emerald-600">{c.totalSpend}</td>
                <td>
                  <span className="badge badge-primary font-bold text-xs">{c.tier}</span>
                </td>
                <td className="text-right">
                  <button className="btn btn-ghost btn-xs text-primary font-bold">View Profile</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
