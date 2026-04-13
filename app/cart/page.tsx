"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CartItem = {
  id: string;
  quantity: number;
  subtotal: number;
  product: {
    id: string;
    name: string;
    slug: string;
    mainImage: string;
    price: number;
    stock: number;
  };
};

type AppliedPromo = {
  id: string;
  code: string;
  discountType: "FIXED" | "PERCENT";
  discountValue: number;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);

  async function loadCart() {
    setLoading(true);

    try {
      const res = await fetch("/api/cart", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();
      setItems(data.items || []);
      setSubtotal(data.total || 0);

      if (!appliedPromo) {
        setDiscount(0);
        setTotal(data.total || 0);
      }
    } finally {
      setLoading(false);
    }
  }

  async function applyPromo() {
    try {
      const res = await fetch("/api/promo/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ code: promoCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to apply promo");
      }

      setAppliedPromo(data.promo);
      setSubtotal(data.subtotal);
      setDiscount(data.discount);
      setTotal(data.total);

      alert("Promo applied successfully");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to apply promo");
    }
  }

  async function updateQuantity(id: string, quantity: number) {
    const res = await fetch(`/api/cart/item/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ quantity }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data?.message || "Failed to update quantity");
      return;
    }

    setAppliedPromo(null);
    setPromoCode("");
    loadCart();
  }

  async function removeItem(id: string) {
    const res = await fetch(`/api/cart/item/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data?.message || "Failed to remove item");
      return;
    }

    setAppliedPromo(null);
    setPromoCode("");
    loadCart();
  }

  useEffect(() => {
    loadCart();
  }, []);

  if (loading) {
    return <div className="container py-12">Loading cart...</div>;
  }

  return (
    <main className="container py-10 md:py-14">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_12px_30px_rgba(201,149,0,0.05)] md:p-6">
          <h1 className="text-2xl font-bold text-[#2b2112]">Your Cart</h1>

          {items.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-[rgba(201,149,0,0.14)] bg-[#fffdf7] p-8 text-center text-[#7a6641]">
              Your cart is empty.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-4 rounded-2xl border border-[rgba(201,149,0,0.12)] p-4 md:grid-cols-[100px_1fr_auto]"
                >
                  <img
                    src={item.product.mainImage || "/images/default-product.webp"}
                    alt={item.product.name}
                    className="h-24 w-24 rounded-xl object-cover"
                  />

                  <div>
                    <h2 className="text-lg font-semibold text-[#2b2112]">
                      {item.product.name}
                    </h2>
                    <p className="mt-1 text-sm text-[#7a6641]">
                      ₹{item.product.price.toFixed(2)}
                    </p>
                    <p className="mt-1 text-xs text-[#7a6641]">
                      Stock: {item.product.stock}
                    </p>

                    <div className="mt-3 inline-flex items-center rounded-md border border-[rgba(201,149,0,0.14)] bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                        className="h-10 w-10"
                      >
                        −
                      </button>
                      <span className="flex h-10 min-w-[40px] items-center justify-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-10 w-10"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <p className="font-bold text-[#2b2112]">
                      ₹{item.subtotal.toFixed(2)}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-sm font-medium text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-[#fffdf7] p-5 shadow-[0_12px_30px_rgba(201,149,0,0.05)] md:p-6">
          <h2 className="text-xl font-bold text-[#2b2112]">Order Summary</h2>

          <div className="mt-5 flex gap-3">
            <input
              type="text"
              placeholder="Promo code"
              className="input-premium h-11 flex-1"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            />
            <button
              type="button"
              onClick={applyPromo}
              className="rounded-xl border border-[rgba(201,149,0,0.16)] bg-white px-4 py-2 text-sm font-semibold text-[#2b2112]"
            >
              Apply
            </button>
          </div>

          {appliedPromo ? (
            <p className="mt-3 text-sm font-medium text-green-700">
              Applied: {appliedPromo.code}
            </p>
          ) : null}

          <div className="mt-6 space-y-3 text-[#2b2112]">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span>Discount</span>
              <span>- ₹{discount.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between border-t border-[rgba(201,149,0,0.12)] pt-4">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <Link
            href={`/checkout${appliedPromo ? `?promo=${appliedPromo.code}` : ""}`}
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#c99500] px-5 py-3 font-semibold text-white"
          >
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </main>
  );
}