"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  MapPin, CreditCard, ShieldCheck, ShoppingBag, Check, 
  ChevronRight, Truck 
} from "lucide-react";

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

      if (!res.ok) throw new Error(data?.message || "Checkout failed");

      router.push(
        `/payment?orderNumber=${data.order.orderNumber}&amount=${data.order.total}`
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setPlacing(false);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf8f0] flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#c99500] border-t-transparent"></div>
      </main>
    );
  }

  // Progress Steps Config
  const steps = [
    { label: "Shopping Cart", icon: ShoppingBag },
    { label: "Delivery Details", icon: MapPin },
    { label: "Payment", icon: CreditCard },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fffdf9_0%,#f8f4ec_100%] pt-24 pb-16 px-4">
      <div className="mx-auto max-w-6xl">
        
        {/* Header & Progress Steps */}
        <div className="rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white shadow-[0_20px_60px_rgba(201,149,0,0.06)] p-6 mb-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#a87400] font-semibold">
                Secure Checkout
              </p>
              <h1 className="mt-2 text-2xl font-bold text-[#2b2112] md:text-3xl">
                Complete Your Order
              </h1>
            </div>
            
            {/* Step Tracker */}
            <div className="flex items-center gap-2">
              {steps.map((step, index) => {
                const isActive = index === 1;
                const isCompleted = index < 1;
                const Icon = step.icon;
                
                return (
                  <div key={step.label} className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition ${
                        isCompleted 
                          ? "border-green-500 bg-green-500 text-white" 
                          : isActive 
                          ? "border-[#c99500] bg-[#fff6df] text-[#c99500]" 
                          : "border-gray-200 bg-white text-gray-300"
                      }`}>
                        {isCompleted ? <Check size={14} /> : <Icon size={14} />}
                      </div>
                      <span className={`hidden sm:inline text-xs font-medium ${
                        isActive ? "text-[#2b2112]" : "text-gray-400"
                      }`}>
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <ChevronRight size={16} className={`mx-1 ${index < 1 ? "text-green-500" : "text-gray-300"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <form
          onSubmit={handlePlaceOrder}
          className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]"
        >
          {/* LEFT COLUMN */}
          <section className="space-y-6">
            
            {/* Delivery Details Form */}
            <div className="rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white shadow-[0_20px_60px_rgba(201,149,0,0.06)] p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[rgba(201,149,0,0.1)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff6df] border border-[rgba(201,149,0,0.15)] text-[#c99500]">
                  <Truck size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#2b2112]">Delivery Address</h2>
                  <p className="text-xs text-[#9b8b6f]">Where should we send your jersey?</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#7a6641] mb-1.5">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    className="input-premium h-12"
                    placeholder="Enter your full name"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-[#7a6641] mb-1.5">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      className="input-premium h-12"
                      placeholder="10-digit number"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#7a6641] mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="input-premium h-12"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#7a6641] mb-1.5">
                    Full Address <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    className="input-premium min-h-[120px] py-3 resize-none"
                    placeholder="House no, Road, Area, City, State, Pincode..."
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white shadow-[0_20px_60px_rgba(201,149,0,0.06)] p-6 md:p-8">
              <h2 className="text-lg font-bold text-[#2b2112] mb-5">
                Items in Cart ({items.length})
              </h2>

              {items.length === 0 ? (
                <div className="text-center py-8 text-sm text-[#9b8b6f]">
                  No items in cart.
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 rounded-2xl border border-[rgba(201,149,0,0.08)] bg-[#fffdf7] p-3 transition hover:shadow-sm"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[rgba(201,149,0,0.1)]">
                        <img
                          src={item.product.mainImage || "/images/default-product.webp"}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#2b2112] truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-[#9b8b6f] mt-0.5">
                          Qty: {item.quantity} • ₹{item.product.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-[#2b2112]">
                          ₹{item.subtotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* RIGHT COLUMN */}
          <aside className="h-fit lg:sticky lg:top-28">
            <div className="rounded-[28px] border border-[rgba(201,149,0,0.14)] bg-white shadow-[0_20px_60px_rgba(201,149,0,0.06)] p-6 md:p-8">
              
              <h2 className="text-lg font-bold text-[#2b2112] mb-6">
                Order Summary
              </h2>

              {promoFromUrl && discount > 0 && (
                <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 p-3 mb-6">
                  <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                  <p className="text-sm font-medium text-green-700">
                    Promo code <span className="font-bold uppercase">{promoFromUrl}</span> applied!
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#7a6641]">Subtotal ({items.length} items)</span>
                  <span className="font-semibold text-[#2b2112]">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Promo Discount</span>
                    <span className="font-semibold text-green-600">
                      - ₹{discount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="border-t border-[rgba(201,149,0,0.15)] pt-4 mt-4">
                  <div className="flex justify-between items-end">
                    <span className="text-base font-semibold text-[#2b2112]">
                      Grand Total
                    </span>
                    <span className="text-2xl font-bold text-[#2b2112]">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={placing || items.length === 0}
                className="mt-8 w-full rounded-xl bg-[linear-gradient(135deg,#c99500,#e0b22c)] py-4 text-sm font-bold text-white shadow-lg shadow-[0_12px_24px_rgba(201,149,0,0.25)] transition hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {placing ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Placing Order...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Continue to Payment
                  </>
                )}
              </button>

              {/* Trust Badge */}
              <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#fafaf8] border border-[rgba(201,149,0,0.1)] px-4 py-3">
                <ShieldCheck size={16} className="text-[#a87400]" />
                <p className="text-xs font-medium text-[#7a6641]">
                  Safe & Secure Checkout
                </p>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#faf8f0] flex items-center justify-center pt-24">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#c99500] border-t-transparent"></div>
      </main>
    }>
      <CheckoutContent />
    </Suspense>
  );
}