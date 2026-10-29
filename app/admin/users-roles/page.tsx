"use client";

import { useEffect, useState } from "react";
import { 
  UserCheck, 
  ShieldCheck, 
  ShieldAlert, 
  Key, 
  Plus, 
  Check, 
  X, 
  Search, 
  Eye, 
  Users, 
  Lock, 
  Sliders,
  Save,
  RefreshCw,
  Sparkles,
  Layers
} from "lucide-react";
import { RoleDocument, UserRole } from "@/types/user";

// All 19 admin routes available in the system
const ADMIN_MODULES = [
  { key: "dashboard", label: "Executive Dashboard", path: "/admin/dashboard", icon: "📊" },
  { key: "products", label: "Products Catalog", path: "/admin/products", icon: "📦" },
  { key: "categories", label: "Product Categories", path: "/admin/categories", icon: "🗂️" },
  { key: "inventory", label: "Inventory & Stock Alerts", path: "/admin/inventory", icon: "📋" },
  { key: "barcode", label: "Barcode Scanning & Restock", path: "/admin/barcode", icon: "🏷️" },
  { key: "warehouses", label: "Warehouse Hubs", path: "/admin/warehouses", icon: "🏢" },
  { key: "purchases", label: "Purchase Orders (PO)", path: "/admin/purchases", icon: "🛍️" },
  { key: "suppliers", label: "Registered Suppliers", path: "/admin/suppliers", icon: "🚚" },
  { key: "orders", label: "Customer Orders Stream", path: "/admin/orders", icon: "🛒" },
  { key: "returns", label: "Returns & Claims", path: "/admin/returns", icon: "🔄" },
  { key: "delivery", label: "Courier Logistics Hub", path: "/admin/delivery", icon: "⚡" },
  { key: "customers", label: "Customer Accounts", path: "/admin/customers", icon: "👥" },
  { key: "expenses", label: "Expenditure Tracking", path: "/admin/expenses", icon: "🧾" },
  { key: "coupons", label: "Coupons & Discounts", path: "/admin/coupons", icon: "🎟️" },
  { key: "marketing", label: "Flash Sales & Marketing", path: "/admin/marketing", icon: "📢" },
  { key: "reviews", label: "Reviews Moderation", path: "/admin/reviews", icon: "⭐" },
  { key: "reports", label: "Reports & Audit Center", path: "/admin/reports", icon: "📈" },
  { key: "users-roles", label: "Users & Roles RBAC", path: "/admin/users-roles", icon: "🔐" },
  { key: "settings", label: "Global System Settings", path: "/admin/settings", icon: "⚙️" },
];

