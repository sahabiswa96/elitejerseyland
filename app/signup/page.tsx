"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successPopup, setSuccessPopup] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiFetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setSuccessPopup(true);

      setTimeout(() => {
        router.push("/login?registered=1");
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative z-20 h-[calc(100vh-48px)] overflow-hidden bg-[radial-gradient(circle_at_top,rgba(201,149,0,0.10),transparent_24%),linear-gradient(to_bottom,#fffdf7,#fff8eb_45%,#fffdf7)]">
      <div className="container flex h-full items-center justify-center py-4 md:py-6">
        <div className="grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1fr_460px]">
          <div className="hidden lg:block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#a87400]">
              Elite Jersey Land
            </p>

            <h1 className="mt-4 max-w-2xl text-5xl font-bold leading-tight text-[#2b2112] xl:text-6xl">
              Create your premium shopping account.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-[#7a6641]">
              Join Elite Jersey Land to save your details, manage orders, and
              enjoy a smooth shopping experience.
            </p>
          </div>

          <div className="mx-auto w-full max-w-[460px]">
            <div className="overflow-hidden rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white/95 shadow-[0_24px_70px_rgba(201,149,0,0.10)]">
              <div className="border-b border-[rgba(201,149,0,0.10)] px-6 py-5 text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#a87400]">
                  Elite Jersey Land
                </p>
                <h2 className="mt-1 text-[30px] font-bold text-[#2b2112]">
                  Create Account
                </h2>
              </div>

              <div className="h-[500px] overflow-y-auto px-5 py-5 no-scrollbar md:px-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="input-premium h-12"
                      value={form.firstName}
                      onChange={(e) =>
                        setForm({ ...form, firstName: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="input-premium h-12"
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                    />
                  </div>

                  <input
                    type="email"
                    placeholder="Email"
                    className="input-premium h-12"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Phone"
                    className="input-premium h-12"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />

                  <textarea
                    placeholder="Address"
                    className="input-premium min-h-[90px]"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="input-premium h-12 pr-20 placeholder:text-sm placeholder:text-[#a89a80]"
                        value={form.password}
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-lg px-2 py-1 text-sm font-medium text-[#9b8b6f] hover:bg-[#fff6df] hover:text-[#a87400]"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="input-premium h-12 pr-20 placeholder:text-sm placeholder:text-[#a89a80]"
                        value={form.confirmPassword}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((prev) => !prev)
                        }
                        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-lg px-2 py-1 text-sm font-medium text-[#9b8b6f] hover:bg-[#fff6df] hover:text-[#a87400]"
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  {error ? (
                    <p className="text-sm font-medium text-red-600">{error}</p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-[#c99500] py-3.5 text-lg font-semibold text-white transition hover:opacity-90 disabled:opacity-70"
                  >
                    {loading ? "Signing up..." : "Sign Up"}
                  </button>

                  <p className="text-center text-sm text-[#7a6641]">
                    Already have account?{" "}
                    <Link href="/login" className="font-semibold text-[#a87400]">
                      Login
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {successPopup ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-sm rounded-[24px] border border-[rgba(201,149,0,0.16)] bg-white p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff6df] text-2xl text-[#c99500]">
              ✓
            </div>
            <h3 className="mt-4 text-xl font-bold text-[#2b2112]">
              Signup Successful
            </h3>
            <p className="mt-2 text-sm text-[#7a6641]">
              Your account has been created successfully. Redirecting to login...
            </p>
          </div>
        </div>
      ) : null}
    </main>
  );
}