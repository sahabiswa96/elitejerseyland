"use client";

import { useEffect, useState } from "react";

type Promo = {
  id: string;
  code: string;
  discountType: "FIXED" | "PERCENT";
  discountValue: number;
  minOrderAmount: number | null;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
};

export default function AdminOffersPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    code: "",
    discountType: "PERCENT",
    discountValue: "",
    minOrderAmount: "",
    expiresAt: "",
  });

  async function loadPromos() {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/promos", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to load promos");
      }

      setPromos(data.promos || []);
    } catch (error) {
      console.error("LOAD_PROMOS_ERROR", error);
      setPromos([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreatePromo(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch("/api/admin/promos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to create promo");
      }

      alert("Promo created successfully");
      setForm({
        code: "",
        discountType: "PERCENT",
        discountValue: "",
        minOrderAmount: "",
        expiresAt: "",
      });
      loadPromos();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to create promo");
    }
  }

  async function togglePromo(promo: Promo) {
    try {
      const res = await fetch(`/api/admin/promos/${promo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          isActive: !promo.isActive,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to update promo");
      }

      loadPromos();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update promo");
    }
  }

  async function deletePromo(id: string) {
    if (!confirm("Delete this promo?")) return;

    try {
      const res = await fetch(`/api/admin/promos/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to delete promo");
      }

      loadPromos();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete promo");
    }
  }

  useEffect(() => {
    loadPromos();
  }, []);

  return (
    <main className="space-y-8">
      <div className="rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white p-6 shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#a87400]">
          Offers & Promos
        </p>
        <h2 className="mt-2 text-3xl font-bold text-[#2b2112]">
          Manage Promo Codes
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#7a6641]">
          Create discount codes, control active offers, and manage promo rules.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form
          onSubmit={handleCreatePromo}
          className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_12px_28px_rgba(201,149,0,0.05)]"
        >
          <h3 className="text-xl font-bold text-[#2b2112]">Create Promo</h3>

          <div className="mt-5 grid gap-4">
            <input
              type="text"
              placeholder="Promo Code"
              className="input-premium h-11"
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value.toUpperCase() })
              }
            />

            <select
              className="input-premium h-11"
              value={form.discountType}
              onChange={(e) =>
                setForm({ ...form, discountType: e.target.value })
              }
            >
              <option value="PERCENT">Percent</option>
              <option value="FIXED">Fixed</option>
            </select>

            <input
              type="number"
              placeholder="Discount Value"
              className="input-premium h-11"
              value={form.discountValue}
              onChange={(e) =>
                setForm({ ...form, discountValue: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Minimum Order Amount (optional)"
              className="input-premium h-11"
              value={form.minOrderAmount}
              onChange={(e) =>
                setForm({ ...form, minOrderAmount: e.target.value })
              }
            />

            <input
              type="datetime-local"
              className="input-premium h-11"
              value={form.expiresAt}
              onChange={(e) =>
                setForm({ ...form, expiresAt: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="mt-6 rounded-xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Create Promo
          </button>
        </form>

        <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
          <h3 className="text-xl font-bold text-[#2b2112]">Promo List</h3>

          {loading ? (
            <div className="mt-6 text-[#7a6641]">Loading promos...</div>
          ) : promos.length === 0 ? (
            <div className="mt-6 text-[#7a6641]">No promos found.</div>
          ) : (
            <div className="mt-5 space-y-4">
              {promos.map((promo) => (
                <div
                  key={promo.id}
                  className="rounded-2xl border border-[rgba(201,149,0,0.12)] bg-[#fffdf7] p-4"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-lg font-bold text-[#2b2112]">
                        {promo.code}
                      </p>
                      <p className="mt-2 text-sm text-[#7a6641]">
                        {promo.discountType === "PERCENT"
                          ? `${promo.discountValue}% off`
                          : `₹${promo.discountValue.toFixed(2)} off`}
                      </p>
                      <p className="mt-1 text-xs text-[#7a6641]">
                        Min Order: ₹{(promo.minOrderAmount || 0).toFixed(2)}
                      </p>
                      <p className="mt-1 text-xs text-[#7a6641]">
                        Expires:{" "}
                        {promo.expiresAt
                          ? new Date(promo.expiresAt).toLocaleString()
                          : "No expiry"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => togglePromo(promo)}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                          promo.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {promo.isActive ? "Active" : "Inactive"}
                      </button>

                      <button
                        type="button"
                        onClick={() => deletePromo(promo.id)}
                        className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}