export default function AdminUsersRolesPage() {
  const [roles, setRoles] = useState<RoleDocument[]>([]);
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<RoleDocument | null>(null);
  const [activeTab, setActiveTab] = useState<"permissions" | "staff">("permissions");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchStaff, setSearchStaff] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Fetch roles and staff from MongoDB
  const fetchRolesData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/roles");
      const data = await res.json();
      if (data.success) {
        setRoles(data.roles || []);
        setStaffMembers(data.staffMembers || []);
        if (data.roles && data.roles.length > 0) {
          setSelectedRole(data.roles[0]);
        }
      }
    } catch (err) {
      console.error("Error loading roles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRolesData();
  }, []);

  // Toggle specific module action permission (View, Create, Edit, Delete)
  const handleTogglePermission = (moduleKey: string, action: "view" | "create" | "edit" | "delete") => {
    if (!selectedRole) return;
    if (selectedRole.name === "Super Admin") {
      showToast("🔒 Super Admin has permanent unrestricted root access!");
      return;
    }

    const currentModule = selectedRole.permissions[moduleKey] || { view: false, create: false, edit: false, delete: false };
    const updatedValue = !currentModule[action];

    const updatedPermissions = {
      ...selectedRole.permissions,
      [moduleKey]: {
        ...currentModule,
        [action]: updatedValue,
        // If view is disabled, auto disable create, edit, delete
        ...(action === "view" && !updatedValue ? { create: false, edit: false, delete: false } : {}),
        // If create/edit/delete is enabled, auto enable view
        ...(action !== "view" && updatedValue ? { view: true } : {}),
      },
    };

    setSelectedRole({
      ...selectedRole,
      permissions: updatedPermissions,
    });
  };

  // Enable / Disable all actions for a module
  const handleToggleFullModule = (moduleKey: string, enable: boolean) => {
    if (!selectedRole || selectedRole.name === "Super Admin") return;

    setSelectedRole({
      ...selectedRole,
      permissions: {
        ...selectedRole.permissions,
        [moduleKey]: {
          view: enable,
          create: enable,
          edit: enable,
          delete: enable,
        },
      },
    });
  };

  // Save changes to MongoDB
  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    setSaving(true);
    try {
      const res = await fetch("/api/roles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleName: selectedRole.name,
          permissions: selectedRole.permissions,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`✅ Permissions for '${selectedRole.name}' saved to MongoDB!`);
        // Update local roles list
        setRoles((prev) =>
          prev.map((r) => (r.name === selectedRole.name ? selectedRole : r))
        );
      } else {
        alert(data.message || "Failed to save permissions");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving permissions");
    } finally {
      setSaving(false);
    }
  };

  const filteredStaff = staffMembers.filter((s) =>
    s.name.toLowerCase().includes(searchStaff.toLowerCase()) ||
    s.email.toLowerCase().includes(searchStaff.toLowerCase()) ||
    s.role.toLowerCase().includes(searchStaff.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
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
            <UserCheck className="w-8 h-8 text-primary" /> Dynamic Role Permissions (RBAC)
          </h1>
          <p className="text-xs text-slate-500">
            Granular route access management. Toggle View, Create, Edit, and Delete privileges per route across all staff roles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchRolesData}
            disabled={loading}
            className="btn btn-outline btn-sm font-bold rounded-xl gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          {activeTab === "permissions" && selectedRole && selectedRole.name !== "Super Admin" && (
            <button
              onClick={handleSavePermissions}
              disabled={saving}
              className="btn btn-primary btn-sm font-bold rounded-xl gap-2 shadow-md shadow-primary/20"
            >
              {saving ? <span className="loading loading-spinner loading-xs"></span> : <Save className="w-4 h-4" />}
              Save Role Permissions
            </button>
          )}
        </div>
      </div>

      {/* Tabs Switcher: Role Permissions Matrix vs Staff Members List */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("permissions")}
          className={`btn btn-sm rounded-xl font-bold gap-2 ${
            activeTab === "permissions" ? "btn-primary" : "btn-ghost text-slate-600"
          }`}
        >
          <Sliders className="w-4 h-4" /> Role Permissions Matrix
        </button>
        <button
          onClick={() => setActiveTab("staff")}
          className={`btn btn-sm rounded-xl font-bold gap-2 ${
            activeTab === "staff" ? "btn-primary" : "btn-ghost text-slate-600"
          }`}
        >
          <Users className="w-4 h-4" /> Staff Members Directory ({staffMembers.length})
        </button>
      </div>

      {activeTab === "permissions" ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: Role Selector Cards */}
          <div className="lg:col-span-1 space-y-3">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
              Configured Roles ({roles.length})
            </span>

            <div className="space-y-2">
              {roles.map((r) => {
                const isSelected = selectedRole?.name === r.name;

                return (
                  <button
                    key={r.name}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all text-xs space-y-1.5 ${
                      isSelected
                        ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                        : "bg-white text-slate-800 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm">{r.name}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                        isSelected ? "bg-white/20 text-white" : r.badgeColor
                      }`}>
                        Level {r.level}
                      </span>
                    </div>
                    <p className={`text-[11px] line-clamp-2 ${isSelected ? "text-white/80" : "text-slate-500"}`}>
                      {r.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right 3 Columns: Granular 19 Routes Permission Matrix */}
          <div className="lg:col-span-3 space-y-4">
            {selectedRole && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-slate-900">{selectedRole.name}</h2>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${selectedRole.badgeColor}`}>
                        Level {selectedRole.level} Role
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{selectedRole.description}</p>
                  </div>

                  {selectedRole.name === "Super Admin" ? (
                    <div className="flex items-center gap-2 p-2.5 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold border border-rose-200">
                      <Lock className="w-4 h-4" /> Root Unrestricted Permissions
                    </div>
                  ) : (
                    <button
                      onClick={handleSavePermissions}
                      disabled={saving}
                      className="btn btn-primary btn-sm font-bold rounded-xl gap-2"
                    >
                      {saving ? <span className="loading loading-spinner loading-xs"></span> : <Save className="w-4 h-4" />}
                      Save Permissions
                    </button>
                  )}
                </div>

                {/* Granular Permission Matrix Table */}
                <div className="overflow-x-auto">
                  <table className="table w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                        <th>Admin Route Module</th>
                        <th className="text-center w-24">View (Read)</th>
                        <th className="text-center w-24">Create (Add)</th>
                        <th className="text-center w-24">Edit (Update)</th>
                        <th className="text-center w-24">Delete (Trash)</th>
                        <th className="text-center w-28">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {ADMIN_MODULES.map((mod) => {
                        const perm = selectedRole.permissions[mod.key] || { view: false, create: false, edit: false, delete: false };
                        const isSuper = selectedRole.name === "Super Admin";

                        return (
                          <tr key={mod.key} className="hover:bg-slate-50/60">
                            <td>
                              <div className="flex items-center gap-2.5">
                                <span className="text-base">{mod.icon}</span>
                                <div>
                                  <p className="font-bold text-slate-900 text-xs">{mod.label}</p>
                                  <p className="text-[10px] text-slate-400 font-mono">{mod.path}</p>
                                </div>
                              </div>
                            </td>

                            {/* View Checkbox */}
                            <td className="text-center">
                              <input
                                type="checkbox"
                                disabled={isSuper}
                                checked={isSuper ? true : !!perm.view}
                                onChange={() => handleTogglePermission(mod.key, "view")}
                                className="checkbox checkbox-sm checkbox-primary rounded-lg"
                              />
                            </td>

                            {/* Create Checkbox */}
                            <td className="text-center">
                              <input
                                type="checkbox"
                                disabled={isSuper || !perm.view}
                                checked={isSuper ? true : !!perm.create}
                                onChange={() => handleTogglePermission(mod.key, "create")}
                                className="checkbox checkbox-sm checkbox-secondary rounded-lg"
                              />
                            </td>

                            {/* Edit Checkbox */}
                            <td className="text-center">
                              <input
                                type="checkbox"
                                disabled={isSuper || !perm.view}
                                checked={isSuper ? true : !!perm.edit}
                                onChange={() => handleTogglePermission(mod.key, "edit")}
                                className="checkbox checkbox-sm checkbox-accent rounded-lg"
                              />
                            </td>

                            {/* Delete Checkbox */}
                            <td className="text-center">
                              <input
                                type="checkbox"
                                disabled={isSuper || !perm.view}
                                checked={isSuper ? true : !!perm.delete}
                                onChange={() => handleTogglePermission(mod.key, "delete")}
                                className="checkbox checkbox-sm checkbox-error rounded-lg"
                              />
                            </td>

                            {/* Quick Enable/Disable Module */}
                            <td className="text-center">
                              {!isSuper && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleFullModule(mod.key, !perm.view)}
                                  className={`btn btn-xs rounded-lg font-bold ${
                                    perm.view ? "btn-ghost text-slate-500 hover:text-rose-500" : "btn-outline btn-primary"
                                  }`}
                                >
                                  {perm.view ? "Revoke All" : "Grant All"}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Staff Directory Tab */
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Registered Staff Accounts</h2>
              <p className="text-xs text-slate-500">All non-customer administrators and department managers</p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff by name, email or role..."
                value={searchStaff}
                onChange={(e) => setSearchStaff(e.target.value)}
                className="input input-sm input-bordered w-full pl-9 rounded-xl text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                  <th>Staff Member</th>
                  <th>Assigned Role</th>
                  <th>Contact Phone</th>
                  <th>Account Status</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50/50">
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={staff.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${staff.name}`}
                          alt={staff.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{staff.name}</p>
                          <p className="text-[11px] text-slate-400">{staff.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-sm badge-neutral font-bold text-slate-200">
                        {staff.role}
                      </span>
                    </td>
                    <td className="font-mono text-slate-600">{staff.phone || "N/A"}</td>
                    <td>
                      <span className="badge badge-xs badge-success text-white font-bold">
                        {staff.status || "Active"}
                      </span>
                    </td>
                    <td className="text-slate-400">
                      {staff.createdAt ? new Date(staff.createdAt).toLocaleDateString("en-GB") : "Active"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
