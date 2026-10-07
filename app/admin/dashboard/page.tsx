import Link from "next/link";
import { 
  DollarSign, 
  ShoppingCart, 
  Boxes, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  AlertTriangle, 
  Plus, 
  ShoppingBag, 
  Ticket, 
  BarChart3,
  Eye,
  CheckCircle,
  Clock
} from "lucide-react";

export default function AdminDashboardPage() {
  const kpiStats = [
    { title: "Total Revenue", value: "\$128,450.00", change: "+14.2% vs last month", icon: DollarSign, color: "text-emerald-500 bg-emerald-500/10" },
    { title: "Total Orders", value: "1,420", change: "+8.5% vs last month", icon: ShoppingCart, color: "text-blue-500 bg-blue-500/10" },
    { title: "Inventory Value", value: "\$340,890.00", change: "142 Active SKUs", icon: Boxes, color: "text-purple-500 bg-purple-500/10" },
    { title: "Active Customers", value: "3,890", change: "+240 New this week", icon: Users, color: "text-amber-500 bg-amber-500/10" }
  ];

  const recentOrders = [
    { id: "ORD-9982", customer: "Abu Sayed", email: "sayed@example.com", date: "Today, 02:45 PM", amount: "\$497.99", status: "Completed", badgeColor: "badge-success" },
    { id: "ORD-9981", customer: "Jane Cooper", email: "jane@example.com", date: "Today, 01:15 PM", amount: "\$149.00", status: "Processing", badgeColor: "badge-primary" },
    { id: "ORD-9980", customer: "Robert Fox", email: "fox@example.com", date: "Yesterday", amount: "\$89.99", status: "Pending", badgeColor: "badge-warning" },
    { id: "ORD-9979", customer: "Cody Fisher", email: "cody@example.com", date: "Oct 05, 2026", amount: "\$310.50", status: "Completed", badgeColor: "badge-success" }
  ];

  const lowStockAlerts = [
    { name: "Wireless Headphones", sku: "SD-HEAD-9081", stock: 2, minStock: 10 },
    { name: "Gaming Mechanical Keyboard", sku: "SD-KEY-1022", stock: 4, minStock: 15 },
    { name: "USB-C Fast Charger Cable", sku: "SD-CBL-4421", stock: 1, minStock: 20 },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-xs text-slate-500">Welcome back, Super Admin! Here is your business overview.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/admin/products" className="btn btn-sm btn-primary gap-1">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
          <Link href="/admin/purchases" className="btn btn-sm btn-outline gap-1">
            <ShoppingBag className="w-4 h-4" /> Create PO
          </Link>
          <Link href="/admin/coupons" className="btn btn-sm btn-ghost gap-1">
            <Ticket className="w-4 h-4 text-secondary" /> New Coupon
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiStats.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">{kpi.title}</span>
                <div className={`p-2.5 rounded-xl ${kpi.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">{kpi.value}</h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" /> {kpi.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics & Low Stock Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Overview Chart Mock */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Revenue & Sales Trends</h3>
              <p className="text-xs text-slate-500">Monthly breakdown for year 2026</p>
            </div>
            <select className="select select-xs select-bordered">
              <option>This Year (2026)</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          {/* Graphical Mock Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-3 pt-6 px-4 bg-slate-50 rounded-xl border border-slate-100">
            {[
              { month: "Jan", height: "60%" },
              { month: "Feb", height: "45%" },
              { month: "Mar", height: "75%" },
              { month: "Apr", height: "50%" },
              { month: "May", height: "85%" },
              { month: "Jun", height: "70%" },
              { month: "Jul", height: "95%" },
              { month: "Aug", height: "80%" },
              { month: "Sep", height: "90%" },
              { month: "Oct", height: "100%" }
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div 
                  className="w-full bg-primary/80 hover:bg-primary rounded-t-lg transition-all" 
                  style={{ height: bar.height }}
                ></div>
                <span className="text-[10px] font-bold text-slate-500">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Warning Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-error" /> Low Stock Alerts
            </h3>
            <Link href="/admin/inventory" className="text-xs text-primary font-bold hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockAlerts.map((item, idx) => (
              <div key={idx} className="p-3 bg-red-50/60 rounded-xl border border-red-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{item.name}</h4>
                  <span className="text-[10px] text-slate-500 font-mono">SKU: {item.sku}</span>
                </div>
                <div className="text-right">
                  <span className="badge badge-error badge-sm text-white font-extrabold">{item.stock} Left</span>
                  <p className="text-[10px] text-slate-500">Min: {item.minStock}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/admin/inventory" className="btn btn-error btn-outline btn-sm btn-block text-xs font-bold">
            Reorder Stock Now
          </Link>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Recent Customer Orders</h3>
            <p className="text-xs text-slate-500">Latest transactions from customer storefront</p>
          </div>
          <Link href="/admin/orders" className="btn btn-xs btn-outline btn-primary">
            View All Orders
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 uppercase border-b border-slate-100">
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="font-extrabold text-primary">{order.id}</td>
                  <td>
                    <div>
                      <p className="font-bold text-slate-900">{order.customer}</p>
                      <p className="text-xs text-slate-400">{order.email}</p>
                    </div>
                  </td>
                  <td className="text-xs text-slate-500">{order.date}</td>
                  <td className="font-bold text-slate-900">{order.amount}</td>
                  <td>
                    <span className={`badge ${order.badgeColor} text-white font-bold text-xs`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <Link href="/admin/orders" className="btn btn-ghost btn-xs text-slate-600 hover:text-primary">
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
