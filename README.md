# 🛍️ SuperDeal - Enterprise E-Commerce & Inventory Management System

**SuperDeal** is a feature-rich, high-performance, responsive full-stack E-Commerce storefront and back-office Enterprise Inventory Management System built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **DaisyUI v5**.

Designed for scalable online retail, multi-warehouse stock management, delivery logistics integration, role-based authorization, and comprehensive business reporting.

---

## ✨ Comprehensive Features Overview

### 🛍️ Customer Storefront (`(customer)`)
- **Home Page (`/`):** Dynamic hero banners, category grid, flash deal countdowns, trust badges, and newsletter subscription.
- **Products Catalog (`/products`):** Multi-criteria sidebar filtering (category, price range, rating), sorting, product grid, and pagination.
- **Product Details (`/products/[id]`):** High-resolution image gallery, color variant picker, live stock status, tabbed specs/reviews, cross-sell recommendations, and structured schema (JSON-LD).
- **Product Recommendations:** Smart "Because you viewed X, you may also like Y" recommendation engine with AI-ready architecture.
- **Customer Reviews & Ratings (`/admin/reviews`):** Verified purchase badges, star ratings, customer feedback, and admin approval workflows.
- **Shopping Cart (`/cart`):** Quantity management, dynamic subtotal calculations, promo coupon validator, and order summary.
- **Checkout Page (`/checkout`):** Shipping address book, multi-method payment gateway (bKash, Nagad, Credit Card, COD), and instant order confirmation.
- **My Orders (`/my-orders`):** Order history with live status tracking (*Processing, In Transit, Delivered*), itemized breakdown, and package tracking.
- **Wishlist (`/wishlist`):** Saved items grid with instant move-to-cart capability.
- **Customer Account (`/account`):** Profile details, shipping addresses, loyalty points summary, and security settings.

---

### 🔐 Back-Office Admin & Enterprise Management (`/admin`)

