import { Boxes, AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw, Plus, Search } from "lucide-react";

export default function AdminInventoryPage() {
  const inventoryItems = [
    { sku: "SD-HEAD-9081", name: "Wireless Headphones", warehouse: "Main Warehouse (Dhaka)", inStock: 18, reorderLevel: 10, unitValue: "\$120.00", totalValuation: "\$2,160.00", status: "Healthy" },
    { sku: "SD-WTC-7721", name: "Ultra Smart Watch", warehouse: "Main Warehouse (Dhaka)", inStock: 25, reorderLevel: 15, unitValue: "\$90.00", totalValuation: "\$2,250.00", status: "Healthy" },
    { sku: "SD-KEY-1022", name: "Gaming Mechanical Keyboard", warehouse: "Sub Warehouse (Chittagong)", inStock: 4, reorderLevel: 15, unitValue: "\$50.00", totalValuation: "\$200.00", status: "Reorder Needed" },
    { sku: "SD-CBL-4421", name: "USB-C Fast Cable", warehouse: "Main Warehouse (Dhaka)", inStock: 1, reorderLevel: 20, unitValue: "\$4.00", totalValuation: "\$4.00", status: "Critical" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Inventory & Stock Controls</h1>
          <p className="text-xs text-slate-500">Monitor warehouse stock, reorder levels, and stock movements</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-primary btn-sm gap-2">
            <Plus className="w-4 h-4" /> Stock Adjustment
          </button>
        </div>
      </div>

      {/* Stock Health KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Total Items in Stock</p>
            <h3 className="text-2xl font-black text-slate-900">4,850 Units</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Boxes className="w-6 h-6" /></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Reorder Alerts</p>
            <h3 className="text-2xl font-black text-error">4 Items Low</h3>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-xl"><AlertTriangle className="w-6 h-6" /></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Total Valuation</p>
            <h3 className="text-2xl font-black text-emerald-600">\$340,890.00</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><RefreshCw className="w-6 h-6" /></div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
              <th>SKU</th>
              <th>Product</th>
              <th>Warehouse</th>
              <th>Current Stock</th>
              <th>Reorder Point</th>
              <th>Total Value</th>
              <th>Stock Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inventoryItems.map((item, idx) => (
              <tr key={idx}>
                <td className="font-mono text-xs text-slate-500">{item.sku}</td>
                <td className="font-bold text-slate-900">{item.name}</td>
                <td className="text-xs text-slate-600">{item.warehouse}</td>
                <td className="font-extrabold text-slate-900">{item.inStock} units</td>
                <td className="text-xs text-slate-500">{item.reorderLevel} units</td>
                <td className="font-mono text-slate-900 font-bold">{item.totalValuation}</td>
                <td>
                  <span className={`badge badge-sm font-bold ${
                    item.status === "Healthy" ? "badge-success text-white" :
                    item.status === "Reorder Needed" ? "badge-warning" : "badge-error text-white"
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="text-right">
                  <button className="btn btn-xs btn-outline btn-primary">Adjust Stock</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
