"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    houseName: "",
    roadName: "",
    address: "",
    pincode: "",
  });

  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setSuccess("");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to submit request");
      }

      setSuccess("Your request has been submitted successfully.");
      setForm({
        name: "",
        email: "",
        phone: "",
        houseName: "",
        roadName: "",
        address: "",
        pincode: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit request");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="container py-10 md:py-14">
      <section className="relative overflow-hidden rounded-[30px] border border-[rgba(201,149,0,0.14)] bg-white/80 shadow-[0_20px_60px_rgba(201,149,0,0.08)] backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,149,0,0.12),transparent_28%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(201,149,0,0.05),transparent_22%)]" />

        <div className="relative grid gap-8 px-5 py-8 sm:px-6 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#a87400]">
              Contact Us
            </p>

            <h1 className="mt-3 text-3xl font-bold leading-tight text-[#2b2112] md:text-4xl">
              Let’s talk about your jersey order or support request.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#7a6641] md:text-base">
              Reach out to Elite Jersey Land for order support, product questions,
              delivery help, or general inquiries. Fill in the form and we will get
              back to you as soon as possible.
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="input-premium h-12"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="input-premium h-12"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    className="input-premium h-12"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                    House Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter house name"
                    className="input-premium h-12"
                    value={form.houseName}
                    onChange={(e) =>
                      setForm({ ...form, houseName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                    Road Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter road name"
                    className="input-premium h-12"
                    value={form.roadName}
                    onChange={(e) =>
                      setForm({ ...form, roadName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                  Address
                </label>
                <textarea
                  placeholder="Write your full address"
                  className="input-premium min-h-[120px] resize-none py-3"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#2b2112]">
                  Pincode
                </label>
                <input
                  type="text"
                  placeholder="Enter your pincode"
                  className="input-premium h-12"
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                />
              </div>

              {success ? (
                <p className="text-sm font-medium text-green-700">{success}</p>
              ) : null}

              {error ? (
                <p className="text-sm font-medium text-red-600">{error}</p>
              ) : null}

              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-70 md:w-auto md:min-w-[180px]"
              >
                {sending ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>

          <div className="lg:pl-2">
            <div className="rounded-[26px] border border-[rgba(201,149,0,0.14)] bg-[#fffdf7] p-5 shadow-[0_12px_32px_rgba(201,149,0,0.06)] md:p-6">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#a87400]">
                Website Details
              </p>

              <h2 className="mt-3 text-2xl font-bold text-[#2b2112]">
                Elite Jersey Land
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#7a6641]">
                Premium jerseysin a clean white and deep yellow shopping
                experience with strong product focus and elegant layout.
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#9b8b6f]">
                    Contact Number
                  </p>
                  <p className="mt-2 text-base font-semibold text-[#2b2112]">
                    +91 7003240920
                  </p>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#9b8b6f]">
                    Email Address
                  </p>
                  <p className="mt-2 break-all text-base font-semibold text-[#2b2112]">
                    elitejerseyland@gmail.com
                  </p>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#9b8b6f]">
                    Support Hours
                  </p>
                  <p className="mt-2 text-base font-semibold text-[#2b2112]">
                    Mon - Sat, 10:00 AM - 7:00 PM
                  </p>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#9b8b6f]">
                    Service Note
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#7a6641]">
                    For order tracking, delivery support, product queries, and account
                    help, use the form or contact us directly through email or phone.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#a87400]">
                Quick Help
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="rounded-2xl border border-[rgba(201,149,0,0.12)] bg-[#fffdf7] p-4">
                  <h3 className="text-sm font-semibold text-[#2b2112]">
                    Order Support
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#7a6641]">
                    Ask about order status, shipping, or cancellation.
                  </p>
                </div>

                <div className="rounded-2xl border border-[rgba(201,149,0,0.12)] bg-[#fffdf7] p-4">
                  <h3 className="text-sm font-semibold text-[#2b2112]">
                    Product Help
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#7a6641]">
                    Get support with jersey size, style, or availability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}