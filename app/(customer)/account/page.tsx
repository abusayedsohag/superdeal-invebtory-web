"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getStoredWishlist } from "@/lib/wishlist-store";
import {
  User,
  Mail,
  Phone,
  MapPin,
  KeyRound,
  Award,
  Package,
  Heart,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  LogOut,
  RefreshCw,
  ShoppingBag
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  address: string;
  district: string;
  upazila: string;
  rewardPoints: number;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const updateWishlist = () => {
      setWishlistCount(getStoredWishlist().length);
    };
    updateWishlist();
    window.addEventListener("wishlistUpdated", updateWishlist);
    return () => window.removeEventListener("wishlistUpdated", updateWishlist);
  }, []);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [avatar, setAvatar] = useState("");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Alerts
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");
  const [pwdError, setPwdError] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      if (data.success && data.profile) {
        setProfile(data.profile);
        setName(data.profile.name || "");
        setPhone(data.profile.phone || "");
        setAddress(data.profile.address || "");
        setDistrict(data.profile.district || "");
        setUpazila(data.profile.upazila || "");
        setAvatar(data.profile.avatar || "");
      } else {
        router.push("/login");
      }
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess("");
    setProfileError("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, address, district, upazila, avatar })
      });
      const data = await res.json();
      if (data.success) {
        setProfileSuccess(data.message || "Profile updated successfully!");
        setProfile((prev) => (prev ? { ...prev, name, phone, address, district, upazila, avatar } : null));
        window.dispatchEvent(new Event("authChanged"));
        setTimeout(() => setProfileSuccess(""), 4000);
      } else {
        setProfileError(data.message || "Failed to update profile");
      }
    } catch {
      setProfileError("Network error. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    setPwdSuccess("");
    setPwdError("");

    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
      });
      const data = await res.json();
      if (data.success) {
        setPwdSuccess(data.message || "Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPwdSuccess(""), 4000);
      } else {
        setPwdError(data.message || "Failed to change password");
      }
    } catch {
      setPwdError("Network error. Please try again.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.dispatchEvent(new Event("authChanged"));
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-semibold text-base-content/60">Loading your account profile...</p>
      </div>
    );
  }

  if (!profile) return null;

  const displayAvatar = avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.name)}`;
  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "Recent";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-indigo-900/40">
        <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
          <div className="avatar">
            <div className="w-20 md:w-24 rounded-full ring-4 ring-primary ring-offset-4 ring-offset-slate-900 bg-base-100">
              <img src={displayAvatar} alt={profile.name} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="text-2xl md:text-3xl font-black">{profile.name}</h1>
              <span className="badge badge-primary font-bold text-xs">{profile.role}</span>
            </div>
            <p className="text-xs text-slate-300">
              {profile.email} • Member since {memberSince}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1.5">
              <span className="badge badge-accent badge-sm font-bold gap-1">
                <Award className="w-3 h-3" />
                {profile.rewardPoints || 0} Reward Points
              </span>
              <span className="badge badge-ghost badge-sm text-slate-200">
                Total Orders: {profile.totalOrders || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          {profile.role !== "Customer" && (
            <Link
              href="/admin/dashboard"
              className="btn btn-sm btn-outline border-primary text-primary hover:bg-primary hover:text-primary-content gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              Staff Dashboard
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="btn btn-sm btn-ghost hover:bg-error/20 text-error gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Account Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-base-100 p-5 rounded-2xl border border-base-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black">{profile.totalOrders || 0}</p>
            <p className="text-xs text-base-content/60 font-semibold">Total Orders Placed</p>
          </div>
        </div>

        <div className="bg-base-100 p-5 rounded-2xl border border-base-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-success/10 text-success rounded-xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black">৳{(profile.totalSpent || 0).toLocaleString()}</p>
            <p className="text-xs text-base-content/60 font-semibold">Total Purchased Value</p>
          </div>
        </div>

        <div className="bg-base-100 p-5 rounded-2xl border border-base-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black">{wishlistCount}</p>
            <p className="text-xs text-base-content/60 font-semibold">Wishlist Saved Items</p>
          </div>
        </div>

        <div className="bg-base-100 p-5 rounded-2xl border border-base-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-accent/10 text-accent rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black">{profile.rewardPoints || 0}</p>
            <p className="text-xs text-base-content/60 font-semibold">Available SuperPoints</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Details Form */}
        <div className="lg:col-span-2 bg-base-100 p-6 md:p-8 rounded-3xl border border-base-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-base-200 pb-3">
            <h2 className="text-xl font-black flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Personal Profile Information
            </h2>
            <button
              onClick={fetchProfile}
              className="btn btn-ghost btn-xs gap-1 text-base-content/60 hover:text-base-content"
              title="Refresh profile"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>

          {profileSuccess && (
            <div className="alert alert-success text-xs py-2.5 rounded-xl flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="alert alert-error text-xs py-2.5 rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-base-content/60 flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-sm input-bordered w-full focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-base-content/60 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> Email Address (Immutable)
                </label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="input input-sm input-bordered w-full bg-base-200 text-base-content/60 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-base-content/60 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> Phone Number (Bangladesh)
                </label>
                <input
                  type="tel"
                  placeholder="+880 1700 000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input input-sm input-bordered w-full focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-base-content/60 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> District / City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka, Chittagong, Sylhet"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="input input-sm input-bordered w-full focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-base-content/60 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Upazila / Area / Thana
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dhanmondi, Banani, Mirpur"
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  className="input input-sm input-bordered w-full focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-base-content/60">Custom Avatar URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="input input-sm input-bordered w-full focus:outline-none focus:border-primary"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold uppercase text-base-content/60 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Detailed Delivery Address
                </label>
                <textarea
                  rows={2}
                  placeholder="House #, Road #, Sector/Block, Landmark..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="textarea textarea-sm textarea-bordered w-full focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="btn btn-primary btn-sm rounded-xl gap-2 font-bold px-5 shadow-sm"
            >
              {savingProfile ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Profile Changes
                </>
              )}
            </button>
          </form>
        </div>

        {/* Change Password / Security */}
        <div className="bg-base-100 p-6 rounded-3xl border border-base-200 shadow-xs space-y-6 h-fit">
          <h2 className="text-xl font-black flex items-center gap-2 border-b border-base-200 pb-3">
            <KeyRound className="w-5 h-5 text-primary" /> Account Security
          </h2>

          {pwdSuccess && (
            <div className="alert alert-success text-xs py-2 rounded-xl flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{pwdSuccess}</span>
            </div>
          )}

          {pwdError && (
            <div className="alert alert-error text-xs py-2 rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{pwdError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-base-content/60">Current Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input input-sm input-bordered w-full focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-base-content/60">New Password</label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input input-sm input-bordered w-full focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-base-content/60">Confirm New Password</label>
              <input
                type="password"
                required
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input input-sm input-bordered w-full focus:outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              disabled={savingPassword}
              className="btn btn-outline btn-primary btn-sm w-full rounded-xl gap-2 font-bold mt-2"
            >
              {savingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" /> Update Password
                </>
              )}
            </button>
          </form>

          {/* Quick link to Orders */}
          <div className="pt-2 border-t border-base-200">
            <Link
              href="/my-orders"
              className="btn btn-sm btn-ghost w-full justify-between font-semibold text-xs"
            >
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" /> View Order History
              </span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
