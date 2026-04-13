// elite-jersey-land/app/checkout/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

type CartItem = {
  id: string;
  quantity: number;
  subtotal: number;
  product: {
    id: string;
    name: string;
    mainImage: string;
    price: number;
  };
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const promoFromUrl = searchParams.get("promo") || "";

  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
  });

  async function loadCart() {
    setLoading(true);

    try {
      const res = await fetch("/api/cart", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();
      const cartItems = data.items || [];
      const cartTotal = data.total || 0;

      setItems(cartItems);
      setSubtotal(cartTotal);

      if (promoFromUrl) {
        try {
          const promoRes = await fetch("/api/promo/apply", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ code: promoFromUrl }),
          });

          const promoData = await promoRes.json();

          if (promoRes.ok) {
            setDiscount(promoData.discount);
            setTotal(promoData.total);
          } else {
            setDiscount(0);
            setTotal(cartTotal);
          }
        } catch {
          setDiscount(0);
          setTotal(cartTotal);
        }
      } else {
        setDiscount(0);
        setTotal(cartTotal);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setPlacing(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          promoCode: promoFromUrl || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Checkout failed");
      }

      router.push(
        `/payment?orderNumber=${data.order.orderNumber}&amount=${data.order.total}`
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setPlacing(false);
    }
  }

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div className="container py-12">Loading checkout...</div>;
  }

  return (
    <main className="container py-10 md:py-14">
      <form
        onSubmit={handlePlaceOrder}
        className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <section className="rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_12px_30px_rgba(201,149,0,0.05)] md:p-6">
          <h1 className="text-2xl font-bold text-[#2b2112]">
            Checkout Details
          </h1>

          <div className="mt-6 grid gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="input-premium h-11"
              value={form.customerName}
              onChange={(e) =>
                setForm({ ...form, customerName: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Phone"
              className="input-premium h-11"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <input
              type="email"
              placeholder="Email"
              className="input-premium h-11"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <textarea
              placeholder="Full Address"
              className="input-premium min-h-[120px]"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
        </section>

        <aside className="rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-[#fffdf7] p-5 shadow-[0_12px_30px_rgba(201,149,0,0.05)] md:p-6">
          <h2 className="text-xl font-bold text-[#2b2112]">Order Summary</h2>

          {promoFromUrl && discount > 0 ? (
            <p className="mt-3 text-sm font-medium text-green-700">
              Promo applied: {promoFromUrl}
            </p>
          ) : null}

          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-[rgba(201,149,0,0.12)] bg-white p-3"
              >
                <img
                  src={item.product.mainImage || "/images/default-product.webp"}
                  alt={item.product.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <p className="font-medium text-[#2b2112]">
                    {item.product.name}
                  </p>
                  <p className="text-sm text-[#7a6641]">
                    Qty: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold text-[#2b2112]">
                  ₹{item.subtotal.toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 text-[#2b2112]">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 ? (
              <div className="flex items-center justify-between text-green-700">
                <span>Discount</span>
                <span>- ₹{discount.toFixed(2)}</span>
              </div>
            ) : null}

            <div className="flex items-center justify-between border-t border-[rgba(201,149,0,0.12)] pt-4">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={placing || items.length === 0}
            className="mt-6 w-full rounded-xl bg-[#c99500] px-5 py-3 font-semibold text-white disabled:opacity-60"
          >
            {placing ? "Placing Order..." : "Place Order"}
          </button>
        </aside>
      </form>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-12">Loading checkout...</div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}