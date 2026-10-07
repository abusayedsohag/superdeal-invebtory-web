# 🛍️ SuperDeal - E-Commerce & Inventory Management System

**SuperDeal** is a modern, responsive full-stack E-Commerce storefront and back-office Inventory Management Dashboard built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **DaisyUI v5**.

---

## ✨ Features Overview

### 🛍️ Customer Storefront
- **Home Page (`/`):** Hero sales banner, category cards grid, flash deal highlights, trust badges, and newsletter subscription.
- **Products Catalog (`/products`):** Interactive sidebar filters (categories, price range, rating), sorting, product cards, and pagination.
- **Categories Page (`/categories`):** Main category showcases with item counts and subcategory tags.
- **Product Details (`/products/[id]`):** Image gallery, color variant selector, stock status, specs/reviews tabs, and quick checkout actions.
- **Shopping Cart (`/cart`):** Quantity increment/decrement, dynamic subtotal calculations, coupon code validator, and summary.
- **Checkout (`/checkout`):** Shipping address form, multi-method payment selector (Credit Card, Mobile Banking bKash/Nagad, Cash on Delivery), and order confirmation.
- **My Orders (`/my-orders`):** Customer order history, live status badges (*Processing, In Transit, Delivered*), item breakdowns, and package tracking.
- **Wishlist (`/wishlist`):** Saved items grid with move-to-cart functionality.
- **Customer Account (`/account`):** Personal profile management, shipping address book, loyalty points, and security/password updates.

---

### 🔐 Admin Dashboard & Inventory System
- **Executive Dashboard (`/admin/dashboard`):** KPI metric cards (*Total Revenue, Orders, Inventory Value, Active Customers*), monthly sales chart, low stock warning panel, and recent order transactions.
- **Products Catalog (`/admin/products`):** Full SKU management, cost vs. selling prices, stock levels, and status filters.
- **Inventory Control (`/admin/inventory`):** Warehouse stock tracking, reorder threshold alerts, valuation totals, and stock adjustments.
- **Purchase Orders (`/admin/purchases`):** Procurement tracking from vendors, PO status approvals, and order values.
- **Suppliers Directory (`/admin/suppliers`):** Vendor contact directory, locations, and total fulfilled purchase orders.
- **Order Fulfillment (`/admin/orders`):** Customer order management, payment verification, status updates (*Pending, Processing, Shipped, Delivered*), and invoice viewing.
- **Customers Management (`/admin/customers`):** Customer records, lifetime spend metrics, and loyalty tier badges.
- **Expenses Tracker (`/admin/expenses`):** Operating overhead logging, expense categories, and management approval logs.
- **Coupons & Discounts (`/admin/coupons`):** Active promo code management, discount rules, redemption counts, and validity dates.
- **Marketing & Campaigns (`/admin/marketing`):** Campaign tracking across Meta Ads, Email Newsletters, and Web Push notifications.
- **Reports & Analytics (`/admin/reports`):** Downloadable financial reports (*P&L statements, Inventory Valuation, Sales Summaries*).
- **Users & Roles (`/admin/users-roles`):** Staff account permissions matrix (*Super Admin, Store Manager, Inventory Manager*).
- **Store Settings (`/admin/settings`):** Global currency options, tax rates, payment gateway toggles, and store details.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + [DaisyUI v5](https://daisyui.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 📁 Project Structure

```text
inventory-website-project/
├── app/
│   ├── (customer)/            # Customer Storefront Routes
│   │   ├── account/           # Customer Account Page
│   │   ├── cart/              # Shopping Cart Page
│   │   ├── categories/        # Categories Page
│   │   ├── checkout/          # Checkout & Payment Page
│   │   ├── my-orders/         # Order History Page
│   │   ├── products/          # Products Catalog & Details ([id])
│   │   ├── wishlist/          # Saved Items Page
│   │   ├── layout.tsx         # Customer Layout Wrapper (Navbar + Footer)
│   │   └── page.tsx           # Customer Home Page
│   │
│   └── admin/                 # Admin Dashboard Routes
│       ├── coupons/           # Promo Codes Page
│       ├── customers/         # Registered Customers Page
│       ├── dashboard/         # Executive Analytics Dashboard
│       ├── expenses/          # Overhead Expenses Page
│       ├── inventory/         # Stock Control & Alerts Page
│       ├── marketing/         # Marketing Campaigns Page
│       ├── orders/            # Store Orders Fulfillment Page
│       ├── products/          # Catalog & SKU Management Page
│       ├── purchases/         # Vendor Purchase Orders Page
│       ├── reports/           # Financial Audit Reports Page
│       ├── settings/          # System Configuration Page
│       ├── suppliers/         # Vendor Directory Page
│       ├── users-roles/       # Staff Access Controls Page
│       └── layout.tsx         # Admin Layout Wrapper (Sidebar + Header)
│
├── components/
│   ├── customer/              # Customer Navbar & Footer Components
│   └── admin/                 # Admin Sidebar & Header Components
│
├── public/                    # Static Assets
└── package.json               # Dependencies & Scripts
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
