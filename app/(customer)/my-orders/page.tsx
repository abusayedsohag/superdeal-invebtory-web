import Link from "next/link";
import { Package, Clock, CheckCircle, Truck, FileText, ArrowRight } from "lucide-react";

const customerOrders = [
  {
    id: "ORD-9982",
    date: "Oct 06, 2026",
    status: "Delivered",
    statusColor: "badge-success text-white",
    total: 497.99,
    itemsCount: 3,
    paymentMethod: "Credit Card (ending 4242)",
    items: [
      { name: "Wireless Noise-Canceling Headphones", price: 199.99, qty: 1, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80" },
      { name: "Ultra Smart Watch Series 7 Pro", price: 149.00, qty: 2, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80" }
    ]
  },
  {
    id: "ORD-9950",
    date: "Sep 28, 2026",
    status: "In Transit",
    statusColor: "badge-primary",
    total: 89.99,
    itemsCount: 1,
    paymentMethod: "bKash Mobile Payment",
    items: [
      { name: "Ergonomic Mechanical Gaming Keyboard", price: 89.99, qty: 1, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&auto=format&fit=crop&q=80" }
    ]
  }
];

export default function MyOrdersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-200 pb-4">
        <div>
          <h1 className="text-3xl font-black">My Order History</h1>
          <p className="text-xs text-base-content/60">Track your past purchases and shipment statuses</p>
        </div>
        <Link href="/products" className="btn btn-primary btn-sm rounded-xl">
          Start Shopping
        </Link>
      </div>

      {/* Orders Cards List */}
      <div className="space-y-6">
        {customerOrders.map((order) => (
          <div key={order.id} className="bg-base-100 rounded-3xl border border-base-200 p-6 shadow-xs space-y-4">
            {/* Top Info Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-base-200 pb-4 text-xs">
              <div className="space-x-4">
                <span className="font-extrabold text-sm text-base-content">{order.id}</span>
                <span className="text-base-content/60">Placed on: <strong>{order.date}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge ${order.statusColor} font-bold px-3 py-1 text-xs`}>
                  {order.status}
                </span>
                <span className="font-extrabold text-base text-primary font-mono">\${order.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Order Items preview */}
            <div className="divide-y divide-base-200">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover border border-base-200" />
                    <div>
                      <h4 className="font-bold text-sm text-base-content">{item.name}</h4>
                      <p className="text-xs text-base-content/60">Quantity: {item.qty} × \${item.price}</p>
                    </div>
                  </div>
                  <Link href={`/products/1`} className="btn btn-ghost btn-xs text-primary font-bold">
                    View Product
                  </Link>
                </div>
              ))}
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-4 border-t border-base-200 flex flex-wrap items-center justify-between gap-4 text-xs">
              <span className="text-base-content/60">Payment: <strong>{order.paymentMethod}</strong></span>
              <div className="flex items-center gap-2">
                <button className="btn btn-xs btn-outline gap-1">
                  <FileText className="w-3.5 h-3.5" /> Download Invoice
                </button>
                <button className="btn btn-xs btn-primary gap-1">
                  <Truck className="w-3.5 h-3.5" /> Track Package
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
