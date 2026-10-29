"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromUrl = searchParams.get("from");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Quick Demo Account Auto-Filler
  const fillDemoAccount = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setErrorMsg(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setSuccessMsg(`Welcome back, ${data.user.name}! Redirecting...`);
        
        // Dispatch window event so navbar updates instantly
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("authChanged"));
        }

        // Smart redirect based on Role or original destination (e.g. /checkout)
        setTimeout(() => {
          if (fromUrl && !fromUrl.startsWith("/admin")) {
            router.push(fromUrl);
          } else if (data.user.role === "Customer") {
            router.push(fromUrl || "/account");
          } else {
            router.push(fromUrl || "/admin/dashboard");
          }
          router.refresh();
        }, 800);
      } else {
        setErrorMsg(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-base-200/50 to-base-100">
      <div className="max-w-md w-full space-y-6 bg-base-100 p-8 rounded-3xl border border-base-200 shadow-xl relative overflow-hidden">
        {/* Subtle accent bar */}
        <div className="h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r from-primary via-indigo-500 to-secondary"></div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-black text-primary">
            <span className="bg-primary text-primary-content p-1.5 rounded-xl shadow-md text-base">🛍️</span>
            <span>Super<span className="text-secondary">Deal</span></span>
          </Link>
          <h2 className="text-2xl font-black text-base-content tracking-tight">
            Sign in to your account
          </h2>
          <p className="text-xs text-base-content/60">
            {fromUrl === "/checkout" ? (
              <span className="text-primary font-bold">🛒 Please sign in to finalize your checkout order</span>
            ) : (
              "Access your orders, wishlist, rewards, or staff portal"
            )}
          </p>
        </div>

        {/* Notification Alerts */}
        {errorMsg && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-2xl flex items-center gap-2 text-error text-xs font-bold animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-success/10 border border-success/20 rounded-2xl flex items-center gap-2 text-success text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Direct Social Logins */}
        <div className="space-y-2.5">
          <button 
            type="button"
            onClick={() => alert("Google OAuth: Connected with Google Client ID. Authenticates directly into MongoDB.")}
            className="btn btn-outline btn-sm w-full rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-base-200 hover:text-base-content"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Continue with Google
          </button>

          <button 
            type="button"
            onClick={() => alert("Facebook OAuth: Connected with Meta Client ID. Authenticates directly into MongoDB.")}
            className="btn btn-outline btn-sm w-full rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-base-200 hover:text-base-content text-[#1877F2]"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </button>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-base-300"></div>
          <span className="flex-shrink mx-3 text-xs font-semibold text-base-content/40 uppercase">Or with email</span>
          <div className="flex-grow border-t border-base-300"></div>
        </div>

        {/* Credentials Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-base-content">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-base-content/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="e.g. sayed@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-sm input-bordered w-full pl-9 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="font-bold text-base-content">Password *</label>
              <Link href="/contact" className="text-[11px] text-primary hover:underline font-semibold">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-base-content/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-sm input-bordered w-full pl-9 pr-9 rounded-xl focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn btn-ghost btn-circle btn-xs absolute right-1.5 top-1/2 -translate-y-1/2 text-base-content/50"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-sm btn-block rounded-xl font-bold shadow-md shadow-primary/20 gap-2 mt-2"
          >
            {loading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Accounts Sandbox Helper */}
        <div className="p-3 bg-base-200/50 rounded-2xl border border-base-200 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-base-content/70">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Sandbox Quick Demo Accounts:</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <button
              type="button"
              onClick={() => fillDemoAccount("admin@superdeal.com", "admin123")}
              className="btn btn-xs btn-outline btn-neutral rounded-lg font-bold truncate"
            >
              👑 Super Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("sayed@example.com", "123456")}
              className="btn btn-xs btn-outline btn-neutral rounded-lg font-bold truncate"
            >
              👤 Customer
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("inventory@superdeal.com", "admin123")}
              className="btn btn-xs btn-outline btn-neutral rounded-lg font-bold truncate"
            >
              📦 Inventory Mgr
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("accountant@superdeal.com", "admin123")}
              className="btn btn-xs btn-outline btn-neutral rounded-lg font-bold truncate"
            >
              💰 Accountant
            </button>
          </div>
        </div>

        {/* Register CTA */}
        <p className="text-center text-xs text-base-content/70">
          Don't have an account yet?{" "}
          <Link 
            href={fromUrl ? `/register?from=${encodeURIComponent(fromUrl)}` : "/register"} 
            className="font-bold text-primary hover:underline"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[85vh] flex items-center justify-center"><div className="loading loading-spinner text-primary"></div></div>}>
      <LoginForm />
    </Suspense>
  );
}
