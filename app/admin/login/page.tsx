"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch<{ user: { role: string } }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (res.user.role !== "ADMIN") {
        throw new Error("Admin access only");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(201,149,0,0.08),transparent_24%),linear-gradient(to_bottom,#fffdf7,#fff8e8_45%,#fffdf7)]">
      <div className="container flex min-h-screen items-center justify-center py-10">
        <div className="grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="hidden lg:block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#a87400]">
              Elite Jersey Land
            </p>
            <h1 className="mt-4 max-w-xl text-5xl font-bold leading-tight text-[#2b2112]">
              Admin access for premium store management.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-8 text-[#7a6641]">
              Manage products, orders, offers, customers, and stock from one
              elegant admin workspace.
            </p>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white/80 p-6 shadow-[0_24px_80px_rgba(201,149,0,0.08)] backdrop-blur-xl sm:p-8">
              <div className="mb-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(201,149,0,0.22)] bg-[#fff6df] text-xl font-bold text-[#c99500]">
                  E
                </div>
                <h2 className="mt-4 text-3xl font-bold text-[#2b2112]">
                  Admin Login
                </h2>
                <p className="mt-2 text-sm text-[#7a6641]">
                  Sign in to manage the store.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter admin email"
                    className="input-premium h-12"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className="input-premium h-12 pr-12"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9b8b6f] transition hover:text-[#a87400]"
                    >
                      {showPassword ? "🙈" : "👁"}
                    </button>
                  </div>
                </div>

                {error ? (
                  <p className="text-sm font-medium text-red-600">{error}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center rounded-xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-70"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}