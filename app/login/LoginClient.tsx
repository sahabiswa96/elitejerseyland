"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
  const [checkingUser, setCheckingUser] = useState(true);
  const [error, setError] = useState("");

  // Check if user is already logged in as CUSTOMER
  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        const data = await res.json();

        // If already logged in as CUSTOMER, redirect to home
        if (data.user && data.user.role === "CUSTOMER") {
          router.replace("/");
          return;
        }
        
        // If logged in as ADMIN, redirect to admin dashboard
        if (data.user && data.user.role === "ADMIN") {
          router.replace("/admin/dashboard");
          return;
        }

        setCheckingUser(false);
      } catch (err) {
        console.error(err);
        setCheckingUser(false);
      }
    }

    checkUser();
  }, [router]);

  const registered = useMemo(
    () => searchParams.get("registered") === "1",
    [searchParams]
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch<{ user: { role: string } }>(
        "/api/auth/login",
        {
          method: "POST",
          body: JSON.stringify(form),
        }
      );

      // Check role after login
      if (res.user.role === "ADMIN") {
        // Admin should not login through customer portal
        setError("Invalid credentials. Please use admin login portal.");
        // Logout the admin immediately
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
        setLoading(false);
        return;
      }

      // Only CUSTOMER role proceeds to home
      if (res.user.role === "CUSTOMER") {
        router.push("/");
        router.refresh();
      } else {
        setError("Invalid user type");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  if (checkingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">
        Checking session...
      </div>
    );
  }

  return (
    <main className="relative z-20 h-[calc(100vh-48px)] overflow-hidden bg-[radial-gradient(circle_at_top,rgba(201,149,0,0.08),transparent_24%),linear-gradient(to_bottom,#fffdf7,#fff8e8_45%,#fffdf7)]">

      <div className="container flex h-full items-center justify-center py-6 md:py-8">

        <div className="grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">

          {/* LEFT */}
          <div className="hidden lg:block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#a87400]">
              Elite Jersey Land
            </p>

            <h1 className="mt-4 max-w-xl text-5xl font-bold leading-tight text-[#2b2112]">
              Premium sportswear shopping
            </h1>

            <p className="mt-5 max-w-lg text-base leading-8 text-[#7a6641]">
              Sign in to continue shopping experience.
            </p>
          </div>

          {/* RIGHT */}
          <div className="mx-auto w-full max-w-[420px]">

            <div className="rounded-[28px] border bg-white/90 p-6 shadow">

              <h2 className="text-3xl font-bold text-[#2b2112] text-center">
                 Login
              </h2>
              
              {registered && (
                <div className="mt-3 rounded-lg bg-green-50 p-3 text-center text-sm text-green-700">
                  Registration successful! Please login.
                </div>
              )}

              <form className="space-y-4 mt-5" onSubmit={handleSubmit}>

                <input
                  type="email"
                  placeholder="Enter email"
                  className="input-premium h-12"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  required
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="input-premium h-12"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-[#c99500] py-3 text-white font-semibold hover:bg-[#b88700] transition disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

              </form>

              <div className="mt-4 text-center">
                <Link href="/signup" className="text-sm text-[#a87400] hover:underline">
                  Create account
                </Link>
              </div>
              
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-500">
                  For admin access, please use the admin portal
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}