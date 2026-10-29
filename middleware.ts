import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "superdeal-secret-enterprise-auth-jwt-token-2026-key";
const JWT_SECRET_BYTES = new TextEncoder().encode(JWT_SECRET_STRING);
const AUTH_COOKIE_NAME = "superdeal_auth_token";

// Define allowed modules for departmental staff roles
const ROLE_ALLOWED_PREFIXES: Record<string, string[]> = {
  "Super Admin": ["/admin"], // Unrestricted
  "Admin": [
    "/admin/dashboard",
    "/admin/products",
    "/admin/categories",
    "/admin/inventory",
    "/admin/barcode",
    "/admin/warehouses",
    "/admin/purchases",
    "/admin/suppliers",
    "/admin/orders",
    "/admin/returns",
    "/admin/delivery",
    "/admin/customers",
    "/admin/expenses",
    "/admin/coupons",
    "/admin/marketing",
    "/admin/reviews",
    "/admin/reports"
  ],
  "Inventory Manager": [
    "/admin/dashboard",
    "/admin/products",
    "/admin/inventory",
    "/admin/barcode",
    "/admin/warehouses",
    "/admin/purchases",
    "/admin/suppliers"
  ],
  "Sales Manager": [
    "/admin/dashboard",
    "/admin/orders",
    "/admin/returns",
    "/admin/reviews",
    "/admin/customers",
    "/admin/coupons"
  ],
  "Delivery Manager": [
    "/admin/dashboard",
    "/admin/delivery",
    "/admin/orders"
  ],
  "Accountant": [
    "/admin/dashboard",
    "/admin/expenses",
    "/admin/purchases",
    "/admin/reports",
    "/admin/coupons"
  ]
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  let session: any = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET_BYTES);
      session = payload;
    } catch (err) {
      session = null;
    }
  }

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isAdminRoute = pathname.startsWith("/admin");
  const isCustomerProtectedRoute = 
    pathname.startsWith("/account") || 
    pathname.startsWith("/my-orders") || 
    pathname.startsWith("/checkout");

  // 1. If logged in user tries to visit /login or /register, redirect to appropriate portal
  if (isAuthPage && session) {
    const returnUrl = request.nextUrl.searchParams.get("from");
    if (returnUrl && !returnUrl.startsWith("/admin")) {
      return NextResponse.redirect(new URL(returnUrl, request.url));
    }
    const redirectUrl = session.role === "Customer" ? "/account" : "/admin/dashboard";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // 2. Protect Admin Routes (/admin/*)
  if (isAdminRoute) {
    // If not logged in, redirect to login page with return URL
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If logged in as Customer, block admin access and send to customer portal
    if (session.role === "Customer") {
      return NextResponse.redirect(new URL("/account?error=unauthorized_admin", request.url));
    }

    // Role-Based Module Access Control for Staff
    if (session.role !== "Super Admin") {
      const allowedPaths = ROLE_ALLOWED_PREFIXES[session.role] || ["/admin/dashboard"];
      
      const isAllowed = allowedPaths.some((prefix) => 
        pathname === prefix || pathname.startsWith(prefix + "/")
      );

      if (!isAllowed) {
        // Redirect unauthorized staff to their permitted default portal
        const fallbackUrl = new URL("/admin/dashboard?error=access_denied", request.url);
        return NextResponse.redirect(fallbackUrl);
      }
    }
  }

  // 3. Protect Customer Private Routes (/account, /my-orders)
  if (isCustomerProtectedRoute && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Config matcher: intercept protected portals while ignoring static files & api
export const config = {
  matcher: [
    "/admin/:path*",
    "/account/:path*",
    "/my-orders/:path*",
    "/checkout/:path*",
    "/checkout",
    "/login",
    "/register"
  ],
};
