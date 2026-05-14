"use client";

import { useEffect, useState } from "react";

type Settings = {
  id: string;
  storeName: string | null;
  supportEmail: string | null;
  supportPhone: string | null;
  address: string | null;
  logo: string | null;
  currency: string | null;
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [form, setForm] = useState({
    storeName: "",
    supportEmail: "",
    supportPhone: "",
    address: "",
    logo: "",
    currency: "INR",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  async function loadSettings() {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/settings", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to load settings");
      }

      setSettings(data.settings);
      setForm({
        storeName: data.settings?.storeName || "",
        supportEmail: data.settings?.supportEmail || "",
        supportPhone: data.settings?.supportPhone || "",
        address: data.settings?.address || "",
        logo: data.settings?.logo || "",
        currency: data.settings?.currency || "INR",
      });
    } catch (error) {
      console.error("SETTINGS_LOAD_ERROR", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to save settings");
      }

      alert("Settings updated successfully");
      await loadSettings();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordSaving(true);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(passwordForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to change password");
      }

      alert("Password changed successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to change password"
      );
    } finally {
      setPasswordSaving(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  if (loading) {
    return (
      <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-10 text-center text-[#7a6641] shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
        Loading settings...
      </div>
    );
  }

  return (
    <main className="space-y-8">
      <div className="rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white p-6 shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#a87400]">
          Settings
        </p>
        <h2 className="mt-2 text-3xl font-bold text-[#2b2112]">
          Store Settings
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#7a6641]">
          Manage store information, contact details, branding, and admin
          password from one place.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <form
          onSubmit={handleSaveSettings}
          className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_12px_28px_rgba(201,149,0,0.05)]"
        >
          <h3 className="text-xl font-bold text-[#2b2112]">Store Info</h3>

          <div className="mt-5 grid gap-4">
            <input
              type="text"
              placeholder="Store Name"
              className="input-premium h-11"
              value={form.storeName}
              onChange={(e) =>
                setForm({ ...form, storeName: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Support Email"
              className="input-premium h-11"
              value={form.supportEmail}
              onChange={(e) =>
                setForm({ ...form, supportEmail: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Support Phone"
              className="input-premium h-11"
              value={form.supportPhone}
              onChange={(e) =>
                setForm({ ...form, supportPhone: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Logo URL"
              className="input-premium h-11"
              value={form.logo}
              onChange={(e) =>
                setForm({ ...form, logo: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Currency"
              className="input-premium h-11"
              value={form.currency}
              onChange={(e) =>
                setForm({ ...form, currency: e.target.value })
              }
            />

            <textarea
              placeholder="Store Address"
              className="input-premium min-h-[120px]"
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 rounded-xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </form>

        <form
          onSubmit={handleChangePassword}
          className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_12px_28px_rgba(201,149,0,0.05)]"
        >
          <h3 className="text-xl font-bold text-[#2b2112]">Change Password</h3>

          <div className="mt-5 grid gap-4">
            <input
              type="password"
              placeholder="Current Password"
              className="input-premium h-11"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  currentPassword: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="New Password"
              className="input-premium h-11"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              className="input-premium h-11"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
            />
          </div>

          <button
            type="submit"
            disabled={passwordSaving}
            className="mt-6 rounded-xl border border-[rgba(201,149,0,0.16)] bg-white px-5 py-3 text-sm font-semibold text-[#2b2112] transition hover:border-[rgba(201,149,0,0.28)] hover:text-[#a87400] disabled:opacity-70"
          >
            {passwordSaving ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </main>
  );
}