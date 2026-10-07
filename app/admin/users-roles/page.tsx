import { UserCheck, Plus, ShieldCheck, Mail, Lock, UserX } from "lucide-react";

export default function AdminUsersRolesPage() {
  const staffUsers = [
    { name: "Abu Sayed", email: "admin@superdeal.com", role: "Super Admin", permissions: "Full System Access", status: "Active", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
    { name: "Sarah Jenkins", email: "sarah@superdeal.com", role: "Store Manager", permissions: "Orders, Products, Customers", status: "Active", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" },
    { name: "David Miller", email: "david@superdeal.com", role: "Inventory Manager", permissions: "Inventory, Purchases, Suppliers", status: "Active", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Users & Permission Roles</h1>
          <p className="text-xs text-slate-500">Manage administrative staff accounts and access permission levels</p>
        </div>
        <button className="btn btn-primary btn-sm gap-2 font-bold shadow-md shadow-primary/20">
          <Plus className="w-4 h-4" /> Add Staff Member
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
              <th>Staff Member</th>
              <th>Email</th>
              <th>Assigned Role</th>
              <th>Allowed Scope</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staffUsers.map((u, idx) => (
              <tr key={idx}>
                <td>
                  <div className="flex items-center gap-3">
                    <img src={u.image} alt={u.name} className="w-9 h-9 rounded-full object-cover ring ring-primary/20" />
                    <span className="font-bold text-slate-900">{u.name}</span>
                  </div>
                </td>
                <td className="text-xs text-slate-600">{u.email}</td>
                <td>
                  <span className="badge badge-primary font-bold text-xs">{u.role}</span>
                </td>
                <td className="text-xs text-slate-500">{u.permissions}</td>
                <td>
                  <span className="badge badge-success text-white badge-sm font-bold">{u.status}</span>
                </td>
                <td className="text-right">
                  <button className="btn btn-ghost btn-xs text-slate-600 hover:text-primary font-bold">Edit Role</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
