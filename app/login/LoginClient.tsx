"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const registered = useMemo(
    () => searchParams.get("registered") === "1",
    [searchParams]
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch<{ user: { role: string } }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (res.user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative z-20 h-[calc(100vh-48px)] overflow-hidden bg-[radial-gradient(circle_at_top,rgba(201,149,0,0.08),transparent_24%),linear-gradient(to_bottom,#fffdf7,#fff8e8_45%,#fffdf7)]">
      <div className="container flex h-full items-center justify-center py-6 md:py-8">
        <div className="grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">

          <div className="hidden lg:block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#a87400]">
              Elite Jersey Land
            </p>

            <h1 className="mt-4 max-w-xl text-5xl font-bold leading-tight text-[#2b2112]">
              Premium sportswear shopping with a cleaner identity.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-8 text-[#7a6641]">
              Sign in to track orders, manage your account, save products, and continue your premium jersey shopping experience.
            </p>
          </div>

          <div className="mx-auto w-full max-w-[420px]">
            <div className="overflow-hidden rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white/90 p-6 shadow-[0_24px_70px_rgba(201,149,0,0.10)] backdrop-blur-xl sm:p-7">

              <div className="mb-5 text-center">
                <h2 className="text-3xl font-bold text-[#2b2112]">Login</h2>
                <p className="mt-2 text-sm text-[#7a6641]">
                  Access your account to continue shopping.
                </p>
              </div>

              {registered && (
                <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                  Signup successful. Please login to continue.
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input-premium h-12"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="input-premium h-12 pr-20"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#9b8b6f]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-4 py-3.5 text-white"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

              </form>

              <div className="mt-5 text-center">
                <Link href="/signup" className="text-[#a87400]">
                  Create New Account
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}