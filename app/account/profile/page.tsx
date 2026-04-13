"use client";

import { useEffect, useState } from "react";

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

  async function loadProfile() {
    setLoading(true);

    try {
      const res = await fetch("/api/account/profile", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to load profile");
      }

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

    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to update profile");
      }

      setProfile(data.profile);
      alert("Profile updated successfully");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update profile");
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
        <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-10 text-center text-[#7a6641] shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
          Loading profile...
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="container py-10 md:py-14">
        <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-10 text-center text-[#7a6641] shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
          Unable to load profile.
        </div>
      </main>
    );
  }

  return (
    <main className="container py-10 md:py-14">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-[#fffdf7] p-6 shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#a87400]">
            My Profile
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#2b2112]">
            Account Details
          </h1>
          <p className="mt-3 text-sm leading-7 text-[#7a6641]">
            Keep your personal information updated for smoother checkout and
            order communication.
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-[rgba(201,149,0,0.12)] bg-white p-4">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#9b8b6f]">
                Email Address
              </p>
              <p className="mt-2 break-all text-base font-semibold text-[#2b2112]">
                {profile.email}
              </p>
            </div>

            <div className="rounded-2xl border border-[rgba(201,149,0,0.12)] bg-white p-4">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#9b8b6f]">
                Account Status
              </p>
              <p className="mt-2 text-base font-semibold text-[#2b2112]">
                {profile.isActive ? "Active" : "Inactive"}
              </p>
            </div>

            <div className="rounded-2xl border border-[rgba(201,149,0,0.12)] bg-white p-4">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#9b8b6f]">
                Joined On
              </p>
              <p className="mt-2 text-base font-semibold text-[#2b2112]">
                {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white p-6 shadow-[0_12px_28px_rgba(201,149,0,0.05)]"
        >
          <h2 className="text-2xl font-bold text-[#2b2112]">
            Update Profile
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                First Name
              </label>
              <input
                type="text"
                className="input-premium h-11"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                Last Name
              </label>
              <input
                type="text"
                className="input-premium h-11"
                value={form.lastName}
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-[#2b2112]">
              Email Address
            </label>
            <input
              type="email"
              className="input-premium h-11 bg-[#f8f6f0]"
              value={profile.email}
              readOnly
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-[#2b2112]">
              Phone Number
            </label>
            <input
              type="text"
              className="input-premium h-11"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-[#2b2112]">
              Address
            </label>
            <textarea
              className="input-premium min-h-[140px]"
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
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </main>
  );
}