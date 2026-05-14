"use client";

import { useEffect, useState } from "react";
import { 
  User, Mail, Phone, MapPin, Calendar, Shield, 
  Save, CheckCircle2, AlertCircle, KeyRound 
} from "lucide-react";
import Link from "next/link";

type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
};

export default function AccountProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });

  // Success and Error states for modern toast
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function loadProfile() {
    setLoading(true);
    try {
      const res = await fetch("/api/account/profile", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Failed to load profile");

      setProfile(data.profile);
      setForm({
        firstName: data.profile?.firstName || "",
        lastName: data.profile?.lastName || "",
        phone: data.profile?.phone || "",
        address: data.profile?.address || "",
      });
    } catch (error) {
      console.error("PROFILE_LOAD_ERROR", error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage(null); // Clear previous message

    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Failed to update profile");

      setProfile(data.profile);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      
      // Auto-hide success message after 4 seconds
      setTimeout(() => setMessage(null), 4000);
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: error instanceof Error ? error.message : "Failed to update profile" 
      });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <main className="container py-10 md:py-14">
        <div className="flex min-h-[400px] items-center justify-center rounded-[30px] border border-[rgba(201,149,0,0.14)] bg-white/80 shadow-xl backdrop-blur-sm">
          <div className="text-center">
             <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#c99500] border-t-transparent"></div>
             <p className="text-sm text-[#7a6641]">Loading profile...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="container py-10 md:py-14">
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[30px] border border-[rgba(201,149,0,0.14)] bg-white/80 shadow-xl backdrop-blur-sm">
          <AlertCircle size={40} className="text-red-400 mb-3" />
          <p className="text-[#7a6641]">Unable to load profile.</p>
        </div>
      </main>
    );
  }

  const initials = `${form.firstName.charAt(0) || ""}${form.lastName.charAt(0) || ""}`.toUpperCase();

  return (
    <main className="container py-10 md:py-14">
      <div className="mx-auto max-w-5xl rounded-[30px] border border-[rgba(201,149,0,0.14)] bg-white/80 shadow-[0_25px_80px_rgba(201,149,0,0.08)] backdrop-blur-xl overflow-hidden">
        <div className="grid lg:grid-cols-[1fr_1.5fr]">
          
          {/* LEFT: Profile Summary Sidebar */}
          <div className="relative bg-gradient-to-b from-[#fffdf7] via-white to-white p-8 border-b lg:border-b-0 lg:border-r border-[rgba(201,149,0,0.1)]">
            <div className="flex flex-col items-center text-center lg:sticky lg:top-24">
              {/* Avatar */}
              <div className="relative mb-6">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#c99500] to-[#e0b22c] text-white shadow-[0_15px_40px_rgba(201,149,0,0.3)]">
                  <span className="text-4xl font-bold tracking-tight">{initials}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-green-500">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
              </div>

              <h2 className="text-xl font-bold text-[#2b2112]">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="mt-1 text-sm text-[#7a6641]">Elite Customer</p>

              <div className="mt-8 w-full space-y-5 text-left">
                <div className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-white">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fff6df] text-[#c99500]">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-[#9b8b6f]">Email</p>
                    <p className="truncate text-sm font-medium text-[#2b2112]">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-white">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fff6df] text-[#c99500]">
                    <Calendar size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-[#9b8b6f]">Member Since</p>
                    <p className="text-sm font-medium text-[#2b2112]">
                      {new Date(profile.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-white">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fff6df] text-[#c99500]">
                    <Shield size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-[#9b8b6f]">Status</p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      Active
                    </span>
                  </div>
                </div>
              </div>

              <Link 
                href="/account/password" 
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-[rgba(201,149,0,0.2)] bg-white px-4 py-2.5 text-sm font-semibold text-[#a87400] transition hover:border-[#c99500] hover:bg-[#fff6df]"
              >
                <KeyRound size={16} />
                Change Password
              </Link>
            </div>
          </div>

          {/* RIGHT: Update Form */}
          <div className="p-8 md:p-10">
            <div className="mb-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#a87400]">
                Settings
              </p>
              <h1 className="mt-2 text-3xl font-bold text-[#2b2112]">
                Update Profile
              </h1>
              <p className="mt-2 text-sm text-[#7a6641]">
                Manage your personal information and contact details.
              </p>
            </div>

            {/* Modern Toast Message */}
            {message && (
              <div className={`mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                message.type === "success" 
                  ? "border-green-200 bg-green-50 text-green-700" 
                  : "border-red-200 bg-red-50 text-red-600"
              }`}>
                {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Details */}
              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#2b2112] flex items-center gap-2">
                  <User size={16} className="text-[#a87400]" />
                  Personal Details
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#7a6641]">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="input-premium h-12"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#7a6641]">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="input-premium h-12"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#2b2112] flex items-center gap-2">
                  <Phone size={16} className="text-[#a87400]" />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#7a6641]">
                      Email Address (Cannot be changed)
                    </label>
                    <input
                      type="email"
                      className="input-premium h-12 bg-[#f8f6f0] cursor-not-allowed opacity-70"
                      value={profile.email}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#7a6641]">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="input-premium h-12"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="Enter 10-digit mobile number"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#7a6641]">
                      Delivery Address
                    </label>
                    <textarea
                      className="input-premium min-h-[120px] py-3"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="House no, Road, Area, City, State, Pincode"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 border-t border-[rgba(201,149,0,0.1)] pt-6">
                <button
                  type="button"
                  onClick={() => setForm({
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    phone: profile.phone || "",
                    address: profile.address || "",
                  })}
                  className="rounded-xl border border-[rgba(201,149,0,0.2)] px-6 py-3 text-sm font-semibold text-[#2b2112] transition hover:bg-[#fffdf7]"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-[#c99500]/20 transition hover:opacity-90 disabled:opacity-60"
                >
                  <Save size={16} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}