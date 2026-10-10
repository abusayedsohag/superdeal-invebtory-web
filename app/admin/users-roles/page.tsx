"use client";

import { useState } from "react";
import { 
  UserCheck, 
  ShieldCheck, 
  ShieldAlert, 
  Key, 
  Plus, 
  Check, 
  X, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Trash2, 
  Users, 
  Lock, 
  ArrowDown, 
  Layers,
  Sliders
} from "lucide-react";

type RoleName = 
  | "Super Admin"
  | "Admin"
  | "Manager"
  | "Inventory Manager"
  | "Sales Manager"
  | "Accountant"
  | "Delivery Manager";

interface ModulePermission {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

interface RoleDefinition {
  name: RoleName;
  level: number;
  description: string;
  badgeColor: string;
  permissions: ModulePermission[];
}

interface StaffUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: RoleName;
  status: "Active" | "Inactive";
  avatar: string;
}

export default function AdminUsersRolesPage() {
  // 7 Hierarchy Roles requested by user
  const initialRoles: RoleDefinition[] = [
    {
      name: "Super Admin",
      level: 1,
      description: "Unrestricted root system access across all modules",
      badgeColor: "badge-error text-white font-black",
      permissions: [
        { module: "Products", view: true, create: true, edit: true, delete: true },
        { module: "Orders", view: true, create: true, edit: true, delete: true },
        { module: "Inventory", view: true, create: true, edit: true, delete: true },
        { module: "Suppliers", view: true, create: true, edit: true, delete: true },
        { module: "Expenses", view: true, create: true, edit: true, delete: true },
        { module: "Reports", view: true, create: true, edit: true, delete: true }
      ]
    },
    {
      name: "Admin",
      level: 2,
      description: "Full store management except root system settings",
      badgeColor: "badge-primary font-black",
      permissions: [
        { module: "Products", view: true, create: true, edit: true, delete: true },
        { module: "Orders", view: true, create: true, edit: true, delete: false }, // Orders delete disabled as requested
        { module: "Inventory", view: true, create: true, edit: true, delete: true },
        { module: "Suppliers", view: true, create: true, edit: true, delete: false },
        { module: "Expenses", view: true, create: true, edit: true, delete: false },
        { module: "Reports", view: true, create: true, edit: false, delete: false }
      ]
    },
    {
      name: "Manager",
      level: 3,
      description: "General store Operations, Products & Orders oversight",
      badgeColor: "badge-accent text-slate-950 font-black",
      permissions: [
        { module: "Products", view: true, create: true, edit: true, delete: false },
        { module: "Orders", view: true, create: true, edit: true, delete: false },
        { module: "Inventory", view: true, create: true, edit: true, delete: false },
        { module: "Suppliers", view: true, create: false, edit: false, delete: false },
        { module: "Expenses", view: true, create: true, edit: false, delete: false },
        { module: "Reports", view: true, create: false, edit: false, delete: false }
      ]
    },
    {
      name: "Inventory Manager",
      level: 4,
      description: "Stock audits, Warehouses, Purchases & Suppliers management",
      badgeColor: "badge-warning text-slate-950 font-extrabold",
      permissions: [
        { module: "Products", view: true, create: true, edit: true, delete: false },
        { module: "Orders", view: true, create: false, edit: false, delete: false },
        { module: "Inventory", view: true, create: true, edit: true, delete: true },
        { module: "Suppliers", view: true, create: true, edit: true, delete: false },
        { module: "Expenses", view: false, create: false, edit: false, delete: false },
        { module: "Reports", view: true, create: false, edit: false, delete: false }
      ]
    },
    {
      name: "Sales Manager",
      level: 5,
      description: "Order fulfillment, Coupons, Marketing & Customer relations",
      badgeColor: "badge-info text-white font-extrabold",
      permissions: [
        { module: "Products", view: true, create: false, edit: false, delete: false },
        { module: "Orders", view: true, create: true, edit: true, delete: false },
        { module: "Inventory", view: true, create: false, edit: false, delete: false },
        { module: "Suppliers", view: false, create: false, edit: false, delete: false },
        { module: "Expenses", view: false, create: false, edit: false, delete: false },
        { module: "Reports", view: true, create: false, edit: false, delete: false }
      ]
    },
    {
      name: "Accountant",
      level: 6,
      description: "Financial expenses, Supplier dues, Accounting & P&L Reports",
      badgeColor: "bg-purple-600 text-white font-extrabold",
      permissions: [
        { module: "Products", view: true, create: false, edit: false, delete: false },
        { module: "Orders", view: true, create: false, edit: false, delete: false },
        { module: "Inventory", view: true, create: false, edit: false, delete: false },
        { module: "Suppliers", view: true, create: true, edit: true, delete: false },
        { module: "Expenses", view: true, create: true, edit: true, delete: true },
        { module: "Reports", view: true, create: true, edit: true, delete: false }
      ]
    },
    {
      name: "Delivery Manager",
      level: 7,
      description: "Courier dispatches, Consignment tracking & Logistics",
      badgeColor: "badge-neutral text-slate-200 font-extrabold",
      permissions: [
        { module: "Products", view: true, create: false, edit: false, delete: false },
        { module: "Orders", view: true, create: false, edit: true, delete: false },
        { module: "Inventory", view: true, create: false, edit: false, delete: false },
        { module: "Suppliers", view: false, create: false, edit: false, delete: false },
        { module: "Expenses", view: false, create: false, edit: false, delete: false },
        { module: "Reports", view: false, create: false, edit: false, delete: false }
      ]
    }
  ];

  const [roles, setRoles] = useState<RoleDefinition[]>(initialRoles);
  const [selectedRole, setSelectedRole] = useState<RoleDefinition>(initialRoles[1]); // Admin by default
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([
    {
      id: "STF-101",
      name: "Abu Sayed",
      email: "sayed@superdeal.com",
      phone: "+880 1711-223344",
      role: "Super Admin",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
    },
    {
      id: "STF-102",
      name: "Sarah Jenkins",
      email: "sarah@superdeal.com",
      phone: "+880 1819-223344",
      role: "Admin",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
    },
    {
      id: "STF-103",
      name: "David Miller",
      email: "david@superdeal.com",
      phone: "+880 1733-445566",
      role: "Inventory Manager",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
    },
    {
      id: "STF-104",
      name: "Tanvir Hossain",
      email: "tanvir@superdeal.com",
      phone: "+880 1911-887766",
      role: "Sales Manager",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
    },
    {
      id: "STF-105",
      name: "Ayesha Sultana",
      email: "ayesha@superdeal.com",
      phone: "+880 1622-334455",
      role: "Accountant",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
    },
    {
      id: "STF-106",
      name: "Mahmud Hasan",
      email: "mahmud@superdeal.com",
      phone: "+880 1755-443322",
      role: "Delivery Manager",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
    }
  ]);

  // Form State for Add Staff
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Admin" as RoleName
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Toggle Permission Checkbox Handler
  const togglePermission = (roleName: RoleName, moduleName: string, permKey: "view" | "create" | "edit" | "delete") => {
    setRoles(prev => prev.map(r => {
      if (r.name === roleName) {
        const updatedPerms = r.permissions.map(p => {
          if (p.module === moduleName) {
            return { ...p, [permKey]: !p[permKey] };
          }
          return p;
        });
        const updatedRole = { ...r, permissions: updatedPerms };
        if (selectedRole.name === roleName) {
          setSelectedRole(updatedRole);
        }
        return updatedRole;
      }
      return r;
    }));

    showToast(`Updated '${permKey}' permission for ${roleName} on ${moduleName}.`);
  };

  // Add Staff Member Handler
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) return;

    const created: StaffUser = {
      id: `STF-10${staffUsers.length + 1}`,
      name: newStaff.name,
      email: newStaff.email,
      phone: newStaff.phone || "+880 1700-000000",
      role: newStaff.role,
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
    };

    setStaffUsers(prev => [created, ...prev]);
    setIsAddStaffModalOpen(false);
    setNewStaff({ name: "", email: "", phone: "", role: "Admin" });
    showToast(`✅ New staff member '${created.name}' assigned as ${created.role}.`);
  };

  const filteredStaff = staffUsers.filter(u => {
    return u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
           u.role.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce text-xs font-bold">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <UserCheck className="w-8 h-8 text-primary" /> Role & Permission System
          </h1>
          <p className="text-xs text-slate-500">
            Multi-tier role hierarchy and granular module-level permission controls (View, Create, Edit, Delete)
          </p>
        </div>

        <button 
          onClick={() => setIsAddStaffModalOpen(true)}
          className="btn btn-primary btn-sm gap-2 font-bold shadow-md rounded-xl"
        >
          <Plus className="w-4 h-4" /> Add Staff Member
        </button>
      </div>

      {/* 7 ROLE HIERARCHY TREE VISUAL CARD (Exact Requested Hierarchy) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4 border border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <span className="badge badge-warning text-slate-950 font-black text-[10px] uppercase">
              7-Tier Role Access Hierarchy Architecture
            </span>
            <h2 className="text-2xl font-black text-white mt-1">Role Delegation Level Tree</h2>
          </div>
          <span className="badge badge-accent font-black text-xs text-slate-950">7 Active Roles</span>
        </div>

        {/* Tree Flow Representation */}
        <div className="flex flex-wrap items-center justify-start gap-2 pt-2 text-xs font-mono font-bold">
          <span className="bg-red-500/20 text-red-300 border border-red-500/40 px-3 py-1.5 rounded-xl">
            1. Super Admin
          </span>
          <span className="text-slate-400">➔</span>
          <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 px-3 py-1.5 rounded-xl">
            2. Admin
          </span>
          <span className="text-slate-400">➔</span>
          <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 px-3 py-1.5 rounded-xl">
            3. Manager
          </span>
          <span className="text-slate-400">➔</span>
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-xl">
            4. Inventory Manager
          </span>
          <span className="text-slate-400">➔</span>
          <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-3 py-1.5 rounded-xl">
            5. Sales Manager
          </span>
          <span className="text-slate-400">➔</span>
          <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 px-3 py-1.5 rounded-xl">
            6. Accountant
          </span>
          <span className="text-slate-400">➔</span>
          <span className="bg-slate-700/60 text-slate-200 border border-slate-600 px-3 py-1.5 rounded-xl">
            7. Delivery Manager
          </span>
        </div>
      </div>

      {/* GRANULAR PERMISSION MATRIX MODERATOR SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-black text-xl text-slate-900 flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" /> Granular Module Permission Matrix
            </h3>
            <p className="text-xs text-slate-500">Configure CRUD privileges per role (View, Create, Edit, Delete)</p>
          </div>

          {/* Select Role Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Selected Role:</span>
            <select
              value={selectedRole.name}
              onChange={(e) => {
                const found = roles.find(r => r.name === e.target.value);
                if (found) setSelectedRole(found);
              }}
              className="select select-sm select-bordered font-black text-slate-900 focus:outline-none rounded-xl"
            >
              {roles.map(r => (
                <option key={r.name} value={r.name}>{r.name} (Level {r.level})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Highlighted Rule Example Box matching User Format */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-900 text-sm">
              Role: <span className="text-primary">{selectedRole.name}</span>
            </span>
            <span className={`badge ${selectedRole.badgeColor} text-xs`}>Level {selectedRole.level} Access</span>
          </div>
          <p className="text-slate-600">{selectedRole.description}</p>
        </div>

        {/* PERMISSIONS MATRIX TABLE */}
        <div className="overflow-x-auto">
          <table className="table w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <th>Module / Feature Domain</th>
                <th className="text-center">View</th>
                <th className="text-center">Create</th>
                <th className="text-center">Edit / Update</th>
                <th className="text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {selectedRole.permissions.map((perm) => (
                <tr key={perm.module} className="hover:bg-slate-50/50">
                  <td className="font-extrabold text-slate-900 text-sm">
                    {perm.module}
                  </td>

                  {/* View Privilege Checkbox */}
                  <td className="text-center">
                    <label className="cursor-pointer inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={perm.view}
                        onChange={() => togglePermission(selectedRole.name, perm.module, "view")}
                        className="checkbox checkbox-sm checkbox-success"
                      />
                      <span className="ml-1.5 text-xs font-bold text-slate-700">
                        {perm.view ? "✓ View" : "✗ View"}
                      </span>
                    </label>
                  </td>

                  {/* Create Privilege Checkbox */}
                  <td className="text-center">
                    <label className="cursor-pointer inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={perm.create}
                        onChange={() => togglePermission(selectedRole.name, perm.module, "create")}
                        className="checkbox checkbox-sm checkbox-primary"
                      />
                      <span className="ml-1.5 text-xs font-bold text-slate-700">
                        {perm.create ? "✓ Create" : "✗ Create"}
                      </span>
                    </label>
                  </td>

                  {/* Edit / Update Privilege Checkbox */}
                  <td className="text-center">
                    <label className="cursor-pointer inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={perm.edit}
                        onChange={() => togglePermission(selectedRole.name, perm.module, "edit")}
                        className="checkbox checkbox-sm checkbox-info"
                      />
                      <span className="ml-1.5 text-xs font-bold text-slate-700">
                        {perm.edit ? "✓ Update" : "✗ Update"}
                      </span>
                    </label>
                  </td>

                  {/* Delete Privilege Checkbox (Sample ✗ Delete for Orders) */}
                  <td className="text-center">
                    <label className="cursor-pointer inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={perm.delete}
                        onChange={() => togglePermission(selectedRole.name, perm.module, "delete")}
                        className="checkbox checkbox-sm checkbox-error"
                      />
                      <span className={`ml-1.5 text-xs font-bold ${perm.delete ? "text-emerald-600" : "text-red-500"}`}>
                        {perm.delete ? "✓ Delete" : "✗ Delete"}
                      </span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* STAFF MEMBERS DIRECTORY TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-xl text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Administrative Staff Members
            </h3>
            <p className="text-xs text-slate-500">Active personnel and assigned organizational roles</p>
          </div>
          <span className="badge badge-primary font-bold text-xs">{staffUsers.length} Members</span>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <th>Staff Member</th>
                <th>Email & Phone</th>
                <th>Assigned Role</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.map((u) => {
                const roleObj = roles.find(r => r.name === u.role);

                return (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td>
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20" />
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm">{u.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{u.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="text-xs font-medium text-slate-700">
                      <p className="font-semibold text-slate-900">{u.email}</p>
                      <p className="text-slate-400">{u.phone}</p>
                    </td>

                    <td>
                      <span className={`badge ${roleObj?.badgeColor || "badge-neutral"} text-xs px-2.5 py-1`}>
                        {u.role}
                      </span>
                    </td>

                    <td>
                      <span className="badge badge-success text-white font-bold text-xs">
                        {u.status}
                      </span>
                    </td>

                    <td className="text-right">
                      <button
                        onClick={() => {
                          const found = roles.find(r => r.name === u.role);
                          if (found) setSelectedRole(found);
                        }}
                        className="btn btn-xs btn-outline btn-primary font-bold rounded-lg gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Permissions
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD NEW STAFF MEMBER MODAL */}
      {isAddStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-xl text-slate-900">Add Staff Member</h3>
                <p className="text-xs text-slate-500">Register administrative user & assign role</p>
              </div>
              <button onClick={() => setIsAddStaffModalOpen(false)} className="btn btn-ghost btn-circle btn-xs">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Abu Sayed"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="input input-sm input-bordered w-full font-bold focus:outline-none rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="staff@superdeal.com"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="input input-sm input-bordered w-full focus:outline-none rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Phone Number</label>
                <input
                  type="text"
                  placeholder="+880 1711-XXXXXX"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  className="input input-sm input-bordered w-full focus:outline-none rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Assign Role *</label>
                <select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as RoleName })}
                  className="select select-sm select-bordered w-full font-bold focus:outline-none rounded-xl"
                >
                  {roles.map(r => (
                    <option key={r.name} value={r.name}>{r.name} (Level {r.level})</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddStaffModalOpen(false)}
                  className="btn btn-sm btn-ghost font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm btn-primary font-bold rounded-xl"
                >
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
