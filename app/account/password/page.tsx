"use client";

import { useState } from "react";
import { KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/account/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      setMessage({ type: "success", text: "Password updated successfully!" });
      
      // সফল হলে ইনপুট ফিল্ড খালি করে দেওয়া হচ্ছে
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: error instanceof Error ? error.message : "Something went wrong" 
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="container py-10 md:py-14">
      <div className="mx-auto max-w-lg">
        
        {/* Back Button */}
        <Link 
          href="/account/profile" 
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#7a6641] transition hover:text-[#a87400]"
        >
          <ArrowLeft size={16} />
          Back to Profile
        </Link>

        <div className="rounded-[30px] border border-[rgba(201,149,0,0.14)] bg-white/80 shadow-[0_25px_80px_rgba(201,149,0,0.08)] backdrop-blur-xl p-8 md:p-10">
          
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fff6df] border border-[rgba(201,149,0,0.2)]">
              <KeyRound className="text-[#c99500]" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-[#2b2112]">
              Change Password
            </h1>
            <p className="mt-2 text-sm text-[#7a6641]">
              Update your password to keep your account secure.
            </p>
          </div>

          {/* Toast Message */}
          {message && (
            <div className={`mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
              message.type === "success" 
                ? "border-green-200 bg-green-50 text-green-700" 
                : "border-red-200 bg-red-50 text-red-600"
            }`}>
              {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Current Password */}
            <div>
              <label className="mb-2 block text-xs font-medium text-[#7a6641]">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input-premium h-12 pr-11"
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9b8b6f] hover:text-[#2b2112]"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="mb-2 block text-xs font-medium text-[#7a6641]">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-premium h-12 pr-11"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9b8b6f] hover:text-[#2b2112]"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {newPassword.length > 0 && newPassword.length < 6 && (
                <p className="mt-1.5 text-xs text-red-500">Must be at least 6 characters</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-xs font-medium text-[#7a6641]">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-premium h-12"
                placeholder="Re-enter new password"
                required
              />
              {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                <p className="mt-1.5 text-xs text-red-500">Passwords do not match</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={saving || newPassword !== confirmPassword || newPassword.length < 6}
              className="w-full rounded-xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#c99500]/20 transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}