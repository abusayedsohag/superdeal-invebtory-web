import Link from "next/link";
import { ShieldCheck, Mail, Phone, MapPin, CreditCard, Share2, Globe, MessageSquare } from "lucide-react";

export default function CustomerFooter() {
  return (
    <footer className="bg-slate-900 text-slate-200 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-2xl font-black text-white">
            <span className="bg-primary text-white p-2 rounded-xl">🛍️</span>
            <span>Super<span className="text-primary">Deal</span></span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            Your one-stop destination for quality products at unbelievable prices. Fast shipping, easy returns, and round-the-clock customer support.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="#" className="btn btn-sm btn-circle btn-neutral hover:btn-primary"><Share2 className="w-4 h-4" /></a>
            <a href="#" className="btn btn-sm btn-circle btn-neutral hover:btn-primary"><Globe className="w-4 h-4" /></a>
            <a href="#" className="btn btn-sm btn-circle btn-neutral hover:btn-primary"><MessageSquare className="w-4 h-4" /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
            <li><Link href="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
            <li><Link href="/wishlist" className="hover:text-primary transition-colors">Wishlist</Link></li>
            <li><Link href="/cart" className="hover:text-primary transition-colors">Shopping Cart</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Customer Support</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link href="/my-orders" className="hover:text-primary transition-colors">My Orders</Link></li>
            <li><Link href="/account" className="hover:text-primary transition-colors">Account Details</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Returns & Refunds</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Help Center / FAQs</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>123 SuperDeal Tower, Tech Avenue, Innovation City</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <span>+1 (800) 555-SUPER</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <span>support@superdeal.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 SuperDeal Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><CreditCard className="w-4 h-4" /> Secure SSL Checkout</span>
            <Link href="/admin/dashboard" className="text-primary hover:underline font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