- **📈 Advanced Dashboard (`/admin/dashboard`):** Real-time KPI summary cards (*Today's Sale ৳125,430, Orders 348, Customers 12,540, Profit ৳42,500*), sales charts, low-stock notifications, and recent order feeds.
- **🏷️ Barcode System (`/admin/barcode`):** Barcode scanner interface support, SKU-to-Barcode lookup, stock lookup, and quick barcode scan-to-sale cashier workflow.
- **📦 Warehouse Management (`/admin/warehouses`):** Multi-warehouse stock allocation, capacity tracking, location management, and warehouse transfers.
- **📦 Returns & Refunds (`/admin/returns`):** Customer return request management, approval/rejection workflows, partial/full refund triggers, and automatic inventory restock updates.
- **🚚 Delivery Management (`/admin/delivery`):** Multi-courier integration architecture (**Steadfast**, **Pathao**, **RedX**, **Custom**), order dispatching, and tracking ID generation.
- **🔐 Role & Permission System (`/admin/users-roles`):** Granular access control hierarchy:
  - *Super Admin*, *Admin*, *Manager*, *Inventory Manager*, *Sales Manager*, *Accountant*, *Delivery Manager*.
  - Fine-grained permission matrix (View, Create, Edit, Delete for Products, Orders, Reports, Users).
- **🧾 Expense Management (`/admin/expenses`):** Business operational overhead tracking (Rent, Salary, Electricity, Internet, Marketing, Packaging, Transportation) with attachments, payment methods, and category breakdowns.
- **📄 Reports & Analytics (`/admin/reports`):**
  - **Sales Reports:** Daily, Monthly, Yearly Sales.
  - **Inventory Reports:** Current Stock, Low Stock, Out of Stock, Stock Movement.
  - **Purchase Reports:** Supplier Purchases, Purchase Costs.
  - **Financial Reports:** Revenue, Expense, Profit, Customer Dues.
  - **Customer Reports:** New Customers, Top Customers, Repeat Customers.
  - **Exports:** One-click CSV and PDF summary report exports.
- **⭐ Review Management (`/admin/reviews`):** Approve, Reject, Delete, and Reply to customer product reviews.
- **🛍️ Products & SKU Control (`/admin/products` & `/admin/products/new`):** Full SKU management, cost vs. selling prices, stock levels, variants, and product images.
- **🏭 Purchase Orders & Suppliers (`/admin/purchases` & `/admin/suppliers`):** Vendor directory, purchase order generation, PO tracking, and receiving logs.
- **🏷️ Coupons & Marketing (`/admin/coupons` & `/admin/marketing`):** Dynamic discount rules, promo code redemptions, and advertising campaign tracking.
- **⚙️ Store Settings (`/admin/settings`):** Global store profile, currency options, tax rates, and system preferences.

---

### 🔍 Search Engine Optimization (SEO System)
- **Dynamic Sitemap:** Auto-generated `/sitemap.xml` for indexed pages and products.
- **Robots Management:** Auto-generated `/robots.txt` restricting admin/private routes.
- **Structured Data (JSON-LD):**
  - `Organization` Schema
  - `Product` & `Offer` Schema
  - `BreadcrumbList` Schema
  - `Review` & `AggregateRating` Schema
- **OpenGraph & Canonical:** Optimized meta tags and canonical URLs for maximum social sharing & search rank performance.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + [DaisyUI v5](https://daisyui.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Rendering:** Partial Page Prerendering (PPR) & Server Components for speed and SEO.

---

## 📁 Project Structure

```text
inventory-website-project/
├── app/
│   ├── (customer)/            # Customer Storefront Routes
│   │   ├── account/           # Account Profile & Address Book
│   │   ├── cart/              # Shopping Cart & Coupon Apply
│   │   ├── categories/        # Browse Categories & Subcategories
│   │   ├── checkout/          # Multi-step Checkout & Payment
│   │   ├── my-orders/         # Order History & Tracking
│   │   ├── products/          # Catalog & Product Details ([id])
│   │   ├── wishlist/          # Saved Wishlist Items
│   │   ├── layout.tsx         # Customer Layout Wrapper (Navbar + Footer)
│   │   └── page.tsx           # Customer Store Frontpage
│   │
│   ├── admin/                 # Admin Back-Office Management
│   │   ├── barcode/           # Barcode Scanner & Quick POS
│   │   ├── categories/        # Category Management
│   │   ├── coupons/           # Promotional Discount Codes
│   │   ├── customers/         # Customer Relationship Management
│   │   ├── dashboard/         # Real-time Executive Analytics
│   │   ├── delivery/          # Courier Integration & Dispatch
│   │   ├── expenses/          # Operational Expense Tracker
│   │   ├── inventory/         # Stock Levels & Movement
│   │   ├── marketing/         # Advertising Campaign Performance
│   │   ├── orders/            # Order Processing & Invoice Printable
│   │   ├── products/          # Catalog & SKU Management
│   │   ├── purchases/         # Vendor Purchase Orders
│   │   ├── reports/           # Financial & Operations Audit Reports
│   │   ├── returns/           # Customer Returns & Refund Workflow
│   │   ├── reviews/           # Product Review Moderation
│   │   ├── settings/          # System Configuration
│   │   ├── suppliers/         # Vendor Directory & Contacts
│   │   ├── users-roles/       # RBAC Roles & Permissions Matrix
│   │   ├── warehouses/        # Warehouse Management
│   │   └── layout.tsx         # Admin Dashboard Shell (Sidebar + Navigation)
│   │
│   ├── robots.ts              # Dynamic SEO Robots Config
│   ├── sitemap.ts             # Dynamic Sitemap Generator
│   ├── layout.tsx             # Root App Layout & Global Metadata
│   └── page.tsx               # Entry Portal / Landing Redirection
│
├── components/
│   ├── customer/              # Customer Layout & Recommendation Components
│   └── admin/                 # Admin Sidebar, Navbar & Header Components
│
├── public/                    # Static Media Assets
└── package.json               # Dependencies & Scripts
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production & Verify
```bash
npm run build
npm run start
```

---

## 📄 License
This project is proprietary open-source under the [MIT License](LICENSE).
